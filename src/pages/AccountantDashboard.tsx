import { useState } from "react";
import { GetUsers } from "../api/users";
import AccountantHourReview from "../components/accountant/AccountantReview";
import HourReview from "../components/employee/components/HourReview";
import AttentionMessage from "../components/UI/UX-messages/AttentionMessage";
import { GetAbsenceData } from "../api/absence";
import { GetProjects } from "../api/projects";

export default function AccountantPage() {
  const { data: users = [] } = GetUsers();
  const { data: projects = [] } = GetProjects();
  const { data: absence = [] } = GetAbsenceData();
  const [weekOffset] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <h1 className="text-center text-3xl font-semibold mb-4">Regnskap</h1>

      <p className="text-center text-gray-600 mb-6">
        Velg en bruker for å se registrerte arbeidstimer
      </p>

      <AttentionMessage message="Her finner du informasjon om arbeidstimer." />

      <AccountantHourReview users={users} />

      {/* User Selector */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b-3 pb-4">
          Se timer per ansatt
        </h2>

        <div className="flex flex-wrap gap-3 justify-center">
          {users.map((user) => {
            const isActive = selectedUserId === user.userId;

            return (
              <button
                key={user.userId}
                onClick={() => setSelectedUserId(user.userId)}
                className={`
                px-5 py-2 text-sm font-medium transition
                border

                ${
                  isActive
                    ? "bg-[#2c3e50] text-white border-[#2c3e50] shadow-lg scale-105"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }
              `}
              >
                {user.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected User Info */}
      {!selectedUserId && (
        <div className="mt-10 text-center text-gray-500 italic">
          Velg en ansatt ovenfor for å vise timer
        </div>
      )}

      {/* Selected User Hours */}
      {selectedUserId && (
        <div className="mt-10">
          {/* Active User Banner */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-700">Viser timer for</p>

            <p className="text-xl font-bold text-blue-900">
              {users.find((u) => u.userId === selectedUserId)?.name}
            </p>
          </div>

          <HourReview
            userId={selectedUserId}
            userName={
              users.find((u) => u.userId === selectedUserId)?.name || ""
            }
            weekOffset={weekOffset}
            projects={projects}
            absence={absence}
          />
        </div>
      )}
    </div>
  );
}
