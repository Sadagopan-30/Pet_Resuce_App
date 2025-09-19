// AdminPets.tsx
import React, { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";
import { apiService, type Pet, type PetAdoption, type PetReport } from "../../services/api";


const tabs = ["rescued", "lost", "found", "adopted"];

// Extend Pet to include status for display
interface PetWithStatus extends Pet {
  status?: string;
}

const AdminPets: React.FC = () => {
  const [pets, setPets] = useState<PetWithStatus[]>([]);
  const [activeTab, setActiveTab] = useState("rescued");
  const [selectedPet, setSelectedPet] = useState<PetWithStatus | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    vaccinated: false,
    diseased: false,
    gender: "all",
    type: "all",
  });
  const [sortBy, setSortBy] = useState("name");
  const [selectedPets, setSelectedPets] = useState<number[]>([]);

  useEffect(() => {
    fetchPets();
  }, [activeTab]);

  const fetchPets = async () => {
    try {
      let data: PetWithStatus[] = [];

      if (activeTab === "rescued" || activeTab === "adopted") {
        const res = await apiService.getPetsByTab("adopt");
        data = (res.results as PetAdoption[]).map((item) => ({
          ...item.pet,
          status: item.status,
        }));
      } else if (activeTab === "lost") {
        const res = await apiService.getPetsByTab("lost");
        data = (res.results as PetReport[]).map((item) => ({
          ...item.pet,
          status: item.pet_status,
        }));
      } else if (activeTab === "found") {
        const res = await apiService.getPetsByTab("found");
        data = (res.results as PetReport[]).map((item) => ({
          ...item.pet,
          status: item.pet_status,
        }));
      } else {
        data = await apiService.getPets();
      }

      setPets(data);
    } catch (err) {
      console.error("Error fetching pets:", err);
    }
  };

  const toggleSelectPet = (id: number) => {
    if (selectedPets.includes(id)) {
      setSelectedPets(selectedPets.filter((pid) => pid !== id));
    } else {
      setSelectedPets([...selectedPets, id]);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;
    try {
      await apiService.deletePet(id);
      setPets((prev) => prev.filter((p) => p.id !== id));
      setSelectedPets((prev) => prev.filter((pid) => pid !== id));
      if (selectedPet?.id === id) setSelectedPet(null);
    } catch (err) {
      console.error("Error deleting pet:", err);
    }
  };

  // Filters + sorting
  const filteredPets = pets
    .filter((pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (pet) =>
        (filters.vaccinated ? pet.is_vaccinated : true) &&
        (filters.diseased ? pet.is_diseased : true) &&
        (filters.gender !== "all" ? pet.gender === filters.gender : true) &&
        (filters.type !== "all"
          ? pet.pet_type === filters.type ||
            (typeof pet.pet_type === "object" &&
              pet.pet_type.type === filters.type)
          : true)
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "age") return (a.age || 0) - (b.age || 0);
      return 0;
    });

  const getPetType = (pet: Pet) => {
    if (typeof pet.pet_type === "string") return pet.pet_type;
    if (pet.pet_type && "type" in pet.pet_type) return pet.pet_type.type;
    return "Unknown";
  };

  const getPetImage = (pet: Pet) => {
    return pet.image
      ? apiService.getImageUrl(pet.image)
      : "https://via.placeholder.com/250?text=No+Image";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Pets Management
          </h1>
          <p className="text-gray-600 mt-1">Manage all pets in the system</p>
        </div>
        <div className="bg-pink-100 text-pink-800 px-4 py-2 rounded-lg font-medium">
          Total Pets: {pets.length}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
        <select
          value={filters.gender}
          onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg"
        >
          <option value="all">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg"
        >
          <option value="all">All Types</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.vaccinated}
            onChange={() =>
              setFilters({ ...filters, vaccinated: !filters.vaccinated })
            }
          />
          <span>Vaccinated</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.diseased}
            onChange={() =>
              setFilters({ ...filters, diseased: !filters.diseased })
            }
          />
          <span>Diseased</span>
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg"
        >
          <option value="name">Sort by Name</option>
          <option value="age">Sort by Age</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-medium ${
              activeTab === tab
                ? "border-b-2 border-pink-500 text-pink-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Pets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {filteredPets.map((pet) => (
          <div
            key={pet.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition"
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={selectedPets.includes(pet.id)}
                onChange={() => toggleSelectPet(pet.id)}
                className="absolute top-2 left-2 z-10 w-5 h-5"
              />
              <img
                src={getPetImage(pet)}
                alt={pet.name}
                className="w-full h-48 object-cover"
                onClick={() => setSelectedPet(pet)}
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{pet.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pet.status === "rescued"
                      ? "bg-green-100 text-green-800"
                      : pet.status === "lost"
                      ? "bg-red-100 text-red-800"
                      : pet.status === "found"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {pet.status?.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                {getPetType(pet)} • {pet.age} yrs • {pet.gender} •{" "}
                {pet.is_vaccinated ? "Vaccinated" : "Not Vaccinated"}
              </p>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(pet.id);
                  }}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setSelectedPet(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
              <img
                src={getPetImage(selectedPet)}
                alt={selectedPet.name}
                className="w-48 h-48 object-cover rounded-lg"
              />
              <div className="flex-1 space-y-3">
                <h2 className="text-2xl font-bold">{selectedPet.name}</h2>
                <p className="text-gray-600">
                  <strong>Breed:</strong> {selectedPet.breed}
                </p>
                <p className="text-gray-600">
                  <strong>Age:</strong> {selectedPet.age} yrs
                </p>
                <p className="text-gray-600">
                  <strong>Gender:</strong> {selectedPet.gender}
                </p>
                <p className="text-gray-600">
                  <strong>Type:</strong> {getPetType(selectedPet)}
                </p>
                <p className="text-gray-600">
                  <strong>Description:</strong> {selectedPet.description}
                </p>
                <p className="text-gray-600">
                  <strong>Location:</strong>{" "}
                  {selectedPet.address}, {selectedPet.city}, {selectedPet.state}
                </p>
                <p className="text-gray-600">
                  <strong>Status:</strong> {selectedPet.status}
                </p>
                <p className="text-gray-600">
                  <strong>Vaccinated:</strong>{" "}
                  {selectedPet.is_vaccinated ? "Yes" : "No"}
                </p>
                <p className="text-gray-600">
                  <strong>Diseased:</strong>{" "}
                  {selectedPet.is_diseased ? "Yes" : "No"}
                </p>
                <p className="text-gray-600">
                  <strong>Added by:</strong>{" "}
                  {selectedPet.created_by?.username || "Unknown"}
                </p>
                <p className="text-gray-600">
                  <strong>Created on:</strong> {selectedPet.created_date}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredPets.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Heart size={48} className="mx-auto mb-4" />
          No pets found for this filter/search.
        </div>
      )}
    </div>
  );
};

export default AdminPets;
