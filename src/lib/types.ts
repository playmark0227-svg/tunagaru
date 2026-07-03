/**
 * ドメイン型定義
 * 本実装では Firestore の各コレクションのドキュメント型に対応する。
 * (docs/architecture.md のデータモデル参照)
 */

/** ユーザー種別 (本部・作業者・クライアントの3階層 + 物販向けエンドユーザー) */
export type Role = "master" | "worker" | "client" | "endUser";

export const ROLE_LABELS: Record<Role, string> = {
  master: "マスター管理者(本部)",
  worker: "作業者(クリエイター)",
  client: "クライアント",
  endUser: "エンドユーザー",
};

/** 作業者 (スタッフ/クリエイター) */
export interface Worker {
  id: string;
  name: string;
  /** 得意分野 例: ["動画編集", "モーショングラフィックス"] */
  specialties: string[];
  /** 完了した案件数 */
  completedCount: number;
  joinedAt: string;
  avatarColor: string;
}

/** クライアント(インストラクター等)のステータス */
export type ClientStatus = "active" | "trial" | "suspended";

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  active: "契約中",
  trial: "トライアル",
  suspended: "休止中",
};

export interface Client {
  id: string;
  /** 教室・サロン名 */
  name: string;
  /** 代表者名 */
  ownerName: string;
  /** 業種カテゴリ */
  category: string;
  status: ClientStatus;
  /** 契約プラン */
  plan: "ライト" | "スタンダード" | "プレミアム";
  /** 紐づくエンドユーザー(生徒)数 */
  studentCount: number;
  joinedAt: string; // 例: "2024-04-01"
  /** 保守管理中のサイトURL等 */
  siteUrl?: string;
  avatarColor: string; // Tailwindのbgクラス 例: "bg-rose-400"
}

/** エンドユーザー(生徒・一般顧客) */
export interface EndUser {
  id: string;
  name: string;
  clientId: string;
  joinedAt: string;
  lastOrderAt?: string;
  totalSpent: number;
  avatarColor: string;
}

/** 案件カテゴリ */
export type ProjectCategory =
  | "HP制作"
  | "動画制作"
  | "キャンペーン"
  | "SNS運用"
  | "EC構築"
  | "デザイン";

export type ProjectStatus = "open" | "in_progress" | "done";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  open: "募集中",
  in_progress: "進行中",
  done: "完了",
};

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  /** 報酬・費用 (円) */
  budget: number;
  /** 応募締切 */
  deadline: string;
  description: string;
  /** 応募したクライアントID */
  applicantIds: string[];
  /** 採用されたクライアントID */
  assignedClientId?: string;
  createdAt: string;
  /* --- 案件募集フィード (Instagram風) 用のビジュアル要素 --- */
  /** カバー用の絵文字 */
  emoji: string;
  /** カバー用のグラデーション 例: "from-sky-100 to-indigo-100" */
  gradient: string;
  /** いいね数 (フィードのソーシャル要素) */
  likes: number;
  /** 作業者(クリエイター)向け募集か (falseならクライアント向け) */
  forWorkers?: boolean;
  /** 応募した作業者ID (作業者向け案件の場合) */
  applicantWorkerIds?: string[];
}

/** 応募ステータス */
export type ApplicationStatus = "applied" | "accepted" | "rejected";

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "応募中",
  accepted: "採用",
  rejected: "見送り",
};

export interface Application {
  id: string;
  projectId: string;
  clientId: string;
  status: ApplicationStatus;
  appliedAt: string;
  note?: string;
}

/** タスク (修正依頼・Zoom予約などの進捗管理) */
export type TaskStatus = "todo" | "in_progress" | "review" | "done";

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "未着手",
  in_progress: "進行中",
  review: "確認待ち",
  done: "完了",
};

/**
 * タスクの発生源。
 * chat = チャットからワンタップでタスク化 / ai = AIが会話から自動抽出 /
 * ec = 外部EC(BASE等)の売上通知から生成 / manual = 手動作成
 */
export type TaskSource = "manual" | "chat" | "ai" | "ec";

export const TASK_SOURCE_LABELS: Record<TaskSource, string> = {
  manual: "手動",
  chat: "チャットから",
  ai: "AI抽出",
  ec: "EC連携",
};

export interface Task {
  id: string;
  title: string;
  kind: "修正依頼" | "Zoom予約" | "素材提出" | "確認" | "発送" | "その他";
  status: TaskStatus;
  /** 担当: "本部" / クライアント名 / 作業者名 */
  assignee: string;
  dueDate: string;
  projectId?: string;
  clientId?: string;
  /** 担当作業者 (クリエイター) */
  workerId?: string;
  /** タスクの発生源 (AI導入・EC連携を見据えたフィールド) */
  source?: TaskSource;
  note?: string;
}

