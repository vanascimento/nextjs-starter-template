"use server";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import GlobalDialogsProvider from "@/providers/global-dialogs-provider";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <GlobalDialogsProvider>{children}</GlobalDialogsProvider>
    </SessionProvider>
  );
}
