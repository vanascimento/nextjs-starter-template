"use client";
import { InitiateLoginProcessAction } from "@/app/actions/login";
import {
  ExecuteChangePasswordAction,
  ExecuteTokenVerificationFormEmail,
} from "@/app/actions/register";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ResetPasswordSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const EMAIL_PARAM = "email";
const TOKEN_PARAM = "token";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: params.get(EMAIL_PARAM) || "",
      token: params.get(TOKEN_PARAM) || "",
    },
    reValidateMode: "onBlur",
  });

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    let toastId = toast.loading("Verifying email");
    try {
      await ExecuteChangePasswordAction(
        values.email,
        values.confirmPassword,
        values.token
      );
      toast.success("Password changed with success", { id: toastId });
      await InitiateLoginProcessAction(values.email, values.confirmPassword);
      router.push(`/main`);
    } catch (error) {
      toast.error((error as Error).message, { id: toastId });
    }
  };

  return (
    <div className="w-full h-full  flex flex-row justify-center items-center">
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Change your password to secure your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="youremail@email.com"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Token</FormLabel>
                    <FormControl>
                      <InputOTP
                        {...field}
                        className="w-full"
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Password"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Password"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                className="w-full"
                type="submit"
              >
                Confirm
              </Button>
              <Link
                className="w-full flex justify-center underline text-sm text-muted-foreground"
                href="/auth"
              >
                Log in
              </Link>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
