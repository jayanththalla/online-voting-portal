'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Shield, BarChart, Globe, Check, Clock, User, Award } from 'lucide-react'
import { useState, useEffect } from 'react'
import Footer from './footer' // Adjust the path as needed
export default function Home() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [testimonialRef, testimonialInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  const [countdown, setCountdown] = useState({
    days: 30,
    hours: 12,
    minutes: 45,
    seconds: 0
  })
  
  // Simulated countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
  }

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
  }

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const testimonials = [
    {
      name: "Aisha Patel",
      role: "First-time Voter",
      image: "/images/testimonial1.png",
      content: "The verification process was quick and secure. I felt confident that my vote was properly counted."
    },
    {
      name: "Rajiv Kumar",
      role: "Election Commission Official",
      image: "/images/testimonial2.png",
      content: "This platform has revolutionized how we conduct elections, with better turnout and fewer irregularities."
    },
    {
      name: "Meena Singh",
      role: "Senior Citizen",
      image: "/images/testimonial3.png",
      content: "I never thought online voting could be so easy and accessible, even for someone my age."
    }
  ]

  const CountdownItem = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-2xl md:text-3xl font-bold text-white mb-2">
        {value}
      </div>
      <span className="text-white/80 text-sm">{label}</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-secondary">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('/images/vote-india.png')] bg-cover bg-center opacity-20" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 transform translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-white/5 rounded-tr-full" />
        
        <div className="container mx-auto px-4 z-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div 
              className="text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={fadeInLeft}
            >
              <div className="mb-4 inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Election Countdown
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
                Democracy at Your
                <span className="block text-white relative">
                  Fingertips
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent" viewBox="0 0 200 8" preserveAspectRatio="none">
                    <path d="M0,0 C50,5 100,5 200,0" stroke="currentColor" strokeWidth="3" fill="none" />
                  </svg>
                </span>
              </h1>
              <p className="mt-6 text-xl leading-8 text-white/80 max-w-2xl mx-auto lg:mx-0">
                Participate in the future of democracy with our secure, modern, and accessible online voting platform
              </p>
              
              {/* Countdown Timer */}
              <div className="mt-8 mb-10">
                <div className="flex justify-center lg:justify-start space-x-4">
                  <CountdownItem value={countdown.days.toString()} label="Days" />
                  <CountdownItem value={countdown.hours.toString()} label="Hours" />
                  <CountdownItem value={countdown.minutes.toString()} label="Minutes" />
                  <CountdownItem value={countdown.seconds.toString()} label="Seconds" />
                </div>
                <p className="mt-4 text-white/80 text-sm">Until voting closes</p>
              </div>
              
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/register">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-8 py-6 bg-white hover:bg-white/90 text-primary font-semibold shadow-lg transition-all duration-300"
                  >
                    Register as Voter
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/vote">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-white text-white 
                      bg-white/5 backdrop-blur-sm hover:bg-white hover:text-primary 
                      transition-all duration-300"
                  >
                    Cast Your Vote
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Shield className="h-4 w-4 mr-2 text-white" />
                  <span className="text-sm text-white">CERT-IN Certified</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Check className="h-4 w-4 mr-2 text-white" />
                  <span className="text-sm text-white">ISO 27001</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <User className="h-4 w-4 mr-2 text-white" />
                  <span className="text-sm text-white">1M+ Voters</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Illustration & Animated Elements */}
            <motion.div
              className="relative lg:block"
              initial="hidden"
              animate="visible"
              variants={fadeInRight}
            >
              <div className="relative">
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-accent/50 rounded-full blur-lg" />
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-secondary/50 rounded-full blur-xl" />
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-4 py-2 rounded-full text-sm font-medium">
                    Secure • Fast • Reliable
                  </div>
        <Image
                    src="/images/voting.png"
                    alt="Voting Illustration"
                    width={500}
                    height={500}
                    className="w-full h-auto"
                  />
                  
                  {/* Mock Interface Elements */}
                  <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <span className="ml-2 text-white font-medium">Identity Verified</span>
                      </div>
                      <div className="bg-green-400/20 text-green-400 px-2 py-1 rounded-full text-xs">Complete</div>
                    </div>
                    <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-accent rounded-full" />
                    </div>
                    <div className="mt-3 text-white/70 text-sm">Voting progress: 75% complete</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 320" 
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: '15vh', minHeight: '100px' }}
          >
            <path 
              fill="#ffffff"
              d="M0,288L80,266.7C160,245,320,203,480,197.3C640,192,800,224,960,229.3C1120,235,1280,213,1360,202.7L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            />
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div 
        ref={statsRef}
        className="py-16 bg-white"
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        variants={staggerChildren}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "99.9%", label: "Uptime", icon: <Clock className="h-6 w-6 text-primary mx-auto mb-2" /> },
              { value: "10M+", label: "Secure Transactions", icon: <Shield className="h-6 w-6 text-primary mx-auto mb-2" /> },
              { value: "100+", label: "Districts Covered", icon: <Globe className="h-6 w-6 text-primary mx-auto mb-2" /> },
              { value: "5s", label: "Average Verification Time", icon: <Check className="h-6 w-6 text-primary mx-auto mb-2" /> }
            ].map((stat, index) => (
              <motion.div key={index} variants={fadeInUp} className="p-4">
                {stat.icon}
                <h3 className="text-3xl md:text-4xl font-bold text-secondary">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Section with Images */}
      <motion.div 
        ref={ref}
        className="py-24 relative overflow-hidden bg-gray-50"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={staggerChildren}
      >
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24 rotate-180">
            <path fill="white" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,213.2,131.2,289.77,121.99,289.77,91.2,351.39,76.44Z" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" variants={fadeInUp}>
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              POWERFUL FEATURES
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-secondary">
              The Most Advanced Voting System
            </h2>
            <p className="text-lg text-muted-foreground">
              Built with cutting-edge technology to ensure security, transparency, and accessibility
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Military-Grade Security",
                description: "Multi-factor biometric verification with blockchain technology ensures tamper-proof voting records.",
                icon: <Shield className="h-10 w-10 text-white" />,
                color: "from-primary to-secondary",
                image: "/images/system.png"
              },
              {
                title: "Live Analytics Dashboard",
                description: "Real-time election insights with detailed breakdowns by demographics and regions.",
                icon: <BarChart className="h-10 w-10 text-white" />,
                color: "from-secondary to-accent",
                image: "/images/results.png"
              },
              {
                title: "Vote From Anywhere",
                description: "Native mobile apps and SMS backup ensure voting access for all citizens regardless of location.",
                icon: <Globe className="h-10 w-10 text-white" />,
                color: "from-accent to-primary",
                image: "/images/online-vote.png"
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="relative h-48 w-full overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
          <Image
                        src={feature.image} 
                        alt={feature.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 p-3 rounded-full bg-white/20 backdrop-blur-sm">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                      <div className="mt-4 flex items-center text-primary font-medium">
                        <span>Learn more</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* How It Works Section with Interactive Elements */}
      <motion.div 
        className="py-24 relative overflow-hidden bg-white"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={staggerChildren}
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" variants={fadeInUp}>
            <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
              SIMPLE PROCESS
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-secondary">
              Four Easy Steps
            </h2>
            <p className="text-lg text-muted-foreground">
              Our streamlined process makes voting accessible to everyone
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Register",
                description: "Create your account with your personal details and upload your identity documents.",
                color: "from-primary to-primary-600",
                icon: <User className="h-6 w-6 text-white" />
              },
              {
                step: "2",
                title: "Verify",
                description: "Complete biometric verification and receive your unique voter ID via SMS.",
                color: "from-secondary to-secondary-600",
                icon: <Shield className="h-6 w-6 text-white" />
              },
              {
                step: "3",
                title: "Vote",
                description: "Log in during the election period and cast your vote securely and privately.",
                color: "from-accent to-accent-600",
                icon: <Check className="h-6 w-6 text-white" />
              },
              {
                step: "4",
                title: "Track",
                description: "Receive your voting receipt and track election results in real-time.",
                color: "from-primary to-secondary",
                icon: <BarChart className="h-6 w-6 text-white" />
              }
            ].map((step, index) => (
              <motion.div key={index} variants={fadeInUp} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${step.color} text-white flex items-center justify-center shadow-lg relative group`}>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center text-sm font-bold text-primary">
                      {step.step}
                    </div>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mt-6 mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-10 left-1/2 w-full h-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30">
                    <div className="absolute top-1/2 left-full transform -translate-y-1/2 translate-x-1 w-3 h-3 rounded-full bg-accent animate-pulse" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <motion.div variants={fadeInUp} className="mt-16 relative">
            <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-primary/20 rounded-full blur-lg" />
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-accent/20 rounded-full blur-lg" />
            <div className="bg-gray-50 rounded-2xl shadow-xl p-6 md:p-10 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Interactive Demo</h3>
                  <p className="text-muted-foreground mb-6">
                    See how the platform works with our interactive demonstration. Experience the security features firsthand.
                  </p>
                  <Link href="/demo">
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      Try Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="relative w-full h-64">
          <Image
                    src="/images/candidates.png"
                    alt="Candidate Voting System"
                    fill
                    className="object-contain"
                  />
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white">
                    <Award className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div 
        ref={testimonialRef}
        className="py-24 relative overflow-hidden bg-gray-50"
        initial="hidden"
        animate={testimonialInView ? "visible" : "hidden"}
        variants={staggerChildren}
      >
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24 rotate-180">
            <path fill="white" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,213.2,131.2,289.77,121.99,289.77,91.2,351.39,76.44Z" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" variants={fadeInUp}>
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-secondary">
              What Voters Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Hear from citizens who have experienced our online voting platform
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">★</span>
                      ))}
                    </div>
                    <p className="text-muted-foreground italic mb-6">"{item.content}"</p>
                    <div className="flex items-center">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
          <Image
                          src={item.image} 
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
            <path fill="white" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,213.2,131.2,289.77,121.99,289.77,91.2,351.39,76.44Z" />
          </svg>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-32"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={staggerChildren}
      >
        {/* Wave Divider Top */}
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <svg 
            viewBox="0 0 1440 320" 
            className="w-full h-[12vh] md:h-[15vh] lg:h-[20vh]" 
            preserveAspectRatio="none"
          >
            <path 
              fill="white" 
              fillOpacity="1" 
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeInUp} className="mb-8">
              {/* <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mx-auto flex items-center justify-center">
                <Award className="h-10 w-10 text-white" />
              </div> */}
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-6 text-white"
              variants={fadeInUp}
            >
              Ready to Participate in Democracy?
            </motion.h2>
            
            <motion.p 
              className="text-xl mb-12 text-white/80 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Join millions of citizens who have already registered. Your vote matters 
              and makes a difference in shaping our future.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
              variants={fadeInUp}
            >
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-white hover:bg-white/90 text-primary font-semibold shadow-lg">
                  Register Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/learn-more">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-white  hover:bg-white/10 text-primary font-semibold shadow-lg">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg 
            viewBox="0 0 1440 320" 
            className="w-full h-[12vh] md:h-[15vh] lg:h-[20vh]" 
            preserveAspectRatio="none"
          >
            <path 
              fill="rgb(17 24 39)" 
              fillOpacity="1" 
              d="M0,128L48,154.7C96,181,192,235,288,234.7C384,235,480,181,576,181.3C672,181,768,235,864,250.7C960,267,1056,245,1152,229.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

