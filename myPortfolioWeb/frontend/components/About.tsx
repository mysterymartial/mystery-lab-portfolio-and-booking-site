'use client'

import Link from 'next/link'

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 bg-[#0a0e27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-vibrant to-cyan-500 mx-auto rounded-full mb-4"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start">
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Agbaosi Bolarinwa Minasu (Mystery)
            </h3>
            
            <div className="mb-6">
              <p className="text-xl text-primary-vibrant font-semibold mb-4">
                Fullstack Software Engineer & Embedded Systems Engineer
              </p>
              <p className="text-gray-300 text-lg mb-4">
                I am a seasoned <span className="text-primary-vibrant font-semibold">Fullstack Software Engineer</span> and 
                <span className="text-primary-vibrant font-semibold"> Embedded Systems Engineer</span> with extensive expertise 
                in <span className="text-primary-vibrant font-semibold">Cybersecurity</span>, <span className="text-primary-vibrant font-semibold">DevOps</span>, 
                <span className="text-primary-vibrant font-semibold">Fintech APIs</span>, <span className="text-primary-vibrant font-semibold">Blockchain & Web3</span>, 
                and <span className="text-primary-vibrant font-semibold">Machine Learning</span>. With strong <span className="text-primary-vibrant font-semibold">Design Thinking</span> and 
                <span className="text-primary-vibrant font-semibold">Critical Thinking</span> knowledge, and years of experience building 
                scalable applications and robust embedded systems, I bring a unique blend of technical depth and innovative problem-solving 
                to every project.
              </p>
            </div>

            <div className="mb-4 sm:mb-6">
              <p className="text-base sm:text-lg md:text-xl text-primary-vibrant font-semibold mb-3 sm:mb-4">
                Leadership & Innovation
              </p>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 leading-relaxed">
                As the <span className="text-primary-vibrant font-semibold">CEO of Mystery Lab</span> and 
                <span className="text-primary-vibrant font-semibold"> CTO of ALO LABS</span>, I lead teams in developing 
                cutting-edge technology solutions, from enterprise software and blockchain products to IoT devices and embedded systems. 
                My leadership philosophy centers on innovation, excellence, and delivering solutions that exceed expectations.
              </p>
            </div>

            <div className="mb-4 sm:mb-6">
              <p className="text-base sm:text-lg md:text-xl text-primary-vibrant font-semibold mb-3 sm:mb-4">
                Technical Expertise
              </p>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 leading-relaxed">
                My technical journey spans full-stack development, embedded systems design, cybersecurity implementations, 
                DevOps automation, and machine learning applications. I specialize in architecting secure, scalable systems 
                that power businesses and enhance user experiences across web, mobile, desktop, and IoT platforms.
              </p>
            </div>

            <div className="mb-4 sm:mb-6">
              <p className="text-base sm:text-lg md:text-xl text-primary-vibrant font-semibold mb-3 sm:mb-4">
                Beyond Technology: Music & Martial Arts
              </p>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 leading-relaxed">
                Beyond my technical pursuits, I am a passionate <span className="text-primary-vibrant font-semibold">professional musician</span> 
                specializing in saxophone performance, bringing artistry and creativity to live performances, studio recordings, 
                and special events. As a dedicated <span className="text-primary-vibrant font-semibold">martial artist</span>, 
                I have trained extensively in multiple disciplines including <span className="text-primary-vibrant font-semibold">Kickboxing</span>, 
                <span className="text-primary-vibrant font-semibold"> Taekwondo</span>, 
                <span className="text-primary-vibrant font-semibold"> Brazilian Jiu-Jitsu (BJJ)</span>, 
                <span className="text-primary-vibrant font-semibold"> Wrestling</span>, and various other combat disciplines. 
                These diverse passions reflect my commitment to continuous growth, discipline, mental fortitude, and excellence 
                in all aspects of life—principles that directly enhance my approach to technology and leadership.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
              <a
                href="/cv.pdf"
                download="AGBAOSI_BOLARINWA_MINASU_MYSTERY_CV.pdf"
                className="px-4 py-2 sm:px-6 sm:py-3 bg-primary-vibrant text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-blue-500 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download CV
              </a>
              <Link
                href="/booking"
                className="px-4 py-2 sm:px-6 sm:py-3 bg-green-600 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-green-500 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Chat with Me
              </Link>
              <Link
                href="/#resume"
                className="px-6 py-3 bg-slate-700/80 backdrop-blur-sm border-2 border-slate-500 text-white rounded-xl font-semibold hover:bg-slate-600 transition-all duration-200"
              >
                View Resume
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 shadow-sm">
              <h4 className="text-2xl font-bold text-white mb-6">Mystery Lab</h4>
              <p className="text-gray-300 mb-4">
                <span className="text-primary-vibrant font-semibold">Mystery Lab</span> is a dynamic innovation hub 
                that bridges technology, artistry, and physical excellence. As CEO, I lead a team dedicated to delivering 
                exceptional solutions across:
              </p>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-primary-vibrant mr-2 flex-shrink-0">✓</span>
                  <span>Full-stack software development and system architecture</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-vibrant mr-2">✓</span>
                  <span>Embedded systems and IoT device development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-vibrant mr-2">✓</span>
                  <span>Cybersecurity solutions and DevOps automation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-vibrant mr-2">✓</span>
                  <span>AI/ML applications and data science</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-vibrant mr-2">✓</span>
                  <span>Live music performances and studio recordings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-vibrant mr-2">✓</span>
                  <span>Martial arts training and self-defense classes</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-700/50 shadow-sm">
              <h4 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">ALO LABS</h4>
              <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
                As <span className="text-primary-vibrant font-semibold">Chief Technology Officer (CTO)</span> of 
                <span className="text-primary-vibrant font-semibold"> ALO LABS</span>, I lead the technological vision 
                and strategic development of innovative solutions. ALO LABS is a forward-thinking technology company 
                focused on cutting-edge research and development in software engineering, embedded systems, artificial intelligence, 
                and emerging technologies.
              </p>
              <p className="text-gray-300 mb-4">
                In this role, I architect scalable enterprise solutions, lead R&D initiatives, mentor engineering teams, 
                and ensure that ALO LABS remains at the forefront of technological advancement. My responsibilities include 
                technology strategy, product innovation, system architecture design, and driving the company's technical 
                roadmap to deliver transformative solutions to clients.
              </p>
              <p className="text-gray-300">
                The synergy between my roles at Mystery Lab and ALO LABS allows me to bridge innovation with practical 
                application, delivering solutions that combine research excellence with real-world impact.
              </p>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-2xl border border-primary-vibrant/40 shadow-sm">
              <h4 className="text-xl font-bold text-white mb-4">Professional Philosophy</h4>
              <p className="text-gray-200 italic mb-4">
                "Excellence is not a destination, but a continuous journey. Whether architecting complex systems, 
                writing elegant code, performing music, or practicing martial arts, I believe in pushing boundaries, 
                embracing challenges, and delivering solutions that exceed expectations."
              </p>
              <p className="text-gray-200 text-sm sm:text-base italic leading-relaxed">
                "My commitment is to give you more than you can imagine—combining technical expertise, creative 
                problem-solving, and unwavering dedication to excellence in every project, performance, and interaction."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
