/** Original public host of the request, including the port when present. */
export function getHost(request: Request): string {
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";

  return host.split(",")[0]?.trim() ?? "";
}
