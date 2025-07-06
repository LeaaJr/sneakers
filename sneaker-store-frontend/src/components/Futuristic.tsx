import React, { useState, useEffect } from 'react';

interface CyberGlitchTextProps {
  text: string;
  intensity?: number;
  fontSize?: string;
}

const CyberGlitchText: React.FC<CyberGlitchTextProps> = ({ 
  text, 
  intensity = 0.7,
  fontSize = '3rem'
}) => {
  const [glitch, setGlitch] = useState(false);
  const [offsets, setOffsets] = useState({ x1: 0, x2: 0, y1: 0, y2: 0 });

  // Efecto de glitch aleatorio
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        triggerGlitch();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const triggerGlitch = () => {
    setGlitch(true);
    setOffsets({
      x1: Math.random() * 6 - 3,
      x2: Math.random() * 6 - 3,
      y1: Math.random() * 4 - 2,
      y2: Math.random() * 4 - 2
    });

    setTimeout(() => setGlitch(false), 200 + Math.random() * 300);
  };
  

  return (
    <div 
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: 'pointer',
        fontSize: fontSize,
        fontWeight: 700,
        letterSpacing: '0.2em',
        color: '#EBEDF3',
        textShadow: '0 0 8px rgba(235, 237, 243, 0.5)',
        filter: 'drop-shadow(0 0 2px rgba(140, 199, 237, 0.7))',
        padding: '0.5em 1em',
        margin: '0.5em 0',
        zIndex: 10
      }}
      onClick={triggerGlitch}
    >
      {/* Texto principal */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        opacity: glitch ? 0.8 : 1,
        transition: 'opacity 0.2s ease-out'
      }}>
        {text}
      </div>

      {/* Capas de glitch */}
      {glitch && (
        <>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            color: 'rgba(200, 220, 255, 0.7)',
            zIndex: 2,
            clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
            transform: `translate(${offsets.x1}px, ${offsets.y1}px)`,
            textShadow: '2px 0 1px rgba(255,255,255,0.5)'
          }}>
            {text}
          </div>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            color: 'rgba(170, 190, 220, 0.7)',
            zIndex: 1,
            clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
            transform: `translate(${offsets.x2}px, ${offsets.y2}px)`,
            textShadow: '-2px 0 1px rgba(255,255,255,0.3)'
          }}>
            {text}
          </div>
        </>
      )}

      {/* Efecto de ruido/snow digital */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        right: '-10%',
        bottom: '-10%',
        background: `
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${intensity * 0.15}'/%3E%3C/svg%3E")
        `,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        zIndex: 4,
        opacity: glitch ? 0.8 : 0.3,
        transition: 'opacity 0.3s ease-out'
      }} />

      {/* Borde sutil */}
{/*       <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        border: '1px solid rgba(235, 237, 243, 0.2)',
        borderRadius: '2px',
        pointerEvents: 'none',
        zIndex: 0,
        boxShadow: 'inset 0 0 10px rgba(140, 199, 237, 0.3)'
      }} /> */}
    </div>
  );
};

export default CyberGlitchText;
