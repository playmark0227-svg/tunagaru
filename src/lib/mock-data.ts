/**
 * プロトタイプ用モックデータ
 * 本実装ではこのファイルの内容が Firestore から取得されるデータに置き換わる。
 * 画面側は型 (src/lib/types.ts) にのみ依存しているため、差し替えは容易。
 */
import type {
  AiDigestItem,
  Announcement,
  Application,
  BookingSlot,
  ChatMessage,
  ChatThread,
  Client,
  EcNotification,
  EndUser,
  NewsPost,
  Order,
  Payout,
  Product,
  Project,
  Task,
  Worker,
} from "./types";

/* ------------------------------------------------------------------ */
/* クライアント (インストラクター等)                                     */
/* ------------------------------------------------------------------ */
export const clients: Client[] = [
  {
    id: "c1",
    name: "アトリエ彩花",
    ownerName: "佐藤 彩香",
    category: "ポーセラーツ教室",
    status: "active",
    plan: "プレミアム",
    studentCount: 32,
    joinedAt: "2023-04-10",
    siteUrl: "https://atelier-ayaka.example.com",
    avatarColor: "bg-rose-400",
  },
  {
    id: "c2",
    name: "Nail Salon Luce",
    ownerName: "高橋 瑠奈",
    category: "ネイルサロン",
    status: "active",
    plan: "スタンダード",
    studentCount: 24,
    joinedAt: "2023-09-01",
    siteUrl: "https://nail-luce.example.com",
    avatarColor: "bg-violet-400",
  },
  {
    id: "c3",
    name: "ハーバリウム工房 みずいろ",
    ownerName: "雫石 美和",
    category: "ハーバリウム教室",
    status: "trial",
    plan: "ライト",
    studentCount: 18,
    joinedAt: "2026-05-20",
    avatarColor: "bg-sky-400",
  },
  {
    id: "c4",
    name: "Studio Hana Candle",
    ownerName: "花村 ひかり",
    category: "キャンドル教室",
    status: "active",
    plan: "スタンダード",
    studentCount: 41,
    joinedAt: "2024-01-15",
    siteUrl: "https://hana-candle.example.com",
    avatarColor: "bg-amber-400",
  },
  {
    id: "c5",
    name: "コスメサロン Blanche",
    ownerName: "白井 恵美",
    category: "トータルビューティ",
    status: "active",
    plan: "プレミアム",
    studentCount: 56,
    joinedAt: "2022-11-01",
    siteUrl: "https://blanche.example.com",
    avatarColor: "bg-emerald-400",
  },
  {
    id: "c6",
    name: "つまみ細工 ことは",
    ownerName: "琴葉 なつみ",
    category: "つまみ細工教室",
    status: "suspended",
    plan: "ライト",
    studentCount: 9,
    joinedAt: "2024-08-05",
    avatarColor: "bg-stone-400",
  },
];

/** プロトタイプで「ログイン中」とみなすクライアント */
export const currentClient = clients[0]; // アトリエ彩花・佐藤彩香

/* ------------------------------------------------------------------ */
/* エンドユーザー (生徒・一般顧客) — currentClient に紐づく              */
/* ------------------------------------------------------------------ */
export const endUsers: EndUser[] = [
  {
    id: "u1",
    name: "山田 花子",
    clientId: "c1",
    joinedAt: "2024-04-05",
    lastOrderAt: "2026-06-28",
    totalSpent: 42350,
    avatarColor: "bg-pink-400",
  },
  {
    id: "u2",
    name: "鈴木 美咲",
    clientId: "c1",
    joinedAt: "2024-06-12",
    lastOrderAt: "2026-06-15",
    totalSpent: 18700,
    avatarColor: "bg-indigo-400",
  },
  {
    id: "u3",
    name: "田中 優子",
    clientId: "c1",
    joinedAt: "2025-01-20",
    lastOrderAt: "2026-05-30",
    totalSpent: 9900,
    avatarColor: "bg-teal-400",
  },
  {
    id: "u4",
    name: "小林 真央",
    clientId: "c1",
    joinedAt: "2025-03-08",
    totalSpent: 4950,
    avatarColor: "bg-orange-400",
  },
  {
    id: "u5",
    name: "伊藤 さくら",
    clientId: "c1",
    joinedAt: "2026-02-14",
    lastOrderAt: "2026-07-01",
    totalSpent: 27500,
    avatarColor: "bg-lime-400",
  },
];

/** プロトタイプで「ログイン中」とみなすエンドユーザー */
export const currentEndUser = endUsers[0]; // 山田花子

