export interface AuthUser {
  id: number | string;
  username: string;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

interface JwtPayload {
  exp?: number;
  userId?: number | string;
  username?: string;
}

const AUTH_TOKEN_KEY = 'auth_token';

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;

  return localStorage.getItem(AUTH_TOKEN_KEY);
};

const clearStoredToken = () => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(AUTH_TOKEN_KEY);
};

const decodeTokenPayload = (token: string): JwtPayload | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '='
    );

    return JSON.parse(atob(padded)) as JwtPayload;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

const getUserFromToken = (token: string): AuthUser | null => {
  const payload = decodeTokenPayload(token);

  if (!payload?.userId || !payload.username) {
    return null;
  }

  if (payload.exp && payload.exp * 1000 < Date.now()) {
    return null;
  }

  return {
    id: payload.userId,
    username: payload.username,
  };
};

export const authService = {
  async signup(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Помилка реєстрації');
      }

      const data: AuthResponse = await response.json();
      // Зберегти токен
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      }
      return data;
    } catch (error: unknown) {
      console.error('Signup error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Помилка реєстрації'
      );
    }
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Помилка входу');
      }

      const data: AuthResponse = await response.json();
      // Зберегти токен
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      }
      return data;
    } catch (error: unknown) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Помилка входу');
    }
  },

  async logout() {
    clearStoredToken();
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      if (typeof window === 'undefined') return null;

      const token = getStoredToken();
      if (!token) return null;

      const fallbackUser = getUserFromToken(token);
      if (!fallbackUser) {
        clearStoredToken();
        return null;
      }

      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      if (!response.ok) {
        if ([401, 403, 404].includes(response.status)) {
          clearStoredToken();
          return null;
        }

        return fallbackUser;
      }

      return await response.json();
    } catch (error) {
      console.error('Get user error:', error);
      return getStoredToken() ? getUserFromToken(getStoredToken()!) : null;
    }
  },
};
