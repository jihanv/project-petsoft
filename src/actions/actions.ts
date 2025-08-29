"use server";

import { prisma } from "@/lib/db";
import { Pet } from "@prisma/client";

export async function addPet(pet) {
  await prisma.pet.create({
    data: pet,
  });
}
