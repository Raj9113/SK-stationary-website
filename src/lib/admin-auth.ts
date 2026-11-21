import "server-only";

import { getAuthenticatedUser, normalizeEmail } from "@/lib/auth";

export type AdminAccess =
  | { authorized: true; user: NonNullable<Awaited<ReturnType<typeof getAuthenticatedUser>>> }
  | { authorized: false; reason: "unauthenticated" | "forbidden" };

function getConfiguredAdminEmail() {
  const value = process.env.ADMIN_EMAIL;
  if (!value?.trim()) {
    throw new Error("ADMIN_EMAIL is not configured. Set it in the deployment environment.");
  }
  return normalizeEmail(value);
}

/**
 * Secure, database-backed admin authorization.
 * The administrator is selected only by the server-side ADMIN_EMAIL setting;
 * customer-editable profile fields never grant admin access.
 */
export async function getAdminAccess(): Promise<AdminAccess> {
  const user = await getAuthenticatedUser();

  if (!user || user.emailVerified !== true) {
    return { authorized: false, reason: "unauthenticated" };
  }

  if (normalizeEmail(user.email) !== getConfiguredAdminEmail()) {
    return { authorized: false, reason: "forbidden" };
  }

  return { authorized: true, user };
}
