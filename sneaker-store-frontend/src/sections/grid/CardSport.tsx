// src/components/CardSport.tsx
import React from 'react';

interface CardSportProps {
  title: string;
  description: string;
  image: string;
}

const CardSport: React.FC<CardSportProps> = ({ title, description, image }) => {
  return (
    <div
      className="rounded-lg overflow-hidden shadow-lg transition-transform hover:shadow-xl cursor-pointer"
      onClick={() => console.log(`Clicked on ${title}`)}
    >
      <div className="h-96 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              'https://placehold.co/400x300/FF0000/FFFFFF?text=Image+Error';
          }} // Fallback rojo
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900"> {title} </h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default CardSport;