export default function WeekNavigator({
  weekNumber,
  onPrev,
  onNext,
}: {
  weekNumber: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-center gap-6">
      <button onClick={onPrev} aria-label="Previous week">
        ←
      </button>
      <h3 className="text-2xl font-bold">Week {weekNumber}</h3>
      <button onClick={onNext} aria-label="Next week">
        →
      </button>
    </div>
  );
}
