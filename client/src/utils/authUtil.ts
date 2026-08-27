const PUBLIC_URLS: readonly string[] = [
  "/api/v1/auth/customer/register",
  "/api/v1/auth/login",
  "/api/v1/auth/refresh-token",
  "/api/v1/restaurants/public",
  "/api/v1/momo/",
  "/api/v1/zalopay/",
  "/websocket/",
  "/oauth2/",
  "/login/oauth2/",
];

export const isPublicUrl = (url?: string): boolean => {
  if (!url) {
    return false;
  }

  return PUBLIC_URLS.some((publicUrl) => url.startsWith(publicUrl));
};

export const redirectToLogin = (): void => {
  window.location.href = "/login";
};
