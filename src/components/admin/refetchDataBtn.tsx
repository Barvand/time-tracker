type RefetchDataBtnProps = {
  refetch: () => void;
  isLoading: boolean;
};

function RefetchDataBtn({ refetch, isLoading }: RefetchDataBtnProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={() => refetch()}
        className="text-sm text-blue-600 hover:underline"
        disabled={isLoading}
      >
        {isLoading ? "Laster..." : "Oppdater"}
      </button>
    </div>
  );
}

export default RefetchDataBtn;
