import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getAuthenticatedUser();
  redirect(user ? "/account/profile" : "/account/login");
}
