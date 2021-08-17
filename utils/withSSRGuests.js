import { parseCookies } from "nookies";

export function withSRRGuest(fn) {
  return async (ctx) => {
    const cookies = parseCookies(ctx);

    if (cookies["nextauth.token"]) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }
    return await fn(ctx);
  };
}
