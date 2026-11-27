import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import CheckoutClient, { type CheckoutAddress } from "./CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/account/login");

  const addresses: CheckoutAddress[] = (user.addresses || []).map((address) => ({
    id: String(address._id || ""),
    label: address.label || "Address",
    line1: address.line1 || "",
    line2: address.line2 || "",
    locality: address.locality || "",
    city: address.city || "",
    state: address.state || "",
    postalCode: address.postalCode || "",
    country: address.country || "India",
    isPrimary: address.isPrimary === true,
  }));

  return (
    <CheckoutClient
      customer={{ name: user.name || "", email: user.email || "", mobile: user.mobile || "" }}
      addresses={addresses}
    />
  );
}
