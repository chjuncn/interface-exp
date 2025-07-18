'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InputBox from '@/components/InputBox'
import FloatingAIAssistant from '@/components/FloatingAIAssistant'
import SmartSuggestions from '@/components/SmartSuggestions'
import Canvas from '@/components/Canvas'
import ImagingViewer from '@/components/ImagingViewer'
import EnhancedInputBox from '@/components/EnhancedInputBox'
import ProjectPreview from '@/components/ProjectPreview'
import ProjectBrowser from '@/components/ProjectBrowser'
import MothersDayCardProject from '@/components/MothersDayCardProject'

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

export default function Home() {
  const [isStarted, setIsStarted] = useState(false)
  const [projects, setProjects] = useState<Project[]>([
    // Sample projects for demonstration
    {
      id: '1',
      name: 'Bubble Sort Animation',
      type: 'bubble-sort',
      userInput: 'Create a bubble sort animation',
      context: ['algorithm', 'sorting', 'technical'],
      createdAt: new Date('2024-01-15'),
      isActive: false,
      description: 'Interactive bubble sort algorithm visualization with step-by-step execution',
      tags: ['algorithm', 'sorting', 'animation'],
      author: 'John Doe',
      rating: 4.8,
      usageCount: 156
    },
    {
      id: '2',
      name: 'E-commerce Analytics Dashboard',
      type: 'dashboard',
      userInput: 'Build a dashboard for e-commerce analytics',
      context: ['ecommerce', 'analytics', 'business'],
      createdAt: new Date('2024-01-20'),
      isActive: false,
      description: 'Comprehensive e-commerce analytics dashboard with sales metrics and customer insights',
      tags: ['dashboard', 'analytics', 'ecommerce'],
      author: 'Jane Smith',
      rating: 4.9,
      usageCount: 89
    },
    {
      id: '3',
      name: 'Tumor Board Template',
      type: 'tumor-board',
      userInput: 'Create a tumor board template for medical case review',
      context: ['medical', 'healthcare', 'clinical'],
      createdAt: new Date('2024-01-25'),
      isActive: false,
      description: 'Medical case review system with patient data visualization and collaboration tools',
      tags: ['medical', 'healthcare', 'collaboration'],
      author: 'Dr. Johnson',
      rating: 4.7,
      usageCount: 234
    }
  ])
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false)
  const [pendingVisualizationChange, setPendingVisualizationChange] = useState<any>(null)
  const [showImagingViewer, setShowImagingViewer] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showProjectBrowser, setShowProjectBrowser] = useState(false)
  const [showAssistant, setShowAssistant] = useState(false)
  const [showMothersDayProject, setShowMothersDayProject] = useState(false)
  
  // Debug logging for Mother's Day project state
  useEffect(() => {
    console.log('showMothersDayProject state changed to:', showMothersDayProject)
  }, [showMothersDayProject])

  const handleStartBuilding = (input: string) => {
    console.log('handleStartBuilding called with:', input)
    // Special handling for Mother's Day card
    if (input.toLowerCase().includes("mother") && input.toLowerCase().includes("day") && input.toLowerCase().includes("card")) {
      console.log('Navigating to Mother\'s Day project')
      setShowMothersDayProject(true)
      return
    }
    
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
      isActive: true,
      description: `A ${projectType || 'custom'} project created from user input`,
      tags: detectedContext,
      author: 'You',
      rating: 0,
      usageCount: 0
    }
    
    setProjects(prev => [...prev, newProject])
    setCurrentProjectId(newProject.id)
    
    // Show transition animation
    setTimeout(() => {
      setIsCreatingNewProject(false)
    }, 2000)
  }

  const handleCloneProject = (project: Project) => {
    const clonedProject: Project = {
      ...project,
      id: Date.now().toString(),
      name: `${project.name} (Copy)`,
      createdAt: new Date(),
      isActive: true,
      author: 'You',
      usageCount: 0
    }
    
    // Deactivate current project if exists
    setProjects(prev => prev.map(p => ({ ...p, isActive: false })))
    
    // Add cloned project and set as active
    setProjects(prev => [...prev, clonedProject])
    setCurrentProjectId(clonedProject.id)
    setIsStarted(true)
  }

  const generateProjectName = (input: string, type: 'bubble-sort' | 'dashboard' | 'tumor-board' | null): string => {
    if (type === 'bubble-sort') {
      return 'Bubble Sort Animation'
    } else if (type === 'dashboard') {
      return 'Data Visualization Dashboard'
    } else if (type === 'tumor-board') {
      return 'Tumor Board Template'
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

    // Add project type context
    const projectType = determineProjectType(input)
    if (projectType === 'bubble-sort') {
      contexts.push('bubble-sort', 'algorithm', 'sorting')
    } else if (projectType === 'dashboard') {
      contexts.push('dashboard', 'visualization', 'charts')
    }

    // Default context if none detected
    if (contexts.length === 0) {
      contexts.push('general', 'productivity')
    }

    return contexts
  }

  const determineProjectType = (input: string): 'bubble-sort' | 'dashboard' | 'tumor-board' | null => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('bubble sort') || lowerInput.includes('sort animation') || lowerInput.includes('algorithm')) {
      return 'bubble-sort'
    } else if (lowerInput.includes('dashboard') || lowerInput.includes('chart') || lowerInput.includes('visualization') || 
               lowerInput.includes('data') || lowerInput.includes('analytics')) {
      return 'dashboard'
    } else if (lowerInput.includes('tumor') || lowerInput.includes('medical') || lowerInput.includes('healthcare') || 
               lowerInput.includes('patient') || lowerInput.includes('clinical')) {
      return 'tumor-board'
    }
    
    return null
  }

  const currentProject = projects.find(p => p.id === currentProjectId)

  const handleSuggestionClick = (suggestionId: string) => {
    switch (suggestionId) {
      case 'imaging-viewer':
        setShowImagingViewer(true)
        break
      case 'patient-portal':
        console.log('Patient portal integration clicked')
        break
      case 'treatment-planner':
        console.log('Treatment planning clicked')
        break
      case 'mothers-day-card':
        setShowMothersDayProject(true)
        break
      case 'clinical-trials':
        console.log('Clinical trials clicked')
        break
      case 'outcome-tracking':
        console.log('Outcome tracking clicked')
        break
      default:
        console.log('Unknown suggestion:', suggestionId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            <div className={`container mx-auto px-4 py-8 min-h-screen ${!isStarted ? 'flex items-center justify-center' : ''}`}>
        <div className="w-full">
          <AnimatePresence mode="wait">
            {showMothersDayProject ? (
              <MothersDayCardProject onBack={() => setShowMothersDayProject(false)} />
            ) : !isStarted ? (
              <EnhancedInputBox 
                projects={projects}
                onStartBuilding={handleStartBuilding}
                onCloneProject={handleCloneProject}
                onPreviewProject={(project) => setSelectedProject(project)}
                onBrowseAllProjects={() => setShowProjectBrowser(true)}
                onOpenAssistant={() => setShowAssistant(true)}
                onMothersDayCard={() => setShowMothersDayProject(true)}
              />
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
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          setIsStarted(false)
                          setCurrentProjectId(null)
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Browse
                      </button>
                      <div>
                        <h1 className="text-xl font-bold text-gray-900">{currentProject.name}</h1>
                        <p className="text-sm text-gray-600">
                          Created {currentProject.createdAt.toLocaleString()} • {currentProject.context.join(', ')}
                        </p>
                      </div>
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
                  onVisualizationChange={(command) => {
                    console.log('Canvas received visualization change:', command)
                    setPendingVisualizationChange(null) // Clear after processing
                  }}
                  pendingVisualizationChange={pendingVisualizationChange}
                />
              </div>

              {/* Smart Suggestions */}
              <div className="col-span-1">
                <SmartSuggestions 
                  context={currentProject.context} 
                  currentProjectType={currentProject.type}
                  userInput={currentProject.userInput}
                  onSuggestionClick={handleSuggestionClick}
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        </div>
        
        {/* Floating AI Assistant */}
        {(isStarted && currentProject) || showAssistant ? (
          <FloatingAIAssistant 
            userInput={currentProject?.userInput || ''} 
            context={currentProject?.context || []}
            onCreateNewProject={handleCreateNewProject}
            onVisualizationChange={(command) => {
              console.log('Visualization change requested:', command)
              setPendingVisualizationChange(command)
            }}
            onClose={() => setShowAssistant(false)}
          />
        ) : null}

        {/* Imaging Viewer Modal */}
        <ImagingViewer
          isOpen={showImagingViewer}
          onClose={() => setShowImagingViewer(false)}
          patientData={currentProject}
        />

        {/* Project Preview Modal */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectPreview
              key="project-preview"
              project={selectedProject}
              isOpen={true}
              onClose={() => setSelectedProject(null)}
              onClone={(project) => {
                handleCloneProject(project)
                setSelectedProject(null)
              }}
            />
          )}
        </AnimatePresence>

        {/* Project Browser Modal */}
        <AnimatePresence>
          {showProjectBrowser && (
            <ProjectBrowser
              key="project-browser"
              projects={projects}
              onSelectProject={(project) => {
                setSelectedProject(project)
              }}
              onCloneProject={handleCloneProject}
              onClose={() => setShowProjectBrowser(false)}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  )
} 