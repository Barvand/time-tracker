type PreviewProps = {
  startStr: string;
  endStr: string;
  breakStr: string;
  hours: number;
};

function PreviewSection({ preview }: { preview: PreviewProps }) {
  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <svg
          className="w-4 h-4 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Oppsummering
      </h3>
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          Du har jobbet fra{" "}
          <strong className="text-gray-900">{preview.startStr}</strong> til{" "}
          <strong className="text-gray-900">{preview.endStr}</strong> med en
          pause på <strong className="text-gray-900">{preview.breakStr}</strong>
          .
        </p>
        <p className="text-base font-semibold text-blue-600 mt-3">
          Totalt: {preview.hours} timer
        </p>
      </div>
    </div>
  );
}

export default PreviewSection;
