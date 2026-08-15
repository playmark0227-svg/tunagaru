/**
 * ドメイン型定義
 * 本実装では Firestore の各コレクションのドキュメント型に対応する。
 * (docs/architecture.md のデータモデル参照)
 *
 * ▼ 2026-08 打ち合わせでの方針転換
 * 「顧客」と「作業者」は別人ではなく、同一人物が兼ねる。
 * (繋がるクラフトでは顧客がそのままスタッフになるため)
 * そのため両者を Member に統合し、スタッフ権限はフラグで表す。
 */

/**
 * ユーザー種別。
 * member = 顧客。うち isStaff の人は作業者(スタッフ)を兼ねる。
 * endUser = メンバーの先にいる一般客(物販のみ)。
 */
export type Role = "master" | "member" | "endUser";

export const ROLE_LABELS: Record<Role, string> = {
  master: "本部(繋がるクラフト)",
  member: "メンバー(顧客 / スタッフ)",
  endUser: "エンドユーザー(一般のお客様)",
};

/**
 * メンバー = 顧客であり、スタッフ(作業者)を兼ねることもある人。
 * 旧 Client と旧 Worker を統合した型。
 */
export interface Member {
  id: string;
  /** 教室・サロン名 / 屋号 */
  name: string;
  /** 代表者名・本人名 */
  ownerName: string;
  /** 業種カテゴリ */
  category: string;
  status: MemberStatus;
  plan: "ライト" | "スタンダード" | "プレミアム";
  joinedAt: string;
  avatarColor: string;

  /* --- 顧客としての属性 --- */
  /** 紐づくエンドユーザー(生徒)数 */
  studentCount: number;
  siteUrl?: string;

  /* --- スタッフ(作業者)としての属性 --- */
  /**
   * スタッフを兼ねているか。
   * true の人だけが案件募集ページ(マージンが推測できる画面)を見られる。
   */
  isStaff: boolean;
  /** 得意分野 例: ["動画編集", "モーショングラフィックス"] */
  specialties?: string[];
  /** 作業者として完了した案件数 */
  completedCount?: number;
}

/** メンバーの契約ステータス */
export type MemberStatus = "active" | "trial" | "suspended";

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  active: "契約中",
  trial: "トライアル",
  suspended: "休止中",
};

/* 旧 Client / Worker は Member に統合済み (上記参照)。
   互換のための別名を残す。新規コードでは Member を使うこと。 */
export type ClientStatus = MemberStatus;
export const CLIENT_STATUS_LABELS = MEMBER_STATUS_LABELS;

/** エンドユーザー(生徒・一般顧客) */
export interface EndUser {
  id: string;
  name: string;
  /** 所属先のメンバーID (通っている教室) */
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

/**
 * 案件。
 *
 * ▼ 重要 — 金額は必ず2本立てで持つ
 * 顧客への提示額 (clientPrice) と作業者への支払額 (workerPrice) は別物で、
 * 差額が本部のマージンになる。作業者にマージンを知られてはいけないため、
 * 画面へ渡す前に必ず toStaffView() / toClientView() で絞り込むこと。
 * (2026-08 打ち合わせ: 「うちに25,000円入ってるとわかるでしょ」)
 */
export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  /** 顧客への提示額 (税込・円)。作業者には見せない */
  clientPrice: number;
  /** 作業者への支払額 (税込・円)。顧客には見せない */
  workerPrice: number;
  /** 応募締切 */
  deadline: string;
  description: string;
  /** 応募したメンバーID */
  applicantIds: string[];
  /** 採用されたメンバーID */
  assignedMemberId?: string;
  /** 発注元の顧客メンバーID (この案件が誰の依頼から生まれたか) */
  customerId?: string;
  createdAt: string;
  /** 誰が投稿したか。本部以外も案件を出せる */
  postedBy?: "本部" | string;
  /* --- 案件募集フィード (Instagram風) 用のビジュアル要素 --- */
  emoji: string;
  gradient: string;
  likes: number;
  /** 応募した作業者(スタッフ)のメンバーID */
  applicantWorkerIds?: string[];
}

