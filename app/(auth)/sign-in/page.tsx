import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignIn() {
  return (
    <form
      className="w-full h-full  flex flex-col justify-center items-center space-y-2"
      action={async (formData) => {
        "use server";
        await signIn("credentials", formData);
      }}
    >
      <div className="space-y-6  w-[10%]">
        <label className="flex flex-col w-full">
          Email
          <Input name="email" type="email" className="w-full" />
        </label>
        <label className="flex flex-col">
          Password
          <Input name="password" type="password" />
        </label>
        <Button className="w-full">Sign In</Button>
      </div>
    </form>
  );
}
