import { signIn } from '../../../../auth.js';

export async function POST() {
  // signIn will throw a redirect, which is expected behavior
  await signIn("google", { redirectTo: "/dashboard" });
}
