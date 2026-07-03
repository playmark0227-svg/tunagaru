/**
 * Stripe 決済 (サーバー側雛形)
 *
 * ⚠️ GitHub Pages プレビュー (静的エクスポート) ではサーバー処理が使えないため、
 * このモジュールは画面からは呼ばれない。本実装 (Vercel / Cloud Functions) へ
 * 移行する際に、API Route からこの関数群を呼び出す。
 *
 * 想定エンドポイント:
 * - POST /api/checkout          → createCheckoutSession()
 * - POST /api/webhooks/stripe   → handleWebhookEvent()
 *
 * 手数料メモ: Stripe 国内カード 3.6%。販売価格・卸価格に織り込むこと。
 * クライアントへの売上分配が必要になったら Stripe Connect を検討する。
 */
import Stripe from "stripe";
import type { OrderItem } from "../types";

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!isStripeConfigured()) {
    throw new Error("STRIPE_SECRET_KEY が未設定です (.env.example 参照)");
  }
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }
  return stripe;
}

/**
 * Checkout セッションを作成して決済ページURLを返す。
 * metadata に clientId / endUserId を入れておき、webhook で
 * 「どのクライアント経由の注文か」を復元して自動発注につなげる。
 */
export async function createCheckoutSession(input: {
  items: OrderItem[];
  clientId: string;
  endUserId: string;
  appUrl: string;
}): Promise<{ url: string }> {
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: input.items.map((item) => ({
      price_data: {
        currency: "jpy",
        product_data: { name: item.productName },
        unit_amount: item.unitPrice, // JPY はゼロ小数通貨のためそのまま
      },
      quantity: item.quantity,
    })),
    metadata: {
      clientId: input.clientId,
      endUserId: input.endUserId,
    },
    success_url: `${input.appUrl}/user/orders?checkout=success`,
    cancel_url: `${input.appUrl}/user/cart?checkout=cancel`,
  });

  if (!session.url) throw new Error("Checkout セッションの作成に失敗しました");
  return { url: session.url };
}

/**
 * Webhook 受信処理 (署名検証込み)。
 * checkout.session.completed を受けたら:
 * 1. Firestore に注文ドキュメントを作成 (status: "received")
 * 2. 本部への自動発注 (status: "ordered_to_hq" へ更新 + 本部へ通知)
 * 3. クライアント・エンドユーザー双方へプッシュ通知
 */
export async function handleWebhookEvent(
  rawBody: string,
  signature: string,
): Promise<{ received: true }> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET が未設定です");
  }

  const event = getStripe().webhooks.constructEvent(
    rawBody,
    signature,
    webhookSecret,
  );

  switch (event.type) {
    case "checkout.session.completed": {
      // TODO(本実装): Firestore へ注文作成 → 自動発注 → プッシュ通知
      // const session = event.data.object;
      // await createOrderFromSession(session);
      break;
    }
    default:
      break;
  }

  return { received: true };
}
