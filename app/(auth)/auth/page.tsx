import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { RegisterComponent } from "@/features/auth/components/register";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogInComponent } from "@/features/auth/components/log-in";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <Tabs defaultValue="loggin" className="w-[30%]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="loggin">Log in</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="loggin">
        <LogInComponent />
      </TabsContent>
      <TabsContent value="register">
        <RegisterComponent />
      </TabsContent>
    </Tabs>
  );
}
