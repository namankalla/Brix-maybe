"use client";
 
import ColorBends from '@/components/ColorBends';
import { Footer } from '@/components/ui/footer';
import { Blocks, CreditCard, Webhook, CodeXml, Scale, Handshake } from 'lucide-react';
import { HeroScrollDemo } from '@/components/ui/hero-scroll-demo';

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-black text-white">
      <section id="hero" className="relative h-screen overflow-hidden">
        <ColorBends
          colors={["#c83232"]}
          rotation={40}
          autoRotate={10}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.1}
          transparent={false}
        />
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">AI App Builder</h1>
            <p className="mt-4 text-red-400 max-w-2xl mx-auto mb-8">
              Build AI-powered apps with a chat-first workflow.
            </p>
            <a 
              href="/sign-in"
              className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white transition-all duration-200 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <span className="relative z-10">Let's Start</span>
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </a>
          </div>
        </div>
      </section>

      <section id="section-2" className="min-h-screen bg-black">
        <HeroScrollDemo />
      </section>

      <section id="section-3" className="min-h-screen bg-black" />

      <footer className="bg-black">
        <Footer
          className="bg-black text-white"
          brand={{
            name: 'AI App Builder',
            description: 'Build AI-powered apps with a chat-first workflow.'
          }}
          socialLinks={[
            { name: 'Twitter', href: '#' },
            { name: 'GitHub', href: '#' },
            { name: 'Discord', href: '#' }
          ]}
          columns={[
            {
              title: 'Product',
              links: [
                { name: 'Features', Icon: Blocks, href: '#section-2' },
                { name: 'Pricing', Icon: CreditCard, href: '#' },
                { name: 'Integrations', Icon: Webhook, href: '#section-3' },
                { name: 'API Docs', Icon: CodeXml, href: '#' }
              ]
            },
            {
              title: 'Resources',
              links: [
                { name: 'Privacy', Icon: Scale, href: '#' },
                { name: 'Terms', Icon: Handshake, href: '#' }
              ]
            },
            {
              title: 'Pages',
              links: [
                { name: 'Home', Icon: Blocks, href: '/' },
                { name: 'Sign In', Icon: Handshake, href: '/sign-in' }
              ]
            }
          ]}
          copyright={`AI App Builder © ${new Date().getFullYear()}`}
        />
      </footer>
    </main>
  );
}


