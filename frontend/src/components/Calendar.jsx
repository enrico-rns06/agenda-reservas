import { useState } from 'react';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
];

export default function Calendar({ selectedDate, selectedTime, onDateChange, onTimeChange }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  function selectDay(day) {
    if (!day) return;
    const date = new Date(year, month, day);
    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return;
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateChange(formatted);
  }

  function isPast(day) {
    if (!day) return false;
    const date = new Date(year, month, day);
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  function isSelected(day) {
    if (!day || !selectedDate) return false;
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return formatted === selectedDate;
  }

  function isToday(day) {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  }

  return (
    <div style={styles.wrapper}>
      <div className="glass-card" style={styles.calendar}>
        <div style={styles.header}>
          <button style={styles.navBtn} onClick={prevMonth}>&#8249;</button>
          <span style={styles.monthLabel}>{MONTHS[month]} {year}</span>
          <button style={styles.navBtn} onClick={nextMonth}>&#8250;</button>
        </div>

        <div style={styles.grid}>
          {DAYS.map(d => (
            <div key={d} style={styles.dayName}>{d}</div>
          ))}
          {cells.map((day, i) => (
            <button
              key={i}
              style={{
                ...styles.dayCell,
                ...(isSelected(day) ? styles.dayCellSelected : {}),
                ...(isToday(day) && !isSelected(day) ? styles.dayCellToday : {}),
                ...(isPast(day) || !day ? styles.dayCellDisabled : {}),
              }}
              onClick={() => selectDay(day)}
              disabled={!day || isPast(day)}
            >
              {day || ''}
            </button>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div style={styles.timesWrapper}>
          <p style={styles.timesTitle}>Escolha o horario</p>
          <div style={styles.timesGrid}>
            {TIME_SLOTS.map(t => (
              <button
                key={t}
                style={{
                  ...styles.timeBtn,
                  ...(selectedTime === t ? styles.timeBtnSelected : {}),
                }}
                onClick={() => onTimeChange(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  calendar: {
    padding: '1rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  navBtn: {
    background: 'var(--glass-bg-strong)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    color: 'var(--text)',
    width: '32px',
    height: '32px',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  monthLabel: {
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  },
  dayName: {
    textAlign: 'center',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    padding: '4px 0',
    fontWeight: '600',
  },
  dayCell: {
    textAlign: 'center',
    padding: '6px 0',
    fontSize: '0.85rem',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: 'var(--text)',
    cursor: 'pointer',
  },
  dayCellSelected: {
    backgroundColor: '#22c55e',
    color: '#000',
    fontWeight: '700',
  },
  dayCellToday: {
    border: '1px solid #22c55e',
    color: '#22c55e',
    fontWeight: '600',
  },
  dayCellDisabled: {
    color: 'var(--text-muted)',
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  timesWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  timesTitle: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  timesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '0.5rem',
  },
  timeBtn: {
    padding: '0.5rem',
    borderRadius: '8px',
    border: '1px solid var(--glass-border)',
    background: 'var(--glass-bg)',
    color: 'var(--text)',
    fontSize: '0.8rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  timeBtnSelected: {
    backgroundColor: '#22c55e',
    color: '#000',
    borderColor: '#22c55e',
    fontWeight: '700',
  },
};