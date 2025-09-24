import Footer from "./HomeFooter";
import HomeHeader from "./HomeHeader";
import './HomePage.css';

function HomePage() {
  return (
    <div>
      <HomeHeader />
      <div className="HomeContent">
        <h1>Dedicados à sua saúde, guiados pela compaixão e comprometidos com a excelência no cuidado.</h1>
        <p>Em nosso hospital, acreditamos que todo paciente merece mais do que tratamento — merece compreensão, respeito e cuidado genuíno. Com tecnologia avançada, profissionais capacitados e uma abordagem compassiva, estamos aqui para apoiar você e sua família em todas as fases da vida.</p>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;