"use client";
import { RegisterSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { useCreateAccount } from "../api/use-create-account";
import { logger } from "@/lib/logger";
import { useRouter } from "next/navigation";

const log = logger.child({ module: "RegisterForm" });
export const RegisterForm = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync } = useCreateAccount();

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const result = await mutateAsync(values);
      setSubmitSuccess(true);
      // router.push("/sign-in");
    } catch (error) {
      log.error(error);
      setSubmitError(error as Error);
    }
  };

  if (submitSuccess) {
    return (
      <div className="border-[1px] border-emerald-200 rounded-sm bg-emerald-50 p-2 text-muted-foreground ">
        <h1 className="text-emerald-800 text-center">Account created</h1>
        <p className="text-emerald-500">
          Your account has been created. Please check your email to verify your
          account.
        </p>
      </div>
    );
  }

  return (
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
                <Button
                  variant="link"
                  size="sm"
                  className="px-0 font-normal"
                  asChild
                >
                  <Link href="/auth/reset">Forgot password?</Link>
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {submitError && <FormMessage>{submitError.message}</FormMessage>}

        <Button
          disabled={form.formState.isSubmitting || !form.formState.isValid}
          type="submit"
          className="w-full"
        >
          Create account
        </Button>
      </form>
    </Form>
  );
};
