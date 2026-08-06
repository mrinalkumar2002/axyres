import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL
// Replace this later with your actual extension ID
const EXTENSION_ID = "hcpppoijklpfnncakbjeodjpcblnhhpl";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Check session on app load (cookie → backend)
  useEffect(() => {
    fetch(`${BASE_URL}/api/users/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

const syncExtension = async () => {
  try {
    // Request an extension token from backend
    const res = await fetch(`${BASE_URL}/api/extension/token`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) return;

    if (!window.chrome?.runtime) return;

    chrome.runtime.sendMessage(
      EXTENSION_ID,
      {
        type: "LOGIN_SUCCESS",
        token: data.token,
        user: data.user,
      },
      (response) => {
        console.log("Extension Synced:", response);
      }
    );

  } catch (err) {
    console.error("Extension Sync Failed", err);
  }
};

const signup = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/api/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Signup failed");
  }

  setUser(data.user);

  return data;
};

// ✅ Login
const login = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  setUser(data.user);

  // Sync Extension
  await syncExtension();

  return data;
};   // ✅ THIS WAS MISSING

// 🚪 Logout
const logout = async () => {
  await fetch(`${BASE_URL}/api/users/logout`, {
    method: "POST",
    credentials: "include",
  });

  setUser(null);

  try {
    if (window.chrome?.runtime) {
      chrome.runtime.sendMessage(
        EXTENSION_ID,
        {
          type: "LOGOUT",
        }
      );
    }
  } catch (err) {
    console.error(err);
  }
};

return (
  <AuthContext.Provider
    value={{
      user,
      loading,
      signup,
      login,
      logout,
    }}
  >
    {children}
  </AuthContext.Provider>
);
}

export function useAuth() {
  return useContext(AuthContext);
}