let accessToken: string | null = null;

export const getAccessToken = (): string | null => {
  return accessToken;
};

export const setAccessToken = (token: string): void => {
  accessToken = token;
  console.log("SET ACCESS TOKEN:", accessToken);
};

export const clearAccessToken = (): void => {
  accessToken = null;
};
