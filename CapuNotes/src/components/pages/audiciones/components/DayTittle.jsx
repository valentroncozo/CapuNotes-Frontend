// src/components/pages/audiciones/components/DayTittle.jsx
import CalendarIcon from '@/assets/CalendarIcon.jsx';
import '@/styles/day-title.css';

export default function DayTitle({ title = 'xxxx 00/00' }) {
  return (
    <div className="title-day">
      <CalendarIcon className="calendar-icon" />
      <span>{title}</span>
    </div>
  );
}
