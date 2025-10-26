import { LoginForm } from "./components/LoginForm";
import { Flame } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Flame className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">VC-POS</h1>
          <p className="text-muted-foreground">
            Welcome back! Please login to your account.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
