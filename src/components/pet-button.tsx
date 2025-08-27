"use client"

import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import PetForm from "./pet-form";
import { useState } from "react";

export type PetButtonProps = {
    children?: React.ReactNode;
    actionType: "add" | "edit" | "checkout";
    onClick?: () => void;
};

export default function PetButton({
    actionType,
    children,
    onClick,
}: PetButtonProps) {

    const [isFormOpen, setIsFormOpen] = useState(false)

    if (actionType === "checkout") {
        return (
            <Button onClick={onClick} variant="secondary">
                {children}
            </Button>
        );
    }

    return (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                {actionType === "add" ? (
                    <Button size="icon">
                        <PlusIcon className="!h-6 !w-6" />
                    </Button>
                ) : (
                    <Button variant="secondary">{children}</Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{actionType === "add" ? "Add a new pet" : "Edit pet"}</DialogTitle>
                </DialogHeader>
                <PetForm
                    actionType={actionType}
                    onFormSubmission={() => setIsFormOpen(false)} />
            </DialogContent>
        </Dialog>
    );



}
