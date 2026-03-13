// src/components/Header.tsx
import React, { useEffect, useRef, useState, useCallback } from "react";

/** * TYPES & INTERFACES 
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
}

interface ScanRingProps {
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

interface HoloOrbProps {
  bannerRef: React.RefObject<HTMLDivElement | null>;
  mouseInside: boolean;
}

interface GlitchLetterProps {
  char: string;
  index: number;
  total: number;
}

const COLORS = {
  dark: "#6b789a",
  mid: "#96a0bd",
  light: "#acb4cb",
  lighter: "#d3d7e3",
  white: "#eef0f5",
  accent: "#7b8ab8",
};

/**
 * Animated particle field
 */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * 1600,
      y: Math.random() * 700,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());

      // Gradient background
      const bg = ctx.createLinearGradient(0, 0, W(), H());
      bg.addColorStop(0, "#bdc5d8");
      bg.addColorStop(0.4, "#c8cedd");
      bg.addColorStop(0.7, "#acb4cb");
      bg.addColorStop(1, "#96a0bd");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W(), H());

      // Subtle radial glow center
      const glow = ctx.createRadialGradient(W() * 0.5, H() * 0.55, 0, W() * 0.5, H() * 0.55, W() * 0.45);
      glow.addColorStop(0, "rgba(255,255,255,0.18)");
      glow.addColorStop(0.5, "rgba(255,255,255,0.05)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W(), H());

      // Move particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W();
        if (p.x > W()) p.x = 0;
        if (p.y < 0) p.y = H();
        if (p.y > H()) p.y = 0;
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(107,120,154,${0.15 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(107,120,154,${p.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}

/**
 * Scanning ring animation
 */
function ScanRing({ size, delay, duration, opacity }: ScanRingProps) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1px solid rgba(150,160,189,${opacity})`,
        animation: `scanPulse ${duration}s ease-out ${delay}s infinite`,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}

/**
 * Holographic orb with mouse tracking + blink
 */
function HoloOrb({ bannerRef, mouseInside }: HoloOrbProps) {
  const pupilRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const orbRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [blinkProgress, setBlinkProgress] = useState(0);
  const blinkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Primero defines la función con useCallback
const scheduleBlink = useCallback(() => {
  const delay = 2000 + Math.random() * 4000;
  blinkTimeoutRef.current = setTimeout(() => {
    let t = 0;
    const blinkFrames = 8;
    const blinkInterval = setInterval(() => {
      t++;
      if (t <= blinkFrames / 2) {
        setBlinkProgress(t / (blinkFrames / 2));
      } else if (t <= blinkFrames) {
        setBlinkProgress(1 - (t - blinkFrames / 2) / (blinkFrames / 2));
      } else {
        setBlinkProgress(0);
        clearInterval(blinkInterval);
        scheduleBlink(); // Aquí se llama a sí misma para el siguiente parpadeo
      }
    }, 30);
  }, delay);
}, []); // Nota: Quite scheduleBlink de las dependencias aquí para evitar bucles innecesarios

// 2. Después de definir el useEffect que la utiliza al montar el componente
useEffect(() => {
  scheduleBlink();
  return () => {
    if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
  };
}, [scheduleBlink]);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    const onMove = (e: MouseEvent) => {
      const orb = orbRef.current;
      if (!orb) return;
      const rect = orb.getBoundingClientRect();
      const orbCx = rect.left + rect.width / 2;
      const orbCy = rect.top + rect.height / 2;
      const dx = e.clientX - orbCx;
      const dy = e.clientY - orbCy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxR = 10;
      const angle = Math.atan2(dy, dx);
      const travel = Math.min(dist / 300, 1) * maxR;
      targetRef.current = {
        x: Math.cos(angle) * travel,
        y: Math.sin(angle) * travel,
      };
    };

    banner.addEventListener("mousemove", onMove);
    return () => banner.removeEventListener("mousemove", onMove);
  }, [bannerRef]);

  useEffect(() => {
    if (!mouseInside) {
      targetRef.current = { x: 0, y: 0 };
    }
  }, [mouseInside]);

  useEffect(() => {
    const loop = () => {
      const cur = pupilRef.current;
      const tgt = targetRef.current;
      const lerpFactor = 0.08;
      const nx = cur.x + (tgt.x - cur.x) * lerpFactor;
      const ny = cur.y + (tgt.y - cur.y) * lerpFactor;
      pupilRef.current = { x: nx, y: ny };
      setPupilPos({ x: nx, y: ny });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const eyelidScale = blinkProgress;

  return (
    <div style={{ position: "relative", width: 260, height: 260, margin: "0 auto" }}>
      <ScanRing size={260} delay={0} duration={2.4} opacity={0.4} />
      <ScanRing size={220} delay={0.4} duration={2.4} opacity={0.3} />
      <ScanRing size={180} delay={0.8} duration={2.4} opacity={0.25} />
      <ScanRing size={140} delay={1.2} duration={2.4} opacity={0.2} />

      <div
        ref={orbRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9) 0%, rgba(210,215,228,0.8) 35%, rgba(150,160,189,0.7) 65%, rgba(107,120,154,0.5) 100%)",
          boxShadow: "0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(150,160,189,0.3), inset 0 0 20px rgba(255,255,255,0.4)",
          animation: "orbFloat 4s ease-in-out infinite",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(calc(-50% + ${pupilPos.x}px), calc(-50% + ${pupilPos.y}px))`,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 40%, rgba(172,180,203,0.9) 0%, rgba(107,120,154,1) 40%, rgba(80,92,130,1) 70%, rgba(40,50,80,0.9) 100%)",
            boxShadow: "inset 0 0 15px rgba(0,0,0,0.3), 0 0 20px rgba(107,120,154,0.5)",
            overflow: "hidden",
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "50%",
                height: 1,
                background: "rgba(211,215,227,0.3)",
                transformOrigin: "left center",
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "radial-gradient(circle, #1a2040 0%, #0d1225 100%)",
              boxShadow: "0 0 8px rgba(0,0,0,0.8)",
            }}
          />
        </div>

        {/* Eyelids */}
        {[
          { top: 0, transformOrigin: "top center", gradient: "at 35% 35%" },
          { bottom: 0, transformOrigin: "bottom center", gradient: "at 65% 65%" },
        ].map((lid, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: lid.top,
              bottom: lid.bottom,
              height: "50%",
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: lid.top !== undefined ? 0 : "auto",
                bottom: lid.bottom !== undefined ? 0 : "auto",
                height: "200%",
                borderRadius: "50%",
                background: `radial-gradient(circle ${lid.gradient}, rgba(255,255,255,0.95) 0%, rgba(210,215,228,0.9) 35%, rgba(150,160,189,0.85) 65%, rgba(107,120,154,0.8) 100%)`,
                transformOrigin: lid.transformOrigin,
                transform: `scaleY(${eyelidScale})`,
                transition: "transform 0.03s linear",
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Decors can follow similar patterns... */}
    </div>
  );
}

/**
 * Glitchy letter
 */
function GlitchLetter({ char, index, total }: GlitchLetterProps) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.08) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 120);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const progress = index / (total - 1);
  const r = Math.round(74 + (211 - 74) * progress);
  const g = Math.round(85 + (215 - 85) * progress);
  const b = Math.round(120 + (227 - 120) * progress);
  const color = `rgb(${r},${g},${b})`;

  return (
    <span
      style={{
        display: "inline-block",
        color,
        position: "relative",
        transition: "transform 0.1s",
        transform: glitching ? `translateX(${(Math.random() - 0.5) * 4}px) skewX(${(Math.random() - 0.5) * 8}deg)` : "none",
        animation: `letterReveal 0.6s ease-out ${index * 0.04}s both`,
        textShadow: glitching
          ? `2px 0 rgba(150,160,189,0.8), -2px 0 rgba(107,120,154,0.8)`
          : `0 0 40px rgba(150,160,189,0.3)`,
      }}
    >
      {char}
    </span>
  );
}

