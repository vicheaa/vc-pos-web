"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@tanstack/react-router";

export function LoginForm() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email({ message: t("auth.invalidEmail") }),
    password: z.string().min(6, { message: t("auth.passwordMinLength") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "test@example.com",
      password: "password",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      toast({
        title: t("auth.loginSuccessful"),
        description: t("auth.welcomeBack"),
      });
      router.navigate({ to: "/dashboard" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("auth.loginFailed"),
        description: t("auth.checkCredentials"),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.email")}</FormLabel>
              <FormControl>
                <Input placeholder={t("auth.emailPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.password")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("auth.passwordPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : t("auth.login")}
        </Button>
      </form>
    </Form>
  );
}
