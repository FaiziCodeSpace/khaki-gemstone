import { useState, useEffect } from "react";
import adminApi from "../../services/adminServices/api.authService";

const STATUS_BADGE = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_LABEL = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BargainerApplications() {
  const [bargainers, setBargainers] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const fetchBargainers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get(`/bargainers?status=${filter}`);
      setBargainers(res.data.bargainers || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setBargainers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBargainers();
  }, [filter]);

  const handleApprove = async (id) => {
    if (!confirm("Approve this application?")) return;
    setActionLoading(id + "_approve");
    try {
      await adminApi.patch(`/bargainers/${id}/approve`);
      fetchBargainers();
    } catch (err) {
      alert("Failed to approve");
    } finally {
      setActionLoading("");
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal.id + "_reject");
    try {
      await adminApi.patch(`/bargainers/${rejectModal.id}/reject`, {
        reason: rejectReason,
      });
      setRejectModal(null);
      setRejectReason("");
      fetchBargainers();
    } catch (err) {
      alert("Failed to reject");
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await adminApi.delete(`/bargainers/${id}`);
      fetchBargainers();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  // We calculate counts based on the current list or you might need a separate endpoint 
  // for global counts. For now, this filters the locally fetched 'bargainers' array.
  const counts = {
    pending: bargainers.filter((b) => b.status === "pending").length,
    approved: bargainers.filter((b) => b.status === "approved").length,
    rejected: bargainers.filter((b) => b.status === "rejected").length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bargainer Applications</h2>
          <p className="text-sm text-gray-500 mt-0.5">Requests to use AgentHub</p>
        </div>
        <button
          onClick={fetchBargainers}
          className="flex items-center gap-2 text-sm border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 text-gray-600 transition-colors"
        >
          <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "pending", label: "Pending" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
          { key: "", label: "All" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              filter === key ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex items-center gap-3 text-sm text-gray-400 py-12 justify-center">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading applications...
        </div>
      ) : bargainers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-semibold text-gray-700">No Applications</p>
          <p className="text-sm text-gray-400 mt-1">No records found for this filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bargainers.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{b.fullName || "Unknown"}</div>
                    <div className="text-xs text-gray-400">ID: {b._id.slice(-6)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{b.email}</div>
                    <div className="text-xs text-gray-400">{b.phone || "No Phone"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${STATUS_BADGE[b.status]}`}>
                      {STATUS_LABEL[b.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(b.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {b.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(b._id)}
                            disabled={actionLoading === b._id + "_approve"}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setRejectModal(b)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            ✕
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete Permanently"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Reject Application</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Reason for rejecting <strong>{rejectModal.fullName}</strong> (optional)
              </p>
            </div>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={actionLoading === rejectModal.id + "_reject"}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
              >
                {actionLoading === rejectModal.id + "_reject" ? "..." : "Reject"}
              </button>
              <button
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason("");
                }}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}