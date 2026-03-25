// context/Agentauthcontext.jsx
import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";

export const AgentAuthContext = createContext();

// ── Plain axios ONLY for refresh-token — bypasses the agentApi interceptor
// to prevent the infinite loop: 401 → try refresh → 401 → repeat
//
// VITE_API_URL should be the full base including /api
// e.g. https://api.khakigemstone.com/api  OR  http://localhost:8080/api
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const plainAxios = axios.create({
  baseURL:         BASE,
  withCredentials: true,   // sends the agentRefreshToken cookie
});

export const AgentAuthProvider = ({ children }) => {
  const [agent, setAgent]     = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await plainAxios.post("/agents/refresh-token");
      if (res.data?.accessToken) {
        window.agentAccessToken = res.data.accessToken;
        setAgent(res.data.agent);
      } else {
        window.agentAccessToken = null;
        setAgent(null);
      }
    } catch {
      // 401 = no cookie / expired — agent is simply not logged in
      window.agentAccessToken = null;
      setAgent(null);
    } finally {
      // Always runs — loading never gets stuck
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (credentials) => {
    const { default: agentApi } = await import("../services/agentServices/api.agentService");
    const res = await agentApi.post("/agents/login", credentials);
    window.agentAccessToken = res.data.accessToken;
    setAgent(res.data.agent);
    return res.data;
  };

  const logout = async () => {
    try {
      await plainAxios.post("/agents/logout");
    } catch {
      // Ignore — clear state regardless
    } finally {
      window.agentAccessToken = null;
      setAgent(null);
    }
  };

  return (
    <AgentAuthContext.Provider value={{ agent, login, logout, loading, refresh }}>
      {children ? children : <Outlet />}
    </AgentAuthContext.Provider>
  );
};

export const useAgentAuth = () => useContext(AgentAuthContext);