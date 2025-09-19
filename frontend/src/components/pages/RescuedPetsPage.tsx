import React, { useState } from "react";
import PetCard from "../petcard/PetCard";

const rescuedPetsMock = [
  {
    id: 1,
    name: "Charlie",
    image: "https://images.unsplash.com/photo-1601758123927-196f9c0f0f2d?w=500&auto=format&fit=crop",
    breed: "Beagle",
    age: "3 Years",
    gender: "Male",
    description: "Friendly and curious. Loves playing fetch and interacting with people.",
    address: "Bangalore",
    created_date: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Luna",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop",
    breed: "Siamese",
    age: "1 Year",
    gender: "Female",
    description: "Calm and affectionate. Loves cuddles and warm sunlight.",
    address: "Coimbatore",
    created_date: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Buddy",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop",
    breed: "Golden Retriever",
    age: "2 Years",
    gender: "Male",
    description: "Very playful and loves children.",
    address: "Chennai",
    created_date: new Date().toISOString(),
  },
];

const RescuedPetsPage: React.FC = () => {
  const [selectedPet, setSelectedPet] = useState<any | null>(null);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Rescued Pets</h1>
      <p className="text-gray-600 mb-6">Click on any pet to see full details below.</p>

      {/* Pets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rescuedPetsMock.map((pet) => (
          <div key={pet.id} onClick={() => setSelectedPet(pet)}>
            <PetCard pet={pet} />
          </div>
        ))}
      </div>

      {/* Selected Pet Details */}
      {selectedPet && (
        <div className="mt-12 p-6 bg-white rounded-xl shadow-lg flex flex-col md:flex-row gap-6">
          <img
            src={selectedPet.image}
            alt={selectedPet.name}
            className="w-full md:w-1/3 h-64 object-cover rounded-lg"
          />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">{selectedPet.name}</h2>
              <button
                onClick={() => setSelectedPet(null)}
                className="text-red-500 font-semibold hover:text-red-700"
              >
                Close
              </button>
            </div>
            <p><strong>Breed:</strong> {selectedPet.breed}</p>
            <p><strong>Age:</strong> {selectedPet.age}</p>
            <p><strong>Gender:</strong> {selectedPet.gender}</p>
            <p><strong>Location:</strong> {selectedPet.address}</p>
            <p><strong>Description:</strong> {selectedPet.description}</p>
            <p><strong>Listed on:</strong> {new Date(selectedPet.created_date).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RescuedPetsPage;
