// src/components/PetsSection.tsx
import React from "react";
import PetCard from "./petcard/PetCard"; // adjust path if needed

const petsMock = [
  {
    id: 101,
    name: "Buddy",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop",
    breed: "Golden Retriever",
    age: "2 Years",
    gender: "Male",
    description: "Playful and gentle.",
    address: "Chennai",
    created_date: new Date().toISOString(),
  },
  {
    id: 102,
    name: "Luna",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop",
    breed: "Siamese",
    age: "1 Year",
    gender: "Female",
    description: "Calm and affectionate.",
    address: "Coimbatore",
    created_date: new Date().toISOString(),
  },
];

const PetsSection: React.FC = () => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">All Pets</h2>
      <p className="text-gray-600 mb-6">This section lists all pets, not just rescued ones.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {petsMock.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
};

export default PetsSection;
