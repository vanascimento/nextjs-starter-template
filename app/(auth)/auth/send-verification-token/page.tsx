"use client";
import {
  generateNewVerificationToken,
  verifyTokenForEmail,
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

const VerifyEmailSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
});

export default function VerifyEmailPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof VerifyEmailSchema>>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      email: "",
    },
    reValidateMode: "onBlur",
  });

  const onSubmit = async (values: z.infer<typeof VerifyEmailSchema>) => {
    let toastId = toast.loading("Sending verification token");
    try {
      await generateNewVerificationToken(values.email);
      router.push("/auth");
      toast.success("Verification token was sent, verify your e-mail", {
        id: toastId,
      });
    } catch (error) {
      toast.error((error as Error).message, { id: toastId });
    }
  };

  return (
    <div className="w-full h-full  flex flex-row justify-center items-center">
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Receive a new verification token</CardTitle>
          <CardDescription>
            Receive a new verification token by entering your email below.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full "
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="w-full"
                        placeholder="youremail@email.com"
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
