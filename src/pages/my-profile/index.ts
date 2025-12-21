import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description: "My profile stub page",
};

export { MyProfilePage as default } from "./ui/MyProfilePage";
