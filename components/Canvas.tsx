'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layout, Palette, Code, Settings, Share2, Globe, Download, Edit3, Shield, CheckCircle, BarChart3 } from 'lucide-react'
import BubbleSortAnimation from './BubbleSortAnimation'
import DataVisualizationDashboard from './DataVisualizationDashboard'
import CodeEditor from './CodeEditor'

interface CanvasProps {
  userInput: string
  context: string[]
  onProjectTypeChange?: (type: 'bubble-sort' | 'dashboard' | null) => void
}

export default function Canvas({ userInput, context, onProjectTypeChange }: CanvasProps) {
  const [isBuilding, setIsBuilding] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [showShareButtons, setShowShareButtons] = useState(false)
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)
  const [projectType, setProjectType] = useState<'bubble-sort' | 'dashboard' | null>(null)

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

  // Debug logging
  useEffect(() => {
    console.log('Canvas state:', {
      isBuilding,
      showAnimation,
      showShareButtons,
      projectType,
      userInput
    })
  }, [isBuilding, showAnimation, showShareButtons, projectType, userInput])

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
              {isVerified && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                >
                  <Shield className="w-3 h-3" />
                  Verified
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
              {projectType === 'bubble-sort' && <BubbleSortAnimation isActive={true} />}
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
                  setIsVerified(true)
                  setShowVerificationMessage(true)
                  setTimeout(() => setShowVerificationMessage(false), 3000)
                }}
                disabled={isVerified}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-colors font-medium ${
                  isVerified
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Shield className="w-4 h-4" />
                {isVerified ? 'Verified' : 'Verify'}
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
              <span className="font-medium">Project verified successfully!</span>
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
    </motion.div>
  )
} 