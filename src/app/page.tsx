"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FadeIn, SlideIn, StaggeredList, StaggeredItem } from "@/components/ui/animated-card";

export default function HomePage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl bg-gradient-to-r from-cf-blue to-cf-purple bg-clip-text text-transparent">
              CodeForge
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/problems" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Problems
            </Link>
            <Link 
              href="/contests" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contests
            </Link>
            <Link 
              href="/compare" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Compare
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-24 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
              <div className="flex flex-col justify-center space-y-4">
                <FadeIn>
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                      <span className="bg-gradient-to-r from-cf-blue to-cf-purple bg-clip-text text-transparent">
                        Elevate
                      </span> your competitive programming
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Comprehensive analytics and personalized recommendations to enhance your Codeforces journey.
                    </p>
                  </div>
                </FadeIn>
                <SlideIn direction="up" delay={0.3}>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/dashboard"
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                      >
                        Get Started
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/about"
                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        Learn More
                      </Link>
                    </motion.div>
                  </div>
                </SlideIn>
              </div>
              <div className="flex items-center justify-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
                  className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px]"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cf-blue to-cf-purple opacity-20 blur-3xl animate-pulse-slow"></div>
                  <div className="relative h-full w-full rounded-xl glass-effect p-4 sm:p-6 animate-float">
                    <div className="h-full w-full rounded-lg bg-background/80 p-6 flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-medium">Performance Analysis</div>
                        <div className="text-xs text-muted-foreground">Last 6 months</div>
                      </div>
                      <div className="mt-4 h-48 w-full relative">
                        {/* Mock Chart with CSS */}
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: "20%" }}
                          transition={{ delay: 0.8, duration: 0.5 }}
                          className="absolute bottom-0 left-0 w-1/6 bg-cf-blue rounded-sm"
                        ></motion.div>
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: "40%" }}
                          transition={{ delay: 0.9, duration: 0.5 }}
                          className="absolute bottom-0 left-[calc(100%/6)] w-1/6 bg-cf-blue rounded-sm"
                        ></motion.div>
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: "60%" }}
                          transition={{ delay: 1.0, duration: 0.5 }}
                          className="absolute bottom-0 left-[calc(100%/3)] w-1/6 bg-cf-blue rounded-sm"
                        ></motion.div>
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: "80%" }}
                          transition={{ delay: 1.1, duration: 0.5 }}
                          className="absolute bottom-0 left-[calc(50%)] w-1/6 bg-cf-blue rounded-sm"
                        ></motion.div>
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: "60%" }}
                          transition={{ delay: 1.2, duration: 0.5 }}
                          className="absolute bottom-0 left-[calc(100%*2/3)] w-1/6 bg-cf-blue rounded-sm"
                        ></motion.div>
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: "80%" }}
                          transition={{ delay: 1.3, duration: 0.5 }}
                          className="absolute bottom-0 left-[calc(100%*5/6)] w-1/6 bg-cf-blue rounded-sm"
                        ></motion.div>
                      </div>
                      <div className="mt-6 grid grid-cols-3 gap-3">
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.4, duration: 0.3 }}
                          className="rounded-md bg-background p-2"
                        >
                          <div className="text-xs text-muted-foreground">Rating</div>
                          <div className="text-xl font-medium text-cf-blue">1850</div>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.5, duration: 0.3 }}
                          className="rounded-md bg-background p-2"
                        >
                          <div className="text-xs text-muted-foreground">Solved</div>
                          <div className="text-xl font-medium text-cf-green">432</div>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.6, duration: 0.3 }}
                          className="rounded-md bg-background p-2"
                        >
                          <div className="text-xs text-muted-foreground">Contests</div>
                          <div className="text-xl font-medium text-cf-purple">28</div>
                        </motion.div>
                      </div>
                      <div className="mt-6">
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.7, duration: 0.3 }}
                        >
                          <div className="text-sm font-medium">Recommended Practice</div>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <div className="rounded-md bg-background p-2 flex items-center">
                              <div className="h-2 w-2 rounded-full bg-cf-orange mr-2"></div>
                              <div className="text-xs">Dynamic Programming</div>
                            </div>
                            <div className="rounded-md bg-background p-2 flex items-center">
                              <div className="h-2 w-2 rounded-full bg-cf-red mr-2"></div>
                              <div className="text-xs">Graph Algorithms</div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-secondary/50 py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <FadeIn>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Key Features
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                    Everything you need to excel in competitive programming
                  </p>
                </div>
              </FadeIn>
            </div>
            <StaggeredList delay={0.3} staggerDelay={0.15} className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 md:grid-cols-3 md:gap-8">
              <StaggeredItem>
                <motion.div 
                  whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="flex flex-col h-full items-center space-y-4 rounded-xl p-6 glass-effect border"
                >
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                      <line x1="6" y1="6" x2="6.01" y2="6"></line>
                      <line x1="6" y1="18" x2="6.01" y2="18"></line>
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-bold">In-depth Analytics</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Visualize your performance with interactive charts and graphs to identify patterns in your problem-solving journey.
                  </p>
                  <ul className="text-sm text-left space-y-2 mt-2">
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                      <span>Solve rate tracking</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                      <span>Topic strength analysis</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                      <span>Rating progression</span>
                    </li>
                  </ul>
                </motion.div>
              </StaggeredItem>
              <StaggeredItem>
                <motion.div 
                  whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="flex flex-col h-full items-center space-y-4 rounded-xl p-6 glass-effect border"
                >
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-bold">Smart Recommendations</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    AI-powered problem suggestions that adapt to your skill level and focus on strengthening your weak areas.
                  </p>
                  <ul className="text-sm text-left space-y-2 mt-2">
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                      <span>Personalized practice plan</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                      <span>Difficulty progression</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                      <span>Topic diversity optimization</span>
                    </li>
                  </ul>
                </motion.div>
              </StaggeredItem>
              <StaggeredItem>
                <motion.div 
                  whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="flex flex-col h-full items-center space-y-4 rounded-xl p-6 glass-effect border"
                >
                  <motion.div 
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-bold">Friend Comparison</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Compare your progress with friends and top competitors to identify growth opportunities and stay motivated.
                  </p>
                  <ul className="text-sm text-left space-y-2 mt-2">
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
                      <span>Head-to-head statistics</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
                      <span>Common strengths/weaknesses</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
                      <span>Solve pattern analysis</span>
                    </li>
                  </ul>
                </motion.div>
              </StaggeredItem>
            </StaggeredList>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:justify-between md:py-8">
          <div className="flex flex-col gap-2">
            <div className="font-semibold">
              CodeForge
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced Codeforces analytics and recommendations
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>© 2024 CodeForge.</span>
              <Link href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link href="/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>
            </div>
            <div className="text-xs">
              Built with Next.js, Tailwind CSS, and Codeforces API
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 