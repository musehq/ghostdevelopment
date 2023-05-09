const LOCAL_STORAGE_TOKEN_KEY = "ACCESS_TOKEN";

interface TokensInterface {
  token: string;
  refreshToken: string;
}

export function removeLocalAccessToken() {
  localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
}

export function setLocalAccessToken(tokens: TokensInterface) {
  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, JSON.stringify(tokens));
}

function extractLocalAccessToken() {
  const tokens = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  if (tokens) {
    try {
      return JSON.parse(tokens) as TokensInterface;
    } catch {
      removeLocalAccessToken();
    }
  }
  return null;
}

export function getLocalAccessToken() {
  const tokens = extractLocalAccessToken();
  return tokens?.token;
}

export function getLocalRefreshToken() {
  const tokens = extractLocalAccessToken();
  return tokens?.refreshToken;
}
