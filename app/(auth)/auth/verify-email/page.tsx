"use client";
import { ExecuteTokenVerificationFormEmail } from "@/app/actions/register";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const EMAIL_PARAM = "email";
const TOKEN_PARAM = "token";

const VerifyEmailSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  token: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof VerifyEmailSchema>>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      email: params.get(EMAIL_PARAM) || "",
      token: params.get(TOKEN_PARAM) || "",
    },
    reValidateMode: "onBlur",
  });

  const onSubmit = async (values: z.infer<typeof VerifyEmailSchema>) => {
    let toastId = toast.loading("Verifying email");
    try {
      await ExecuteTokenVerificationFormEmail(values.email, values.token);
      router.push("/sign-in");
      toast.success("Email verified", { id: toastId });
    } catch (error) {
      toast.error((error as Error).message, { id: toastId });
    }
  };

  return (
    <div className="w-full h-full  flex flex-row justify-center items-center">
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            Use your code that was sent to you by email or sms
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
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
                className="w-full flex justify-center underline text-sm texmufor`"
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
