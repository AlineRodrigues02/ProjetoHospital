import './HomeHeader.css';
import { Link } from 'react-router-dom';

function HomeHeader() {
  return (
    <header>
      <div className='TopHeader'>
        <div className='LogoSection'>
          <img src='hcs-logo.png' alt='Healthcare Systems Logo' />
        </div>
        <ul>
          <li>Pesquisa</li>
          <li>Educação & Treinamento</li>
          <li>Contato</li>
          <li>Ajuda</li>
          <div className='SearchSection'>
            <form>
              <input type="text" placeholder="Pesquisar..." />
              <button type="submit">Buscar</button>
            </form>
          </div>
          <div className='PortalSection'>
            <Link to="/atendente/login" className='PortalButton'>
              Portal
            </Link>
          </div>
        </ul>
      </div>
      <nav>
        <ul className='NavLinks'>
          <li><Link to="/">Agendar Consulta</Link></li>
          <li><Link to="/about">Sobre Câncer & Tratamento</Link></li>
          <li><Link to="/services">Serviços</Link></li>
          <li><Link to="/donate">Doar Agora</Link></li>
        </ul>
      </nav>
      <div className='HeaderLine'></div>
    </header>
  );
}

export default HomeHeader;