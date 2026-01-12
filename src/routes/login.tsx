import { createFileRoute } from "@tanstack/react-router";
import { LoginPageWrapper } from "@/components/features/auth/LoginPageWrapper";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return <LoginPageWrapper />;
}
