import type { Metadata } from "next";
import { ProjectFeed } from "./project-feed";

export const metadata: Metadata = { title: "案件フィード" };

export default function WorkerFeedPage() {
  return <ProjectFeed />;
}
