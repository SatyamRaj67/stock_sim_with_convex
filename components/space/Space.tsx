"use client";

import { useEffect, useRef } from "react";

const Space = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.scale(dpr, dpr);

    let frameCount = 0;
    let animationFrameId;
    let stars: { x: number; y: number }[] = [];

    const draw = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points: { x: number; y: number }[] = [];

      while (points.length < 100) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
        });
      }

      points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);
  }, []);

  return (
    <div className="fixed h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

export default Space;
