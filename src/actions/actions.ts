"use server";

import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sleep } from "@/lib/utils";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAuth, findPetById } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
export type AuthState = { message?: string };

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Server Actions for users
export async function logIn(prevStat: unknown, formData: unknown) {
  await sleep();
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            message: "Invalid Credentials",
          };
        }
        default: {
          return {
            message: "Could not sign in.",
          };
        }
      }
    }
    throw error;
  }
  // redirect("/app/dashboard");
}

export async function signUp(prevStat: unknown, formData: unknown) {
  await sleep();
  // Validate form data
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }

  const formDataEntries = Object.fromEntries(formData.entries());
  const validatedFormData = authSchema.safeParse(formDataEntries);

  if (!validatedFormData.success) {
    return;
  }

  const { email, password } = validatedFormData.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma?.user.create({
      data: {
        email: email,
        hashedPassword: hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists.",
        };
      }
    }
    return;
  }

  await signIn("credentials", formData);
}

export async function logOut() {
  await sleep();
  await signOut({
    redirectTo: "/",
  });
}

// Server Actions for Pets
export async function addPet(petData: unknown) {
  await sleep();

  const session = await checkAuth();

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
  const session = await checkAuth();

  //Validata input
  const validatedPet = petFormSchema.safeParse(petData);
  const validateId = petIdSchema.safeParse(petId);

  if (!validateId.success || !validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  // Authorization check
  const pet = await findPetById(validateId.data);
  // const pet = await prisma.pet.findUnique({
  //   where: {
  //     id: validateId.data,
  //   },
  //   select: {
  //     userId: true,
  //   },
  // });

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
  const session = await checkAuth();

  // Validation
  const validateId = petIdSchema.safeParse(petId);

  if (!validateId.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  // Authorization check
  const pet = await findPetById(validateId.data);
  // const pet = await prisma.pet.findUnique({
  //   where: {
  //     id: validateId.data,
  //   },
  //   select: {
  //     userId: true,
  //   },
  // });

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

// Payment actions

export async function createCheckoutSession() {
  // Authentication check
  const session = await checkAuth();

  // Create checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    line_items: [
      {
        price: "price_1S7x0bH4cZ5QmzzehaDsbMW7",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
    cancel_url: `${process.env.CANONICAL_URL}/payment?cancelled=true`,
  });

  // Redirect user
  redirect(checkoutSession.url);
}
