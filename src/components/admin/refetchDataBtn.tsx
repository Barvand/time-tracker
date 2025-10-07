type RefetchDataBtnProps = {
  refetch: () => void;
  isLoading: boolean;
};

function RefetchDataBtn({ refetch, isLoading }: RefetchDataBtnProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Prosjekt Dashboard</h1>
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
