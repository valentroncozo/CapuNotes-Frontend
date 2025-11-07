import '@/styles/landing.css';
import { Link } from 'react-router-dom';
import TopVarLanding from '@/assets/TopVarLanding';
import UbicacionIcon from '@/assets/UbicacionIcon';
import YouTubeIcon  from '@/assets/YoutubeIcon';
import SpotifyIcon from '@/assets/SpotifyIcon';
import FacebookIcon from '@/assets/FacebookIcon';
import { Instagram } from 'react-bootstrap-icons';

const LandingPage = () => {
    return (
        <main className="landing-page">
            <header className='landing-header'>
                <TopVarLanding id='topvar-clip'/>
                <nav>
                    <ul>
                        <li><img src="./public/logo-coro-sin-fondo.png" alt="Logo" className="logo"/></li>
                        <li><a to="#Quienes Somos">Quienes Somos</a></li>
                        <li><a to="#Actividades">Actividades</a></li>
                        <li><a to="#Unite">Unite</a></li>
                        <li><Link to="#contact">Login</Link></li>
                    </ul>
                    <hr className='dividir'/>
                </nav>

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
                            <a href="https://www.instagram.com/corocapuchinos/" title='Instagram'>
                                <Instagram style={{ color: 'var(--text-light)', width: 24, height: 24 }}/>
                            </a>
    
                        </div>
                    </div>

                    <div className="header-logo">
                        <img src="./public/logo capuchinos.png" alt="logo" className='logo'/>
                    </div>
                </div>

            </header>
        </main>
    );
};


export default LandingPage;