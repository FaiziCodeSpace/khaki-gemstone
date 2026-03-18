// context/Agentauthcontext.jsx
import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";

export const AgentAuthContext = createContext();

// ── A plain axios instance used ONLY for the refresh-token call ──
// This deliberately bypasses the agentApi interceptor to prevent
// the infinite loop: refresh fails → interceptor tries to refresh → repeat
const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const plainAxios = axios.create({ baseURL: BASE, withCredentials: true });

export const AgentAuthProvider = ({ children }) => {
  const [agent, setAgent]     = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    // Always reset loading at the start
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
      // Any error (401, network, CORS) — just mark as not logged in
      window.agentAccessToken = null;
      setAgent(null);
    } finally {
      // This ALWAYS runs — loading will never get stuck
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (credentials) => {
    // Import agentApi here to avoid circular dependency issues
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
      // Even if logout request fails, clear local state
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