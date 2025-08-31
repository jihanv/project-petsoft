import { Button } from './ui/button'
import { useFormStatus } from 'react-dom'

export type PetFormBtnProps = {
    actionType: "add" | "edit";
}

export default function PetFormBtn({ actionType }: PetFormBtnProps) {

    const { pending } = useFormStatus()
    return (
        <Button className="mt-5 self-end" type="submit" disabled={pending}>
            {actionType === "add" ? "Add a new pet" : "Edit pet"}
        </Button>
    )
}
