import React from "react";
import { Link } from "react-router-dom";
import type { Absence } from "../../api/absence";

const AbsenceItem: React.FC<{ absence: Absence }> = ({ absence }) => {
  return (
    <li className="bg-white p-4 rounded border shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/admin/absence/${absence.absenceCode}`} className="block">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors">
                {absence.absenceCode} - {absence.name}
              </h3>

              {/* Red "Fravær" badge */}
              <span className="text-sm font-medium px-2 py-1 rounded-full bg-red-100 text-red-800">
                Fravær
              </span>
            </div>

            {absence.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {absence.description}
              </p>
            )}
          </div>

          <div className="ml-4 flex-shrink-0">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default AbsenceItem;
