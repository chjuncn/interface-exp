'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Search, Copy, Eye, Star, Clock, Users, Activity, BarChart3, Users as UsersIcon, Zap, Bot } from 'lucide-react'
import FloatingAIAssistant from './FloatingAIAssistant'

interface Project {
  id: string
  name: string
  type: 'bubble-sort' | 'dashboard' | 'tumor-board' | null
  userInput: string
  context: string[]
  createdAt: Date
  isActive: boolean
  description?: string
  tags?: string[]
  author?: string
  rating?: number
  usageCount?: number
  preview?: string
}

interface EnhancedInputBoxProps {
  projects: Project[]
  onStartBuilding: (input: string) => void
  onCloneProject: (project: Project) => void
  onPreviewProject: (project: Project) => void
  onBrowseAllProjects?: () => void
  onOpenAssistant?: () => void
  onMothersDayCard?: () => void
}

export default function EnhancedInputBox({ projects, onStartBuilding, onCloneProject, onPreviewProject, onBrowseAllProjects, onOpenAssistant, onMothersDayCard }: EnhancedInputBoxProps) {
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setHasSubmitted(true)
    }
  }

  const handleCreateNew = () => {
    onStartBuilding(input.trim())
  }



  // Find similar projects based on user input
  const similarProjects = useMemo(() => {
    if (!input.trim()) return []
    
    const lowerInput = input.toLowerCase()
    const inputWords = lowerInput.split(' ')
    
    return projects
      .map(project => {
        let score = 0
        
        // Check project name
        if (project.name.toLowerCase().includes(lowerInput)) score += 10
        if (project.description?.toLowerCase().includes(lowerInput)) score += 8
        
        // Check context and tags
        project.context.forEach(ctx => {
          if (inputWords.some(word => ctx.toLowerCase().includes(word))) score += 5
        })
        
        project.tags?.forEach(tag => {
          if (inputWords.some(word => tag.toLowerCase().includes(word))) score += 3
        })
        
        // Check project type keywords
        if (project.type === 'bubble-sort' && (lowerInput.includes('sort') || lowerInput.includes('algorithm'))) score += 6
        if (project.type === 'dashboard' && (lowerInput.includes('dashboard') || lowerInput.includes('analytics'))) score += 6
        if (project.type === 'tumor-board' && (lowerInput.includes('medical') || lowerInput.includes('tumor'))) score += 6
        
        return { project, score }
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.project)
  }, [input, projects])

  const getProjectIcon = (project: Project) => {
    switch (project.type) {
      case 'bubble-sort':
        return <Activity className="w-4 h-4" />
      case 'dashboard':
        return <BarChart3 className="w-4 h-4" />
      case 'tumor-board':
        return <UsersIcon className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
    }
  }

  const getProjectColor = (project: Project) => {
    switch (project.type) {
      case 'bubble-sort':
        return 'bg-blue-100 text-blue-700'
      case 'dashboard':
        return 'bg-green-100 text-green-700'
      case 'tumor-board':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!hasSubmitted ? (
          // Original Input Interface - Centered
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-5xl font-bold text-gradient mb-4 relative">
                {/* LEGO-style "Create" animation */}
                <div className="inline-block relative">
                  {['C', 'r', 'e', 'a', 't', 'e'].map((letter, index) => (
                    <motion.span
                      key={index}
                      initial={{ 
                        opacity: 0, 
                        y: -50, 
                        rotateX: 90,
                        scale: 0.5
                      }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        rotateX: 0,
                        scale: 1
                      }}
                      transition={{ 
                        duration: 0.6,
                        delay: index * 0.2,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      className="inline-block relative"
                      style={{
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <motion.span
                        animate={{
                          y: [0, -3, 0],
                          rotateY: [0, 5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                          ease: "easeInOut"
                        }}
                        className="inline-block text-blue-600"
                        style={{
                          textShadow: '2px 2px 0px rgba(0,0,0,0.1)',
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                        }}
                      >
                        {letter}
                      </motion.span>
                      {/* LEGO studs on top */}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full opacity-60"></div>
                      <div className="absolute -top-1 left-1/4 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full opacity-60"></div>
                      <div className="absolute -top-1 right-1/4 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full opacity-60"></div>
                    </motion.span>
                  ))}
                </div>
                
                <span className="inline-block mx-2">in your way,</span>
                
                {/* Modern "Live" with style transitions */}
                <div className="inline-block relative">
                  {['L', 'i', 'v', 'e'].map((letter, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 0.5,
                        delay: 1.5 + index * 0.15,
                        type: "spring",
                        stiffness: 300
                      }}
                      className="inline-block"
                    >
                      <motion.span
                        animate={{
                          y: [0, -3, 0],
                          rotateY: [0, 5, 0],
                          fontFamily: [
                            'system-ui, sans-serif',
                            'Georgia, serif',
                            'Courier New, monospace',
                            'system-ui, sans-serif'
                          ],
                          fontWeight: [700, 400, 700, 700],
                          color: ['#10B981', '#059669', '#047857', '#10B981']
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.3
                        }}
                        className="inline-block"
                      >
                        {letter}
                      </motion.span>
                    </motion.span>
                  ))}
                </div>
                
                <span className="inline-block ml-2">in your way</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Describe what you want to create, and we'll guide you with intelligent suggestions
              </p>
            </motion.div>

            {/* Input Form */}
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onSubmit={handleSubmit}
              className="relative"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: isFocused ? 1.02 : 1,
                    boxShadow: isFocused 
                      ? "0 20px 40px -10px rgba(14, 165, 233, 0.15)" 
                      : "0 10px 40px -10px rgba(0, 0, 0, 0.1)"
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="e.g., A fantastic tumor board template, A great e-commerce analytics dashboard..."
                    className="w-full px-8 py-6 text-lg bg-white rounded-2xl border-2 border-gray-200 input-focus outline-none transition-all duration-300"
                    style={{ minHeight: '80px' }}
                  />
                  
                  {/* Decorative elements */}
                  <motion.div
                    animate={{ rotate: isFocused ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400"
                  >
                    <Sparkles size={24} />
                  </motion.div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ArrowRight size={20} />
                </motion.button>
              </div>

              {/* Helper text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-4 text-sm text-gray-500"
              >
                Press Enter or click the arrow to start building
              </motion.p>
            </motion.form>

            {/* Example suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-12 space-y-6"
            >
              <div>
                <p className="text-sm text-gray-500 mb-4">Try these examples:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    "Tumor board template",
                    "E-commerce analytics",
                    "Bubble sort animation",
                    "Restaurant profitability",
                    "Sales pipeline",
                    "Job search checklist",
                    "Mother's Day card"
                  ].map((example, index) => (
                    <motion.button
                      key={example}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setInput(example)
                      }}
                      className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-gray-600 hover:bg-white/80 transition-all duration-200 border border-gray-200"
                      style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                    >
                      {example}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Browse All Projects Button */}
              {onBrowseAllProjects && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="text-center"
                >
                  <button
                    onClick={onBrowseAllProjects}
                    className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-lg transition-all duration-200"
                  >
                    <Search className="w-4 h-4" />
                    Browse all projects
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          // Results Interface - Full height, scrollable
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8 py-8"
          >


            {/* Create New Project Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center relative"
            >
              {/* Floating AI Assistant */}
              {onOpenAssistant && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="fixed top-6 right-6 z-50"
                >
                  <FloatingAIAssistant 
                    userInput={input}
                    context={[]}
                    onClose={() => {}}
                  />
                </motion.div>
              )}
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Create a New Project</h2>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 max-w-2xl mx-auto">
                <p className="text-gray-600 mb-4">"{input}"</p>
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Building
                </button>
              </div>
            </motion.div>

            {/* Similar Projects Section */}
            {similarProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Similar Existing Projects</h3>
                  <p className="text-gray-600">You might want to check these out or use them as inspiration</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getProjectColor(project)}`}>
                            {getProjectIcon(project)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{project.name}</h4>
                            <p className="text-sm text-gray-500">{project.author || 'Anonymous'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{project.rating || 4.5}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {project.description || project.userInput}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {project.usageCount || 0}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => onPreviewProject(project)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          Preview
                        </button>
                        <button
                          onClick={() => onCloneProject(project)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          Clone
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* No Similar Projects */}
            {similarProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center py-8"
              >
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No similar projects found</h3>
                <p className="text-gray-600">You're creating something unique! Go ahead and start building.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 