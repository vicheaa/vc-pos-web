import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale, defaultLocale } from "./routing";

// const defaultLocale = "en"; // Assuming 'en' is the default locale

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  const validLocale = locale as Locale;

  try {
    let messages;
    if (validLocale === 'en') {
      messages = (await import(`../messages/en.json`)).default;
    } else {
      messages = (await import(`../messages/${validLocale}.json`)).default;
    }
    console.log(`Loaded messages for ${validLocale}`);
    return {
      locale: validLocale,
      messages,
    };
  } catch (error) {
    console.error(`Failed to load messages for ${validLocale}`, error);
    return {
      locale: validLocale,
      messages: {},
    };
  }
});
