'use client'

export default function Contact() {
  const contactLinks = {
    whatsapp: 'https://wa.me/2348159089791',
    phone: 'tel:+2348159089791',
    secretaryPhone: 'tel:+2348146796931',
    linkedin: 'https://www.linkedin.com/in/bolarinwa-agbaosi-692231318/',
    github: 'https://github.com/mysterymartial',
    tiktok: 'https://www.tiktok.com/@mysterymartialsax',
    instagram: 'https://www.instagram.com/mysterymartial_sax',
    twitter: 'https://x.com/Martialsax3',
    telegram: 'https://t.me/mysterymartialsax',
  }

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-24 bg-[#0a0e27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">Get In Touch</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-vibrant to-cyan-500 mx-auto rounded-full mb-4"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="text-primary-vibrant mr-4 flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Phone</p>
                  <a href={contactLinks.phone} className="text-gray-300 hover:text-primary-vibrant transition-colors">
                    08159089791
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-primary-vibrant mr-4 flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">WhatsApp</p>
                  <a href={contactLinks.whatsapp} className="text-gray-300 hover:text-primary-vibrant transition-colors">
                    08159089791
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-primary-vibrant mr-4 flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Secretary</p>
                  <a href={contactLinks.secretaryPhone} className="text-gray-300 hover:text-primary-vibrant transition-colors">
                    0814 679 6931
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold text-white mb-4">Follow Me</h4>
              <div className="flex flex-wrap gap-4">
                <a href={contactLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary-vibrant transition-colors text-sm sm:text-base">
                  LinkedIn
                </a>
                <a href={contactLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary-vibrant transition-colors text-sm sm:text-base">
                GitHub
              </a>
                <a href={contactLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary-vibrant transition-colors text-sm sm:text-base">
                TikTok
              </a>
                <a href={contactLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary-vibrant transition-colors text-sm sm:text-base">
                Instagram
              </a>
                <a href={contactLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary-vibrant transition-colors text-sm sm:text-base">
                X (Twitter)
              </a>
                <a href={contactLinks.telegram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary-vibrant transition-colors text-sm sm:text-base">
                  Telegram
                </a>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-slate-700/50 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Quick Actions</h3>
            <div className="space-y-3 sm:space-y-4">
              <a
                href="/booking"
                className="block w-full px-4 py-3 sm:px-6 sm:py-4 bg-primary-vibrant text-white rounded-xl text-center text-sm sm:text-base font-semibold hover:bg-blue-500 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat on Website
              </a>
              <a
                href="/booking"
                className="block w-full px-6 py-4 bg-primary-vibrant/90 text-white rounded-xl text-center font-semibold hover:bg-primary-vibrant transition-all duration-200"
              >
                Book a Gig
              </a>
              <a
                href={contactLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-4 bg-green-600 text-white rounded-xl text-center font-semibold hover:bg-green-500 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Chat on WhatsApp
              </a>
              <a
                href={contactLinks.phone}
                className="block w-full px-4 py-3 sm:px-6 sm:py-4 bg-slate-700/80 text-white rounded-xl text-center text-sm sm:text-base font-semibold hover:bg-slate-600 transition-all duration-200"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
