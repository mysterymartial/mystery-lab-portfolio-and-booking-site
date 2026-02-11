
const Resume = () => {
  return (
    <section id="resume" className="p-8 text-center text-white min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-4xl">CV/Resume</h1>
        <p className="mt-4">You can view or download my CV/Resume below:</p>
        <a href="/path/to/your-cv.pdf" className="mt-4 inline-block px-4 py-2 bg-black text-white rounded" download>
          Download CV/Resume
        </a>
      </div>
    </section>
  );
};

export default Resume;

