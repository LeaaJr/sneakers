// src/sections/running/CardRunning.tsx
import React from 'react';

interface CardRunngingProps {
  title: string;
  description: string;
  image: string;
}
const CardRunnging: React.FC<CardRunngingProps> = ({
  title,
  description,
  image,
}) => {
  return (
    // DEBUGGING: Añadir un fondo y borde para cada CardRunnging
    <div
      className="rounded-lg overflow-hidden shadow-lg transition-transform hover:shadow-xl cursor-pointer"
      onClick={() => console.log(`Clicked on ${title}`)}
    >

      <div className="h-96 overflow-hidden"> 
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover" 
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/FF0000/FFFFFF?text=Image+Error'; }} // Fallback rojo
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900"> {title} </h3> {/* Añadir DEBUG al título */}
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};
export default CardRunnging;
