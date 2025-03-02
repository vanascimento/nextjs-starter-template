"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useProfileStore from "../hooks/use-profile-store";
import { useSession } from "next-auth/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ChangeProfileSettingsSchema,
  ChangeProfileSettingsSchemaType,
} from "../schema/change-profile-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import saveProfileSettings from "../api/get-profile";
import { logger } from "@/lib/logger";

interface EditProfileDialogProps {
  openButtonText?: string;
}

const log = logger.child({ module: "edit-profile-dialog" });
export default function EditProfileDialogComponent({
  openButtonText = "Open",
}: EditProfileDialogProps) {
  const { modelOpen, closeModal } = useProfileStore();
  const session = useSession();
  const form = useForm<ChangeProfileSettingsSchemaType>({
    resolver: zodResolver(ChangeProfileSettingsSchema),
    defaultValues: {
      name: session.data?.user?.name,
      darkMode: session.data?.user?.darkMode,
    },
  });

  const onSubmit = async (data: ChangeProfileSettingsSchemaType) => {
    const toastId = toast.loading("Saving profile settings...");
    try {
      await saveProfileSettings(data);
      toast.success("Profile settings saved", { id: toastId });
    } catch (error) {
      log.error(error, "Failed to save profile settings");
      toast.error("Failed to save profile settings", { id: toastId });
    }
  };

  return (
    <Dialog open={modelOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogTrigger>{openButtonText}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change your profile</DialogTitle>
          <DialogDescription>
            Change your profile settings here. This definition will be saved in
            the database.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="darkMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Dark mode</FormLabel>
                    <FormDescription>
                      Enable dark mode for a better experience.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
            >
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
