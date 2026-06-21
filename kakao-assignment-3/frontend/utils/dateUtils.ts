// 오늘 날짜 00:00:00 으로 반환
export function getTodayNormal(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
  
  // 해당 날짜가 속한 주의 월요일 반환
  export function getWeekMonday(date: Date): Date {
    const d    = new Date(date);
    const day  = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  
  // weekBaseDate 기준 월~일 7개 Date 배열 반환
  export function getWeekDates(weekBaseDate: Date): Date[] {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekBaseDate);
      d.setDate(d.getDate() + i);
      return d;
    });
  }
  
  // Date -> 'YYYY-MM-DD' (로컬스토리지 키용)
  export function formatDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  
  // Date -> 'YYYY. MM. DD' (화면 표시용)
  export function formatDateLabel(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}. ${m}. ${d}`;
  }
  
  // 요일 풀네임 (일간 네비게이터용)
  export function getDayOfWeek(date: Date): string {
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return days[date.getDay()];
  }
  
  // 요일 축약형 (주간뷰 셀용)
  export function getShortDayOfWeek(date: Date): string {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  }
  
  // 연/월/일 기준으로 같은 날인지 비교
  export function isSameDay(a: Date, b: Date): boolean {
    return formatDateKey(a) === formatDateKey(b);
  }