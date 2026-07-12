"use client";

import { forwardRef, useImperativeHandle, useEffect, useState } from "react";

export type CardVariant = "dark" | "light";

interface CardTemplateProps {
  userName: string;
  variant: CardVariant;
  onTextureReady: (dataUrl: string) => void;
  city?: string;
  date?: string;
  email?: string;
  phone?: string;
  github?: string;
  wechatQr?: string;
}

export interface CardTemplateRef {
  captureTexture: () => Promise<void>;
  exportCard: () => void;
}

const CANVAS_SIZE = 1376;

// Draw common elements (background, name, city, date, contacts, qr) on a given canvas
function drawCard(
  canvas: HTMLCanvasElement,
  baseImage: HTMLImageElement | null,
  qrImage: HTMLImageElement | null,
  textColor: string,
  userName: string,
  city?: string,
  date?: string,
  email?: string,
  phone?: string,
  github?: string,
  wechatQr?: string,
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

  // Name
  const displayName = userName || "YOUR NAME";
  const textX = (CANVAS_SIZE / 2) - 55;
  ctx.fillStyle = textColor;
  ctx.font = 'normal 48px "Geist Mono", monospace';
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(displayName.toUpperCase(), textX, CANVAS_SIZE - 400);

  // City
  if (city) {
    ctx.fillStyle = textColor;
    ctx.font = 'normal 48px "Geist Mono", monospace';
    ctx.textAlign = "right";
    ctx.fillText(city.toUpperCase(), textX, CANVAS_SIZE - 1226);
  }

  // Date
  if (date) {
    ctx.fillStyle = '#878787';
    ctx.font = 'normal 48px "Geist Mono", monospace';
    ctx.textAlign = "right";
    ctx.fillText(date.toUpperCase(), textX, CANVAS_SIZE - 1170);
  }

  // Contact info text (right side)
  let contactY = CANVAS_SIZE - 600;
  const renderContactLine = (value: string) => {
    ctx.fillStyle = '#878787';
    ctx.font = 'normal 28px "Geist Mono", monospace';
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(value, textX, contactY);
    contactY += 36;
  };

  if (email) renderContactLine(email);
  if (phone) renderContactLine(phone);
  if (github) renderContactLine(`github.com/${github}`);

  // WeChat QR code (left side)
  if (wechatQr && qrImage) {
    const qrSize = 200;
    const qrX = 180;
    const qrY = CANVAS_SIZE - 660;
    // White background for QR code to ensure scannability
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16);
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
    // Label below QR
    ctx.fillStyle = textColor;
    ctx.font = 'normal 22px "Geist Mono", monospace';
    ctx.textAlign = "center";
    ctx.fillText("WeChat", qrX + qrSize / 2, qrY + qrSize + 30);
  }
}

const CardTemplate = forwardRef<CardTemplateRef, CardTemplateProps>(
  ({ userName, variant, onTextureReady, city, date, email, phone, github, wechatQr }, ref) => {
    const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null);
    const [qrImage, setQrImage] = useState<HTMLImageElement | null>(null);

    const imageSrc = variant === "dark" ? "/card-base-dark.png" : "/card-base-light.png";
    const textColor = variant === "dark" ? "#ffffff" : "#000000";

    // Preload the base card image
    useEffect(() => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => setBaseImage(img);
      img.src = imageSrc;
    }, [imageSrc]);

    // Preload QR code image
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

    const captureTexture = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      drawCard(canvas, baseImage, qrImage, textColor, userName, city, date, email, phone, github, wechatQr);
      const dataUrl = canvas.toDataURL("image/png");
      onTextureReady(dataUrl);
    };

    const exportCard = () => {
      const CROP_BOTTOM = 334;
      const EXPORT_HEIGHT = CANVAS_SIZE - CROP_BOTTOM;

      const fullCanvas = document.createElement("canvas");
      fullCanvas.width = CANVAS_SIZE;
      fullCanvas.height = CANVAS_SIZE;
      drawCard(fullCanvas, baseImage, qrImage, textColor, userName, city, date, email, phone, github, wechatQr);

      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = CANVAS_SIZE;
      exportCanvas.height = EXPORT_HEIGHT;
      const exportCtx = exportCanvas.getContext("2d");
      if (!exportCtx) return;
      exportCtx.drawImage(fullCanvas, 0, 0, CANVAS_SIZE, EXPORT_HEIGHT, 0, 0, CANVAS_SIZE, EXPORT_HEIGHT);

      const dataUrl = exportCanvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `iman-geng-${userName || "card"}.png`;
      link.href = dataUrl;
      link.click();
    };

    useImperativeHandle(ref, () => ({
      captureTexture,
      exportCard,
    }));

    return null;
  }
);

CardTemplate.displayName = "CardTemplate";

export default CardTemplate;
