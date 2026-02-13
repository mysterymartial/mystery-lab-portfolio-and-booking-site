'use client'

export default function Resume() {
  // CV file path - exact filename from public folder
  const cvPath = '/AGBAOSI BOLARINWA MINASU MYSTERY CV.PDF'

  return (
    <section id="resume" className="py-16 sm:py-20 md:py-24 bg-[#0a0e27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Resume & CV</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-vibrant to-cyan-500 mx-auto rounded-full mb-4"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-700/50 mb-6 sm:mb-8 shadow-lg hover:border-primary-vibrant/30 transition-colors">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Professional Summary</h3>
            
            <div className="space-y-4 sm:space-y-5 md:space-y-6 text-gray-300">
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-primary-vibrant mb-2 sm:mb-3">Technical Expertise</h4>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                  As a <span className="text-white font-semibold">Fullstack Software Engineer</span> and 
                  <span className="text-white font-semibold"> Embedded Systems Engineer</span>, I bring extensive 
                  experience in building scalable web applications, mobile and desktop applications, robust embedded systems, 
                  and secure IoT solutions. A <span className="text-primary-vibrant font-semibold">Fintech expert</span> with 
                  deep knowledge of payment APIs and financial integrations, I also deliver <span className="text-primary-vibrant font-semibold">blockchain and Web3</span> products. 
                  My expertise spans <span className="text-primary-vibrant font-semibold">Cybersecurity</span>, 
                  <span className="text-primary-vibrant font-semibold"> DevOps</span>, and 
                  <span className="text-primary-vibrant font-semibold"> Machine Learning</span>, enabling end-to-end solutions that combine cutting-edge technology with practical business value.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-primary-vibrant mb-3">Leadership Roles</h4>
                <p className="text-lg leading-relaxed text-gray-300">
                  Currently serving as <span className="text-white font-semibold">CEO of Mystery Lab</span> and 
                  <span className="text-white font-semibold"> CTO of ALO LABS</span>, I lead cross-functional teams 
                  in developing innovative technology solutions. My leadership approach emphasizes technical excellence, 
                  strategic innovation, and delivering products that exceed client expectations. I've successfully 
                  architected and delivered numerous projects ranging from enterprise software to embedded systems 
                  and AI-powered applications.
                </p>
              </div>

              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-primary-vibrant mb-2 sm:mb-3">Technical Skills</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                  <div>
                    <p className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Full-Stack Development:</p>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base">React, Next.js, Node.js, TypeScript, Python, Java, Golang, Flutter, RESTful APIs, Microservices, Fintech APIs</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Blockchain & Web3:</p>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base">Move, Solidity, Rust, Solana, Sui, ETH, Smart Contracts, DApps, Web3 Integration</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Embedded Systems:</p>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base">C/C++, ARM Cortex, IoT Devices, Firmware Development, Hardware Integration</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Cybersecurity:</p>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base">Security Architecture, Penetration Testing, Secure Coding Practices, Encryption</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">DevOps & Cloud:</p>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base">Docker, Kubernetes, CI/CD, AWS, Azure, Infrastructure as Code</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Machine Learning:</p>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base">TensorFlow, PyTorch, Data Science, Neural Networks, Model Deployment</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Other Skills:</p>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base">System Architecture, Database Design, API Development, Agile Methodologies</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-primary-vibrant mb-2 sm:mb-3">Beyond Technology</h4>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                  My diverse background extends beyond technology. As a <span className="text-white font-semibold">professional musician</span>, 
                  I specialize in saxophone performance, bringing creativity and artistry to live performances and studio recordings. 
                  As a <span className="text-white font-semibold">martial artist</span>, I've trained extensively in 
                  <span className="text-primary-vibrant font-semibold"> Kickboxing</span>, 
                  <span className="text-primary-vibrant font-semibold"> Taekwondo</span>, 
                  <span className="text-primary-vibrant font-semibold"> Brazilian Jiu-Jitsu (BJJ)</span>, 
                  <span className="text-primary-vibrant font-semibold"> Wrestling</span>, and other combat disciplines. 
                  These pursuits reflect my commitment to discipline, continuous improvement, and excellence in all endeavors.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={cvPath}
              download="AGBAOSI BOLARINWA MINASU MYSTERY CV.PDF"
              className="px-8 py-4 bg-primary-vibrant text-white rounded-xl text-lg font-semibold hover:bg-blue-500 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CV (PDF)
            </a>
            <a
              href={cvPath}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white/5 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl text-sm sm:text-base md:text-lg font-semibold hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View CV Online
            </a>
            <a
              href="/booking"
              className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-green-600 text-white rounded-xl text-sm sm:text-base md:text-lg font-semibold hover:bg-green-500 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chat with Me
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
