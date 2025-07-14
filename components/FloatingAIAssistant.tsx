'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Bot, User, X, Minimize2, ThumbsUp, Zap, Star } from 'lucide-react'
import { parseNaturalLanguageRequest, generateResponseFromCommand } from '@/utils/naturalLanguageParser'

interface FloatingAIAssistantProps {
  userInput: string
  context: string[]
  onCreateNewProject?: (input: string) => void
  onVisualizationChange?: (command: any) => void
}

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  hasThumbsUp?: boolean
}

export default function FloatingAIAssistant({ userInput, context, onCreateNewProject, onVisualizationChange }: FloatingAIAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [showPowerUp, setShowPowerUp] = useState(false)
  const [powerLevel, setPowerLevel] = useState(0)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'user',
      content: userInput,
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'assistant',
      content: `I understand you want to build: "${userInput}". Based on your request, I can help you create this with the right tools and templates. What specific aspects would you like to focus on first?`,
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle hover to expand
  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsExpanded(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsExpanded(false)
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    console.log('AI Assistant received message:', newMessage)

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')

    // Simulate assistant response
    setTimeout(() => {
      const response = generateResponse(newMessage, context)
      console.log('AI Assistant generated response:', response)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    }, 1000)
  }

  const generateResponse = (message: string, context: string[]): string => {
    const lowerMessage = message.toLowerCase()
    console.log('AI Assistant context:', context)
    
    // Check for new project requests
    if (lowerMessage.includes('build') || lowerMessage.includes('create') || lowerMessage.includes('make')) {
      if (lowerMessage.includes('dashboard') || lowerMessage.includes('chart') || lowerMessage.includes('visualization') || 
          lowerMessage.includes('data') || lowerMessage.includes('analytics')) {
        if (onCreateNewProject) {
          setTimeout(() => {
            onCreateNewProject(message)
          }, 1000)
        }
        return "I'll save your current project and create a new data visualization dashboard for you. Let me set that up..."
      }
      
      if (lowerMessage.includes('bubble sort') || lowerMessage.includes('sort') || lowerMessage.includes('algorithm')) {
        if (onCreateNewProject) {
          setTimeout(() => {
            onCreateNewProject(message)
          }, 1000)
        }
        return "I'll save your current project and create a new bubble sort animation for you. Let me set that up..."
      }
    }
    
    // Parse natural language requests for visualization changes
    const parsedCommand = parseNaturalLanguageRequest(message)
    console.log('Parsed command:', parsedCommand)
    
    if (parsedCommand.confidence >= 0.1 && onVisualizationChange) { // Lowered threshold for testing
      console.log('Executing visualization change with confidence:', parsedCommand.confidence)
      // Execute the visualization change
      setTimeout(() => {
        onVisualizationChange(parsedCommand)
      }, 500)
      
      return generateResponseFromCommand(parsedCommand)
    } else {
      console.log('Command not executed. Confidence:', parsedCommand.confidence, 'Has handler:', !!onVisualizationChange)
    }
    
    // Context-specific responses
    if (context.includes('technical') || context.includes('data') || context.includes('bubble-sort') || context.includes('algorithm')) {
      if (lowerMessage.includes('speed') || lowerMessage.includes('fast')) {
        return "I've adjusted the animation speed to 500ms for faster visualization. You can also use the speed control to make it even faster or slower as needed."
      }
      if (lowerMessage.includes('numbers') || lowerMessage.includes('input')) {
        return "You can modify the numbers by typing a comma-separated list in the input field. Try different sequences like '5, 2, 8, 1, 9' to see how the algorithm handles various cases."
      }
      if (lowerMessage.includes('step') || lowerMessage.includes('explain')) {
        return "The animation shows each comparison and swap step-by-step. Yellow highlights indicate comparison, red indicates swapping. You can use the timeline below to jump to any step."
      }
    }
    
    if (context.includes('dashboard') || context.includes('analytics')) {
      if (lowerMessage.includes('chart') || lowerMessage.includes('visualization')) {
        return "You can switch between different chart types (bar, line, pie, area) using the controls. Each chart type is optimized for different data patterns and insights."
      }
      if (lowerMessage.includes('real-time') || lowerMessage.includes('live')) {
        return "The real-time feature updates data every 2 seconds. You can toggle it on/off and control the playback with the play/pause buttons."
      }
      if (lowerMessage.includes('export') || lowerMessage.includes('download')) {
        return "Use the Export button to download your data as CSV. You can also configure scheduled exports in the dashboard settings."
      }
    }
    
    const responses = [
      "That's a great point! Let me help you refine that approach.",
      "I can see you're thinking about the user experience. Here's what I suggest...",
      "Based on your context, I'd recommend starting with the core functionality first.",
      "That's exactly the right direction. Let's build on that foundation.",
      "I understand your vision. Here's how we can make it even better...",
      "Perfect! Now let's think about the technical implementation.",
      "That's a smart approach. Let me show you some options...",
      "Great idea! Here's how we can optimize that for your use case."
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleThumbsUp = (messageId?: string) => {
    if (messageId) {
      // Thumbs up for specific message
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, hasThumbsUp: true }
          : msg
      ))
    }
    
    setPowerLevel(prev => prev + 1)
    setShowPowerUp(true)
    
    // Hide power-up animation after 3 seconds
    setTimeout(() => {
      setShowPowerUp(false)
    }, 3000)
  }

  return (
    <div
      ref={containerRef}
      className="fixed right-6 top-6 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Collapsed Robot Icon
          <motion.div
            key="collapsed"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full shadow-lg border-4 border-white cursor-pointer flex items-center justify-center"
            onClick={() => setIsExpanded(true)}
          >
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, 0],
                scale: showPowerUp ? [1, 1.3, 1] : [1, 1.1, 1]
              }}
              transition={{ 
                duration: showPowerUp ? 0.5 : 2,
                repeat: Infinity,
                repeatDelay: showPowerUp ? 0 : 3
              }}
            >
              <Bot className={`w-8 h-8 ${showPowerUp ? 'text-yellow-300' : 'text-white'}`} />
            </motion.div>

            {/* Power-up Animation */}
            <AnimatePresence>
              {showPowerUp && (
                <>
                  {/* Main Zap Effect */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 2, 1],
                        rotate: [0, 360],
                        y: [-20, -40, -60]
                      }}
                      transition={{
                        duration: 2,
                        ease: "easeOut"
                      }}
                      className="text-yellow-400"
                    >
                      <Zap className="w-12 h-12" />
                    </motion.div>
                  </motion.div>

                  {/* Particle Effects */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        scale: 0, 
                        opacity: 0,
                        x: 0,
                        y: 0
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: Math.cos(i * 60 * Math.PI / 180) * 30,
                        y: Math.sin(i * 60 * Math.PI / 180) * 30
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.1,
                        ease: "easeOut"
                      }}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
            
            {/* Notification dot */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
            />
          </motion.div>
        ) : (
          // Expanded Chat Interface
          <motion.div
            key="expanded"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-80 h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-primary-500 to-primary-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">AI Assistant</h3>
                    <p className="text-white/80 text-xs">Context-aware guidance</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {/* Power Level Indicator */}
                  {powerLevel > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full">
                      <Star className="w-3 h-3 text-yellow-300" />
                      <span className="text-yellow-300 text-xs font-medium">{powerLevel}</span>
                    </div>
                  )}
                  

                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsPinned(!isPinned)}
                    className={`p-1 rounded text-white/80 hover:text-white transition-colors ${
                      isPinned ? 'bg-white/20' : ''
                    }`}
                    title={isPinned ? 'Unpin' : 'Pin'}
                  >
                    <Minimize2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsExpanded(false)}
                    className="p-1 rounded text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3 h-3 text-primary-600" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[85%] p-2 rounded-xl text-xs ${
                      message.type === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs ${
                        message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      
                      {/* Thumbs up button for assistant messages */}
                      {message.type === 'assistant' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleThumbsUp(message.id)}
                          disabled={message.hasThumbsUp}
                          className={`p-1 rounded transition-colors ${
                            message.hasThumbsUp
                              ? 'text-yellow-500 cursor-default'
                              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                          }`}
                          title={message.hasThumbsUp ? 'Already liked!' : 'Give thumbs up!'}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-3 h-3 text-gray-600" />
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 text-xs bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-3 h-3" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 