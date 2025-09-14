import HomeHeader from "./HomeHeader";
import './HomePage.css';

function HomePage() {
  return (
    <div>
      <HomeHeader />
      <div className="HomeContent">
        <h1>Dedicated to your health, guided by compassion, and committed to excellence in care.</h1>
        <p>At our hospital, we believe that every patient deserves more than treatment — they deserve understanding, respect, and genuine care. With advanced technology, skilled professionals, and a compassionate approach, we are here to support you and your family at every stage of life.</p>
      </div>
    </div>
  );
}

export default HomePage;