import '@/styles/abmc.css';
import '@/styles/audicion.css';

import BackButton from '../../common/BackButton';

const AudicionAgregar = ({title="Agregar Audición"}) => {
  return (
    <main className='audicion-page'>
        <div className="abmc-card">
        <header className="abmc-header">
            <BackButton />
            <h1>{title}</h1>
        </header>
            
        </div>
    </main>
    
    );
}
export default AudicionAgregar;