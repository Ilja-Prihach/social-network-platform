import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Feature Demo",
  description: "Demonstrates a feature slice wired to the User entity and stateful controls.",
};

export { UserFeaturePage as default } from "./ui/UserFeaturePage";
