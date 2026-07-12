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
}

export interface CardTemplateRef {
  captureTexture: () => Promise<void>;
}

const CANVAS_SIZE = 1376;

function drawCardBg(ctx: CanvasRenderingContext2D, variant: CardVariant) {
  const isDark = variant === "dark";
  const bg = isDark ? "#111111" : "#fafafa";
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function drawCard(
  canvas: HTMLCanvasElement,
  qrImage: HTMLImageElement | null,
  textColor: string,
  variant: CardVariant,
  side: CardSide,
  userName: string,
  email?: string,
  phone?: string,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  drawCardBg(ctx, variant);

  // Generate a grid to diagnose UV mapping — each cell is 172px (8x8 grid on 1376 canvas)
  // After viewing, remove this block and position content based on visible grid cells
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 4;
  ctx.font = 'normal 24px "Geist Mono", monospace';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const gx = c * 172 + 86;
      const gy = r * 172 + 86;
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.strokeRect(c * 172, r * 172, 172, 172);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText(`${c},${r}`, gx, gy);
    }
  }
  return; // STOP — just show grid, skip content

  if (side === "front") {
    let y = vy - 30;
    ctx.fillStyle = textColor;
    ctx.font = '600 48px "Geist Mono", monospace';
    ctx.fillText(userName.toUpperCase() || "IMAN GENG", vx, y);
    y += 72;

    ctx.fillStyle = variant === "dark" ? "#aaaaaa" : "#666666";
    ctx.font = 'normal 30px "Geist Mono", monospace';
    if (email) { ctx.fillText(email, vx, y); y += 46; }
    if (phone) { ctx.fillText(phone, vx, y); y += 46; }
  } else {
    const qrSize = 380;
    const qrX = vx - qrSize / 2;
    const qrY = vy - qrSize / 2 - 30;
    if (qrImage) {
      ctx.fillStyle = "#ffffff";
      const pad = 16;
      ctx.fillRect(qrX - pad, qrY - pad, qrSize + pad * 2, qrSize + pad * 2);
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
    }

    let y = qrY + qrSize + 36;
    ctx.fillStyle = textColor;
    ctx.font = 'normal 30px "Geist Mono", monospace';
    ctx.fillText("微信扫码联系", vx, y);
    y += 48;

    ctx.fillStyle = variant === "dark" ? "#aaaaaa" : "#666666";
    ctx.font = 'normal 26px "Geist Mono", monospace';
    if (email) { ctx.fillText(email, vx, y); y += 40; }
    if (phone) { ctx.fillText(phone, vx, y); y += 40; }
  }
}

const CardTemplate = forwardRef<CardTemplateRef, CardTemplateProps>(
  ({ userName, variant, side, onTextureReady, email, phone, github, wechatQr }, ref) => {
    const [qrImage, setQrImage] = useState<HTMLImageElement | null>(null);

    const textColor = variant === "dark" ? "#ffffff" : "#000000";

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

    // Capture when QR loads
    useEffect(() => {
      if (qrImage || side === "front") {
        captureTexture();
      }
    }, [qrImage]);

    const captureTexture = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      drawCard(canvas, qrImage, textColor, variant, side, userName, email, phone);
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