/* ------------------------------------------------------------------ */
/* 案件 (プロジェクト)                                                  */
/* ------------------------------------------------------------------ */
export const projects: Project[] = [
  {
    id: "p1",
    title: "教室紹介ムービー制作キャンペーン",
    category: "動画制作",
    status: "open",
    budget: 55000,
    deadline: "2026-07-20",
    description:
      "教室・サロンの魅力を60秒で伝える紹介ムービーを特別価格で制作します。撮影素材(スマホ動画・写真)をご提供いただくだけでOK。InstagramリールとHP埋め込み用の2サイズを納品します。先着5教室限定。",
    applicantIds: ["c2", "c4"],
    createdAt: "2026-06-25",
    emoji: "🎬",
    gradient: "from-violet-100 to-fuchsia-100",
    likes: 24,
  },
  {
    id: "p2",
    title: "ホームページリニューアル(夏の特別枠)",
    category: "HP制作",
    status: "open",
    budget: 220000,
    deadline: "2026-07-31",
    description:
      "スマホ最適化・予約導線の改善・SEO対策を含むフルリニューアル。現行サイトの内容を活かしつつ、体験レッスンの申込率アップを狙った構成に刷新します。月2教室まで。",
    applicantIds: ["c1"],
    createdAt: "2026-06-20",
    emoji: "🖥️",
    gradient: "from-sky-100 to-indigo-100",
    likes: 18,
  },
  {
    id: "p3",
    title: "秋の体験レッスンLPキャンペーン",
    category: "キャンペーン",
    status: "in_progress",
    budget: 88000,
    deadline: "2026-08-31",
    description:
      "秋の入会シーズンに向けた体験レッスン専用ランディングページの制作と、Instagram広告の出稿サポートのセットプランです。",
    applicantIds: ["c1", "c2", "c5"],
    assignedClientId: "c1",
    createdAt: "2026-06-10",
    emoji: "🍂",
    gradient: "from-amber-100 to-orange-100",
    likes: 31,
  },
  {
    id: "p4",
    title: "Instagramリール運用サポート(3ヶ月)",
    category: "SNS運用",
    status: "open",
    budget: 33000,
    deadline: "2026-07-15",
    description:
      "月4本のリール企画・編集を3ヶ月間サポート。教室の日常や作品紹介を素材に、フォロワー増加と体験申込につなげます。",
    applicantIds: [],
    createdAt: "2026-07-01",
    emoji: "📱",
    gradient: "from-pink-100 to-rose-100",
    likes: 12,
  },
  {
    id: "p5",
    title: "オンラインショップ(EC)構築サポート",
    category: "EC構築",
    status: "done",
    budget: 165000,
    deadline: "2026-05-31",
    description:
      "作品・キット販売用のオンラインショップを構築。決済・配送設定までフルサポートしました。",
    applicantIds: ["c5"],
    assignedClientId: "c5",
    createdAt: "2026-04-01",
    emoji: "🛒",
    gradient: "from-emerald-100 to-teal-100",
    likes: 9,
  },
  {
    id: "p6",
    title: "年間キャンペーンDMデザイン一式",
    category: "デザイン",
    status: "done",
    budget: 44000,
    deadline: "2026-03-31",
    description:
      "季節ごとのキャンペーンDM(4種)のデザインと印刷手配を行いました。",
    applicantIds: ["c4"],
    assignedClientId: "c4",
    createdAt: "2026-02-15",
    emoji: "💌",
    gradient: "from-stone-100 to-amber-50",
    likes: 7,
  },
  /* --- 作業者(クリエイター)向け募集 — 案件フィードに表示 --- */
  {
    id: "p7",
    title: "【モニター募集】教室紹介ムービーの編集スタッフ",
    category: "動画制作",
    status: "open",
    budget: 30000,
    deadline: "2026-07-12",
    description:
      "教室紹介ムービー(60秒×2本)の編集を担当いただけるクリエイターを募集します。素材と構成案は本部から支給。CapCut / Premiere いずれでもOK。初回はモニター価格ですが、継続案件につながります🎬",
    applicantIds: [],
    applicantWorkerIds: ["w2"],
    createdAt: "2026-07-02",
    emoji: "🎬",
    gradient: "from-violet-100 to-purple-100",
    likes: 42,
    forWorkers: true,
  },
  {
    id: "p8",
    title: "秋キャンペーンLPのコーディング担当募集",
    category: "HP制作",
    status: "open",
    budget: 45000,
    deadline: "2026-07-10",
    description:
      "デザインカンプ(Figma)からのコーディング1本。レスポンシブ対応必須、アニメーションは軽めです。納期は着手から10日間。Next.js経験者歓迎🖥️",
    applicantIds: [],
    applicantWorkerIds: ["w1", "w3"],
    createdAt: "2026-06-30",
    emoji: "⌨️",
    gradient: "from-sky-100 to-cyan-100",
    likes: 27,
    forWorkers: true,
  },
  {
    id: "p9",
    title: "教室向けパンフレットのデザイナー募集",
    category: "デザイン",
    status: "open",
    budget: 38000,
    deadline: "2026-07-25",
    description:
      "A4三つ折りパンフレット(表裏)のデザイン。教室の世界観に合わせた温かみのあるトーンが得意な方。写真素材・原稿は支給します📐",
    applicantIds: [],
    applicantWorkerIds: [],
    createdAt: "2026-07-03",
    emoji: "📐",
    gradient: "from-rose-100 to-orange-100",
    likes: 15,
    forWorkers: true,
  },
];

