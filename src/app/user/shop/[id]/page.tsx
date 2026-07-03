import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { Badge, Card, PageHeader, ProductThumb } from "@/components/ui";
import { formatYen } from "@/lib/format";
import { currentClient, products } from "@/lib/mock-data";
import { AddToCartButton } from "./add-to-cart";

export const metadata = { title: "商品詳細" };

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <>
      <PageHeader title="商品詳細" backHref="/user/shop" />
      <main className="pb-32">
        <ProductThumb
          emoji={product.emoji}
          gradient={product.gradient}
          size="lg"
          className="!h-56 !rounded-none text-7xl"
        />

        <div className="space-y-4 px-4 pt-4">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge>{product.category}</Badge>
              {product.isNew && <Badge tone="brand">NEW</Badge>}
              {product.stock > 0 ? (
                <Badge tone="green">在庫あり</Badge>
              ) : (
                <Badge tone="red">在庫切れ</Badge>
              )}
            </div>
            <h1 className="mt-2 text-lg font-bold leading-snug">
              {product.name}
            </h1>
            <p className="mt-1 text-2xl font-bold text-brand">
              {formatYen(product.price)}
              <span className="ml-1 text-xs font-normal text-ink/40">
                (税込)
              </span>
            </p>
          </div>

          <Card className="p-4">
            <p className="text-xs font-bold text-ink/55">商品説明</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              {product.description}
            </p>
          </Card>

          <Card className="flex gap-3 p-4">
            <Icon name="truck" className="h-5 w-5 shrink-0 text-brand" />
            <p className="text-xs leading-relaxed text-ink/55">
              {currentClient.ownerName}先生の教室を通じて本部から発送されます。
              ご注文から3〜5営業日でお届けします。
            </p>
          </Card>
        </div>
      </main>

      <AddToCartButton disabled={product.stock === 0} />
    </>
  );
}
