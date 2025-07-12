'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Settings, ChevronRight, ChevronLeft, MessageCircle } from 'lucide-react'
import CommentSystem from './CommentSystem'
import CommentIndicator from './CommentIndicator'

interface AnimationStep {
  id: string
  type: 'compare' | 'swap' | 'complete'
  indices: number[]
  array: number[]
  description: string
  delay: number
}

interface BubbleSortAnimationProps {
  isActive: boolean
}

interface Comment {
  id: string
  elementId: string
  elementType: 'array-item' | 'control' | 'timeline' | 'general'
  position: { x: number; y: number }
  text: string
  author: string
  timestamp: Date
  replies: Reply[]
}

interface Reply {
  id: string
  text: string
  author: string
  timestamp: Date
}

export default function BubbleSortAnimation({ isActive }: BubbleSortAnimationProps) {
  const [numbers, setNumbers] = useState<string>('64, 34, 25, 12, 22, 11, 90')
  const [parsedNumbers, setParsedNumbers] = useState<number[]>([64, 34, 25, 12, 22, 11, 90])
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [showControls, setShowControls] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Cancel comment mode when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAddingComment) {
        setIsAddingComment(false)
        console.log('Comment mode cancelled by escape key')
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (isAddingComment && !(e.target as HTMLElement).closest('[data-array-item], [data-control], [data-timeline]')) {
        setIsAddingComment(false)
        console.log('Comment mode cancelled by clicking outside')
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isAddingComment])

  // Generate animation steps from bubble sort algorithm
  const generateAnimationSteps = (arr: number[]): AnimationStep[] => {
    const steps: AnimationStep[] = []
    const array = [...arr]
    let stepId = 0

    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        // Compare step
        steps.push({
          id: `step-${stepId++}`,
          type: 'compare',
          indices: [j, j + 1],
          array: [...array],
          description: `Comparing ${array[j]} and ${array[j + 1]}`,
          delay: steps.length * speed
        })

        if (array[j] > array[j + 1]) {
          // Swap step
          [array[j], array[j + 1]] = [array[j + 1], array[j]]
          steps.push({
            id: `step-${stepId++}`,
            type: 'swap',
            indices: [j, j + 1],
            array: [...array],
            description: `Swapping ${array[j + 1]} and ${array[j]}`,
            delay: steps.length * speed
          })
        }
      }
    }

    // Final complete step
    steps.push({
      id: `step-${stepId++}`,
      type: 'complete',
      indices: [],
      array: [...array],
      description: 'Sorting complete!',
      delay: steps.length * speed
    })

    return steps
  }

  useEffect(() => {
    if (isActive) {
      const parsed = numbers.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
      setParsedNumbers(parsed)
      const steps = generateAnimationSteps(parsed)
      setAnimationSteps(steps)
      setCurrentStep(0)
      setIsPlaying(false)
    }
  }, [numbers, isActive, speed])

  useEffect(() => {
    if (isPlaying && currentStep < animationSteps.length - 1) {
      intervalRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, speed)
    } else if (currentStep >= animationSteps.length - 1) {
      setIsPlaying(false)
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [isPlaying, currentStep, animationSteps.length, speed])

  const handlePlay = () => {
    if (currentStep >= animationSteps.length - 1) {
      setCurrentStep(0)
    }
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const handleNext = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const currentArray = animationSteps[currentStep]?.array || parsedNumbers
  const currentStepData = animationSteps[currentStep]

  // Comment management functions
  const handleAddComment = (comment: Comment) => {
    setComments(prev => [...prev, comment])
  }

  const handleUpdateComment = (commentId: string, text: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId ? { ...comment, text } : comment
    ))
  }

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId))
  }

  const handleAddReply = (commentId: string, reply: Reply) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ))
  }

  // Handle element selection for commenting
  const handleElementClick = (elementId: string, elementType: Comment['elementType']) => {
    console.log('Element clicked:', elementId, elementType, 'isAddingComment:', isAddingComment)
    if (isAddingComment) {
      setSelectedElement(elementId)
      setIsAddingComment(false)
      console.log('Element selected for commenting:', elementId)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Animation Controls */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Bubble Sort Animation</h3>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowControls(!showControls)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                console.log('Comment button clicked, setting isAddingComment to true')
                setIsAddingComment(true)
              }}
              className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors relative"
            >
              <MessageCircle className="w-5 h-5" />
              {comments.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {comments.length}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Input Controls */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numbers (comma-separated)
            </label>
            <input
              type="text"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="64, 34, 25, 12, 22, 11, 90"
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Speed (ms)
            </label>
            <input
              type="number"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value) || 1000)}
              min="100"
              max="3000"
              step="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            disabled={currentStep === 0}
            data-control="prev-button"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onMouseDown={() => handleElementClick('prev-button', 'control')}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isPlaying ? handlePause : handlePlay}
            data-control="play-pause-button"
            className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            onMouseDown={() => handleElementClick('play-pause-button', 'control')}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={currentStep >= animationSteps.length - 1}
            data-control="next-button"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onMouseDown={() => handleElementClick('next-button', 'control')}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            data-control="reset-button"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onMouseDown={() => handleElementClick('reset-button', 'control')}
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>

          <div className="ml-4 text-sm text-gray-600">
            Step {currentStep + 1} of {animationSteps.length}
          </div>
        </div>
      </div>

      {/* Animation Canvas */}
      <div className="flex-1 p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Comment Mode Indicator */}
        {isAddingComment && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Click on any element to add a comment
              <button
                onClick={() => setIsAddingComment(false)}
                className="ml-2 px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div className="h-full flex flex-col items-center justify-center">
          {/* Array Visualization */}
          <div className="mb-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4 text-center">
              {currentStepData?.description || 'Ready to sort'}
            </h4>
            <div className="flex gap-3 justify-center">
              {currentArray.map((num, index) => {
                const elementId = `item-${index}-${num}`
                const elementComments = comments.filter(c => c.elementId === elementId)
                
                return (
                  <div key={index} className="relative">
                    <motion.div
                      data-array-item={elementId}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                        backgroundColor: currentStepData?.indices.includes(index) 
                          ? currentStepData.type === 'compare' 
                            ? '#fbbf24' 
                            : '#ef4444'
                          : '#ffffff',
                        borderColor: currentStepData?.indices.includes(index)
                          ? currentStepData.type === 'compare'
                            ? '#f59e0b'
                            : '#dc2626'
                          : '#d1d5db'
                      }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.1,
                        backgroundColor: { duration: 0.2 },
                        borderColor: { duration: 0.2 }
                      }}
                      className={`w-16 h-16 flex items-center justify-center text-lg font-bold text-gray-900 bg-white border-2 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all ${
                        isAddingComment 
                          ? 'border-yellow-400 shadow-yellow-200 hover:scale-105' 
                          : 'border-gray-300'
                      }`}
                      onClick={() => handleElementClick(elementId, 'array-item')}
                    >
                      {num}
                    </motion.div>
                    <CommentIndicator
                      elementId={elementId}
                      commentCount={elementComments.length}
                      onClick={() => {
                        setSelectedElement(elementId)
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Animation Timeline */}
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h5 className="font-medium text-gray-900 mb-3">Animation Timeline</h5>
              <div className="flex gap-1">
                {animationSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    data-timeline={`step-${index}`}
                    whileHover={{ scale: 1.05 }}
                    className={`flex-1 h-2 rounded-full cursor-pointer transition-colors ${
                      index === currentStep
                        ? 'bg-primary-600'
                        : index < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                    onClick={() => setCurrentStep(index)}
                    onMouseDown={() => handleElementClick(`step-${index}`, 'timeline')}
                  />
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {currentStepData?.type === 'compare' && '🟡 Comparing'}
                {currentStepData?.type === 'swap' && '🔴 Swapping'}
                {currentStepData?.type === 'complete' && '✅ Complete'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment System */}
      <CommentSystem
        isActive={isActive}
        onAddComment={handleAddComment}
        comments={comments}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        onAddReply={handleAddReply}
        isAddingComment={isAddingComment}
        setIsAddingComment={setIsAddingComment}
        selectedElement={selectedElement}
        setSelectedElement={setSelectedElement}
      />
    </div>
  )
} 