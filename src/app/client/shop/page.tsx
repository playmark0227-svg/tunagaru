import type { Metadata } from "next";
import { WholesaleCatalog } from "./wholesale-catalog";

export const metadata: Metadata = { title: "仕入れ" };

export default function ClientShopPage() {
  return <WholesaleCatalog />;
}
