"use server";

import { prisma } from "@/lib/db";
import { PetEssentials } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { Pet } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { headers } from "next/headers";

///
export async function addPet(petData: unknown) {
  await sleep();

  const validatedPet = petFormSchema.safeParse(petData);
  if (!validatedPet.success) {
    console.log(validatedPet.error);
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.create({
      data: validatedPet.data,
    });
  } catch (error) {
    console.log(error);
    return {
      message: "Could not add pet.",
    };
  }
  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, petData: unknown) {
  //Validata input
  const validatedPet = petFormSchema.safeParse(petData);
  const validateId = petIdSchema.safeParse(petId);

  if (!validateId.success || !validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  await sleep();
  try {
    await prisma.pet.update({
      where: {
        id: validateId.data,
      },
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: "Could not edit pet.",
    };
  }
  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
  await sleep();

  const validateId = petIdSchema.safeParse(petId);

  if (!validateId.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.delete({
      where: {
        id: validateId.data,
      },
    });
  } catch (error) {
    return {
      message: "Could not edit pet.",
    };
  }
  revalidatePath("/app", "layout");
}
