"use server";

import { signIn } from "../../auth.js";

export async function handleGoogleSignIn() {
  await signIn("google", { redirectTo: "/dashboard" });
}
