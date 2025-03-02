import EditProfileDialogComponent from "@/features/profile/components/edit-profile-dialog";

export default function GlobalDialogsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <EditProfileDialogComponent />
    </>
  );
}
