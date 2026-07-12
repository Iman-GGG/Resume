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
  const accent = isDark ? "#222222" : "#eeeeee";

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Subtle geometric pattern
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1;
  for (let i = -CANVAS_SIZE; i < CANVAS_SIZE * 2; i += 80) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i - CANVAS_SIZE, CANVAS_SIZE);
    ctx.stroke();
  }

  // Top accent band
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, CANVAS_SIZE, 60);
  ctx.fillRect(0, CANVAS_SIZE - 60, CANVAS_SIZE, 60);
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

  const cx = CANVAS_SIZE / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (side === "front") {
    // --- Front: name + contacts centered ---
    let y = CANVAS_SIZE / 2 - 40;
    ctx.fillStyle = textColor;
    ctx.font = '600 56px "Geist Mono", monospace';
    ctx.fillText(userName.toUpperCase() || "IMAN GENG", cx, y);
    y += 80;

    ctx.fillStyle = variant === "dark" ? "#aaaaaa" : "#666666";
    ctx.font = 'normal 34px "Geist Mono", monospace';
    if (email) { ctx.fillText(email, cx, y); y += 52; }
    if (phone) { ctx.fillText(phone, cx, y); y += 52; }
  } else {
    // --- Back: QR code centered ---
    const qrSize = 520;
    const qrX = cx - qrSize / 2;
    const qrY = 360;
    if (qrImage) {
      ctx.fillStyle = "#ffffff";
      const pad = 20;
      ctx.fillRect(qrX - pad, qrY - pad, qrSize + pad * 2, qrSize + pad * 2);
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
    }

    let y = qrY + qrSize + 40;
    ctx.fillStyle = textColor;
    ctx.font = 'normal 34px "Geist Mono", monospace';
    ctx.fillText("微信扫码联系", cx, y);
    y += 52;

    ctx.fillStyle = variant === "dark" ? "#aaaaaa" : "#666666";
    ctx.font = 'normal 30px "Geist Mono", monospace';
    if (email) { ctx.fillText(email, cx, y); y += 44; }
    if (phone) { ctx.fillText(phone, cx, y); y += 44; }
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