/* ------------------------------------------------------------------ */
/* 作業者 (スタッフ/クリエイター)                                        */
/* ------------------------------------------------------------------ */
export const workers: Worker[] = [
  {
    id: "w1",
    name: "田村 健太",
    specialties: ["動画編集", "モーショングラフィックス"],
    completedCount: 12,
    joinedAt: "2025-04-01",
    avatarColor: "bg-violet-500",
  },
  {
    id: "w2",
    name: "森本 さやか",
    specialties: ["Webデザイン", "コーディング"],
    completedCount: 8,
    joinedAt: "2025-08-15",
    avatarColor: "bg-cyan-500",
  },
  {
    id: "w3",
    name: "青木 蓮",
    specialties: ["グラフィックデザイン", "DTP"],
    completedCount: 21,
    joinedAt: "2024-11-20",
    avatarColor: "bg-teal-500",
  },
];

/** プロトタイプで「ログイン中」とみなす作業者 */
export const currentWorker = workers[0]; // 田村健太

/** 作業者 (田村) の担当タスク — 案件ごとに整理して表示する */
export const workerTasks: Task[] = [
  {
    id: "wt1",
    title: "Luce様 紹介ムービーの粗編集 (60秒版)",
    kind: "その他",
    status: "in_progress",
    assignee: "田村 健太",
    dueDate: "2026-07-07",
    projectId: "p1",
    workerId: "w1",
    source: "manual",
    note: "素材は共有ドライブの「luce_raw」フォルダ。テロップは仮でOK。",
  },
  {
    id: "wt2",
    title: "BGM候補を3曲ピックアップして本部へ共有",
    kind: "確認",
    status: "todo",
    assignee: "田村 健太",
    dueDate: "2026-07-05",
    projectId: "p1",
    workerId: "w1",
    source: "chat",
    note: "チャットの依頼からタスク化されました。",
  },
  {
    id: "wt3",
    title: "リールサイズ (9:16) への書き出し設定確認",
    kind: "確認",
    status: "todo",
    assignee: "田村 健太",
    dueDate: "2026-07-09",
    projectId: "p1",
    workerId: "w1",
    source: "ai",
    note: "AIが会話から抽出したタスク候補です (Phase 3 デモ)。",
  },
  {
    id: "wt4",
    title: "LPヒーロー動画の圧縮・書き出し",
    kind: "素材提出",
    status: "review",
    assignee: "田村 健太",
    dueDate: "2026-07-04",
    projectId: "p3",
    workerId: "w1",
    source: "manual",
    note: "本部にて確認中です。",
  },
  {
    id: "wt5",
    title: "修正版ムービーの最終納品",
    kind: "素材提出",
    status: "done",
    assignee: "田村 健太",
    dueDate: "2026-06-28",
    projectId: "p3",
    workerId: "w1",
    source: "manual",
  },
];

export const applications: Application[] = [
  {
    id: "ap1",
    projectId: "p2",
    clientId: "c1",
    status: "applied",
    appliedAt: "2026-06-27",
    note: "予約フォームの改善を特に相談したいです。",
  },
  {
    id: "ap2",
    projectId: "p3",
    clientId: "c1",
    status: "accepted",
    appliedAt: "2026-06-12",
  },
  {
    id: "ap3",
    projectId: "p1",
    clientId: "c2",
    status: "applied",
    appliedAt: "2026-06-26",
  },
  {
    id: "ap4",
    projectId: "p1",
    clientId: "c4",
    status: "applied",
    appliedAt: "2026-06-28",
  },
];

/* ------------------------------------------------------------------ */
/* タスク (修正依頼・Zoom予約など)                                       */
/* ------------------------------------------------------------------ */
export const tasks: Task[] = [
  {
    id: "t1",
    title: "トップページのキャッチコピー修正",
    kind: "修正依頼",
    status: "in_progress",
    assignee: "本部",
    dueDate: "2026-07-04",
    projectId: "p3",
    clientId: "c1",
    note: "「秋の体験会」の文言に差し替え。画像は現行のまま。",
  },
  {
    id: "t2",
    title: "LP構成案のすり合わせ (Zoom)",
    kind: "Zoom予約",
    status: "todo",
    assignee: "アトリエ彩花",
    dueDate: "2026-07-08",
    projectId: "p3",
    clientId: "c1",
    note: "予約ページから空き枠を選択してください。",
  },
  {
    id: "t3",
    title: "レッスン風景の写真素材アップロード",
    kind: "素材提出",
    status: "review",
    assignee: "アトリエ彩花",
    dueDate: "2026-07-05",
    projectId: "p3",
    clientId: "c1",
    note: "10枚提出済み。本部にて選定中です。",
  },
  {
    id: "t4",
    title: "プロフィール原稿の提出",
    kind: "素材提出",
    status: "done",
    assignee: "アトリエ彩花",
    dueDate: "2026-06-30",
    projectId: "p3",
    clientId: "c1",
  },
  {
    id: "t5",
    title: "キャンペーンバナーの最終確認",
    kind: "確認",
    status: "todo",
    assignee: "アトリエ彩花",
    dueDate: "2026-07-06",
    projectId: "p3",
    clientId: "c1",
    note: "チャットに送付済みのデザイン案をご確認ください。",
  },
  {
    id: "t6",
    title: "Nail Salon Luce 様 動画素材の受領確認",
    kind: "確認",
    status: "in_progress",
    assignee: "本部",
    dueDate: "2026-07-07",
    projectId: "p1",
    clientId: "c2",
  },
];

