import { create } from "zustand";

interface ProfileStore {
  modelOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}
const userProfileStore = create<ProfileStore>((set) => ({
  modelOpen: false,
  openModal: () => set({ modelOpen: true }),
  closeModal: () => set({ modelOpen: false }),
}));

export default userProfileStore;
