// context/BargainerAuthContext.jsx
// Mirrors the AgentAuthContext pattern.
// Uses window.bargainerAccessToken (separate from window.agentAccessToken).
// Cookie: bargainerRefreshToken (separate from agentRefreshToken).

import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const BargainerAuthContext = createContext(null);

// A plain axios instance that bypasses the agent API interceptor
const plainAxios = axios.create({ baseURL: import.meta.env.VITE_API_URL, withCredentials: true });

export function BargainerAuthProvider({ children }) {
  const [bargainer, setBargainer] = useState(null);
  const [loading, setLoading]     = useState(true);
  const refreshTimer              = useRef(null);

  // Schedule silent refresh 1 minute before the 15-min access token expires
  const scheduleRefresh = () => {
    clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(silentRefresh, 14 * 60 * 1000);
  };

  const silentRefresh = async () => {
    try {
      const { data } = await plainAxios.post("/bargainers/refresh-token");
      if (data.success) {
        window.bargainerAccessToken = data.accessToken;
        setBargainer(data.bargainer);
        scheduleRefresh();
      } else {
        clearBargainer();
      }
    } catch {
      clearBargainer();
    }
  };

  const clearBargainer = () => {
    window.bargainerAccessToken = null;
    setBargainer(null);
    clearTimeout(refreshTimer.current);
  };

  // On mount — try to restore session from existing refresh cookie
  useEffect(() => {
    silentRefresh().finally(() => setLoading(false));
    return () => clearTimeout(refreshTimer.current);
  }, []);

  const login = async (phone, password) => {
    const { data } = await plainAxios.post("/bargainers/login", { phone, password });
    if (data.success) {
      window.bargainerAccessToken = data.accessToken;
      setBargainer(data.bargainer);
      scheduleRefresh();
    }
    return data; // let caller inspect message/statusCode on error
  };

  const logout = async () => {
    try { await plainAxios.post("/bargainers/logout"); } catch { /* ignore */ }
    clearBargainer();
  };

  return (
    <BargainerAuthContext.Provider value={{ bargainer, loading, login, logout }}>
      {children}
    </BargainerAuthContext.Provider>
  );
}

export const useBargainerAuth = () => useContext(BargainerAuthContext);