/* ------------------------------------------------------------------ */
/* 商品 (物販 B2B2C)                                                    */
/* ------------------------------------------------------------------ */
export const products: Product[] = [
  {
    id: "pr1",
    name: "モイストリペアセラム 30mL",
    category: "スキンケア",
    price: 4950,
    wholesalePrice: 3465,
    stock: 120,
    description:
      "セラミドとヒアルロン酸を高配合した保湿美容液。乾燥による小じわを目立たなくし、ハリのある肌へ導きます。サロン専売品。",
    emoji: "💧",
    gradient: "from-sky-100 to-indigo-100",
    isNew: true,
  },
  {
    id: "pr2",
    name: "シルクハンドクリーム 50g",
    category: "スキンケア",
    price: 1980,
    wholesalePrice: 1386,
    stock: 230,
    description:
      "シルクプロテイン配合。ベタつかず、手仕事の前後にも使いやすいさらさらタイプのハンドクリームです。",
    emoji: "🤲",
    gradient: "from-rose-100 to-pink-100",
  },
  {
    id: "pr3",
    name: "ボタニカルリップバーム",
    category: "コスメ",
    price: 1650,
    wholesalePrice: 1155,
    stock: 85,
    description:
      "植物由来オイル100%のリップバーム。ほんのり色づくピンクベージュで、レッスン中も自然な血色感をキープ。",
    emoji: "💄",
    gradient: "from-orange-100 to-amber-100",
  },
  {
    id: "pr4",
    name: "UVプロテクトミルク SPF50+",
    category: "スキンケア",
    price: 2750,
    wholesalePrice: 1925,
    stock: 64,
    description:
      "白浮きしない軽いつけ心地の日焼け止めミルク。石けんでオフでき、敏感肌の方にもおすすめです。",
    emoji: "☀️",
    gradient: "from-yellow-100 to-orange-100",
    isNew: true,
  },
  {
    id: "pr5",
    name: "ポーセラーツ転写紙 花柄セット",
    category: "クラフト材料",
    price: 3300,
    wholesalePrice: 2310,
    stock: 42,
    description:
      "人気の花柄転写紙6種セット。レッスン課題にも販売キットにも使いやすい定番デザインです。",
    emoji: "🌸",
    gradient: "from-pink-100 to-rose-100",
  },
  {
    id: "pr6",
    name: "ハーバリウムオイル 1L (高純度)",
    category: "クラフト材料",
    price: 2420,
    wholesalePrice: 1694,
    stock: 58,
    description:
      "透明度が高く花材の色移りが少ないミネラルオイル。引火点262℃で安心してレッスンに使えます。",
    emoji: "🌿",
    gradient: "from-emerald-100 to-teal-100",
  },
];

/* ------------------------------------------------------------------ */
/* 注文 (B2B2C: エンドユーザー → クライアント経由 → 本部へ自動発注)       */
/* ------------------------------------------------------------------ */
export const orders: Order[] = [
  {
    id: "o1001",
    endUserId: "u1",
    endUserName: "山田 花子",
    clientId: "c1",
    clientName: "アトリエ彩花",
    items: [
      { productId: "pr1", productName: "モイストリペアセラム 30mL", quantity: 1, unitPrice: 4950 },
      { productId: "pr3", productName: "ボタニカルリップバーム", quantity: 2, unitPrice: 1650 },
    ],
    total: 8250,
    status: "ordered_to_hq",
    orderedAt: "2026-07-01",
  },
  {
    id: "o1002",
    endUserId: "u5",
    endUserName: "伊藤 さくら",
    clientId: "c1",
    clientName: "アトリエ彩花",
    items: [
      { productId: "pr4", productName: "UVプロテクトミルク SPF50+", quantity: 1, unitPrice: 2750 },
    ],
    total: 2750,
    status: "received",
    orderedAt: "2026-07-02",
  },
  {
    id: "o1003",
    endUserId: "u2",
    endUserName: "鈴木 美咲",
    clientId: "c1",
    clientName: "アトリエ彩花",
    items: [
      { productId: "pr2", productName: "シルクハンドクリーム 50g", quantity: 3, unitPrice: 1980 },
    ],
    total: 5940,
    status: "shipped",
    orderedAt: "2026-06-28",
  },
  {
    id: "o1004",
    clientId: "c1",
    clientName: "アトリエ彩花",
    items: [
      { productId: "pr5", productName: "ポーセラーツ転写紙 花柄セット", quantity: 10, unitPrice: 2310 },
    ],
    total: 23100,
    status: "completed",
    orderedAt: "2026-06-20",
  },
  {
    id: "o1005",
    endUserId: "u9",
    endUserName: "森 千夏",
    clientId: "c5",
    clientName: "コスメサロン Blanche",
    items: [
      { productId: "pr1", productName: "モイストリペアセラム 30mL", quantity: 2, unitPrice: 4950 },
      { productId: "pr2", productName: "シルクハンドクリーム 50g", quantity: 1, unitPrice: 1980 },
    ],
    total: 11880,
    status: "received",
    orderedAt: "2026-07-02",
  },
];

