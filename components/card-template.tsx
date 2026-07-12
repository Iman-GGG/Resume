"use client";

import { forwardRef, useImperativeHandle, useEffect, useState } from "react";

export type CardVariant = "dark" | "light";
export type CardSide = "front" | "back";

interface CardTemplateProps {
  userName: string;
  variant: CardVariant;
  side: CardSide;
  onTextureReady: (dataUrl: string) => void;
  email?: string;
  phone?: string;
  github?: string;
  wechatQr?: string;
  photoUrl?: string;
}

export interface CardTemplateRef {
  captureTexture: () => Promise<void>;
}

const CANVAS_SIZE = 1376;

function drawCard(
  canvas: HTMLCanvasElement,
  baseImage: HTMLImageElement | null,
  qrImage: HTMLImageElement | null,
  photoImage: HTMLImageElement | null,
  textColor: string,
  side: CardSide,
  userName: string,
  email?: string,
  phone?: string,
  github?: string,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background
  if (baseImage) {
    ctx.drawImage(baseImage, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
  } else {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }

  const cx = CANVAS_SIZE / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Cover the V0 logo area on the base image
  const coverColor = textColor === "#ffffff" ? "#0a0a0a" : "#f5f5f5";
  ctx.fillStyle = coverColor;
  ctx.fillRect(cx - 380, 200, 760, 760);

  if (side === "front") {
    // --- Front: name + contacts centered ---
    let y = 560;
    ctx.fillStyle = textColor;
    ctx.font = 'normal 52px "Geist Mono", monospace';
    ctx.fillText(userName.toUpperCase() || "IMAN GENG", cx, y);
    y += 72;

    ctx.fillStyle = '#878787';
    ctx.font = 'normal 32px "Geist Mono", monospace';
    if (email) { ctx.fillText(email, cx, y); y += 48; }
    if (phone) { ctx.fillText(phone, cx, y); y += 48; }
  } else {
    // --- Back: QR code centered ---
    const qrSize = 500;
    const qrX = cx - qrSize / 2 + qrSize * 0.75;
    const qrY = 440 - qrSize * 0.25;
    if (qrImage) {
      ctx.fillStyle = "#ffffff";
      const padding = 20;
      ctx.fillRect(qrX - padding, qrY - padding, qrSize + padding * 2, qrSize + padding * 2);
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
    }

    const textX = qrX + qrSize / 2;
    let y = qrY + qrSize + 30;
    ctx.fillStyle = textColor;
    ctx.font = 'normal 32px "Geist Mono", monospace';
    ctx.fillText("微信二维码", textX, y);
    y += 50;

    ctx.fillStyle = '#878787';
    ctx.font = 'normal 28px "Geist Mono", monospace';
    if (email) { ctx.fillText(email, textX, y); y += 40; }
    if (phone) { ctx.fillText(phone, textX, y); y += 40; }
  }
}

const CardTemplate = forwardRef<CardTemplateRef, CardTemplateProps>(
  ({ userName, variant, side, onTextureReady, email, phone, github, wechatQr, photoUrl }, ref) => {
    const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null);
    const [qrImage, setQrImage] = useState<HTMLImageElement | null>(null);
    const [photoImage, setPhotoImage] = useState<HTMLImageElement | null>(null);

    const imageSrc = variant === "dark" ? "/card-base-dark.png" : "/card-base-light.png";
    const textColor = variant === "dark" ? "#ffffff" : "#000000";

    useEffect(() => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => setBaseImage(img);
      img.src = imageSrc;
    }, [imageSrc]);

    useEffect(() => {
      if (wechatQr) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => setQrImage(img);
        img.src = wechatQr;
      } else {
        setQrImage(null);
      }
    }, [wechatQr]);

    useEffect(() => {
      if (photoUrl) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => setPhotoImage(img);
        img.src = photoUrl;
      } else {
        setPhotoImage(null);
      }
    }, [photoUrl]);

    // Re-capture when images load
    useEffect(() => {
      if (baseImage) {
        captureTexture();
      }
    }, [qrImage, photoImage, baseImage]);

    const captureTexture = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      drawCard(canvas, baseImage, qrImage, photoImage, textColor, side, userName, email, phone, github);
      const dataUrl = canvas.toDataURL("image/png");
      onTextureReady(dataUrl);
    };

    useImperativeHandle(ref, () => ({
      captureTexture,
    }));

    return null;
  }
);

CardTemplate.displayName = "CardTemplate";

export default CardTemplate;
