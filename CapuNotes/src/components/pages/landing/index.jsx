import '@/styles/landing.css';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import InteractiveDefs from './InteractiveDefs';
import TopVarLanding from '@/assets/TopVarLanding';
import UbicacionIcon from '@/assets/UbicacionIcon';
import YouTubeIcon  from '@/assets/YoutubeIcon';
import SpotifyIcon from '@/assets/SpotifyIcon';
import FacebookIcon from '@/assets/FacebookIcon';
import { Instagram } from 'react-bootstrap-icons';
import ContainerPhoto from './ContainerPhto';
import CutActivityContainer from '@/assets/CutActivityContainer';
import { useNavigate } from 'react-router-dom';
import '@/styles/interative-def.css';

const LandingPage = () => {

    const navigate = useNavigate();
    // enable mouse wheel to scroll the photo container horizontally
    useEffect(() => {
        const el = document.querySelector('.container-photo-activities');
        if (!el) return;
        const onWheel = (e) => {
            // only handle vertical wheel to translate into horizontal scroll
            if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
            e.preventDefault();
            el.scrollLeft += e.deltaY;
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, []);
// smooth-scroll for internal anchors: scroll inside .landing-page container if present
    useEffect(() => {
        const onClick = (e) => {
            const a = e.target.closest && e.target.closest('a[href^="#"]');
            if (!a) return;
            const hash = a.getAttribute('href');
            if (!hash || hash === '#') return;
            const target = document.querySelector(hash);
            if (!target) return;
            // pick scroll container: .landing-page if it scrolls, otherwise document.scrollingElement
            const page = document.querySelector('.landing-page');
            const container = (page && page.scrollHeight > page.clientHeight) ? page : document.scrollingElement || document.documentElement;
            const containerRect = container.getBoundingClientRect ? container.getBoundingClientRect() : { top: 0 };
            const targetRect = target.getBoundingClientRect();
            const currentScroll = (container === document.scrollingElement || container === document.documentElement) ? window.scrollY : container.scrollTop;
            const offset = (targetRect.top - containerRect.top) + currentScroll;
            const sticky = document.querySelector('.site-nav') || document.querySelector('.landing-header nav');
            const navHeight = sticky ? sticky.getBoundingClientRect().height : 0;
            e.preventDefault();
            container.scrollTo({ top: Math.max(0, offset - navHeight - 8), behavior: 'smooth' });
        };
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, []);

    return (
        <main className="landing-page">
             <nav className="site-nav">
                <ul>
                    <li><img src="./public/logo-coro-sin-fondo.png" alt="Logo" className="logo"/></li>
                    <li><a href="#quienes-somos">Quienes Somos</a></li>
                    <li><a href="#Actividades">Actividades</a></li>
                    <li><a href="#Unite">Unite</a></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
             </nav>
            <header className='landing-header'>
                <TopVarLanding id='topvar-clip'/>

                <hr className='dividir'/>

                <div className="header-content">
                    <div className="header-text">
                        <h1>CoroCapuchinos</h1>
                        <div className='contactos'>
                            
                            <a href="https://maps.app.goo.gl/C9NKv8odtc4EMX3H9" title="Ubicación">
                                <UbicacionIcon width={24} height={24} style={{fill: 'transparent'}}/>
                            </a>
                            <a href="https://www.youtube.com/@corocapuchinos" title='Youtube'>
                                <YouTubeIcon style={{ color: 'var(--text-light)', width: 30, height: 30 }}/>    
                            </a>
                            <a href="https://open.spotify.com/intl-es/artist/56Yt1Z4IFBnwXIizaoMyXb?si=WPoK38QJQtaRsC3ujt1shA" title='Spotify'>
                            <SpotifyIcon style={{ color: 'var(--text-light)', width: 24, height: 24 }}/>
                            </a>
                            <a href="https://www.facebook.com/corouniversitario.capuchinos" title='Facebook'>
                            <FacebookIcon style={{ color: 'var(--text-light)', width: 24, height: 24 }}/>
                            </a>
                            <a href="https://www.instagram.com/corocapuchinos/" title='Instagram' className='instagram-link'>
                                <Instagram style={{ color: 'var(--text-light)', width: 24, height: 24 }}/>
                            </a>
    
                        </div>
                    </div>

                    <div className="header-logo">
                        <img src="./public/logo capuchinos.png" alt="logo" className='logo'/>
                    </div>
                </div>
            </header>

            <article className="landing-article">
                <section id="quienes-somos" className="section-line">
                    <h2><strong>¿Quienes Somos?</strong></h2>
                    <p>Somos el Coro Capuchinos, un grupo de personas que, habiendo tenido un encuentro personal con Jesucristo, respondemos al llamado de Dios a ejercer un Ministerio de Música y Canto en nuestra comunidad.
                    <br/>
                    <br/>
                       Nuestra misión principal es servir a la comunidad acompañándola en la oración a través de la música. Nos esforzamos por ser instrumentos de la Palabra de Dios, utilizando nuestro propio carisma.
                    <br/>
                    <br/>
                       Nos definimos como una combinación de:
                    </p>
                        {/* Botones interactivos: al hacer click muestran su párrafo asociado */}
                        <InteractiveDefs />
                </section>
                <hr className='dividir'/>
                <section id="Actividades" className="section-line">
                    <h2><strong>Actividades</strong></h2>
                    <p>El enfoque principal es servir a la comunidad cantando en la Misa de los domingos a las 21hs.
                    El crecimiento y la constancia de nuestra actividad se orientan a ser cada vez más un Ministerio de Música , sustentado en el encuentro personal con Jesús.
                    <br />
                    <br />
                    Se realiza un <strong>retiro anual</strong> para crecer en nuestra fe, madurar espiritualmente y seguir el camino de Dios comprendiendo los valores franciscanos (Información adicional). La preparación espiritual, que acompaña los ensayos, generalmente se orienta a este retiro. Este espacio permite fomentar/generar/contribuir al encuentro personal de cada miembro con Jesús.
                    <br />
                    <br />
                    Se realizan <strong>dos convivencias</strong> al año a través del área Alegranos , por medio de encuentros de otra índole. Estas dinámicas permiten fomentar y crecer la fraternidad entre hermanos  y fortalecer el encuentro con Jesús.
                    </p>

                </section>

                    <div className='container-photo-activities'>
                        <CutActivityContainer id='activity-cut'/>
                        <ContainerPhoto>
                            <img src="./public/Retiro2022.jpg" 
                            alt="Retiro2022" 
                            className='activity-photo'/>
                        </ContainerPhoto>
                        <ContainerPhoto>
                            <img src="./public/Retiro2022.jpg" 
                            alt="Retiro2022" 
                            className='activity-photo'/>
                        </ContainerPhoto>
                        
                        <ContainerPhoto>
                            <img src="./public/Retiro2023.jpg" 
                            alt="Retiro2023" 
                            className='activity-photo'/>
                        </ContainerPhoto>                        
                        <ContainerPhoto>
                            <img src="./public/Retiro2023.jpg" alt="Retiro2023" className='activity-photo'/>
                        </ContainerPhoto>
                                    <ContainerPhoto>
                            <img src="./public/Retiro2023.jpg" alt="Retiro2023" className='activity-photo'/>
                        </ContainerPhoto>
                        
                    </div>
                <hr className='dividir'/>
                <section id="Unite" className="section-line">
                    <h2><strong>Unite</strong></h2>
                    <p>
                        Nosotros, como ministerio de música, prestamos nuestro servicio en la Misa de los domingos a las 21.
                        Además, también cantamos en misas especiales, eventos solidarios, encuentros de coros y en otras comunidades que necesiten de nuestro servicio, agregando ensayos excepcionales en caso de ser necesario.
                        <br />
                        <br />
                        Nuestros ensayos son los días sábados (excepto los segundos fines de cada mes, que ensayamos un viernes) de 20:30 a 22:30 y los domingos una hora antes de la Misa (20h).
                        Es importante para nosotros la asistencia a los ensayos; ahí compartimos en fraternidad la música, nos preparamos para hacer crecer ese don que Dios puso en cada uno.
                        <br />
                        <br />
                        Si te animas a comprometerte con lo anterior, ¡¡completa los datos de inscripción!! 
                    </p>

                    <button 
                    className='button-inscribirse'
                    onClick={() => {navigate('/formulario')}}
                    >Inscribirme
                    </button>

                </section>

            </article>

        </main>
    );
};


export default LandingPage;