/* ------------------------------------------------------------------ */
/* チャット                                                             */
/* ------------------------------------------------------------------ */

/** 本部から見たスレッド一覧 (対クライアント) */
export const hqThreads: ChatThread[] = [
  {
    id: "th1",
    kind: "hq_client",
    title: "アトリエ彩花 (佐藤様)",
    lastMessage: "バナー案ありがとうございます!Bパターンでお願いします🙏",
    lastMessageAt: "10:24",
    unreadCount: 2,
    avatarColor: "bg-rose-400",
  },
  {
    id: "th2",
    kind: "hq_client",
    title: "Nail Salon Luce (高橋様)",
    lastMessage: "動画素材、共有ドライブにアップしました!",
    lastMessageAt: "9:02",
    unreadCount: 1,
    avatarColor: "bg-violet-400",
  },
  {
    id: "th3",
    kind: "hq_client",
    title: "Studio Hana Candle (花村様)",
    lastMessage: "承知しました。来週の打ち合わせよろしくお願いします。",
    lastMessageAt: "昨日",
    unreadCount: 0,
    avatarColor: "bg-amber-400",
  },
  {
    id: "th6",
    kind: "group",
    title: "秋の体験レッスンLP 進行グループ",
    lastMessage: "本部: スケジュール表を更新しました。ご確認ください。",
    lastMessageAt: "昨日",
    unreadCount: 0,
    avatarColor: "bg-amber-400",
    memberCount: 5,
    category: "キャンペーン",
    projectId: "p3",
  },
  {
    id: "th10",
    kind: "group",
    title: "教室紹介ムービー 制作グループ",
    lastMessage: "田村: BGM候補、明日までに共有します!",
    lastMessageAt: "11:02",
    unreadCount: 1,
    avatarColor: "bg-violet-400",
    memberCount: 4,
    category: "動画制作",
    projectId: "p1",
  },
  {
    id: "th7",
    kind: "hq_client",
    title: "ハーバリウム工房 みずいろ (雫石様)",
    lastMessage: "トライアルの使い方について質問があります。",
    lastMessageAt: "6/30",
    unreadCount: 0,
    avatarColor: "bg-sky-400",
  },
];

/** クライアント(アトリエ彩花)から見たスレッド一覧 */
export const clientThreads: ChatThread[] = [
  {
    id: "th1",
    kind: "hq_client",
    title: "繋がるクラフト 本部",
    lastMessage: "バナーのBパターン、承知しました!本日中に反映します。",
    lastMessageAt: "10:31",
    unreadCount: 1,
    avatarColor: "bg-brand",
  },
  {
    id: "th4",
    kind: "client_user",
    title: "山田 花子さん",
    lastMessage: "美容液、届くのが楽しみです♪",
    lastMessageAt: "9:45",
    unreadCount: 1,
    avatarColor: "bg-pink-400",
  },
  {
    id: "th5",
    kind: "client_user",
    title: "鈴木 美咲さん",
    lastMessage: "次回のレッスン、振替は可能でしょうか?",
    lastMessageAt: "昨日",
    unreadCount: 2,
    avatarColor: "bg-indigo-400",
  },
  {
    id: "th6",
    kind: "group",
    title: "秋の体験レッスンLP 進行グループ",
    lastMessage: "本部: スケジュール表を更新しました。ご確認ください。",
    lastMessageAt: "昨日",
    unreadCount: 0,
    avatarColor: "bg-amber-400",
    memberCount: 5,
    category: "キャンペーン",
    projectId: "p3",
  },
  {
    id: "th8",
    kind: "group",
    title: "アトリエ彩花 生徒のみなさま",
    lastMessage: "あなた: 7月のレッスンスケジュールを公開しました🌻",
    lastMessageAt: "7/1",
    unreadCount: 0,
    avatarColor: "bg-rose-400",
    memberCount: 33,
  },
];

