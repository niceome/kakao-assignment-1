import { formatDateLabel, getDayOfWeek, isSameDay, getTodayNormal } from '../utils/dateUtils';

export default function DateNav({ selectedDate, onMove }) {
  const isToday = isSameDay(selectedDate, getTodayNormal());

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onMove(-1)}
        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-xl transition-colors cursor-pointer"
      >
        ‹
      </button>

      <div className="text-center">
        <div className="text-white/70 text-xs font-medium tracking-widest uppercase mb-0.5">
          {getDayOfWeek(selectedDate)}
        </div>
        <div className="text-white font-semibold text-lg leading-tight">
          {formatDateLabel(selectedDate)}
        </div>
        {isToday && (
          <span className="inline-block mt-1.5 text-xs bg-white/25 text-white px-2.5 py-0.5 rounded-full font-medium">
            오늘
          </span>
        )}
      </div>

      <button
        onClick={() => onMove(1)}
        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-xl transition-colors cursor-pointer"
      >
        ›
      </button>
    </div>
  );
}
