"use server";

import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
// import { headers } from "next/headers";

// Server Actions for users
export async function logIn(formData: FormData) {
  await signIn("credentials", formData);
}

export async function signUp(formData: FormData) {
  const hashedPassword = await bcrypt.hash(
    formData.get("password") as string,
    10
  );
  await prisma?.user.create({
    data: {
      email: formData.get("email") as string,
      hashedPassword: hashedPassword,
    },
  });

  await signIn("credentials", formData);
}

export async function logOut() {
  await signOut({
    redirectTo: "/",
  });
}
// Server Actions for Pets
export async function addPet(petData: unknown) {
  await sleep();

  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const validatedPet = petFormSchema.safeParse(petData);
  if (!validatedPet.success) {
    console.log(validatedPet.error);
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        User: {
          connect: {
            id: session.user.id,
          },
        },
      },
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
  await sleep();

  // Authentication
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  //Validata input
  const validatedPet = petFormSchema.safeParse(petData);
  const validateId = petIdSchema.safeParse(petId);

  if (!validateId.success || !validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  // Authorization check
  const pet = await prisma.pet.findUnique({
    where: {
      id: validateId.data,
    },
    select: {
      userId: true,
    },
  });

  if (!pet) {
    return {
      message: "Pet not found.",
    };
  }

  if (session.user.id !== pet.userId) {
    return {
      message: "Not authorized",
    };
  }
  // Database mutation

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

  // Authentication
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Validation
  const validateId = petIdSchema.safeParse(petId);

  if (!validateId.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  // Authorization check
  const pet = await prisma.pet.findUnique({
    where: {
      id: validateId.data,
    },
    select: {
      userId: true,
    },
  });

  if (!pet) {
    return {
      message: "Pet not found.",
    };
  }

  if (session.user.id !== pet.userId) {
    return {
      message: "Not authorized",
    };
  }
  // Database mutation

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
