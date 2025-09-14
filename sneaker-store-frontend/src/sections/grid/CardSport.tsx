import React from 'react';
import { Link } from '@tanstack/react-router';

interface CardSportProps {
  id: string;
  title: string;
  description: string;
  image: string;
  sportType: string; // Hacer obligatorio
  linkTo?: boolean;
}

const CardSport: React.FC<CardSportProps> = ({
  id,
  title,
  description,
  image,
  sportType,
  linkTo = true,
}) => {
  const content = (
    <div className="rounded-lg overflow-hidden transition-transform hover:shadow-xl cursor-pointer">
      <div className="h-96 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              'https://placehold.co/400x300/FF0000/FFFFFF?text=Image+Error';
          }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );

  if (!linkTo) {
    return content;
  }

  return (
    <Link 
      to="/category/$sport" 
      params={{ sport: sportType }}
      className="block"
    >
      {content}
    </Link>
  );
};

export default CardSport;