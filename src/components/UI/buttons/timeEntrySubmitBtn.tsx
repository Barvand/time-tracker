type TimeEntrySubmitBtnProps = {
  submitting: boolean;
  preview: boolean;
  handleSubmit: () => void;
};

function TimeEntrySubmitBtn({
  submitting,
  preview,
  handleSubmit,
}: TimeEntrySubmitBtnProps) {
  return (
    <>
      <div className="flex justify-end">
        <button
          disabled={submitting || !preview}
          onClick={handleSubmit}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Lagrer…
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Registrer arbeidstid
            </>
          )}
        </button>
      </div>

      {!preview && (
        <div className="mt-6 border-t pt-6">
          <p className="text-center text-sm text-gray-500">
            Fyll ut alle feltene over for å se en oppsummering av arbeidstiden
            din
          </p>
        </div>
      )}
    </>
  );
}

export default TimeEntrySubmitBtn;
