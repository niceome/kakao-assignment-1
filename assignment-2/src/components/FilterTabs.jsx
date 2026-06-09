const FILTERS = [
  { key: 'all',       label: '전체' },
  { key: 'active',    label: '진행 중' },
  { key: 'completed', label: '완료' },
];

export default function FilterTabs({ currentFilter, onFilterChange }) {
  return (
    <div className="flex gap-2 px-6 py-4 border-b border-gray-100">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
            currentFilter === key
              ? 'bg-violet-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
