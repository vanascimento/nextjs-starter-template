"use server";

import { auth } from "@/auth";
import { ChangeProfileSettingsSchemaType } from "../schema/change-profile-settings";
import { db } from "@/lib/prisma";
import { LANGUAGE } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Save the profile settings to the database
 */
export default async function saveProfileSettings(
  settingsValues: ChangeProfileSettingsSchemaType
) {
  const session = await auth();
  if (!session) {
    throw new Error("User not authenticated");
  }

  await db.user.update({
    where: {
      email: session.user.email!,
    },
    data: {
      name: settingsValues.name,
      darkMode: settingsValues.darkMode,
      language: settingsValues.language as LANGUAGE,
    },
  });

  revalidatePath("/");
}

export const fetchCurrentUserLanguage = async () => {
  const session = await auth();
  if (!session) {
    return "en";
  }

  const userLanguage = await db.user.findUnique({
    where: {
      email: session.user.email!,
    },
    select: {
      language: true,
    },
  });
  return userLanguage?.language;
};
