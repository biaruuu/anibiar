import type { Metadata } from "next";
import { AiringSchedule } from "@/components/airing-schedule";

export const metadata: Metadata = { title: "Schedule" };

export default function SchedulePage() {
  return (
    <div className="mx-auto max-w-4xl pb-4 pt-4">
      <AiringSchedule initialLimit={200} />
    </div>
  );
}
