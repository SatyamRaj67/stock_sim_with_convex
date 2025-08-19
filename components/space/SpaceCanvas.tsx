"use client";

import React, { useEffect, useRef } from "react";

/**
 * SpaceCanvas – React port of the enhanced space rays canvas demo.
 * Features:
 * - Starfield with parallax, breathing, twinkle, diagonals
 * - Nebula background (offscreen canvas)
 * - Shooting stars
 * - Click supernova (curvy shockwave + particles)
 * - Mouse trail
 * - Keyboard toggles: [SPACE] pause, [R] regen, [D] diagonals, [B] breathe, [P] parallax,
 *   [N] nebula, [S] shooting stars, [C] click nova, [T] mouse trail
 */
const SpaceCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
  const canvasEl = canvasRef.current as HTMLCanvasElement | null;
  if (!canvasEl) return;
  const canvas = canvasEl as HTMLCanvasElement; // non-null from here on
  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true }) as CanvasRenderingContext2D;
    if (!ctx) return;

    // --- CONFIGURATION ---
    const CONFIG = {
      MIN_STARS: 400,
      MAX_STARS: 900,
      TARGET_AREA_PER_STAR: 45000,
      MIN_SEP: 22,
      STAR_COLORS: ["255, 255, 255", "200, 220, 255", "255, 240, 220"],
      RAY_GAP: 1,
      PARALLAX_STRENGTH: 0.8,
      ENABLE_DIAGONALS: true,
      ENABLE_BREATHE: true,
      ENABLE_PARALLAX: true,
      ENABLE_NEBULA: true,
      ENABLE_SHOOTING_STARS: true,
      ENABLE_CLICK_NOVA: true,
      ENABLE_MOUSE_TRAIL: true,
      SHOOTING_STAR_CHANCE: 0.0008,
      SHOOTING_STAR_SPEED: 15,
      SHOOTING_STAR_FADE_RATE: 0.96,
      NOVA_PARTICLES: 80,
      NOVA_LIFESPAN: 1.5,
      NOVA_SHOCKWAVE_SPEED: 350,
      NOVA_CORE_LIFESPAN_RATIO: 0.15,
      NOVA_SHAPE_POINTS: 12,
      TRAIL_PARTICLES: 25,
      TRAIL_LIFESPAN: 0.4,
    } as const;

    // State
    let cssW = 0, cssH = 0, dpr = 1;
    let stars: any[] = [];
    let shootingStars: any[] = [];
    let novas: any[] = [];
    let trail: any[] = [];
    let nebulaCanvas: HTMLCanvasElement | null = null;
    let running = true;
    let lastTime = performance.now();
    const mouse = { x: 0, y: 0, dx: 0, dy: 0 };

    // Utils
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

    function generateStars() {
      const target = clamp(
        Math.round((cssW * cssH) / CONFIG.TARGET_AREA_PER_STAR),
        CONFIG.MIN_STARS,
        CONFIG.MAX_STARS
      );
      const pts: { x: number; y: number }[] = [];
      let attempts = 0, maxAttempts = target * 40;
    while (pts.length < target && attempts++ < maxAttempts) {
        const x = Math.random() * cssW;
        const y = Math.random() * cssH;
        let ok = true;
        for (let i = 0; i < pts.length; i++) {
      const prev = pts[i]!;
      const dx = prev.x - x, dy = prev.y - y;
          if (dx * dx + dy * dy < CONFIG.MIN_SEP * CONFIG.MIN_SEP) { ok = false; break; }
        }
        if (ok) pts.push({ x, y });
      }
      stars = pts.map((p) => {
        const depth = Math.pow(Math.random(), 1.6);
        const len = clamp(1 + Math.round(depth * 5), 1, 6);
        return {
          x: p.x,
          y: p.y,
          px: p.x,
          py: p.y,
          depth,
          len,
          color: CONFIG.STAR_COLORS[Math.floor(Math.random() * CONFIG.STAR_COLORS.length)],
          alpha: 0.55 + 0.35 * depth,
          wobble: rand(0.7, 1.3),
          twinkle: rand(2, 5),
          phase: rand(0, Math.PI * 2),
          vx: rand(-0.02, 0.02),
          vy: rand(-0.02, 0.02),
        };
      });
    }

    function generateNebula() {
  nebulaCanvas = document.createElement("canvas");
  nebulaCanvas.width = canvas.width;
  nebulaCanvas.height = canvas.height;
      const nebCtx = nebulaCanvas.getContext("2d")!;
      nebCtx.globalCompositeOperation = "lighter";
      const numClouds = Math.floor(rand(15, 25));
      for (let i = 0; i < numClouds; i++) {
        const x = rand(0, nebulaCanvas.width);
        const y = rand(0, nebulaCanvas.height);
        const r1 = rand(50, 200) * dpr;
        const r2 = rand(r1, nebulaCanvas.width * 0.4);
        const grad = nebCtx.createRadialGradient(x, y, r1, x, y, r2);
        const hue = rand(200, 280);
        grad.addColorStop(0, `hsla(${hue}, 50%, 40%, ${rand(0.05, 0.15)})`);
        grad.addColorStop(1, `hsla(${hue}, 50%, 20%, 0)`);
        nebCtx.fillStyle = grad;
        nebCtx.fillRect(0, 0, nebulaCanvas.width, nebulaCanvas.height);
      }
    }

    function resize() {
  cssW = window.innerWidth;
  cssH = window.innerHeight;
  dpr = Math.max(1, Math.min(2, (window.devicePixelRatio || 1)));
  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);
      generateStars();
      if (CONFIG.ENABLE_NEBULA) generateNebula();
    }

    function clear() {
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#090b10");
      gradient.addColorStop(1, "#121417");
      ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function createNova(x: number, y: number) {
      const nova: any = {
        x, y,
        life: 1,
        hue: rand(0, 360),
        particles: [] as any[],
        shapeRadii: Array.from({ length: CONFIG.NOVA_SHAPE_POINTS }, () => rand(0.85, 1.15)),
      };
      for (let i = 0; i < CONFIG.NOVA_PARTICLES; i++) {
        const angle = rand(0, Math.PI * 2);
        const speed = rand(50, 250) * (1 + Math.random());
        nova.particles.push({ vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed });
      }
      novas.push(nova);
    }

    function createTrailParticle() {
      if (trail.length < CONFIG.TRAIL_PARTICLES) {
        trail.push({
          x: mouse.x,
          y: mouse.y,
          life: 1,
          vx: rand(-5, 5),
          vy: rand(-5, 5),
          color: CONFIG.STAR_COLORS[Math.floor(Math.random() * CONFIG.STAR_COLORS.length)],
        });
      }
    }

    function updateAndDrawEffects(delta: number) {
      ctx.globalCompositeOperation = "lighter";

      // Mouse trail
      if ((CONFIG as any).ENABLE_MOUSE_TRAIL) createTrailParticle();
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.life -= delta / CONFIG.TRAIL_LIFESPAN;
        if (p.life <= 0) { trail.splice(i, 1); continue; }
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        ctx.fillStyle = `rgba(${p.color}, ${p.life * 0.8})`;
        ctx.fillRect(p.x * dpr, p.y * dpr, 1, 1);
      }

      // Novas
      for (let i = novas.length - 1; i >= 0; i--) {
        const n = novas[i];
        n.life -= delta / CONFIG.NOVA_LIFESPAN;
        if (n.life <= 0) { novas.splice(i, 1); continue; }
        const progress = 1 - n.life;
        const alpha = n.life * n.life;
        const baseRadius = progress * CONFIG.NOVA_SHOCKWAVE_SPEED;
        ctx.strokeStyle = `hsla(${n.hue}, 100%, 80%, ${alpha * 0.7})`;
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        const angleStep = (Math.PI * 2) / CONFIG.NOVA_SHAPE_POINTS;
        for (let j = 0; j < CONFIG.NOVA_SHAPE_POINTS; j++) {
          const angle = j * angleStep;
          const nextAngle = (j + 1) * angleStep;
          const r1 = baseRadius * n.shapeRadii[j];
          const p1x = (n.x + Math.cos(angle) * r1) * dpr;
          const p1y = (n.y + Math.sin(angle) * r1) * dpr;
          const r2 = baseRadius * n.shapeRadii[(j + 1) % CONFIG.NOVA_SHAPE_POINTS];
          const p2x = (n.x + Math.cos(nextAngle) * r2) * dpr;
          const p2y = (n.y + Math.sin(nextAngle) * r2) * dpr;
          const midX = (p1x + p2x) / 2;
          const midY = (p1y + p2y) / 2;
          if (j === 0) ctx.moveTo(midX, midY); else ctx.quadraticCurveTo(p1x, p1y, midX, midY);
        }
        ctx.closePath();
        ctx.stroke();

        // Core flash
        const coreProgress = clamp((1 - n.life) / CONFIG.NOVA_CORE_LIFESPAN_RATIO, 0, 1);
        if (coreProgress < 1) {
          const eased = 1 - Math.pow(1 - coreProgress, 2);
          const coreRadius = (40 + 160 * eased) * dpr;
          const coreAlpha = Math.pow(1 - coreProgress, 1.5);
          const grad = ctx.createRadialGradient(n.x * dpr, n.y * dpr, 0, n.x * dpr, n.y * dpr, coreRadius);
          grad.addColorStop(0, `hsla(${n.hue}, 100%, 95%, ${coreAlpha})`);
          grad.addColorStop(1, `hsla(${n.hue}, 100%, 80%, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(n.x * dpr, n.y * dpr, coreRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Nova particles
        ctx.fillStyle = `hsla(${n.hue}, 100%, 75%, ${alpha})`;
        for (const p of n.particles) {
          const px = (n.x + p.vx * progress) * dpr;
          const py = (n.y + p.vy * progress) * dpr;
          ctx.fillRect(px, py, 1.5 * dpr, 1.5 * dpr);
        }
      }

      // Shooting stars
    if ((CONFIG as any).ENABLE_SHOOTING_STARS && Math.random() < CONFIG.SHOOTING_STAR_CHANCE) {
        shootingStars.push({
          x: rand(0, canvas.width),
          y: rand(0, canvas.height),
          len: rand(50, 150) * dpr,
          angle: rand(0, Math.PI * 2),
          speed: rand(CONFIG.SHOOTING_STAR_SPEED * 0.5, CONFIG.SHOOTING_STAR_SPEED * 1.5) * dpr,
          alpha: rand(0.5, 1),
        });
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        const vx = Math.cos(s.angle) * s.speed;
        const vy = Math.sin(s.angle) * s.speed;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - vx * (s.len / s.speed), s.y - vy * (s.len / s.speed));
        const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink") || "255,255,255";
        grad.addColorStop(0, `rgba(${ink}, ${s.alpha})`);
        grad.addColorStop(1, `rgba(${ink}, 0)`);
        ctx.strokeStyle = grad as unknown as CanvasGradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + vx, s.y + vy);
        ctx.stroke();
        s.x += vx;
        s.y += vy;
        s.alpha *= CONFIG.SHOOTING_STAR_FADE_RATE;
        if (s.alpha < 0.01) shootingStars.splice(i, 1);
      }

      ctx.globalCompositeOperation = "source-over";
    }

    function draw(t: number) {
      if (!running) { rafRef.current = requestAnimationFrame(draw); return; }
      const delta = (t - lastTime) / 1000;
      lastTime = t;
      clear();

      if ((CONFIG as any).ENABLE_NEBULA && nebulaCanvas) {
        ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 0.0001);
        ctx.drawImage(nebulaCanvas, 0, 0);
        ctx.globalAlpha = 1;
      }

      const halfW = cssW / 2, halfH = cssH / 2;
      const targetDx = (CONFIG as any).ENABLE_PARALLAX ? ((mouse.x - halfW) / halfW) * CONFIG.PARALLAX_STRENGTH : 0;
      const targetDy = (CONFIG as any).ENABLE_PARALLAX ? ((mouse.y - halfH) / halfH) * CONFIG.PARALLAX_STRENGTH : 0;
      mouse.dx += (targetDx - mouse.dx) * 0.05;
      mouse.dy += (targetDy - mouse.dy) * 0.05;

      for (const s of stars) {
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x += cssW; if (s.x > cssW) s.x -= cssW;
        if (s.y < 0) s.y += cssH; if (s.y > cssH) s.y -= cssH;
        const parallaxFactor = s.depth * s.depth;
        s.px = s.x - mouse.dx * 150 * parallaxFactor;
        s.py = s.y - mouse.dy * 150 * parallaxFactor;
        const cx = Math.round(s.px * dpr);
        const cy = Math.round(s.py * dpr);
  if (cx < 0 || cx > canvas.width || cy < 0 || cy > canvas.height) continue;
        const time = t * 0.001;
        const breathePhase = Math.sin(time * s.wobble + s.phase);
        const twinkleVal = Math.sin(time * s.twinkle + s.phase);
        let cardPhase = (CONFIG as any).ENABLE_BREATHE ? 1 + 0.2 * breathePhase : 1;
        let diagPhase = (CONFIG as any).ENABLE_BREATHE ? 1 + 0.2 * Math.sin(breathePhase - Math.PI / 2) : 1;
        const baseAlpha = s.alpha * (0.8 + 0.2 * twinkleVal);
        const finalAlpha = clamp(baseAlpha * ((cardPhase + diagPhase) / 2), 0, 1);
        ctx.fillStyle = `rgba(${s.color}, ${finalAlpha.toFixed(3)})`;
        ctx.fillRect(cx, cy, 1, 1);
        const cardLen = Math.max(1, Math.round(s.len * cardPhase));
        const gap = CONFIG.RAY_GAP;
        ctx.fillRect(cx + 1 + gap, cy, cardLen, 1);
        ctx.fillRect(cx - gap - cardLen, cy, cardLen, 1);
        ctx.fillRect(cx, cy + 1 + gap, 1, cardLen);
        ctx.fillRect(cx, cy - gap - cardLen, 1, cardLen);
        if ((CONFIG as any).ENABLE_DIAGONALS && s.len > 2) {
          const diagLen = Math.max(1, Math.floor(s.len * 0.6 * diagPhase));
          const diagAlpha = finalAlpha * 0.5;
          ctx.fillStyle = `rgba(${s.color}, ${diagAlpha.toFixed(3)})`;
          for (let step = 1 + gap; step <= gap + diagLen; step++) {
            ctx.fillRect(cx + step, cy + step, 1, 1);
            ctx.fillRect(cx + step, cy - step, 1, 1);
            ctx.fillRect(cx - step, cy + step, 1, 1);
            ctx.fillRect(cx - step, cy - step, 1, 1);
          }
        }
      }

      updateAndDrawEffects(delta);
      rafRef.current = requestAnimationFrame(draw);
    }

    // Event listeners
    function onResize() { resize(); }
    function onKeyDown(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if (e.code === "Space") { running = !running; if (running) lastTime = performance.now(); }
      else if (k === "d") (CONFIG as any).ENABLE_DIAGONALS = !(CONFIG as any).ENABLE_DIAGONALS;
      else if (k === "b") (CONFIG as any).ENABLE_BREATHE = !(CONFIG as any).ENABLE_BREATHE;
      else if (k === "r") generateStars();
      else if (k === "p") (CONFIG as any).ENABLE_PARALLAX = !(CONFIG as any).ENABLE_PARALLAX;
      else if (k === "n") { (CONFIG as any).ENABLE_NEBULA = !(CONFIG as any).ENABLE_NEBULA; if ((CONFIG as any).ENABLE_NEBULA) generateNebula(); }
      else if (k === "s") (CONFIG as any).ENABLE_SHOOTING_STARS = !(CONFIG as any).ENABLE_SHOOTING_STARS;
      else if (k === "c") (CONFIG as any).ENABLE_CLICK_NOVA = !(CONFIG as any).ENABLE_CLICK_NOVA;
      else if (k === "t") (CONFIG as any).ENABLE_MOUSE_TRAIL = !(CONFIG as any).ENABLE_MOUSE_TRAIL;
    }
    function onMouseMove(e: MouseEvent) { mouse.x = e.clientX; mouse.y = e.clientY; }
    function onClick(e: MouseEvent) { if ((CONFIG as any).ENABLE_CLICK_NOVA) createNova(e.clientX, e.clientY); }

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("click", onClick);

    // Init
    resize();
    lastTime = performance.now();
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden cursor-crosshair" style={{ background: "#090b10" }}>
      <style>{`:root{--ink:255,255,255;} .help{position:fixed;bottom:10px;left:10px;font-family:monospace;color:rgba(255,255,255,0.4);font-size:12px;pointer-events:none}`}</style>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full " />
      <div className="help">
        [SPACE] Pause | [R] Regenerate | [D] Diagonals | [B] Breathe | [P] Parallax | [N] Nebula | [S] Shooting Stars | [C] Click Nova | [T] Trail
      </div>
    </div>
  );
};

export default SpaceCanvas;
