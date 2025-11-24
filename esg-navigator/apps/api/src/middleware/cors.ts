import cors from "cors";
import { ENV } from "../config/env";
const allow = new Set(ENV.ALLOWED_ORIGINS);
/** Why: strict allowlist in prod. */
const opts = (req: any, cb: any) => {
  const origin = req.header("Origin") ?? "";
  const ok = ENV.NODE_ENV !== "production" ? true : allow.has(origin);
  cb(null, {
    origin: ok,
    credentials: true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
    maxAge: 600,
  });
};
export const useCors = () => cors(opts);
