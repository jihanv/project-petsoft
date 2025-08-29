"use server";

import { prisma } from "@/lib/db";
import { Pet } from "@prisma/client";

export async function addPet(formData) {
  await prisma.pet.create({
    data: {
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      imageUrl: (formData.get("imageUrl") as string) || "/pet-placeholder.png",
      age: parseInt(formData.get("age")),
      notes: formData.get("notes") as string,
    },
  });
}
