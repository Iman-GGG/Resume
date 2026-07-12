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

  // Visible centers from grid analysis:
  // Front: cells 1-2 x, 2-3 y → center (344, 516)
  // Back:  cells 5-6 x, 2-3 y → center (1032, 516)
  const frontCx = 344;
  const frontCy = 516;
  const backCx = 1032;
  const backCy = 516;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (side === "front") {
    let y = frontCy - 30;
    ctx.fillStyle = textColor;
    ctx.font = '600 46px "Geist Mono", monospace';
    ctx.fillText(userName.toUpperCase() || "IMAN GENG", frontCx, y);
    y += 70;

    ctx.fillStyle = variant === "dark" ? "#aaaaaa" : "#666666";
    ctx.font = 'normal 28px "Geist Mono", monospace';
    if (email) { ctx.fillText(email, frontCx, y); y += 44; }
    if (phone) { ctx.fillText(phone, frontCx, y); y += 44; }
  } else {
    const qrSize = 340;
    const qrX = backCx - qrSize / 2;
    const qrY = backCy - qrSize / 2 - 20;
    if (qrImage) {
      ctx.fillStyle = "#ffffff";
      const pad = 14;
      ctx.fillRect(qrX - pad, qrY - pad, qrSize + pad * 2, qrSize + pad * 2);
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
    }

    let y = qrY + qrSize + 32;
    ctx.fillStyle = textColor;
    ctx.font = 'normal 28px "Geist Mono", monospace';
    ctx.fillText("微信扫码联系", backCx, y);
    y += 44;

    ctx.fillStyle = variant === "dark" ? "#aaaaaa" : "#666666";
    ctx.font = 'normal 24px "Geist Mono", monospace';
    if (email) { ctx.fillText(email, backCx, y); y += 36; }
    if (phone) { ctx.fillText(phone, backCx, y); y += 36; }
  }

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
