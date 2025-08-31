"use server";

import { prisma } from "@/lib/db";
import { sleep } from "@/lib/utils";
import { Pet } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addPet(formData) {
  await sleep();
  await prisma.pet.create({
    data: {
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      imageUrl: (formData.get("imageUrl") as string) || "/pet-placeholder.png",
      age: parseInt(formData.get("age")),
      notes: formData.get("notes") as string,
    },
  });

  revalidatePath("/app", "layout");
}
