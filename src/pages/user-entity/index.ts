import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Entity Demo",
  description: "Demonstrates the User entity slice and its presentation-only components.",
};

export { UserEntityPage as default } from "./ui/UserEntityPage";
