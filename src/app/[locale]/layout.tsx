import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/routing";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/contexts/AppContextProvider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "VC-POS",
  description: "Point of Sale system.",
};

// export function generateStaticParams() {
//   return locales.map((locale) => ({ locale }));
// }

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  console.log("LocaleLayout received params:", await params);
  console.log("LocaleLayout locale:", locale);

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  console.log("Calling getMessages...");
  let messages;
  try {
    messages = await getMessages();
    console.log("Messages loaded:", Object.keys(messages).length);
  } catch (error) {
    console.error("Error loading messages:", error);
    messages = {}; // Fallback to empty messages to prevent crash
  }

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
          suppressHydrationWarning={true}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={cn("min-h-screen bg-background font-body antialiased")}
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider messages={messages}>
          <AppProvider>
            {children}
            <Toaster />
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
