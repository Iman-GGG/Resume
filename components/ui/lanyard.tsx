/* eslint-disable react/no-unknown-property */
'use client';
import {useEffect, useRef, useState, useMemo, useCallback} from 'react';
import {Canvas, extend, useFrame} from '@react-three/fiber';
import {useGLTF, Environment, Lightformer} from '@react-three/drei';
import {
    BallCollider,
    CuboidCollider,
    Physics,
    RigidBody,
    useRopeJoint,
    useSphericalJoint,
    RigidBodyProps
} from '@react-three/rapier';
import {MeshLineGeometry, MeshLineMaterial} from 'meshline';
import * as THREE from 'three';
import clsx from 'clsx';

const cardGLB = '/card.glb';

extend({MeshLineGeometry, MeshLineMaterial});

interface LanyardProps {
    position?: [number, number, number];
    gravity?: [number, number, number];
    fov?: number;
    transparent?: boolean;
    containerClassName?: string;
    cardTextureUrl?: string;
    backTextureUrl?: string;
    canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export default function Lanyard({
                                    position = [0, 0, 30],
                                    gravity = [0, -40, 0],
                                    fov = 20,
                                    transparent = true,
                                    containerClassName,
                                    cardTextureUrl,
                                    backTextureUrl,
                                    canvasRef
                                }: LanyardProps) {
    const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

    useEffect(() => {
        const handleResize = (): void => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            className={clsx(containerClassName || "relative z-0 w-full h-screen flex justify-center items-center transform scale-100 origin-center")}>
            <Canvas
                ref={canvasRef}
                camera={{position, fov}}
                dpr={[1, isMobile ? 1.5 : 2]}
                gl={{alpha: transparent, preserveDrawingBuffer: true}}
                onCreated={({gl}) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
            >
                <ambientLight intensity={Math.PI}/>
                <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
                    <Band isMobile={isMobile} cardTextureUrl={cardTextureUrl} backTextureUrl={backTextureUrl}/>
                </Physics>
                <Environment blur={0.75}>
                    <Lightformer
                        intensity={2}
                        color="white"
                        position={[0, -1, 5]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={3}
                        color="white"
                        position={[-1, -1, 1]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={3}
                        color="white"
                        position={[1, 1, 1]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={10}
                        color="white"
                        position={[-10, 0, 14]}
                        rotation={[0, Math.PI / 2, Math.PI / 3]}
                        scale={[100, 10, 1]}
                    />
                </Environment>
            </Canvas>
        </div>
    );
}

interface BandProps {
    maxSpeed?: number;
    minSpeed?: number;
    isMobile?: boolean;
    cardTextureUrl?: string;
    backTextureUrl?: string;
}

const FLIP_SPEED = 8;

function Band({maxSpeed = 50, minSpeed = 0, isMobile = false, cardTextureUrl, backTextureUrl}: BandProps) {
    const band = useRef<any>(null);
    const fixed = useRef<any>(null);
    const j1 = useRef<any>(null);
    const j2 = useRef<any>(null);
    const j3 = useRef<any>(null);
    const card = useRef<any>(null);
    const flipGroup = useRef<THREE.Group>(null);
    const lastClickRef = useRef(0);
    const flipTargetRef = useRef(0);
    const flipAngleRef = useRef(0);
    const [textureToShow, setTextureToShow] = useState<'front'|'back'>('front');

    const vec = new THREE.Vector3();
    const ang = new THREE.Vector3();
    const rot = new THREE.Vector3();
    const dir = new THREE.Vector3();

    const segmentProps: any = {
        type: 'dynamic' as RigidBodyProps['type'],
        canSleep: true,
        colliders: false,
        angularDamping: 4,
        linearDamping: 4
    };

    const {nodes, materials} = useGLTF(cardGLB) as any;

    const bandTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 - 200, canvas.height / 2 + 48);
            ctx.lineTo(canvas.width / 2 + 200, canvas.height / 2 + 48);
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = '600 72px "Geist Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('IMAN', canvas.width / 2, canvas.height / 2 - 4);
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }, []);

    // Front texture (generated card)
    const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null);
    useEffect(() => {
        if (!cardTextureUrl) { setFrontTexture(null); return; }
        const loader = new THREE.TextureLoader();
        loader.load(cardTextureUrl, (t) => {
            t.flipY = false;
            t.colorSpace = THREE.SRGBColorSpace;
            setFrontTexture(t);
        });
        return () => { frontTexture?.dispose(); };
    }, [cardTextureUrl]);

    // Back texture (generated card back)
    const [backTexture, setBackTexture] = useState<THREE.Texture | null>(null);
    useEffect(() => {
        if (!backTextureUrl) { setBackTexture(null); return; }
        const loader = new THREE.TextureLoader();
        loader.load(backTextureUrl, (t) => {
            t.flipY = false;
            t.colorSpace = THREE.SRGBColorSpace;
            setBackTexture(t);
        });
        return () => { backTexture?.dispose(); };
    }, [backTextureUrl]);

    const activeTexture = textureToShow === 'front'
        ? (frontTexture || materials.base.map)
        : (backTexture || materials.base.map);

    const [curve] = useState(
        () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
    );
    const [dragged, drag] = useState<false | THREE.Vector3>(false);
    const [hovered, hover] = useState(false);
    const pointerMoved = useRef(false);

    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
    useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab';
            return () => { document.body.style.cursor = 'auto'; };
        }
    }, [hovered, dragged]);

    const handlePointerDown = useCallback((e: any) => {
        const now = Date.now();
        pointerMoved.current = false;

        // Double-click detection
        if (now - lastClickRef.current < 350) {
            // Flip!
            flipTargetRef.current = flipTargetRef.current === 0 ? Math.PI : 0;
            lastClickRef.current = 0;
            return;
        }
        lastClickRef.current = now;

        // Normal drag
        e.target.setPointerCapture(e.pointerId);
        drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
    }, [drag]);

    const handlePointerUp = useCallback((e: any) => {
        e.target.releasePointerCapture(e.pointerId);
        drag(false);
    }, [drag]);

    useFrame((state, delta) => {
        if (dragged && typeof dragged !== 'boolean') {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
            dir.copy(vec).sub(state.camera.position).normalize();
            vec.add(dir.multiplyScalar(state.camera.position.length()));
            [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
            card.current?.setNextKinematicTranslation({
                x: vec.x - dragged.x,
                y: vec.y - dragged.y,
                z: vec.z - dragged.z
            });
        }
        if (fixed.current) {
            [j1, j2].forEach(ref => {
                if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
                const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
                ref.current.lerped.lerp(
                    ref.current.translation(),
                    delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
                );
            });
            curve.points[0].copy(j3.current.translation());
            curve.points[1].copy(j2.current.lerped);
            curve.points[2].copy(j1.current.lerped);
            curve.points[3].copy(fixed.current.translation());
            band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
            ang.copy(card.current.angvel());
            rot.copy(card.current.rotation());
            card.current.setAngvel({x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z});
        }

        // Flip animation
        const target = flipTargetRef.current;
        const current = flipAngleRef.current;
        const diff = target - current;
        if (Math.abs(diff) > 0.001) {
            const step = Math.sign(diff) * Math.min(Math.abs(diff), FLIP_SPEED * delta);
            flipAngleRef.current = current + step;
            if (flipGroup.current) {
                flipGroup.current.rotation.y = flipAngleRef.current;
            }
            // Swap texture at halfway point
            const halfPi = Math.PI / 2;
            const prevSide = textureToShow;
            const crossedHalf = (current < halfPi && current + step >= halfPi) ||
                (current > halfPi && current + step <= halfPi);
            if (crossedHalf) {
                setTextureToShow(prevSide === 'front' ? 'back' : 'front');
            }
        }
    });

    curve.curveType = 'chordal';

    return (
        <>
            <group position={[0, 4, 0]}>
                <RigidBody ref={fixed} {...segmentProps} type={'fixed' as RigidBodyProps['type']}/>
                <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
                    <BallCollider args={[0.1]}/>
                </RigidBody>
                <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
                    <BallCollider args={[0.1]}/>
                </RigidBody>
                <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
                    <BallCollider args={[0.1]}/>
                </RigidBody>
                <RigidBody
                    position={[2, 0, 0]}
                    ref={card}
                    {...segmentProps}
                    type={dragged ? ('kinematicPosition' as RigidBodyProps['type']) : ('dynamic' as RigidBodyProps['type'])}
                >
                    <CuboidCollider args={[0.8, 1.125, 0.01]}/>
                    <group
                        scale={2.25}
                        position={[0, -1.2, -0.05]}
                        onPointerOver={() => hover(true)}
                        onPointerOut={() => hover(false)}
                        onPointerUp={handlePointerUp}
                        onPointerDown={handlePointerDown}
                    >
                        <group ref={flipGroup}>
                            <mesh geometry={nodes.card.geometry}>
                                <meshPhysicalMaterial
                                    map={activeTexture}
                                    side={THREE.DoubleSide}
                                    map-anisotropy={16}
                                    clearcoat={isMobile ? 0 : 1}
                                    clearcoatRoughness={0.15}
                                    roughness={0.9}
                                    metalness={0.8}
                                />
                            </mesh>
                        </group>
                        <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3}/>
                        <mesh geometry={nodes.clamp.geometry} material={materials.metal}/>
                    </group>
                </RigidBody>
            </group>
            <mesh ref={band}>
                <meshLineGeometry/>
                <meshLineMaterial
                    color="white"
                    depthTest={false}
                    resolution={isMobile ? [1000, 2000] : [1000, 1000]}
                    useMap
                    map={bandTexture}
                    repeat={[-4, 1]}
                    lineWidth={1}
                />
            </mesh>
        </>
    );
}
