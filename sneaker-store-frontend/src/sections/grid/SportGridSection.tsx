// src/sections/SportGridSection.tsx (from previous response, no changes needed)
import React, { useEffect, useState } from 'react';
import CardSport from './CardSport'; // Adjust path if needed
import { ArrowRightIcon } from 'lucide-react';

interface Sneaker {
  id: string;
  title: string;
  description: string;
  main_image_url: string; // This will come from your DB
}

interface SportGridSectionProps {
  sportType: string; // e.g., "running", "urban", "futbol"
  sectionTitle: string; // e.g., "Zapatillas de Running"
}

const SportGridSection: React.FC<SportGridSectionProps> = ({
  sportType,
  sectionTitle,
}) => {
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSneakersBySport = async () => {
      setLoading(true);
      setError(null);
      try {
        // This is the crucial line that now works with your modified backend
        const response = await fetch(`http://localhost:8000/api/sneakers/?sport=${sportType}`); // Assuming your FastAPI runs on port 8000
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Sneaker[] = await response.json();
        setSneakers(data);
      } catch (err) {
        setError('Failed to fetch sneakers. Please check your backend API.');
        console.error('Error fetching sneakers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSneakersBySport();
  }, [sportType]); // Re-fetch when sportType changes

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        Cargando zapatillas de {sectionTitle}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (sneakers.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center text-gray-600">
        No hay zapatillas de {sectionTitle} disponibles en este momento.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          {sectionTitle}
        </h2>
        <a
          href={`/sneakers?sport=${sportType}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          Ver más {sectionTitle}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </a>
      </div>

      <div className="flex flex-col items-center">
        {sneakers.map((sneaker, index) => (
          <div
            key={sneaker.id}
            className={`
              w-full md:w-3/4 lg:w-2/3 xl:w-1/2
              transform
              ${index % 2 === 0 ? 'rotate-[-2deg]' : 'rotate-2deg'}
              ${index > 0 ? '-mt-24 md:-mt-36' : ''}
              transition-transform duration-300 ease-in-out hover:scale-105 hover:rotate-0
              relative
            `}
            style={{ zIndex: sneakers.length - index }}
          >
            <CardSport
              title={sneaker.title}
              description={sneaker.description}
              image={sneaker.main_image_url}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SportGridSection;