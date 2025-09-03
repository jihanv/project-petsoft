import { Dispatch, SetStateAction } from "react";

// export type Pet = {
//   id: string;
//   name: string;
//   ownerName: string;
//   imageUrl: string;
//   age: number;
//   notes: string;
// };
import { Pet } from "@prisma/client";

export type PetEssentials = Omit<Pet, "id" | "updatedAt" | "createdAt">;

export type TPetContext = {
  pets: Pet[];
  selectedPetId: Pet["id"] | null;
  handleChangeSelectedPetId: (id: Pet["id"]) => void;
  handleCheckoutPet: (id: Pet["id"]) => Promise<void>;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleAddPet: (newPet: PetEssentials) => Promise<void>;
  handleEditPet: (id: Pet["id"], newPetData: PetEssentials) => Promise<void>;
};

export type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};

export type PetFormBtnProps = {
  actionType: "add" | "edit";
};
