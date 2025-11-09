import { useState } from 'react';
import '@/styles/interative-def.css';

/* Componente interno para gestionar los botones y párrafos asociados */
const InteractiveDefs = () => {
    // activar primer item por defecto
    const [active, setActive] = useState(0);
    const items = [
        { id: 0, label: 'Ministerio de Música', text: 'Buscamos fomentar y alimentar el encuentro personal con Jesús en cada miembro a través de la espiritualidad, la oración, formaciones, retiros y convivencias. Ejecutamos temas inspirados por el Espíritu Santo para generar una participación activa de la asamblea.' },
        { id: 1, label: 'Coro Parroquial', text: 'Acompañamos a la comunidad en la Misa de los domingos a las 21hs. Ejecutamos temas preestablecidos, pero buscamos hacer partícipe a la comunidad desde las canciones. Contamos con áreas como instrumentos y cuerdas, salmistas, sonido, y una coordinación general que trabajan en la técnica y la constancia para el servicio.' },
        { id: 2, label: 'Grupo Músical', text: 'Hemos trascendido más allá de la comunidad y de la Misa de las 21hs. Somos reconocidos por fuera de nuestra comunidad. Conjugamos el testimonio de vida personal con la técnica vocal y musical, y a través de nuestras Redes Sociales buscamos seguir fomentando este alcance, saliendo más allá de las fronteras para "hacer discípulos por todas las naciones" (Mt. 28, 19-20).' },
    ];

    return (
        <div className="interactive-defs">
            <ul className='definicion'>
                {items.map((it) => (
                    <li key={it.id}>
                        <button
                            className={`toggle-btn ${active === it.id ? 'active' : ''}`}
                            onClick={() => setActive(active === it.id ? null : it.id)}
                            aria-expanded={active === it.id}
                            aria-controls={`def-${it.id}`}
                        >
                            {it.label}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="defs-contents">
                {items.map((it) => (
                    <p
                        id={`def-${it.id}`}
                        key={it.id}
                        className={`toggle-paragraph ${active === it.id ? 'active' : ''}`}
                    >
                        {it.text}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default InteractiveDefs;