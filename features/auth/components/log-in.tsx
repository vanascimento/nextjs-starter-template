"use client";
import Link from "next/link";
import { z } from "zod";
import { useState } from "react";
import { LoginSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { logger } from "@/lib/logger";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreateNewUserWithEmailVerification } from "@/app/actions/register";
import { useRouter } from "next/navigation";
import { InitiateLoginProcessAction } from "@/app/actions/login";
import { useTranslations } from "next-intl";

const log = logger.child({ module: "RegisterForm" });

export const LogInComponent = () => {
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const router = useRouter();
  const t = useTranslations();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    let toastId = toast.loading("Sign in...");
    setSubmitError(null);
    try {
      await InitiateLoginProcessAction(values.email, values.password);
      toast.success("Succesful log in", { id: toastId });
      router.push(`/main`);
    } catch (error) {
      log.error(error);
      setSubmitError(error as Error);
      toast.error("Error in sign in", { id: toastId });
    }
  };

  return (
    <div className="flex flex-col w-full ">
      <div className="flex flex-col space-y-2 text-center ">
        <h1 className="text-2xl font-semibold tracking-tight ">
          {t("Auth.LoginTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("Auth.LoginDescription")}
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder="********"
                      type="password"
                    />
                  </FormControl>
                  <div className="w-full flex justify-between">
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 font-normal"
                      asChild
                    >
                      <Link href="/auth/forgot-password">
                        {t("Auth.ForgotPassword")}
                      </Link>
                    </Button>

                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 font-normal"
                      asChild
                    >
                      <Link href="/auth/send-verification-token">
                        {t("Auth.ResendVerificationToken")}
                      </Link>
                    </Button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {submitError && (
            <FormMessage className="text-rose-500 font-semibold text-sm">
              {submitError.message}
            </FormMessage>
          )}

          <Button
            disabled={form.formState.isSubmitting || !form.formState.isValid}
            type="submit"
            className="w-full"
          >
            {t("Auth.SignIn")}
          </Button>
        </form>
      </Form>
    </div>
  );
};