/**
 * MAIN BANNER COMPONENT
 */
export default function SneakersBanner() {
  const title = "SNEAKERS STORE";
  const letters = title.split("");
  const nonSpace = letters.filter((c) => c !== " ").length;
  let letterCount = 0;

  const bannerRef = useRef<HTMLDivElement>(null);
  const [mouseInside, setMouseInside] = useState(false);

  return (
    <div
      ref={bannerRef}
      onMouseEnter={() => setMouseInside(true)}
      onMouseLeave={() => setMouseInside(false)}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: 500,
        overflow: "hidden",
        fontFamily: "'Bebas Neue', 'Impact', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@300;400;600&display=swap');
        @keyframes scanPulse {
          0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-12px); }
        }
        @keyframes spinSlow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes letterReveal {
          from { opacity: 0; transform: translateY(-30px) skewX(-10deg); }
          to { opacity: 1; transform: translateY(0) skewX(0deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanLine {
          0% { top: 0%; opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes borderGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(150,160,189,0.4); }
          50% { box-shadow: 0 0 16px rgba(150,160,189,0.7); }
        }
      `}</style>

      <ParticleField />

      {/* Main Title Rendering */}
      <div style={{ fontSize: "clamp(56px, 10vw, 140px)", lineHeight: 0.9, textAlign: "center", zIndex: 10 }}>
        {letters.map((char, i) => {
          if (char === " ") return <span key={i} style={{ display: "inline-block", width: "0.3em" }} />;
          const idx = letterCount++;
          return <GlitchLetter key={i} char={char} index={idx} total={nonSpace} />;
        })}
      </div>

      <HoloOrb bannerRef={bannerRef} mouseInside={mouseInside} />

      <button
        style={{
          marginTop: 24,
          padding: "10px 36px",
          background: "transparent",
          border: "1px solid rgba(150,160,189,0.6)",
          color: COLORS.dark,
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 600,
          letterSpacing: "0.4em",
          cursor: "pointer",
          zIndex: 10
        }}
        onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(150,160,189,0.1)";
        }}
        onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        EXPLORE COLLECTION
      </button>
    </div>
  );
}