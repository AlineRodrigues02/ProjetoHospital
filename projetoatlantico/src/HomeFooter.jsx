import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <div className='FooterContent'>
        <div className='FooterBrand'>
          <img src='hcs-logo.png' alt='Healthcare Systems Logo' />
        </div>
        
        <div className='FooterNav'>
          <Link to="/">Início</Link>
          <Link to="/services">Serviços</Link>
          <Link to="/about">Sobre</Link>
          <Link to="/login">Portal</Link>
          <Link to="/contact">Contato</Link>
        </div>
        
        <div className='FooterCopy'>
          <p>&copy; 2024 Healthcare Systems</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;