'use client'

import { useState, useEffect, useRef } from 'react'
import { Moon, Sun, ChevronDown, Sparkles, Code, Heart, GraduationCap, DollarSign, Cpu, Briefcase, Leaf, Microscope, Music, Camera, Plane, Coffee, Fingerprint } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import * as ScrollArea from '@radix-ui/react-scroll-area'
import React from 'react'

type Theme = 'light' | 'dark'
type Domain = 'Tech' | 'Health' | 'Education' | 'Finance' | 'Business' | 'Environment' | 'Science' | 'Arts' | 'Media' | 'Travel' | 'Food' | 'Security' | null

interface Idea {
  name: string;
  concept: string;
  features: string;
}

const domainIcons = {
  Tech: Code,
  Health: Heart,
  Education: GraduationCap,
  Finance: DollarSign,
  Business: Briefcase,
  Environment: Leaf,
  Science: Microscope,
  Arts: Music,
  Media: Camera,
  Travel: Plane,
  Food: Coffee,
  Security: Fingerprint
}

export default function Component() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [domain, setDomain] = useState<Domain>(null)
  const [problem, setProblem] = useState<string>('')
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const generateIdeas = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain, description: problem }),
      })
      if (!response.ok) {
        throw new Error('Failed to generate ideas')
      }
      const data = await response.json()
      if (!data.ideas || !Array.isArray(data.ideas) || data.ideas.length === 0) {
        throw new Error('Invalid response format from API')
      }
      setIdeas(data.ideas)
    } catch (error) {
      console.error('Error generating ideas:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      setIdeas([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} font-sans`}>
      <header className="py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <Cpu className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-3xl font-bold text-white">
              Nexia Idea Generator
            </h1>
            <p className="text-sm text-blue-200">Turn Your Thoughts Into Reality</p>
          </div>
        </motion.div>
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full text-white hover:bg-white hover:bg-opacity-20">
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="max-w-xl mx-auto space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline"
              className="w-full justify-between text-lg py-6 rounded-xl border-2 hover:border-blue-500 transition-all duration-300 bg-blue-500 bg-opacity-10 backdrop-blur-sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {domain ? (
                <>
                  {domainIcons[domain] && React.createElement(domainIcons[domain], { className: "mr-2 h-5 w-5" })}
                  {domain}
                </>
              ) : (
                <>Select Your Domain or Field</>
              )}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-2 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                <ScrollArea.Root className="w-full h-64 overflow-hidden">
                  <ScrollArea.Viewport className="w-full h-full">
                    <div className="py-1">
                      {Object.entries(domainIcons).map(([item, Icon]) => (
                        <button
                          key={item}
                          className="w-full text-left px-4 py-3 text-lg text-white hover:bg-blue-600 flex items-center"
                          onClick={() => {
                            setDomain(item as Domain)
                            setIsDropdownOpen(false)
                          }}
                        >
                          <Icon className="mr-2 h-5 w-5" />
                          {item}
                        </button>
                      ))}
                    </div>
                  </ScrollArea.Viewport>
                  <ScrollArea.Scrollbar
                    className="flex select-none touch-none p-0.5 bg-gray-700 transition-colors duration-[160ms] ease-out hover:bg-gray-600 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                    orientation="vertical"
                  >
                    <ScrollArea.Thumb className="flex-1 bg-gray-500 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
                  </ScrollArea.Scrollbar>
                </ScrollArea.Root>
              </div>
            )}
          </div>

          <AnimatePresence>
            {domain && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  placeholder="Describe Your Problem or Purpose"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="text-lg py-6 rounded-xl border-2 focus:border-blue-500 transition-all duration-300 bg-blue-500 bg-opacity-10 backdrop-blur-sm placeholder-gray-400"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg py-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            onClick={generateIdeas}
            disabled={!domain || !problem || isLoading}
          >
            {isLoading ? 'Generating Ideas...' : 'Generate Ideas'}
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center"
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {ideas.map((idea, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                <CardContent className="p-6 flex flex-col gap-4 h-full backdrop-blur-sm bg-black bg-opacity-30">
                  <h3 className="text-xl font-bold">{idea.name}</h3>
                  <div className="flex-grow">
                    <h4 className="font-bold text-blue-200 mb-2">Concept:</h4>
                    <p className="text-sm">{idea.concept}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-200 mb-2">Features:</h4>
                    <p className="text-sm">{idea.features}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <footer className="py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-blue-300 bg-gray-800">
        © 2023 Nexia Idea Generator. All rights reserved.
      </footer>
    </div>
  )
}