/** 作業者(田村)から見たスレッド一覧 */
export const workerThreads: ChatThread[] = [
  {
    id: "wth1",
    kind: "hq_client",
    title: "繋がるクラフト 本部",
    lastMessage: "粗編集の進捗いかがでしょうか?急ぎではないです🙏",
    lastMessageAt: "10:48",
    unreadCount: 1,
    avatarColor: "bg-brand",
  },
  {
    id: "th10",
    kind: "group",
    title: "教室紹介ムービー 制作グループ",
    lastMessage: "あなた: BGM候補、明日までに共有します!",
    lastMessageAt: "11:02",
    unreadCount: 0,
    avatarColor: "bg-violet-400",
    memberCount: 4,
    category: "動画制作",
    projectId: "p1",
  },
  {
    id: "th6",
    kind: "group",
    title: "秋の体験レッスンLP 進行グループ",
    lastMessage: "本部: スケジュール表を更新しました。ご確認ください。",
    lastMessageAt: "昨日",
    unreadCount: 0,
    avatarColor: "bg-amber-400",
    memberCount: 5,
    category: "キャンペーン",
    projectId: "p3",
  },
];

/** エンドユーザー(山田花子)から見たスレッド一覧 */
export const endUserThreads: ChatThread[] = [
  {
    id: "th4",
    kind: "client_user",
    title: "アトリエ彩花 佐藤先生",
    lastMessage: "ご注文ありがとうございます!発送までしばらくお待ちください。",
    lastMessageAt: "9:40",
    unreadCount: 1,
    avatarColor: "bg-rose-400",
  },
  {
    id: "th8",
    kind: "group",
    title: "アトリエ彩花 生徒のみなさま",
    lastMessage: "佐藤先生: 7月のレッスンスケジュールを公開しました🌻",
    lastMessageAt: "7/1",
    unreadCount: 0,
    avatarColor: "bg-rose-400",
    memberCount: 33,
  },
];

