

const Header = () => {
  return (
    <header className="p-4 bg-black bg-opacity-50 text-white fixed w-full z-10">
      <nav className="flex justify-center space-x-4">
        <a href="#home" className="m-4">Home</a>
        <a href="#about-me" className="m-4">About Me</a>
        <a href="#projects" className="m-4">Projects</a>
        <a href="#contact" className="m-4">Contact</a>
        <a href="#resume" className="m-4">CV/Resume</a>
      </nav>
    </header>
  );
};

export default Header;

