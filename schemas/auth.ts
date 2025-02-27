import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  // name: z.string().min(1, {
  //   message: "Name is required",
  // }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  // name: z.string().min(1, {
  //   message: "Name is required",
  // }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetPasswordSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email",
    }),
    token: z.string().min(6, {
      message: "Minimum 6 characters required",
    }),
    password: z.string().min(6, {
      message: "Minimum 6 characters required",
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum 6 characters required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
