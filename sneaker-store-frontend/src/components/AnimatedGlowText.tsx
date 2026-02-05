import React from 'react';

interface AnimatedGlowTextProps {
  text: string;
}

const AnimatedGlowText: React.FC<AnimatedGlowTextProps> = ({ text }) => {
  return (
    <div className="flex items-center justify-center w-full px-4 py-12 overflow-hidden bg-transparent">
      <h1 className={`
        relative font-sans font-black uppercase text-center
        text-5xl sm:text-6xl md:text-7xl lg:text-9xl
        tracking-tighter sm:tracking-normal
        animate-float
        
      `}>
        
        {/* El texto con el degradado animado ahora tiene más cuerpo */}
        <span className="relative bg-clip-text text-transparent 
                         bg-[length:200%_auto] 
                         bg-gradient-to-r from-[#60698d] via-[#ffffff] via-[#60699d] to-[#ffffff] 
                         /* Filtro para que el color no sea tan lavado */
                         brightness-110 contrast-110">
          {text}
        </span>

        {/* Reflejo en el "suelo" para aumentar la sensación 3D */}
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[110%] h-8 
                         bg-gradient-to-b from-black/10 to-transparent 
                         blur-2xl rounded-[100%] pointer-events-none opacity-40"></span>
      </h1>
    </div>
  );
};

export default AnimatedGlowText;