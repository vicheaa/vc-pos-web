import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/report")({
  component: ReportPage,
});

function ReportPage() {
  return <div>Report Page</div>;
}
