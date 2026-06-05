export const DEFAULT_ADMIN_PATH = "/admin";

export function normalizeAdminPath(path?: string | null) {
  const rawPath = path?.trim() || DEFAULT_ADMIN_PATH;
  const pathWithLeadingSlash = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const normalized =
    pathWithLeadingSlash.length > 1
      ? pathWithLeadingSlash.replace(/\/+$/, "")
      : DEFAULT_ADMIN_PATH;

  return normalized || DEFAULT_ADMIN_PATH;
}

export function getAdminPath() {
  return normalizeAdminPath(process.env.NEXT_PUBLIC_ADMIN_PATH);
}

export function isPathWithin(pathname: string, basePath: string) {
  const normalizedBasePath = normalizeAdminPath(basePath);
  return (
    pathname === normalizedBasePath ||
    pathname.startsWith(`${normalizedBasePath}/`)
  );
}

export function isAdminRoute(pathname: string) {
  const configuredAdminPath = getAdminPath();
  return (
    isPathWithin(pathname, DEFAULT_ADMIN_PATH) ||
    isPathWithin(pathname, configuredAdminPath)
  );
}
