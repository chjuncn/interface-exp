'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InputBox from '@/components/InputBox'
import FloatingAIAssistant from '@/components/FloatingAIAssistant'
import SmartSuggestions from '@/components/SmartSuggestions'
import Canvas from '@/components/Canvas'

interface Project {
  id: string
  name: string
  type: 'bubble-sort' | 'dashboard' | null
  userInput: string
  context: string[]
  createdAt: Date
  isActive: boolean
}

export default function Home() {
  const [isStarted, setIsStarted] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false)

  const handleStartBuilding = (input: string) => {
    const detectedContext = analyzeIntent(input)
    const projectType = determineProjectType(input)
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: generateProjectName(input, projectType),
      type: projectType,
      userInput: input,
      context: detectedContext,
      createdAt: new Date(),
      isActive: true
    }
    
    // Deactivate current project if exists
    setProjects(prev => prev.map(p => ({ ...p, isActive: false })))
    
    // Add new project and set as active
    setProjects(prev => [...prev, newProject])
    setCurrentProjectId(newProject.id)
    setIsStarted(true)
  }

  const handleCreateNewProject = (input: string) => {
    setIsCreatingNewProject(true)
    
    // Save current project state
    if (currentProjectId) {
      setProjects(prev => prev.map(p => 
        p.id === currentProjectId ? { ...p, isActive: false } : p
      ))
    }
    
    // Create new project
    const detectedContext = analyzeIntent(input)
    const projectType = determineProjectType(input)
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: generateProjectName(input, projectType),
      type: projectType,
      userInput: input,
      context: detectedContext,
      createdAt: new Date(),
      isActive: true
    }
    
    setProjects(prev => [...prev, newProject])
    setCurrentProjectId(newProject.id)
    
    // Show transition animation
    setTimeout(() => {
      setIsCreatingNewProject(false)
    }, 2000)
  }

  const generateProjectName = (input: string, type: 'bubble-sort' | 'dashboard' | null): string => {
    if (type === 'bubble-sort') {
      return 'Bubble Sort Animation'
    } else if (type === 'dashboard') {
      return 'Data Visualization Dashboard'
    }
    return 'New Project'
  }

  const analyzeIntent = (input: string): string[] => {
    const lowerInput = input.toLowerCase()
    const contexts: string[] = []

    // Medical/Healthcare context
    if (lowerInput.includes('tumor') || lowerInput.includes('medical') || lowerInput.includes('healthcare')) {
      contexts.push('medical', 'healthcare', 'clinical')
    }

    // E-commerce context
    if (lowerInput.includes('e-commerce') || lowerInput.includes('store') || lowerInput.includes('analytics') || lowerInput.includes('sales')) {
      contexts.push('ecommerce', 'analytics', 'business')
    }

    // Education context
    if (lowerInput.includes('class') || lowerInput.includes('course') || lowerInput.includes('graduation') || lowerInput.includes('credits')) {
      contexts.push('education', 'academic')
    }

    // Data/Technical context
    if (lowerInput.includes('data') || lowerInput.includes('scientific') || lowerInput.includes('integration') || lowerInput.includes('sort')) {
      contexts.push('data', 'technical', 'analytics')
    }

    // HR/Recruitment context
    if (lowerInput.includes('hiring') || lowerInput.includes('job') || lowerInput.includes('recruitment')) {
      contexts.push('hr', 'recruitment', 'business')
    }

    // Default context if none detected
    if (contexts.length === 0) {
      contexts.push('general', 'productivity')
    }

    return contexts
  }

  const determineProjectType = (input: string): 'bubble-sort' | 'dashboard' | null => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('bubble sort') || lowerInput.includes('sort animation') || lowerInput.includes('algorithm')) {
      return 'bubble-sort'
    } else if (lowerInput.includes('dashboard') || lowerInput.includes('chart') || lowerInput.includes('visualization') || 
               lowerInput.includes('data') || lowerInput.includes('analytics')) {
      return 'dashboard'
    }
    
    return null
  }

  const currentProject = projects.find(p => p.id === currentProjectId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!isStarted ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center justify-center min-h-[80vh]"
            >
              <InputBox onStartBuilding={handleStartBuilding} />
            </motion.div>
          ) : isCreatingNewProject ? (
            <motion.div
              key="transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[80vh]"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-6"
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Creating New Project</h2>
                <p className="text-gray-600">Saving current work and setting up your new project...</p>
              </div>
            </motion.div>
          ) : currentProject ? (
            <motion.div
              key="interface"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 gap-6 h-[90vh]"
            >
              {/* Project Header */}
              <div className="col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 shadow-sm border mb-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">{currentProject.name}</h1>
                      <p className="text-sm text-gray-600">
                        Created {currentProject.createdAt.toLocaleString()} • {currentProject.context.join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Main Canvas */}
              <div className="col-span-1">
                <Canvas 
                  userInput={currentProject.userInput} 
                  context={currentProject.context} 
                  onProjectTypeChange={(type) => {
                    setProjects(prev => prev.map(p => 
                      p.id === currentProjectId ? { ...p, type } : p
                    ))
                  }}
                />
              </div>

              {/* Smart Suggestions */}
              <div className="col-span-1">
                <SmartSuggestions 
                  context={currentProject.context} 
                  currentProjectType={currentProject.type}
                  userInput={currentProject.userInput}
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        
        {/* Floating AI Assistant */}
        {isStarted && currentProject && (
          <FloatingAIAssistant 
            userInput={currentProject.userInput} 
            context={currentProject.context}
            onCreateNewProject={handleCreateNewProject}
          />
        )}
      </div>
    </div>
  )
} 