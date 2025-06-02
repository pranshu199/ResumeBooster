"use server";

import { createClient } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";

export const loginAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();
    const { error } = await auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
export const logOutAction = async () => {
  try {
    const { auth } = await createClient();
    const { error } = await auth.signOut({});
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
export const signUpAction = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const { auth } = await createClient();
    const { data, error } = await auth.signUp({
      email,
      password,
      options: {
        data: { name }, // Supabase user_metadata
      },
    });
    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) {
      throw new Error("Error while signing up");
    }

    // Save user with name in your database
    await prisma.user.create({
      data: {
        id: userId,
        email,
        name, // ✅ add name here
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
