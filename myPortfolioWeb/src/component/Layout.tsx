
import Header from './Header';
import Footer from './Footer';
import Home from  '../sessions/Home';
import AboutMe from '../sessions/AboutMe'; 
import Projects from '../sessions/Projects'; 
import Contact from '../sessions/Contact'; 
import Resume from '../sessions/Resume'; 
import background from '../assets/background.jpg';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover' }} >
      <Header />
      <main className="flex-grow">
        <Home />
        <AboutMe />
        <Projects />
        <Contact />
        <Resume />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

