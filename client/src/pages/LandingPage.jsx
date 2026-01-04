import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Flame, Utensils, BarChart3, Github, Linkedin, Mail } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <div className="bg-dark-bg text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-dark-bg/80 border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-neon-green" />
            <span className="text-xl font-oswald font-bold text-white">IronPath</span>
          </div>
          <button
            onClick={() => navigate('/auth')}
            className="bg-neon-green text-black font-semibold px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 bg-neon-green/10 border border-neon-green/50 rounded-full px-4 py-2 text-sm text-neon-green">
              <Flame className="w-4 h-4" />
              For Serious Athletes
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-oswald font-bold mb-6 leading-tight"
          >
            Build Your <span className="text-neon-green">Dream Physique</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            Premium workout programs and nutrition planning designed for bodybuilders and gym enthusiasts. Intelligent splits, personalized nutrition, and real-time progress tracking.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <button
              onClick={() => navigate('/auth?mode=signup')}
              className="flex items-center gap-2 bg-neon-green text-black font-semibold px-8 py-3 rounded-lg hover:bg-opacity-90 transition text-lg"
            >
              Start Transformation
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('features')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="flex items-center gap-2 border border-neon-green text-neon-green font-semibold px-8 py-3 rounded-lg hover:bg-neon-green/10 transition text-lg"
            >
              Learn More
            </button>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 max-w-xl mx-auto"
          >
            <div className="glass p-4 rounded-lg">
              <p className="text-2xl font-oswald font-bold text-neon-green">500+</p>
              <p className="text-xs text-gray-400 mt-1">Athletes</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <p className="text-2xl font-oswald font-bold text-electric-blue">50+</p>
              <p className="text-xs text-gray-400 mt-1">Programs</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <p className="text-2xl font-oswald font-bold text-neon-green">4.9★</p>
              <p className="text-xs text-gray-400 mt-1">Rating</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 bg-gradient-to-b from-dark-bg to-dark-bg/50"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-oswald font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Advanced tools and science-backed programs for serious fitness enthusiasts
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Smart Splits Feature */}
            <motion.div variants={itemVariants} className="glass p-8 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-neon-green/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="text-2xl font-oswald font-bold">Smart Splits</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                Access scientifically designed workout programs including Bro Split, Push/Pull/Legs, Full Body, and more. Each program is customizable based on your experience level and available training days.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-neon-green rounded-full"></span>
                  Adaptive programming
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-neon-green rounded-full"></span>
                  Exercise library with form videos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-neon-green rounded-full"></span>
                  Progressive overload tracking
                </li>
              </ul>
            </motion.div>

            {/* Budget Diet Feature */}
            <motion.div variants={itemVariants} className="glass p-8 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-electric-blue/20 rounded-lg flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-electric-blue" />
                </div>
                <h3 className="text-2xl font-oswald font-bold">Budget Diets</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                Personalized nutrition plans calculated from your BMR and TDEE. Choose between supplement-heavy (premium) or budget-friendly options without compromising results.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-electric-blue rounded-full"></span>
                  Macro calculators (Carbs, Protein, Fats)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-electric-blue rounded-full"></span>
                  Budget vs Supplement diet toggle
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-electric-blue rounded-full"></span>
                  Meal recommendations & tracking
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Developer Bio Section */}
      <section className="py-20 px-4 bg-dark-bg">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass p-12 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Developer Info */}
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Avatar Placeholder */}
              <motion.div
                className="w-48 h-48 bg-gradient-to-br from-neon-green/20 to-electric-blue/20 rounded-xl flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <img 
        src="/developer.png" 
        className="w-full h-full object-cover" // Forces image to fill the w-48 h-48 box
        alt="Developer Profile" 
      />
                  
                </div>
                
              </motion.div>

              {/* Bio Content */}
              <div className="flex-1">
                <h3 className="text-3xl font-oswald font-bold mb-2">About the Developer</h3>
                <p className="text-neon-green text-sm font-semibold mb-4">Abdul Rehman Munir</p>
                <p className="text-gray-400 leading-relaxed mb-6">
                  IronPath was born from a passion for both fitness and technology. As a computer science student and dedicated bodybuilder, I recognized the gap between generic fitness apps and what serious athletes actually need.
                </p>
                <p className="text-gray-400 leading-relaxed mb-6">
                  This platform combines personalized nutrition science, intelligent workout programming, and beautiful design to create the ultimate tool for bodybuilders and gym enthusiasts. Every feature is built with real athlete feedback and scientific principles.
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                  <motion.a
                    href="https://github.com/imabdulrehmanmunir/"
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-neon-green/10 border border-neon-green/50 rounded-lg flex items-center justify-center text-neon-green hover:bg-neon-green/20 transition"
                  >
                    <Github className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/abdulrehman-munir-4a7a47320"
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-electric-blue/10 border border-electric-blue/50 rounded-lg flex items-center justify-center text-electric-blue hover:bg-electric-blue/20 transition"
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=imabdulrehmanmuneer@gmail.com"
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-gray-600/20 border border-gray-600/50 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-600/30 transition"
                  >
                    <Mail className="w-5 h-5" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-dark-bg to-dark-card">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-oswald font-bold mb-6">
            Ready to <span className="text-neon-green">Transform</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join hundreds of athletes building their dream physique with science-backed programs and real results.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth?mode=signup')}
            className="inline-flex items-center gap-2 bg-neon-green text-black font-semibold px-10 py-4 rounded-lg hover:bg-opacity-90 transition text-lg"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-neon-green" />
                <span className="font-oswald font-bold">IronPath</span>
              </div>
              <p className="text-gray-500 text-sm">
                Premium fitness platform for serious athletes
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-neon-green transition">Features</a></li>
                <li><a href="#" className="hover:text-neon-green transition">Pricing</a></li>
                <li><a href="#" className="hover:text-neon-green transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-neon-green transition">About</a></li>
                <li><a href="#" className="hover:text-neon-green transition">Contact</a></li>
                <li><a href="#" className="hover:text-neon-green transition">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-neon-green transition">Terms</a></li>
                <li><a href="#" className="hover:text-neon-green transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-neon-green transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dark-border pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 IronPath. All rights reserved. Built with passion for athletes.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
