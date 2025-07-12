'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { parseDSL } from '@/utils/dslParser'

interface AnimationPreviewProps {
  code: string
}

export default function AnimationPreview({ code }: AnimationPreviewProps) {
  const [config, setConfig] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const result = parseDSL(code)
    console.log('DSL Parse Result:', result) // Debug log
    if (result.success && result.data) {
      setConfig(result.data)
      setCurrentStep(0)
    } else {
      console.error('DSL Parse Error:', result.error) // Debug log
    }
  }, [code])

  useEffect(() => {
    if (isPlaying && config) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= 5) { // Simplified: just show 6 steps
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, config.animation.speed || 1000)
      
      return () => clearInterval(interval)
    }
  }, [isPlaying, config])

  if (!config) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500">Loading preview...</p>
        </div>
      </div>
    )
  }

  // Simplified animation data for preview
  const previewSteps = [
    { array: config.input.default, description: 'Initial array' },
    { array: [...config.input.default].sort((a, b) => a - b), description: 'Sorted array' },
    { array: config.input.default, description: 'Step 1: Comparing' },
    { array: config.input.default, description: 'Step 2: Swapping' },
    { array: [...config.input.default].sort((a, b) => a - b), description: 'Step 3: Progress' },
    { array: [...config.input.default].sort((a, b) => a - b), description: 'Complete!' }
  ]

  const currentData = previewSteps[currentStep] || previewSteps[0]

  return (
    <div className="h-full flex flex-col p-6">
      {/* Preview Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {config.animation.name}
        </h3>
        <p className="text-sm text-gray-600">
          Algorithm: {config.animation.algorithm} | Speed: {config.animation.speed}ms
        </p>
      </div>

      {/* Animation Preview */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Array Visualization */}
        <div className="mb-8">
          <h4 className="text-center text-gray-700 mb-4">
            {currentData.description}
          </h4>
          <div className="flex gap-2 justify-center">
            {currentData.array.map((num: number, index: number) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  backgroundColor: currentStep === 1 || currentStep === 5 
                    ? config.animation.colors.sorted 
                    : config.animation.colors.default
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  backgroundColor: { duration: 0.2 }
                }}
                className="w-12 h-12 flex items-center justify-center text-sm font-bold text-gray-900 border-2 border-gray-300 rounded-lg shadow-sm"
                style={{
                  backgroundColor: currentStep === 1 || currentStep === 5 
                    ? config.animation.colors.sorted 
                    : config.animation.colors.default
                }}
              >
                {num}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCurrentStep(0)
              setIsPlaying(false)
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            Reset
          </motion.button>
        </div>

        {/* Progress */}
        <div className="mt-6 w-full max-w-md">
          <div className="flex gap-1">
            {previewSteps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-primary-600'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Step {currentStep + 1} of {previewSteps.length}
          </p>
        </div>
      </div>

      {/* Configuration Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-900 mb-2">Configuration</h5>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Style:</span> {config.visualization.style}
          </div>
          <div>
            <span className="font-medium">Animation:</span> {config.visualization.animation}
          </div>
          <div>
            <span className="font-medium">Timeline:</span> {config.visualization.showTimeline ? 'Yes' : 'No'}
          </div>
          <div>
            <span className="font-medium">Description:</span> {config.visualization.showDescription ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
    </div>
  )
} 