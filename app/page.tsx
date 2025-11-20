import Header from "../components/Header"
import Hero from "../components/Hero"
import Services from "../components/Services"
import Feature from "../components/Feature"
import Pricing from "../components/Pricing"
import Testimonials from "../components/Testimonials"
import Contact from "../components/Contact"
import Footer from "../components/Footer"
import ScrollUp from "../components/ScrollUp"


const Home = () => {
  // window.scrollTo({
  //   top: 0,
  //   behavior: "smooth",
  // });
  return (
    <div>
      <>
        <div className="transition-all duration-300">
          <Header />
          <Hero />
          <Services />
          <Feature />
          <Pricing />
          <Testimonials />
          <Contact />
          <Footer />
          <ScrollUp />
        </div>
      </>
    </div>
  );
};

export default Home;
