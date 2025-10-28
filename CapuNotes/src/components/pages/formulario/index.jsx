import '@/styles/abmc.css'
import BackButton from '../../common/BackButton.jsx';
import PreguntaTexto from './preguntas/preguntaTexto.jsx';
import PreguntaOpcion from './preguntas/preguntaOpcion.jsx';
import PreguntaMultiOpcion from './preguntas/preguntaMultiOpcion.jsx';
import { useEffect, useState } from 'react';


// FakeData
const preguntas = [
    {
            "id": 3,
            "valor": "Tocas Algún Instrumento",
            "tipo": "TEXTO",
            "obligatoria": true,
            "opciones": []
        },
        {
            "id": 11,
            "valor": "Seguías al CoroCapuchinos?",
            "tipo": "OPCION",
            "obligatoria": true,
            "opciones": [
                {
                    "id": 156,
                    "texto": "NO"
                },
                {
                    "id": 157,
                    "texto": "SI"
                }
            ]
        },
        {
            "id": 9,
            "valor": "Por donde te enteraste de la convocatoria? ",
            "tipo": "MULTIOPCION",
            "obligatoria": true,
            "opciones": [
                {
                    "id": 154,
                    "texto": "Instragram"
                },
                {
                    "id": 151,
                    "texto": "Anuncios Parroquiales"
                },
                {
                    "id": 152,
                    "texto": "Facebook"
                },
                {
                    "id": 153,
                    "texto": "Por un amigo"
                },
                {
                    "id": 155,
                    "texto": "-"
                }
            ]
        }
    ];


const Formulario = ({title = 'Inscripcion a Audiciones CoroCapuchino'}) => {

    const [respuestas, setRespuestas] = useState([]);

    const handleChange = (preguntaId, nuevoValor) => {
        setRespuestas((prevRespuestas) => {
            const existe = prevRespuestas.find(res => res.preguntaId === preguntaId);
            if (existe) {
                return prevRespuestas.map(res =>
                    res.preguntaId === preguntaId ? nuevoValor  : res
                );
            }
            return [...prevRespuestas, nuevoValor ];
        });

    };

    useEffect(() => {
        console.log('Respuestas actualizadas:', respuestas);
    }, [respuestas]);


    return (
        <main className="encuesta-container">
            <div className="abmc-card">
                <header className="abmc-header">
                    <BackButton />
                    <h1 className='abmc-title'>{title}</h1>
                </header>    

                <form className='cuestionario-formulario'>
                    {preguntas.map((pregunta, index) => (

                        (pregunta.tipo === 'TEXTO')  ? (
                        <PreguntaTexto
                            key={pregunta.id}
                            pregunta={pregunta}
                            index={index}
                            handleChange={handleChange}
                        />
                        ): (pregunta.tipo === 'OPCION') ? (
                            <PreguntaOpcion
                                key={pregunta.id}
                                pregunta={pregunta}
                                index={index}
                                respuestas={respuestas}
                                handleChange={handleChange}
                            /> 
                        ): (pregunta.tipo === 'MULTIOPCION') ? (
                            <PreguntaMultiOpcion
                                pregunta={pregunta}
                                key={pregunta.id}
                                index={index}
                                respuestas={respuestas}
                                handleChange={handleChange}
                            />
                        ) : null
                    ))}
                </form>

            </div>
        </main>
    );
};


export default Formulario;