
import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { addPet, editPet } from "@/actions/actions";
import PetFormBtn from "./pet-form-btn";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

//Validation through Zod
const petFormSchema = z.object({
    name: z.string().trim().min(1, {
        message: "Name is required"
    })
        .max(100, {
            message: "Name should be less than 100 characters"
        }),
    ownerName: z.string().trim().min(1, {
        message: "Owner Name is required"
    })
        .max(100, {
            message: "Owner Name should be less than 100 characters"
        }),
    imageUrl: z.union([z.literal(""), z.string().trim().url({ message: "Image url must be a valid url" })]),
    age: z.coerce.number().int().positive().max(50),
    notes: z.union([z.literal(""), z.string().trim().max(1000)])
})

type TPetFormData = z.infer<typeof petFormSchema>

export type PetFormProps = {
    actionType: "add" | "edit";
    onFormSubmission: () => void;
}

// type TPetFormData = {
//     name: string;
//     ownerName: string;
//     imageUrl: string;
//     age: number;
//     notes: string;
// }


export default function PetForm({ actionType, onFormSubmission }: PetFormProps) {

    const { selectedPet, handleAddPet, handleEditPet } = usePetContext();

    const {
        register,
        trigger,
        formState: {
            errors,
        }
    } = useForm<TPetFormData>({
        //install resolver: pnpm add @hookform/resolvers/3.3.2
        resolver: zodResolver(petFormSchema)
    })
    return (
        <form action={async (formData) => {
            // Validate the form, you must include trigger
            const result = await trigger();
            if (!result) {
                return
            }

            onFormSubmission();
            const petData = {
                name: formData.get("name") as string,
                ownerName: formData.get("ownerName") as string,
                imageUrl:
                    (formData.get("imageUrl") as string) || "/pet-placeholder.png",
                age: parseInt(formData.get("age") as string),
                notes: formData.get("notes") as string,
            }

            if (actionType === "add") {
                await handleAddPet(petData)
            } else if (actionType === "edit") {
                await handleEditPet(selectedPet!.id, petData)
            }

        }} className="flex flex-col">
            <div className="space-y-3">
                <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name")} ></Input>
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input id="ownerName" {...register("ownerName")} ></Input>
                    {errors.ownerName && <p className="text-red-500">{errors.ownerName.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" {...register("imageUrl")} ></Input>
                    {errors.imageUrl && <p className="text-red-500">{errors.imageUrl.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" {...register("age")} ></Input>
                    {errors.age && <p className="text-red-500">{errors.age.message}</p>}

                </div>

                <div className="space-y-1">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" {...register("notes")} />
                    {errors.notes && <p className="text-red-500">{errors.notes.message}</p>}
                </div>
            </div>
            <PetFormBtn actionType={actionType} />

        </form>
    )
}
