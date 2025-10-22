import Hero from "../components/homePage/Hero";
import InfoCards from "../components/homePage/InfoCards";
import { steps } from "../components/homePage/InfoCards";

function HomePage() {
  return (
    <div className="">
      <Hero />
      <InfoCards steps={steps} />
    </div>
  );
}

export default HomePage;
