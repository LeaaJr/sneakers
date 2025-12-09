//src/sections/running/CardRunning.tsx
import React from 'react';
import { useRouter } from '@tanstack/react-router';

interface jordanProps {
  sneakerId: string;
  title: string;
  description: string;
  image: string;
  featureId?: string;
}

const jordan: React.FC<jordanProps> = ({ 
  sneakerId,
  title, 
  description, 
  image 
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.navigate({
      to: '/sneakers/$sneakerId',
      params: { sneakerId },
    });
  };


  return (
    <div
      className="rounded-lg overflow-hidden shadow-lg transition-transform hover:shadow-xl cursor-pointer"
      onClick={handleClick}
    >
      <div className="h-96 overflow-hidden"> 
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover" 
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/FF0000/FFFFFF?text=Image+Error'; }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default jordan;