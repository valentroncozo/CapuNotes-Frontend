import CalendarIcon from '@/assets/CalendarIcon';
import '@/styles/day-title.css';

const DayTitle = ({ title = 'xxxx 00/00' }) => {
    return (
        <div className="title-day">
            <CalendarIcon className="calendar-icon" />
            <span>{title}</span>
        </div>
    );
};

export default DayTitle;

