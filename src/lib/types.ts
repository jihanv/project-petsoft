import { Dispatch, SetStateAction } from "react";

export type Pet = {
  id: string;
  name: string;
  ownerName: string;
  imageUrl: string;
  age: number;
  notes: string;
};

export type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleChangeSelectedPetId: (id: string) => void;
};

export type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};
