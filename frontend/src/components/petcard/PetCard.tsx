import React, { useState } from "react";
import { MapPin, Calendar } from "lucide-react";
import type { Pet } from "../../services/api"; // optional type if you have one

interface PetCardProps {
  pet: Pet | any;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => setImageError(true);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer flex flex-col">
      {pet.image && !imageError ? (
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-56 object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-56 flex items-center justify-center bg-gray-200">
          <span className="text-gray-400">No Image</span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{pet.name}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span>{pet.breed ?? "Unknown breed"}</span>
          <span className="mx-2">•</span>
          <span>{pet.age ?? "Unknown age"}</span>
          <span className="mx-2">•</span>
          <span>{pet.gender ?? "Unknown"}</span>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
