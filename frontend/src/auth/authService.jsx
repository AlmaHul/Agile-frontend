const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// ✅ Spara tokens
export const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

// ✅ Hämta tokens
export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

// ✅ Ta bort tokens
export const removeTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};


// ✅ Dekoda token
export const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (err) {
    console.error("Misslyckades att dekoda token:", err);
    return null;
  }
};



// ✅ Auth headers (stöd för FormData)
export const getAuthHeaders = (isFormData = false) => {
  const token = getAccessToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

// ✅ Försök hämta ny access token via refresh token
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    });

    if (!response.ok) return null;

    const data = await response.json();
    saveTokens(data.access_token, refreshToken);
    return data.access_token;
  } catch (error) {
    console.error("Kunde inte uppdatera access token:", error);
    return null;
  }
};

// ✅ Wrapper för authenticated fetch (automatisk hantering av Content-Type)
export const fetchWithAuth = async (url, options = {}, retry = true) => {
  let accessToken = getAccessToken();

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return fetchWithAuth(url, options, false);
    } else {
      removeTokens();
    }
  }

  return response;
};