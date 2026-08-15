import type { Metadata } from "next";
import { BookingView } from "./booking-view";

export const metadata: Metadata = { title: "Zoom予約" };

export default function ClientBookingPage() {
  return <BookingView />;
}
