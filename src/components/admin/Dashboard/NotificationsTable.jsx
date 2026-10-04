import { Clock } from "lucide-react";

export default function NotificationsTable({ activities = [] }) {
  const isEmpty = activities.length === 0;

  return (
    <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mt-5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 md:h-6 bg-[#CA0A7F] rounded-full" />
          <h3 className="text-base md:text-lg font-bold text-gray-900">Recent Activity</h3>
        </div>
        {!isEmpty && (
          <button className="text-xs font-semibold text-[#CA0A7F] hover:underline px-2 py-1">
            View All
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="flex items-center justify-center py-16 px-4">
          <p className="text-sm font-medium text-gray-400 text-center">
            No recent actions
          </p>
        </div>
      ) : (
        <>
          {/* Responsive Wrapper */}
          <div className="overflow-x-auto w-full scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] md:text-[11px] uppercase tracking-wider">
                  <th className="px-4 md:px-6 py-3 font-semibold">Activity</th>
                  <th className="px-4 md:px-6 py-3 font-semibold">Type</th>
                  <th className="px-4 md:px-6 py-3 font-semibold">Time</th>
                  <th className="px-4 md:px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activities.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={`p-2 rounded-lg shrink-0 ${item.iconBg} ${item.iconColor}`}>
                          <item.icon size={16} className="md:w-[18px] md:h-[18px]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 leading-none mb-1 truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] md:text-xs text-gray-500 truncate max-w-[150px] md:max-w-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-medium text-gray-500">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 capitalize">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-400">
                        <Clock size={12} />
                        {item.time}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <button className="text-[#CA0A7F] md:opacity-0 md:group-hover:opacity-100 transition-opacity text-xs font-bold hover:bg-pink-50 px-3 py-1.5 rounded-lg">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50/30 text-center border-t border-gray-50">
            <p className="text-[10px] md:text-[11px] text-gray-400 font-medium">
              Showing last {activities.length} activities • Scroll to view more
            </p>
          </div>
        </>
      )}
    </section>
  );
}