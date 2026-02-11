import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Projects from '@/components/Projects'
import Reviews from '@/components/Reviews'
import Resume from '@/components/Resume'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#0a0e27' }}>
      <Hero />
      <About />
      <Services />
      <Projects />
      <Reviews />
      <Resume />
      <Contact />
    </div>
  )
}
