import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL

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

  // ✅ Signup (backend)
const signup = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/api/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // 🔥 REQUIRED
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signup failed");
  window.location.reload(); // 🔥 Store user in localStorage
  setUser(data.user); // 🔥 REQUIRED
  return data;
};


  // ✅ Login (cookie is set by backend)
  const login = async ({ email, password }) => {
    const res = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    window.location.reload();
    setUser(data.user);
    return data;
  };

  // 🚪 Logout (clear cookie)
  const logout = async () => {
    await fetch(`${BASE_URL}/api/users/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.reload();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

