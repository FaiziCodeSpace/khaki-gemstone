import { Navigate } from "react-router-dom";
import { useAgentAuth } from "../context/Agentauthcontext";

export default function AgentProtectedRoute({ children }) {
  const { agent, loading } = useAgentAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 animate-spin text-pink-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          <p className="text-sm text-gray-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  return agent ? children : <Navigate to="/agent/login" replace />;
}