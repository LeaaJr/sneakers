// src/sections/running/RunningSection.tsx
import React from 'react';
import CardRunnging from './CardRunning';
import { ArrowRightIcon } from 'lucide-react';

const RunningSection: React.FC = () => {
  const features = [
    {
      id: 1,
      title: 'Structure 26',
      description:
        "Il tallone e la linguetta, realizzati in materiali più morbidi e pregiati, presentano un'imbottitura extra che offre più comfort e una stabilità ideale a ogni passo.",
      image:
        'https://static.nike.com/a/images/f_auto/dpr_1.4,cs_srgb/h_765,c_limit/72a7c5aa-459d-402b-bb22-77d0ff8c1ab4/nike-just-do-it.png',
    },
    {
      id: 2,
      title: 'Sistema di Supporto',
      description:
        "Abbiamo rimosso l'unità Air Zoom dall avampiede per poi aggiungere uno strato in gomma soffiata più morbido, per favorire transizioni maggiormente fluide.",
      image:
        'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4e9e0abc-0e08-406e-a3b7-94e2ec531fd9/W+NIKE+STRUCTURE+26.png',
    },
    {
      id: 3,
      title: "L'intersuola ReactX",
      description:
        'La nuova intersuola in schiuma ReactX rende la scarpa più reattiva e leggermente più morbida.',
      image:
        'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/ff83f80c-8af0-4d5b-9bd4-d5a390e65528/W+NIKE+STRUCTURE+26.png',
    },
  ];
  return (
    // DEBUGGING: Añadir un fondo muy visible para el contenedor de RunningSection
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Nike Structure 26
        </h2>
        <a
          href="#"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          Learn more about inner source
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
        {features.map((feature) => (
          <CardRunnging
            key={feature.id}
            title={feature.title}
            description={feature.description}
            image={feature.image}
          />
        ))}
      </div>
    </div>
  );
};
export default RunningSection;
