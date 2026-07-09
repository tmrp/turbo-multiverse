export function isPreview(): boolean {
  return process.env.VERCEL_ENV === "preview";
}

export function isProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}

/** Local development — any environment not running on Vercel. */
export function isDevelopment(): boolean {
  return process.env.VERCEL_ENV === undefined;
}
