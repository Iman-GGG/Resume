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
  frontPhotoUrl?: string;
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
  frontPhoto?: HTMLImageElement | null,
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
    // Draw front photo centered with multiply blend
    let textStartY = frontCy + 40;
    if (frontPhoto) {
      const imgW = 280;
      const imgH = imgW * (frontPhoto.naturalHeight / frontPhoto.naturalWidth);
      const imgX = frontCx - imgW / 2;
      const imgY = frontCy - imgH / 2;
      ctx.globalCompositeOperation = "exclusion";
      ctx.drawImage(frontPhoto, imgX, imgY, imgW, imgH);
      ctx.globalCompositeOperation = "source-over";
      textStartY = imgY + imgH + 50;
    }

    ctx.fillStyle = textColor;
    ctx.font = '600 92px "Geist Mono", monospace';
    ctx.fillText(userName.toUpperCase() || "IMAN GENG", frontCx, textStartY);
    textStartY += 100;

    ctx.fillStyle = variant === "dark" ? "#aaaaaa" : "#666666";
    ctx.font = 'normal 56px "Geist Mono", monospace';
    if (email) { ctx.fillText(email, frontCx, textStartY); textStartY += 72; }
    if (phone) { ctx.fillText(phone, frontCx, textStartY); textStartY += 72; }
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

  }
}

const CardTemplate = forwardRef<CardTemplateRef, CardTemplateProps>(
  ({ userName, variant, side, onTextureReady, email, phone, github, wechatQr, frontPhotoUrl }, ref) => {
    const [qrImage, setQrImage] = useState<HTMLImageElement | null>(null);
    const [frontPhoto, setFrontPhoto] = useState<HTMLImageElement | null>(null);

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

    useEffect(() => {
      if (frontPhotoUrl) {
        const img = new Image();
        img.onload = () => {
          console.log('frontPhoto loaded:', frontPhotoUrl, img.naturalWidth, img.naturalHeight);
          setFrontPhoto(img);
        };
        img.onerror = (e) => console.error('frontPhoto failed:', frontPhotoUrl, e);
        img.src = frontPhotoUrl;
      } else {
        setFrontPhoto(null);
      }
    }, [frontPhotoUrl]);

    // Capture when images load
    useEffect(() => {
      const frontReady = side === "front" && (frontPhotoUrl ? frontPhoto : true);
      const backReady = side === "back" && qrImage;
      if (frontReady || backReady) {
        captureTexture();
      }
    }, [qrImage, frontPhoto]);

    const captureTexture = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      drawCard(canvas, qrImage, textColor, variant, side, userName, email, phone, frontPhoto);
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