/** 案件の本部マージン (提示額 − 支払額) */
export function projectMargin(p: Project): number {
  return p.clientPrice - p.workerPrice;
}

/** 案件のマージン率 (%) */
export function projectMarginRate(p: Project): number {
  if (!p.clientPrice) return 0;
  return Math.round((projectMargin(p) / p.clientPrice) * 100);
}

/** 作業者に見せてよい範囲だけを抜き出した案件 */
export type StaffProjectView = Omit<Project, "clientPrice"> & {
  /** 作業者にとっての報酬 = workerPrice */
  reward: number;
};

/** 顧客に見せてよい範囲だけを抜き出した案件 */
export type CustomerProjectView = Omit<Project, "workerPrice"> & {
  /** 顧客にとっての費用 = clientPrice */
  price: number;
};

/** 作業者向けに、顧客提示額を落とした形へ変換する */
export function toStaffView(p: Project): StaffProjectView {
  const { clientPrice: _clientPrice, ...rest } = p;
  return { ...rest, reward: p.workerPrice };
}

/** 顧客向けに、作業者支払額を落とした形へ変換する */
export function toCustomerView(p: Project): CustomerProjectView {
  const { workerPrice: _workerPrice, ...rest } = p;
  return { ...rest, price: p.clientPrice };
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
  /** 応募したメンバーID */
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
  /** 担当: "本部" / メンバー名 */
  assignee: string;
  dueDate: string;
  projectId?: string;
  clientId?: string;
  /** 担当スタッフのメンバーID */
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
  /** 経由するメンバー(教室) */
  clientId: string;
  clientName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  orderedAt: string;
}

/**
 * チャットスレッドの種類。
 *
 * ▼ 2026-08 打ち合わせでの方針転換
 * 主役は「案件ごと」ではなく「顧客ごと」のグループチャット。
 * 顧客1人につき1つのグループがあり、そこに本部と担当スタッフが入る。
 * 案件はこのグループの中から生まれる。
 * 金額交渉など人に見せたくない話のために 1対1 の DM も持つ。
 */
export type ThreadKind =
  /** 顧客ごとのグループ (顧客 + 本部 + 担当スタッフ)。これが主役 */
  | "customer"
  /** 1対1のダイレクトメッセージ (単価交渉など) */
  | "dm"
  /** スタッフ間のみのグループ (顧客には不可視) */
  | "staff"
  /** メンバーとその先のエンドユーザー(生徒)とのやりとり */
  | "end_user";

export const THREAD_KIND_LABELS: Record<ThreadKind, string> = {
  customer: "顧客グループ",
  dm: "個別",
  staff: "スタッフ間",
  end_user: "お客様",
};

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
  /** どの顧客メンバーのグループか */
  customerId?: string;
  /** このスレッドで進行中の案件ID (顧客グループから案件が生まれる) */
  projectIds?: string[];
  /**
   * 顧客に見せてよいスレッドか。
   * staff / 一部の dm は false。マージンが露見する会話を隔離する。
   */
  visibleToCustomer: boolean;
}

/**
 * 全体配信タイムラインの投稿。
 * 「札幌でセミナーします、参加者募集」のような本部発信を
 * アプリを開いた最初の画面に流す (2026-08 打ち合わせ)。
 */
export interface TimelinePost {
  id: string;
  /** 投稿者 (通常は本部) */
  author: string;
  kind: "お知らせ" | "イベント" | "募集" | "実績";
  title: string;
  body: string;
  postedAt: string;
  emoji: string;
  gradient: string;
  /** 参加/興味ありの数 */
  reactions: number;
  /** 申込・詳細への導線ラベル */
  ctaLabel?: string;
  /** スタッフだけに見せる投稿か */
  staffOnly?: boolean;
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
