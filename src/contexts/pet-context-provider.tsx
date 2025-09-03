"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { PetContextProviderProps, PetEssentials, TPetContext } from "@/lib/types";
import { createContext, startTransition, useOptimistic, useState } from "react";
import { toast } from "sonner";
import { Pet } from "@prisma/client";


export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
    children,
    data,
}: PetContextProviderProps) {
    //State
    // const [pets, setPets] = useState(data);

    const [optimisticPets, setOptimisticPets] = useOptimistic(
        data,
        (state, { action, payload }) => {
            switch (action) {
                case "add":
                    return [...state, { ...payload, id: Math.random().toString() }]
                case "edit":
                    return state.map((pet) => {
                        if (pet.id === payload.id) {
                            return { ...pet, ...payload.newPetData }
                        }
                        return pet;
                    })
                case "delete":
                    return state.filter((pet) => pet.id !== payload)
                default:
                    return state;
            }
        })
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    //Derived State
    const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
    const numberOfPets = optimisticPets.length;

    //Event handlers

    const handleEditPet = async (petId: Pet["id"], newPetData: PetEssentials) => {
        setOptimisticPets({
            action: "edit",
            payload: {
                id: petId,
                newPetData
            },
        })

        const error = await editPet(petId, newPetData)
        if (error) {
            toast.warning(error.message)
            return;
        }

    }

    const handleAddPet = async (newPet: PetEssentials) => {

        //call function that only happens in server triggered from client 
        setOptimisticPets({
            action: "add",
            payload: newPet,
        })
        const error = await addPet(newPet)
        if (error) {
            toast.warning(error.message)
            return;
        }
    };

    const handleChangeSelectedPetId = (id: Pet["id"]) => {
        setSelectedPetId(id);
    };

    const handleCheckoutPet = async (petId: Pet["id"]) => {
        setOptimisticPets({
            action: "delete",
            payload: petId,
        })

        const error = await deletePet(petId)
        if (error) {
            toast.warning(error.message)
            return;
        }
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
