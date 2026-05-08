import Link from "next/link";
import { ArrowRight, Users, Award, Globe, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-bold text-gradient">RomeoVille</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-sm font-medium text-foreground">About</Link>
              <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground">Contact</Link>
              <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">Login</Link>
              <Link href="/auth/signup" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            About <span className="text-gradient">RomeoVille</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10">
            Building the future of enterprise land and client management in Africa
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="card-premium p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="text-3xl font-bold">500+</p>
            <p className="text-muted-foreground">Happy Clients</p>
          </div>
          <div className="card-premium p-6 text-center">
            <Globe className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="text-3xl font-bold">50+</p>
            <p className="text-muted-foreground">Locations</p>
          </div>
          <div className="card-premium p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="text-3xl font-bold">200%</p>
            <p className="text-muted-foreground">Growth</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
          <div className="card-premium p-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              RomeoVille Document Master was founded with a singular vision: to transform how real estate companies, land administrators, and property developers manage their client relationships, land portfolios, and legal documentation.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              We believe that premium technology should be accessible to every enterprise, regardless of size. Our platform combines powerful automation, beautiful analytics, and enterprise-grade security to help you focus on what matters most—growing your business.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join hundreds of enterprises already using RomeoVille
          </p>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all">
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t dark:border-slate-700 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          © 2026 RomeoVille Document Master. All rights reserved.
        </div>
      </footer>
    </div>
  );
}