/** 商品 (物販 B2B2C) */
export interface Product {
  id: string;
  name: string;
  category: "スキンケア" | "コスメ" | "クラフト材料";
  /** 一般販売価格 (税込) */
  price: number;
  /** クライアント向け卸価格 (税込) */
  wholesalePrice: number;
  stock: number;
  description: string;
  /** プレースホルダー画像の絵文字とグラデーション */
  emoji: string;
  gradient: string; // 例: "from-rose-100 to-orange-100"
  isNew?: boolean;
}

/**
 * 注文ステータス (B2B2Cパイプライン)
 * エンドユーザー注文 → クライアント経由 → 本部へ自動発注 → 発送
 */
export type OrderStatus = "received" | "ordered_to_hq" | "shipped" | "completed";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  received: "注文受付",
  ordered_to_hq: "本部へ自動発注済",
  shipped: "発送済",
  completed: "完了",
};

/** 注文パイプラインの表示順 */
export const ORDER_PIPELINE: OrderStatus[] = [
  "received",
  "ordered_to_hq",
  "shipped",
  "completed",
];

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  /** 注文者 (エンドユーザー)。クライアント自身の仕入れの場合は undefined */
  endUserId?: string;
  endUserName?: string;
  /** 経由するクライアント */
  clientId: string;
  clientName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  orderedAt: string;
}

/** チャットスレッド */
export type ThreadKind = "hq_client" | "client_user" | "group";

export interface ChatThread {
  id: string;
  kind: ThreadKind;
  /** 表示名 (相手 or グループ名) */
  title: string;
  lastMessage: string;
  lastMessageAt: string; // 例: "10:24" / "昨日" / "3/28"
  unreadCount: number;
  avatarColor: string;
  /** グループの場合の参加者数 */
  memberCount?: number;
  /**
   * 案件グループの場合の案件カテゴリ。
   * 「HP修正」「動画制作」等で会話が混ざらないよう分離するためのキー。
   */
  category?: ProjectCategory;
  /** 紐づく案件ID (案件グループチャットの場合) */
  projectId?: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderName: string;
  /** 現在ログイン中ロールから見て自分の発言か */
  isMe: boolean;
  body: string;
  sentAt: string; // 例: "10:24"
  dateLabel?: string; // 日付区切り 例: "今日" "昨日"
}

/** 本部からの一斉お知らせ */
export interface Announcement {
  id: string;
  title: string;
  body: string;
  target: "全クライアント" | "全エンドユーザー" | string;
  sentAt: string;
  /** プッシュ通知送信済みか */
  pushed: boolean;
}

/** 報酬・支払 */
export type PayoutStatus = "pending" | "invoiced" | "paid";

export const PAYOUT_STATUS_LABELS: Record<PayoutStatus, string> = {
  pending: "金額確定待ち",
  invoiced: "請求済",
  paid: "支払済",
};

export interface Payout {
  id: string;
  projectTitle: string;
  clientName: string;
  amount: number;
  status: PayoutStatus;
  month: string; // 例: "2026-06"
}

/** インストラクター発信のお知らせ (エンドユーザー向けフィード) */
export interface NewsPost {
  id: string;
  clientId: string;
  title: string;
  body: string;
  postedAt: string;
  emoji: string;
}

/**
 * 外部EC (BASE / STORES 等) からの売上通知。
 * webhook で受信し、在庫管理・発送タスクへつなげる (Phase 3)。
 */
export interface EcNotification {
  id: string;
  source: "BASE" | "STORES";
  productName: string;
  quantity: number;
  amount: number;
  receivedAt: string;
  /** 発送タスクを作成済みか */
  taskCreated: boolean;
}

/**
 * AIアシスタントの朝のダイジェスト項目 (Phase 3)。
 * 全チャット・タスクを走査し、未処理事項を毎朝レポートする。
 */
export interface AiDigestItem {
  id: string;
  kind: "未完了タスク" | "返信待ち" | "期限超過" | "タスク候補";
  text: string;
  /** 該当画面へのリンク */
  href?: string;
}

/** 予約枠 (Google Calendar 連携) */
export interface BookingSlot {
  id: string;
  date: string; // "2026-07-06"
  dayLabel: string; // "7/6(月)"
  time: string; // "10:00"
  available: boolean;
}
