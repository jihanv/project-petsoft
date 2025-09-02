"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { Pet, PetContextProviderProps, TPetContext } from "@/lib/types";
import { createContext, startTransition, useOptimistic, useState } from "react";
import { toast } from "sonner";

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
    children,
    data,
}: PetContextProviderProps) {
    //State
    // const [pets, setPets] = useState(data);

    const [optimisticPets, setOptimisticPets] = useOptimistic(
        data,
        (state, newPetData) => {
            return [...state, {
                ...newPetData,
                id: Math.random().toString()
            }]
        })
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    //Derived State
    const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
    const numberOfPets = optimisticPets.length;

    //Event handlers

    const handleEditPet = async (petId: string, newPetData: Omit<Pet, "id">) => {

        const error = await editPet(petId, newPetData)
        if (error) {
            toast.warning(error.message)
            return;
        }

    }

    const handleAddPet = async (newPet: Omit<Pet, "id">) => {

        //call function that only happens in server triggered from client 
        setOptimisticPets(newPet)
        const error = await addPet(newPet)
        if (error) {
            toast.warning(error.message)
            return;
        }
    };

    const handleChangeSelectedPetId = (id: string) => {
        setSelectedPetId(id);
    };

    const handleCheckoutPet = async (petId: string) => {

        await deletePet(petId)

        setSelectedPetId(null);
    };

    return (
        <PetContext.Provider
            value={{
                pets: optimisticPets,
                selectedPetId,
                handleChangeSelectedPetId,
                selectedPet,
                numberOfPets,
                handleAddPet,
                handleEditPet,
                handleCheckoutPet
            }}
        >
            {children}
        </PetContext.Provider>
    );
}
