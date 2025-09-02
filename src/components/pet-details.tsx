"use client";

import { usePetContext } from "@/lib/hooks";
import { Pet } from "@/lib/types";
import Image from "next/image";
import PetButton from "./pet-button";
import { deletePet } from "@/actions/actions";
import { useTransition } from "react";

export default function PetDetails() {
    const { selectedPet } = usePetContext();
    return (
        <section className="flex flex-col h-full w-full">
            {!selectedPet ? (
                <EmptyView />
            ) : (
                <>
                    <TopBar pet={selectedPet} />

                    <OtherInfo pet={selectedPet} />

                    <Details pet={selectedPet} />
                </>
            )}
        </section>
    );
}

type Props = {
    pet: Pet;
};

function TopBar({ pet }: Props) {

    const { handleCheckoutPet } = usePetContext();

    const [isPending, startTransition] = useTransition();
    return (
        <div className="flex items-center bg-white px-8 py-5 border-b border-light">
            <Image
                src={pet.imageUrl}
                alt="Pet image"
                width={75}
                height={75}
                className="rounded-full object-cover w-[75px] h-[75px]"
            />
            <h2 className="text-3xl font-semibold leading-7 ml-5">{pet.name}</h2>
            <div className="ml-auto space-x-2">
                <PetButton actionType="edit">Edit</PetButton>
                <PetButton actionType="checkout"
                    disabled={isPending}
                    onClick={async () => {
                        await handleCheckoutPet(pet.id)
                    }}>
                    Checkout
                </PetButton>
            </div>
        </div>
    );
}

function OtherInfo({ pet }: Props) {
    return (
        <div className="flex justify-around py-10 px-5 text-center">
            <div>
                <h3 className="text-[13px] font-medium uppercase text-zinxe-700">
                    Owner Name
                </h3>
                <p className="mt-1 text-lg text-zinc-800">{pet?.ownerName}</p>
            </div>

            <div>
                <h3 className="text-[13px] font-medium uppercase text-zinxe-700">
                    Age
                </h3>
                <p className="mt-1 text-lg text-zinc-800">{pet?.age}</p>
            </div>
        </div>
    );
}

function Details({ pet }: Props) {
    return (
        <section className="bg-white px-7 py-5 rounded-md mb-9 mx-8 flex-1 border border-light">
            {pet?.notes}
        </section>
    );
}

function EmptyView() {
    return (
        <p className="h-full flex justify-center items-center text-2xl font-medium">
            No Pet Selected
        </p>
    );
}
