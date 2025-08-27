
import { usePetContext } from "@/lib/hooks";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export type PetFormProps = {
    actionType: "add" | "edit";
    onFormSubmission: () => void;
}

export default function PetForm({ actionType, onFormSubmission }: PetFormProps) {

    const { handleAddPet, numberOfPets } = usePetContext();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        //Wrap form data in a javascript object
        // const newPet = Object.fromEntries(formData.entries())

        const newPet = {
            // id: numberOfPets,
            name: formData.get("name") as string,
            ownerName: formData.get("name") as string,
            imageUrl: formData.get("imageUrl") as string || "/pet-placeholder.png",
            age: +(formData.get("age") as string),
            notes: formData.get("notes") as string,
        }

        handleAddPet(newPet);
        onFormSubmission();



    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="space-y-3">
                <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" type="text" required></Input>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input id="ownerName" name="ownerName" type="text" required></Input>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" name="imageUrl" type="text" ></Input>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" name="age" type="number" required></Input>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" name="notes" rows={3} required />
                </div>
            </div>
            <Button className="mt-5 self-end" type="submit">
                {actionType === "add" ? "Add a new pet" : "Edit pet"}
            </Button>
        </form>
    )
}
