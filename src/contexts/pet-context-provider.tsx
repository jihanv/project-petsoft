"use client";

import { Pet, PetContextProviderProps, TPetContext } from "@/lib/types";
import { createContext, useState } from "react";

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
    children,
    data,
}: PetContextProviderProps) {
    //State
    const [pets, setPets] = useState(data);
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    //Derived State
    const selectedPet = pets.find((pet) => pet.id === selectedPetId);
    const numberOfPets = pets.length;

    //Event handlers

    const handleAddPet = (newPet: Omit<Pet, "id">) => {
        setPets((prev) => [...prev, { ...newPet, id: Date.now().toString() }]);
    };

    const handleChangeSelectedPetId = (id: string) => {
        setSelectedPetId(id);
    };

    const handleCheckoutPet = (id: string) => {
        setPets(pets.filter((pet) => id !== pet.id));
        setSelectedPetId(null);
    };

    return (
        <PetContext.Provider
            value={{
                pets,
                selectedPetId,
                handleChangeSelectedPetId,
                handleCheckoutPet,
                selectedPet,
                numberOfPets,
                handleAddPet,
            }}
        >
            {children}
        </PetContext.Provider>
    );
}
