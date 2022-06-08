import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutUs from "./views/AboutUs";
import RoadMap from "./views/RoadMap";
import WhoAreWe from "./views/WhoAreWe";
import "./assets/styles/main.css";

const App = () => {
  return (
    <>
    <Header />
    <main>
      <AboutUs />
      <RoadMap />
      <WhoAreWe />
    </main>
    <Footer />
    </>
  );
};

export default App;