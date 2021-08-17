import { parseCookies, destroyCookie } from "nookies";
import { AuthTokenError } from "../errors/AuthTokenError";

export function withSRRAuth(fn) {
  return async (ctx) => {
    const cookies = parseCookies(ctx);

    if (!cookies["nextauth.token"]) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, 'nextauth.token')
        destroyCookie(ctx, 'nextauth.refreshToken')
  
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
      }
      
    }
    
  };
}
