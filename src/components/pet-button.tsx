import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";

export type PetButtonProps = {
    children?: React.ReactNode;
    actionType: "add" | "edit" | "checkout";
}

export default function PetButton({ actionType, children }: PetButtonProps) {

    if (actionType === "add") {
        return (<Button size="icon">
            <PlusIcon className="h-6 w-6" />
        </Button>)
    }

    if (actionType === "edit") {
        return (
            <Button variant="secondary">
                {children}
            </Button>)
    }

    if (actionType === "checkout") {
        return (
            <Button variant="secondary">
                {children}
            </Button>)
    }

}
