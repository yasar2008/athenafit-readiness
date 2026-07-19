import { useState } from "react";
import { useReadiness, UserProfile } from "@/hooks/useReadiness";
import { Search, ShieldAlert, Award, Calendar, Clock, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";

const statusBorders = {
  ready: "border-success/30 bg-success/10 text-success",
  recovery: "border-info/30 bg-info/10 text-info",
  rest: "border-rest/30 bg-rest/10 text-rest",
  risk: "border-destructive/30 bg-destructive/10 text-destructive",
};

const statusLabels = {
  ready: "Ready (Peak)",
  recovery: "Recovery",
  rest: "Rest",
  risk: "Risk Advisory",
};

const AdminPanel = () => {
  const { userList } = useReadiness();
  const [search, setSearch] = useState("");

  const filteredUsers = userList.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass-card rounded-2xl p-6 border border-border/50 bg-background/95 w-full fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="font-serif text-title">Coach & Admin Directory</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Access biometric profiles, fitness goals, and readiness logs of registered athletes.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search athletes..."
            className="pl-9 bg-muted/40 border-border/40 text-foreground text-xs h-9"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
        </div>
      </div>

      {/* User Records Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/40 text-muted-foreground uppercase font-bold tracking-wider">
              <th className="py-3 px-4">Athlete Details</th>
              <th className="py-3 px-4">Focus & Training Goal</th>
              <th className="py-3 px-4 text-center">Score</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Log Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No athlete records found matching your query.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.email} className="hover:bg-muted/20 transition-colors">
                  {/* Name and Email */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-foreground">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{user.email}</p>
                  </td>
                  
                  {/* Focus & Goal */}
                  <td className="py-4 px-4">
                    <span className="font-semibold text-primary block">{user.focus}</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5 max-w-xs truncate" title={user.goal}>
                      {user.goal}
                    </span>
                  </td>

                  {/* Readiness Score */}
                  <td className="py-4 px-4 text-center">
                    {user.score !== undefined ? (
                      <span className="font-mono font-bold text-sm bg-primary/10 px-2 py-0.5 rounded text-primary">
                        {user.score}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40 font-mono">-</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 text-center">
                    {user.status ? (
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${statusBorders[user.status]}`}>
                        {statusLabels[user.status]}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/35 border border-dashed border-border/40 px-2 py-0.5 rounded-full text-[10px]">
                        Pending
                      </span>
                    )}
                  </td>

                  {/* Log Time */}
                  <td className="py-4 px-4 text-right font-mono text-[10px] text-muted-foreground">
                    {user.checkInTime ? (
                      <span className="flex items-center justify-end gap-1.5">
                        <Clock className="h-3 w-3 text-success" />
                        {user.checkInTime}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/30">Not Checked In</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
