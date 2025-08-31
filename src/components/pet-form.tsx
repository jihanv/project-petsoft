
import { usePetContext } from "@/lib/hooks";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { addPet } from "@/actions/actions";
import PetFormBtn from "./pet-form-btn";
import { act } from "react";

export type PetFormProps = {
    actionType: "add" | "edit";
    onFormSubmission: () => void;
}

export default function PetForm({ actionType, onFormSubmission }: PetFormProps) {

    const { handleAddPet, selectedPet, handleEditPet } = usePetContext();

    // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    //     event.preventDefault();

    //     const formData = new FormData(event.currentTarget);

    //     //Wrap form data in a javascript object
    //     // const newPet = Object.fromEntries(formData.entries())

    //     const pet = {
    //         name: formData.get("name") as string,
    //         ownerName: formData.get("ownerName") as string,
    //         imageUrl: formData.get("imageUrl") as string || "/pet-placeholder.png",
    //         age: +(formData.get("age") as string),
    //         notes: formData.get("notes") as string,
    //     }

    //     if (actionType === "add") {
    //         handleAddPet(pet);
    //     } else if (actionType === "edit") {
    //         handleEditPet(selectedPet!.id, pet)
    //     }

    //     onFormSubmission();

    // }


    return (
        <form action={async (formData) => {
            addPet(formData)
            onFormSubmission();
        }} className="flex flex-col">
            <div className="space-y-3">
                <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" type="text" required
                        defaultValue={actionType === "edit" ? selectedPet?.name : ""}></Input>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input id="ownerName" name="ownerName" type="text" required
                        defaultValue={actionType === "edit" ? selectedPet?.ownerName : ""}></Input>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" name="imageUrl" type="text"
                        defaultValue={actionType === "edit" ? selectedPet?.imageUrl : ""} ></Input>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" name="age" type="number" required
                        defaultValue={actionType === "edit" ? selectedPet?.age : ""}></Input>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" name="notes" rows={3} required
                        defaultValue={actionType === "edit" ? selectedPet?.notes : ""} />
                </div>
            </div>
            <PetFormBtn actionType={actionType} />

        </form>
    )
}
