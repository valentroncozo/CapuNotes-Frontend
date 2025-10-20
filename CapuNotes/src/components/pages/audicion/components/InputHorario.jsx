import ClockIcon from "@/assets/ClockIcon";
import '@/styles/input-horario.css';

// Controlled input horario
// props: name, value (string HH:MM), onChange (fn(newValue))
const InputHorario = ({ name, value = '', onChange }) => {
    const handle = (e) => {
        if (typeof onChange === 'function') onChange(e.target.value);
    };

    return (
        <div className="input-horario">
            <label htmlFor={name}>{name}</label>

            <div className="input-with-icon">
                <ClockIcon className="clock-icon" />
                <input
                    type="time"
                    id={name}
                    name={name}
                    className='abmc-input'
                    required
                    value={value}
                    onChange={handle}
                />

            </div>
        </div>
    )
}
export default InputHorario;