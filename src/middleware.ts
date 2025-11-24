import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default async function middleware(request: any) {
  console.log("Middleware running for:", request.nextUrl.pathname);
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);
  return response;
}

export const config = {
  // Match only pathnames without a file extension
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
