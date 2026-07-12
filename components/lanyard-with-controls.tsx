"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Lanyard from "@/components/ui/lanyard";
import CardTemplate, { type CardTemplateRef, type CardVariant } from "@/components/card-template";

interface LanyardWithControlsProps {
  position?: [number, number, number];
  containerClassName?: string;
  defaultName?: string;
  defaultVariant?: CardVariant;
}

export default function LanyardWithControls({
  position = [0, 0, 20],
  containerClassName,
  defaultName = "",
  defaultVariant = "dark",
}: LanyardWithControlsProps) {
  const [frontTextureUrl, setFrontTextureUrl] = useState<string | undefined>(undefined);
  const [backTextureUrl, setBackTextureUrl] = useState<string | undefined>(undefined);
  const [textureKey, setTextureKey] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const frontRef = useRef<CardTemplateRef>(null);
  const backRef = useRef<CardTemplateRef>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (frontRef.current && backRef.current) {
        await Promise.all([
          frontRef.current.captureTexture(),
          backRef.current.captureTexture(),
        ]);
      }
      setIsInitialized(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleFrontReady = useCallback((dataUrl: string) => {
    setFrontTextureUrl(dataUrl);
    setTextureKey((prev) => prev + 1);
  }, []);

  const handleBackReady = useCallback((dataUrl: string) => {
    setBackTextureUrl(dataUrl);
    setTextureKey((prev) => prev + 1);
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex flex-col">
        <CardTemplate ref={frontRef} userName={defaultName} variant={defaultVariant} side="front"
          onTextureReady={handleFrontReady} email="767189834@qq.com" phone="17815381850" github="Iman-GGG" wechatQr="/wechatscan.jpg" />
        <CardTemplate ref={backRef} userName={defaultName} variant={defaultVariant} side="back"
          onTextureReady={handleBackReady} email="767189834@qq.com" phone="17815381850"
          github="Iman-GGG" wechatQr="/wechatscan.jpg" />
        <div className={containerClassName}>
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <CardTemplate ref={frontRef} userName={defaultName} variant={defaultVariant} side="front"
        onTextureReady={handleFrontReady} email="767189834@qq.com" phone="17815381850"
        github="Iman-GGG" wechatQr="/wechatscan.jpg" />
      <CardTemplate ref={backRef} userName={defaultName} variant={defaultVariant} side="back"
        onTextureReady={handleBackReady} email="767189834@qq.com" phone="17815381850"
        photoUrl="/头像" />
      <Lanyard
        key={textureKey}
        position={position}
        containerClassName={containerClassName}
        cardTextureUrl={frontTextureUrl}
        backTextureUrl={backTextureUrl}
        canvasRef={canvasRef}
      />
    </div>
  );
}
