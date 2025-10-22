import AvTimerIcon from '@/assets/AvTimerIcon';

// Controlled duration input
// props: name, value, onChange
const InputDuracionTurno = ({ name, value = '', onChange }) => {
    const handle = (e) => {
        if (typeof onChange === 'function') onChange(e.target.value);
    };

    return (
        <div className="input-horario">
            <label htmlFor={name}>{name}</label>

            <div className="input-with-icon">
                <AvTimerIcon className="clock-icon" />
                <input
                    type="text"
                    placeholder='Minutos'
                    id={name}
                    name={name}
                    className='abmc-input'
                    required
                    value={value}
                    onChange={handle}
                />

            </div>
        </div>
    );
};

export default InputDuracionTurno;