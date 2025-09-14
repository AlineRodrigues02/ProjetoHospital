import './HomeHeader.css';
import { Link } from 'react-router-dom';

function HomeHeader() {
  return (
    <header>
      <div className='TopHeader'>
        <div className='LogoSection'><img src='hcs-logo.png' alt='Healthcare Systems Logo' ></img></div>
        <ul>
          <li>Research</li>
          <li>Education & Training</li>
          <li>Contact Us</li>
          <li>Help</li>
          <div className='SearchSection'>
            <li><input type="text" placeholder="Search..." /><button>Search</button></li>
          </div>
        </ul>
      </div>
      <nav>
        <ul className='NavLinks'>
          <li><Link to={"/"}>Make an appointment</Link></li>
          <li><Link to={"/about"}>Learn About Cancer & Treatment</Link></li>
          <li><Link to={"/services"}>Services</Link></li>
          <li><Link to={"/login"}>PatientPortal: HCS</Link></li>
          <li><Link to={"/donate"}>Donate Now</Link></li>
        </ul>
      </nav>
      <div className='HeaderLine'></div>
    </header>
  );
}

export default HomeHeader;