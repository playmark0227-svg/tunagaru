/**
 * バッジ配色の一元管理
 *
 * 以前は各画面が同じ意味のマップを個別に定義しており (20箇所)、
 * 同じステータスがロールによって違う色で出る不整合が起きていた。
 * 「同じ意味なら、どの画面でも同じ色」を保証するためここに集約する。
 *
 * 配色の考え方:
 *   green  = 良い状態・完了      blue  = 進行中・受付済
 *   amber  = 要対応・待ち        red   = 急ぎ・重要
 *   brand  = 募集中 (アクア/注目) gray  = 非活性・その他
 */
import type { BadgeTone } from "@/components/ui";
import type {
  ApplicationStatus,
  ClientStatus,
  OrderStatus,
  PayoutStatus,
  ProjectCategory,
  ProjectStatus,
  Task,
  TaskStatus,
} from "./types";

/** 案件カテゴリ — 6種すべて異なる色相で見分けやすくする */
export const CATEGORY_TONES: Record<ProjectCategory, BadgeTone> = {
  HP制作: "blue",
  動画制作: "violet",
  キャンペーン: "brand",
  SNS運用: "green",
  EC構築: "amber",
  デザイン: "red",
};

/** 案件ステータス — 募集中を最も目立つアクアに */
export const PROJECT_STATUS_TONES: Record<ProjectStatus, BadgeTone> = {
  open: "brand",
  in_progress: "blue",
  done: "green",
};

/** タスクステータス */
export const TASK_STATUS_TONES: Record<TaskStatus, BadgeTone> = {
  todo: "gray",
  in_progress: "blue",
  review: "amber",
  done: "green",
};

/** タスク種別 */
export const TASK_KIND_TONES: Record<Task["kind"], BadgeTone> = {
  修正依頼: "red",
  Zoom予約: "blue",
  素材提出: "violet",
  確認: "amber",
  発送: "green",
  その他: "gray",
};

/** 応募ステータス */
export const APPLICATION_TONES: Record<ApplicationStatus, BadgeTone> = {
  applied: "blue",
  accepted: "green",
  rejected: "gray",
};

/** 注文ステータス (B2B2Cパイプライン) */
export const ORDER_TONES: Record<OrderStatus, BadgeTone> = {
  received: "amber",
  ordered_to_hq: "blue",
  shipped: "violet",
  completed: "green",
};

/** クライアント契約ステータス */
export const CLIENT_STATUS_TONES: Record<ClientStatus, BadgeTone> = {
  active: "green",
  trial: "amber",
  suspended: "gray",
};

/** 報酬・支払ステータス */
export const PAYOUT_TONES: Record<PayoutStatus, BadgeTone> = {
  pending: "amber",
  invoiced: "blue",
  paid: "green",
};
