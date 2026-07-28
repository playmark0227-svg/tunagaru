import type { Metadata } from "next";
import { ShopCatalog } from "./shop-catalog";

export const metadata: Metadata = { title: "ショップ" };

export default function UserShopPage() {
  return <ShopCatalog />;
}
