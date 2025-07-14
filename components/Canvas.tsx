'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layout, Palette, Code, Settings, Share2, Globe, Download, Edit3, Shield, CheckCircle, BarChart3, User } from 'lucide-react'
import BubbleSortAnimation from './BubbleSortAnimation'
import DataVisualizationDashboard from './DataVisualizationDashboard'
import CodeEditor from './CodeEditor'
import EngineerProfile from './EngineerProfile'

interface CanvasProps {
  userInput: string
  context: string[]
  onProjectTypeChange?: (type: 'bubble-sort' | 'dashboard' | null) => void
  onVisualizationChange?: (command: any) => void
  pendingVisualizationChange?: any
}

export default function Canvas({ userInput, context, onProjectTypeChange, onVisualizationChange, pendingVisualizationChange }: CanvasProps) {
  const [isBuilding, setIsBuilding] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [showShareButtons, setShowShareButtons] = useState(false)
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [verifications, setVerifications] = useState<Array<{id: string, engineer: any, timestamp: Date}>>([])
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)
  const [showEngineerProfile, setShowEngineerProfile] = useState(false)
  const [selectedEngineer, setSelectedEngineer] = useState<any>(null)
  const [projectType, setProjectType] = useState<'bubble-sort' | 'dashboard' | null>(null)
  
  // Visualization state for bubble sort
  const [visualizationType, setVisualizationType] = useState<'default' | 'columns' | 'bars' | 'buttons'>('default')
  const [heightRepresentation, setHeightRepresentation] = useState(false)
  const [customNumbers, setCustomNumbers] = useState<number[]>()
  const [customSpeed, setCustomSpeed] = useState<number>()
  const [layout, setLayout] = useState<'horizontal' | 'vertical' | 'grid'>('horizontal')

  // Determine project type based on user input
  const determineProjectType = () => {
    const input = userInput.toLowerCase()
    if (input.includes('bubble') || input.includes('sort') || input.includes('animation') || input.includes('algorithm')) {
      return 'bubble-sort'
    } else if (input.includes('dashboard') || input.includes('chart') || input.includes('visualization') || 
               input.includes('data') || input.includes('analytics')) {
      return 'dashboard'
    }
    return 'bubble-sort' // default
  }

  useEffect(() => {
    console.log('Canvas useEffect triggered with userInput:', userInput)
    const type = determineProjectType()
    console.log('Determined project type:', type)
    
    // Only update if project type actually changed
    if (type !== projectType) {
      setProjectType(type)
      
      // Notify parent of project type change
      if (onProjectTypeChange) {
        onProjectTypeChange(type)
      }
    }
    
    // Simulate building process
    console.log('Starting building process...')
    const timer = setTimeout(() => {
      console.log('Building process complete, setting states...')
      setIsBuilding(true)
      setShowAnimation(true)
      setShowShareButtons(true)
      console.log('States set: isBuilding=true, showAnimation=true, showShareButtons=true')
    }, 2000)
    return () => clearTimeout(timer)
  }, [userInput]) // Removed onProjectTypeChange from dependencies

  // Engineer database
  const engineers = [
    {
      name: 'Amy Chen',
      title: 'Senior Full-Stack Engineer',
      avatar: 'A',
      rating: 5.0,
      verifiedProjects: 127,
      experience: '8+ years',
      location: 'San Francisco, CA',
      certifications: [
        'AWS Certified Solutions Architect',
        'Google Cloud Professional Developer',
        'Microsoft Azure Developer Associate',
        'Certified Kubernetes Administrator',
        'React Advanced Certification'
      ],
      skills: [
        'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 
        'Kubernetes', 'GraphQL', 'MongoDB', 'PostgreSQL', 'Redis'
      ],
      bio: 'Passionate full-stack engineer with expertise in building scalable web applications and AI-powered solutions. Specialized in React, TypeScript, and cloud architecture. Committed to writing clean, maintainable code and mentoring junior developers.',
      contact: {
        email: 'amy.chen@example.com',
        linkedin: 'https://linkedin.com/in/amychen',
        github: 'https://github.com/amychen'
      }
    },
    {
      name: 'David Kim',
      title: 'Lead DevOps Engineer',
      avatar: 'D',
      rating: 5.0,
      verifiedProjects: 89,
      experience: '6+ years',
      location: 'Seattle, WA',
      certifications: [
        'AWS Certified DevOps Engineer',
        'Kubernetes Administrator',
        'Terraform Associate',
        'Docker Certified Associate',
        'Jenkins Certified Engineer'
      ],
      skills: [
        'Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins', 'GitLab CI/CD',
        'Prometheus', 'Grafana', 'ELK Stack', 'Ansible', 'Python', 'Bash'
      ],
      bio: 'DevOps specialist focused on building robust CI/CD pipelines and scalable infrastructure. Expert in containerization, orchestration, and monitoring solutions. Passionate about automation and infrastructure as code.',
      contact: {
        email: 'david.kim@example.com',
        linkedin: 'https://linkedin.com/in/davidkim',
        github: 'https://github.com/davidkim'
      }
    },
    {
      name: 'Sarah Johnson',
      title: 'Frontend Architect',
      avatar: 'S',
      rating: 5.0,
      verifiedProjects: 156,
      experience: '10+ years',
      location: 'New York, NY',
      certifications: [
        'React Advanced Certification',
        'Vue.js Professional',
        'Angular Expert',
        'Web Performance Specialist',
        'Accessibility Expert'
      ],
      skills: [
        'React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'CSS3',
        'Webpack', 'Vite', 'Jest', 'Cypress', 'Storybook', 'Design Systems'
      ],
      bio: 'Frontend architect with a decade of experience building user-centric web applications. Specialized in modern JavaScript frameworks, performance optimization, and creating accessible, scalable design systems.',
      contact: {
        email: 'sarah.johnson@example.com',
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        github: 'https://github.com/sarahjohnson'
      }
    },
    {
      name: 'Marcus Rodriguez',
      title: 'Machine Learning Engineer',
      avatar: 'M',
      rating: 5.0,
      verifiedProjects: 73,
      experience: '5+ years',
      location: 'Austin, TX',
      certifications: [
        'Google Cloud ML Engineer',
        'AWS Machine Learning Specialty',
        'TensorFlow Developer',
        'PyTorch Certified',
        'Data Science Professional'
      ],
      skills: [
        'Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
        'Jupyter', 'MLflow', 'Kubeflow', 'Docker', 'AWS SageMaker', 'GCP AI Platform'
      ],
      bio: 'ML engineer passionate about building intelligent systems and scalable machine learning pipelines. Expert in deep learning, computer vision, and deploying ML models to production.',
      contact: {
        email: 'marcus.rodriguez@example.com',
        linkedin: 'https://linkedin.com/in/marcusrodriguez',
        github: 'https://github.com/marcusrodriguez'
      }
    }
  ]

  const getRandomEngineer = () => {
    const availableEngineers = engineers.filter(eng => 
      !verifications.some(v => v.engineer.name === eng.name)
    )
    if (availableEngineers.length === 0) {
      // If all engineers have verified, randomly select one
      return engineers[Math.floor(Math.random() * engineers.length)]
    }
    return availableEngineers[Math.floor(Math.random() * availableEngineers.length)]
  }

  // Handle visualization changes from AI Assistant
  const handleVisualizationChange = (command: any) => {
    console.log('Handling visualization change:', command)
    
    // Call the parent handler if provided
    if (onVisualizationChange) {
      onVisualizationChange(command)
    }
    
    switch (command.action) {
      case 'change_visualization':
        console.log('Changing visualization type to:', command.parameters.visualizationType)
        console.log('Setting height representation to:', command.parameters.heightRepresentation)
        if (command.parameters.visualizationType) {
          setVisualizationType(command.parameters.visualizationType)
        }
        if (command.parameters.heightRepresentation !== undefined) {
          setHeightRepresentation(command.parameters.heightRepresentation)
        }
        break
        
      case 'change_numbers':
        if (command.parameters.numbers) {
          setCustomNumbers(command.parameters.numbers)
        }
        break
        
      case 'change_speed':
        if (command.parameters.speed) {
          setCustomSpeed(command.parameters.speed)
        }
        break
        
      case 'change_layout':
        if (command.parameters.layout) {
          setLayout(command.parameters.layout)
        }
        break
        
      case 'add_feature':
        // Handle feature additions
        console.log('Adding feature:', command.parameters.feature)
        break
    }
  }

  // Handle pending visualization changes
  useEffect(() => {
    if (pendingVisualizationChange) {
      console.log('Canvas received pending visualization change:', pendingVisualizationChange)
      handleVisualizationChange(pendingVisualizationChange)
      // Clear the pending change after processing
      if (onVisualizationChange) {
        onVisualizationChange(pendingVisualizationChange)
      }
    }
  }, [pendingVisualizationChange])

  // Debug logging
  useEffect(() => {
    console.log('Canvas state:', {
      isBuilding,
      showAnimation,
      showShareButtons,
      projectType,
      userInput,
      visualizationType,
      heightRepresentation,
      customNumbers,
      customSpeed,
      layout
    })
  }, [isBuilding, showAnimation, showShareButtons, projectType, userInput, visualizationType, heightRepresentation, customNumbers, customSpeed, layout])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="h-full bg-white rounded-2xl shadow-soft border border-gray-100 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {projectType === 'bubble-sort' ? 'Algorithm Visualization' :
                 projectType === 'dashboard' ? 'Data Analytics Dashboard' :
                 'Project Canvas'}
              </h2>
              {verifications.length > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <Shield className="w-3 h-3" />
                    Verified
                  </div>
                  <span className="text-xs text-gray-500">by</span>
                  <div className="flex items-center gap-1">
                    {verifications.map((verification, index) => (
                      <motion.button
                        key={verification.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedEngineer(verification.engineer)
                          setShowEngineerProfile(true)
                        }}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                        title={`Click to view ${verification.engineer.name}'s profile`}
                      >
                        <User className="w-3 h-3" />
                        {verification.engineer.name.split(' ')[0]}
                      </motion.button>
                    ))}
                  </div>
                  {verifications.length > 1 && (
                    <span className="text-xs text-gray-500">
                      ({verifications.length} engineers)
                    </span>
                  )}
                </motion.div>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {projectType === 'bubble-sort' ? 'Interactive algorithm demonstration with step-by-step visualization' :
               projectType === 'dashboard' ? 'Real-time data analytics with multiple chart types' :
               `Build your ${context.join(', ')} project`}
            </p>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Layout className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Palette className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Code className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Share/Publish Buttons */}
        <AnimatePresence>
          {showShareButtons && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {projectType === 'bubble-sort' ? 'Ready to share algorithm:' :
                     projectType === 'dashboard' ? 'Ready to share dashboard:' :
                     'Ready to share:'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Globe className="w-4 h-4" />
                    Publish
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-6">
        <AnimatePresence mode="wait">
          {!isBuilding ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="h-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mb-6"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Layout className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Building Your Project
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    The AI assistant is analyzing your request and preparing the perfect solution...
                  </p>
                </motion.div>

                {/* Loading Animation */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto"
                />
              </div>
            </motion.div>
          ) : showAnimation ? (
            <motion.div
              key="animation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              {projectType === 'bubble-sort' && (
                <BubbleSortAnimation 
                  isActive={true}
                  visualizationType={visualizationType}
                  heightRepresentation={heightRepresentation}
                  customNumbers={customNumbers}
                  customSpeed={customSpeed}
                  layout={layout}
                />
              )}
              {projectType === 'dashboard' && <DataVisualizationDashboard />}
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="h-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mb-6"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Project Complete!
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Your project has been built successfully. You can now edit, share, or publish it.
                  </p>
                </motion.div>

                {/* Project Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="bg-white/60 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto"
                >
                  <h4 className="font-medium text-gray-900 mb-2">Project Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Goal:</span> {userInput}</p>
                    <p><span className="font-medium">Context:</span> {context.join(', ')}</p>
                    <p><span className="font-medium">Status:</span> <span className="text-green-600">Complete</span></p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex gap-3">
          {!isBuilding ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-xl hover:bg-primary-700 transition-colors font-medium"
              >
                Start Building
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Save Draft
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCodeEditor(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const newVerification = {
                    id: Date.now().toString(),
                    engineer: getRandomEngineer(),
                    timestamp: new Date()
                  }
                  setVerifications(prev => [...prev, newVerification])
                  setShowVerificationMessage(true)
                  setTimeout(() => setShowVerificationMessage(false), 3000)
                }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors font-medium"
              >
                <Shield className="w-4 h-4" />
                Verify
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Save
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Verification Message */}
      <AnimatePresence>
        {showVerificationMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">
                {verifications.length === 1 
                  ? `Project verified by ${verifications[0].engineer.name}!` 
                  : `Project verified by ${verifications.length} engineers!`
                }
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Editor Modal */}
      <CodeEditor
        isOpen={showCodeEditor}
        onClose={() => setShowCodeEditor(false)}
        onSave={(code) => {
          console.log('Saving code:', code)
          // Here you would typically update the animation with the new code
          setShowCodeEditor(false)
        }}
        projectType={projectType}
      />

      {/* Engineer Profile Modal */}
      <EngineerProfile
        isOpen={showEngineerProfile}
        onClose={() => setShowEngineerProfile(false)}
        engineer={selectedEngineer || engineers[0]}
      />
    </motion.div>
  )
} 