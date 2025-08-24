"use client"

import { Pet, PetContextProviderProps, TPetContext } from "@/lib/types";
import { createContext, useState } from "react"

export const PetContext = createContext<TPetContext | null>(null)

export default function PetContextProvider({ children, data }: PetContextProviderProps) {

    //State
    const [pets, setPets] = useState(data)
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null)

    //Derived State
    const selectedPet = pets.find(pet => pet.id === selectedPetId)

    const handleChangeSelectedPetId = (id: string) => {
        setSelectedPetId(id)
    }
    return (
        <PetContext.Provider
            value={{
                pets,
                selectedPetId,
                handleChangeSelectedPetId,
                selectedPet

            }}>
            {children}
        </PetContext.Provider>
    )
}