/** スレッドごとのメッセージ (キー: threadId) */
export const messagesByThread: Record<string, ChatMessage[]> = {
  // 本部 ⇄ アトリエ彩花
  th1: [
    {
      id: "m1",
      threadId: "th1",
      senderName: "繋がるクラフト 本部",
      isMe: false,
      body: "佐藤様、秋キャンペーンLPのバナー案が2パターン完成しました。添付をご確認ください🎨",
      sentAt: "9:58",
      dateLabel: "今日",
    },
    {
      id: "m2",
      threadId: "th1",
      senderName: "繋がるクラフト 本部",
      isMe: false,
      body: "Aパターン: 作品写真メイン / Bパターン: レッスン風景メイン です。お好みの方向性をお知らせください。",
      sentAt: "9:59",
    },
    {
      id: "m3",
      threadId: "th1",
      senderName: "佐藤 彩香",
      isMe: true,
      body: "バナー案ありがとうございます!Bパターンでお願いします🙏",
      sentAt: "10:24",
    },
    {
      id: "m4",
      threadId: "th1",
      senderName: "繋がるクラフト 本部",
      isMe: false,
      body: "バナーのBパターン、承知しました!本日中に反映します。あわせて、来週のZoom打ち合わせの候補日を予約ページからお選びいただけますか?",
      sentAt: "10:31",
    },
  ],
  // クライアント ⇄ 生徒 山田花子
  th4: [
    {
      id: "m5",
      threadId: "th4",
      senderName: "山田 花子",
      isMe: false,
      body: "先生、こんにちは!アプリから美容液を注文しました✨",
      sentAt: "9:32",
      dateLabel: "今日",
    },
    {
      id: "m6",
      threadId: "th4",
      senderName: "佐藤 彩香",
      isMe: true,
      body: "ご注文ありがとうございます!発送までしばらくお待ちください。",
      sentAt: "9:40",
    },
    {
      id: "m7",
      threadId: "th4",
      senderName: "山田 花子",
      isMe: false,
      body: "美容液、届くのが楽しみです♪",
      sentAt: "9:45",
    },
  ],
  // クライアント ⇄ 生徒 鈴木美咲
  th5: [
    {
      id: "m8",
      threadId: "th5",
      senderName: "鈴木 美咲",
      isMe: false,
      body: "先生、来週火曜のレッスンですが、仕事の都合で伺えなくなってしまいました💦",
      sentAt: "18:20",
      dateLabel: "昨日",
    },
    {
      id: "m9",
      threadId: "th5",
      senderName: "鈴木 美咲",
      isMe: false,
      body: "次回のレッスン、振替は可能でしょうか?",
      sentAt: "18:21",
    },
  ],
  // グループ: 秋キャンペーン
  th6: [
    {
      id: "m10",
      threadId: "th6",
      senderName: "繋がるクラフト 本部",
      isMe: false,
      body: "参加教室のみなさま、秋キャンペーンの全体スケジュール表を更新しました。ご確認ください。",
      sentAt: "15:02",
      dateLabel: "昨日",
    },
    {
      id: "m11",
      threadId: "th6",
      senderName: "花村 ひかり",
      isMe: false,
      body: "確認しました!撮影日程も問題ありません😊",
      sentAt: "16:44",
    },
  ],
  // 本部 ⇄ Nail Salon Luce
  th2: [
    {
      id: "m12",
      threadId: "th2",
      senderName: "高橋 瑠奈",
      isMe: false,
      body: "紹介ムービー用の動画素材、共有ドライブにアップしました!",
      sentAt: "9:02",
      dateLabel: "今日",
    },
  ],
  // 本部 ⇄ 作業者 田村 (isMe は田村視点)
  wth1: [
    {
      id: "m13",
      threadId: "wth1",
      senderName: "繋がるクラフト 本部",
      isMe: false,
      body: "田村さん、Luce様の紹介ムービーの件です。素材一式を共有ドライブに置きました。まずは60秒版の粗編集からお願いします🎬",
      sentAt: "9:15",
      dateLabel: "今日",
    },
    {
      id: "m14",
      threadId: "wth1",
      senderName: "田村 健太",
      isMe: true,
      body: "確認しました!今日から着手します。BGMの方向性だけ先にすり合わせたいです。",
      sentAt: "9:40",
    },
    {
      id: "m15",
      threadId: "wth1",
      senderName: "繋がるクラフト 本部",
      isMe: false,
      body: "ありがとうございます。候補を3曲ほどピックアップして共有いただけますか?→ このメッセージは右のボタンからそのままタスク化できます📋",
      sentAt: "9:42",
    },
    {
      id: "m16",
      threadId: "wth1",
      senderName: "繋がるクラフト 本部",
      isMe: false,
      body: "粗編集の進捗いかがでしょうか?急ぎではないです🙏",
      sentAt: "10:48",
    },
  ],
  // 案件グループ: 教室紹介ムービー (本部 + 作業者 + クライアント)
  th10: [
    {
      id: "m17",
      threadId: "th10",
      senderName: "繋がるクラフト 本部",
      isMe: false,
      body: "このグループは【動画制作】教室紹介ムービー案件の専用スレッドです。関連のやり取りはこちらに集約してください。",
      sentAt: "9:00",
      dateLabel: "今日",
    },
    {
      id: "m18",
      threadId: "th10",
      senderName: "高橋 瑠奈",
      isMe: false,
      body: "楽しみにしています!ロゴデータもアップしておきました✨",
      sentAt: "10:20",
    },
    {
      id: "m19",
      threadId: "th10",
      senderName: "田村 健太",
      isMe: false,
      body: "BGM候補、明日までに共有します!",
      sentAt: "11:02",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* お知らせ (本部 → 一斉通知)                                            */
/* ------------------------------------------------------------------ */
export const announcements: Announcement[] = [
  {
    id: "a1",
    title: "【新着案件】Instagramリール運用サポート 募集開始",
    body: "月4本のリール制作を3ヶ月間サポートする新プランの募集を開始しました。案件ページからご応募ください。",
    target: "全クライアント",
    sentAt: "2026-07-01 10:00",
    pushed: true,
  },
  {
    id: "a2",
    title: "新商品「モイストリペアセラム」入荷のお知らせ",
    body: "サロン専売の保湿美容液が入荷しました。卸価格は商品カタログをご確認ください。生徒様への告知用画像もご用意しています。",
    target: "全クライアント",
    sentAt: "2026-06-28 14:30",
    pushed: true,
  },
  {
    id: "a3",
    title: "システムメンテナンスのお知らせ (7/10 深夜)",
    body: "7月10日(金) 2:00〜5:00 の間、メンテナンスのためアプリがご利用いただけません。ご了承ください。",
    target: "全クライアント",
    sentAt: "2026-06-25 18:00",
    pushed: false,
  },
];

/* ------------------------------------------------------------------ */
/* 報酬・支払                                                           */
/* ------------------------------------------------------------------ */
export const payouts: Payout[] = [
  {
    id: "py1",
    projectTitle: "秋の体験レッスンLPキャンペーン",
    clientName: "アトリエ彩花",
    amount: 88000,
    status: "invoiced",
    month: "2026-07",
  },
  {
    id: "py2",
    projectTitle: "オンラインショップ(EC)構築サポート",
    clientName: "コスメサロン Blanche",
    amount: 165000,
    status: "paid",
    month: "2026-06",
  },
  {
    id: "py3",
    projectTitle: "年間キャンペーンDMデザイン一式",
    clientName: "Studio Hana Candle",
    amount: 44000,
    status: "paid",
    month: "2026-04",
  },
  {
    id: "py4",
    projectTitle: "教室紹介ムービー制作キャンペーン",
    clientName: "Nail Salon Luce",
    amount: 55000,
    status: "pending",
    month: "2026-07",
  },
];

/* ------------------------------------------------------------------ */
/* インストラクター発信のお知らせ (エンドユーザー向け)                    */
/* ------------------------------------------------------------------ */
export const newsPosts: NewsPost[] = [
  {
    id: "n1",
    clientId: "c1",
    title: "7月のレッスンスケジュールを公開しました",
    body: "7月は「夏の食卓を彩るプレート」がテーマです。体験レッスンの受付も開始しています。ご予約はメッセージからどうぞ🌻",
    postedAt: "2026-07-01",
    emoji: "🗓️",
  },
  {
    id: "n2",
    clientId: "c1",
    title: "新商品のご案内:モイストリペアセラム",
    body: "教室でもご紹介した保湿美容液がアプリから購入できるようになりました。数量限定のため、お早めにどうぞ✨",
    postedAt: "2026-06-29",
    emoji: "💧",
  },
  {
    id: "n3",
    clientId: "c1",
    title: "生徒作品展を開催します!",
    body: "8月22日(土)〜23日(日)、市民ギャラリーにて生徒のみなさまの作品展を開催します。出展のご希望はメッセージでお知らせください。",
    postedAt: "2026-06-24",
    emoji: "🎨",
  },
];

/* ------------------------------------------------------------------ */
/* 予約枠 (Google Calendar 連携のモック)                                */
/* ------------------------------------------------------------------ */
export const bookingSlots: BookingSlot[] = [
  { id: "s1", date: "2026-07-06", dayLabel: "7/6(月)", time: "10:00", available: true },
  { id: "s2", date: "2026-07-06", dayLabel: "7/6(月)", time: "13:00", available: false },
  { id: "s3", date: "2026-07-06", dayLabel: "7/6(月)", time: "15:30", available: true },
  { id: "s4", date: "2026-07-07", dayLabel: "7/7(火)", time: "10:00", available: true },
  { id: "s5", date: "2026-07-07", dayLabel: "7/7(火)", time: "13:00", available: true },
  { id: "s6", date: "2026-07-07", dayLabel: "7/7(火)", time: "19:00", available: false },
  { id: "s7", date: "2026-07-08", dayLabel: "7/8(水)", time: "10:00", available: false },
  { id: "s8", date: "2026-07-08", dayLabel: "7/8(水)", time: "15:30", available: true },
  { id: "s9", date: "2026-07-09", dayLabel: "7/9(木)", time: "13:00", available: true },
  { id: "s10", date: "2026-07-09", dayLabel: "7/9(木)", time: "19:00", available: true },
  { id: "s11", date: "2026-07-10", dayLabel: "7/10(金)", time: "10:00", available: true },
  { id: "s12", date: "2026-07-10", dayLabel: "7/10(金)", time: "15:30", available: false },
];

/* ------------------------------------------------------------------ */
/* ダッシュボード集計 (本部)                                             */
/* ------------------------------------------------------------------ */
export const adminStats = {
  totalClients: clients.length,
  activeClients: clients.filter((c) => c.status === "active").length,
  totalEndUsers: 180,
  openProjects: projects.filter((p) => p.status === "open").length,
  inProgressProjects: projects.filter((p) => p.status === "in_progress").length,
  monthlySales: 342100,
  monthlySalesGrowth: "+12.4%",
  unreadMessages: hqThreads.reduce((sum, t) => sum + t.unreadCount, 0),
  pendingOrders: orders.filter((o) => o.status === "received").length,
};

/* ------------------------------------------------------------------ */
/* 外部EC (BASE等) 売上通知 — webhook で受信する想定のモック (Phase 3)   */
/* ------------------------------------------------------------------ */
export const ecNotifications: EcNotification[] = [
  {
    id: "ec1",
    source: "BASE",
    productName: "モイストリペアセラム 30mL",
    quantity: 1,
    amount: 4950,
    receivedAt: "今日 8:24",
    taskCreated: false,
  },
  {
    id: "ec2",
    source: "BASE",
    productName: "ポーセラーツ転写紙 花柄セット",
    quantity: 2,
    amount: 6600,
    receivedAt: "今日 7:02",
    taskCreated: false,
  },
  {
    id: "ec3",
    source: "BASE",
    productName: "シルクハンドクリーム 50g",
    quantity: 1,
    amount: 1980,
    receivedAt: "昨日 21:40",
    taskCreated: true,
  },
];

/* ------------------------------------------------------------------ */
/* AIアシスタント: 朝のダイジェスト (Phase 3 プレビュー用モック)          */
/* ------------------------------------------------------------------ */
export const aiMorningDigest: AiDigestItem[] = [
  {
    id: "ai1",
    kind: "期限超過",
    text: "「トップページのキャッチコピー修正」が期限を過ぎています (7/4締切・進行中)",
    href: "/admin/projects/p3",
  },
  {
    id: "ai2",
    kind: "返信待ち",
    text: "Nail Salon Luce様のメッセージに18時間返信がありません",
    href: "/admin/messages/th2",
  },
  {
    id: "ai3",
    kind: "タスク候補",
    text: "昨日の会話から「バナー画像のBパターン反映」をタスク化しますか?",
    href: "/admin/messages/th1",
  },
  {
    id: "ai4",
    kind: "未完了タスク",
    text: "未完了タスクが5件あります (うち今日締切2件)",
    href: "/admin/projects",
  },
];

/** ビジュアル管理 (ノーコード編集対象の設定値) */
export const visualSettings = {
  heroTitle: "手しごとの教室を、もっと身近に。",
  heroSubtitle: "つながるクラフトは全国の教室・サロンを応援します",
  brandColor: "#d9634a",
  featuredProductIds: ["pr1", "pr4"],
  campaignBanner: "🍂 秋の体験レッスンキャンペーン 受付中!",
};
