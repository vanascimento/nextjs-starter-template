"use server";

import { auth } from "@/auth";
import { ChangeProfileSettingsSchemaType } from "../schema/change-profile-settings";
import { db } from "@/lib/prisma";

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
    },
  });
}
