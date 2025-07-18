'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Heart, Flower, Sparkles, Send, ArrowLeft, Check, X, Edit3, Printer, MessageCircle, Bot, User, Share2, Globe, Mic, MicOff, Volume2 } from 'lucide-react'

interface ConversationMessage {
  id: string
  type: 'emma' | 'tma'
  message: string
  timestamp: Date
  action?: 'start' | 'photo' | 'message' | 'decoration' | 'review'
  context?: string
}

interface CardElement {
  type: 'photo' | 'message' | 'flower' | 'sparkle' | 'heart'
  content?: string
  position?: { x: number; y: number }
  style?: any
}

export default function MothersDayCardProject({ onBack }: { onBack?: () => void }) {
  const [showHandwriting, setShowHandwriting] = useState(false)
  const [handwritingProgress, setHandwritingProgress] = useState(0)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceLevel, setVoiceLevel] = useState(0)
  
  const [conversation, setConversation] = useState<ConversationMessage[]>([
    {
      id: '1',
      type: 'emma',
      message: 'AI Assistant, I want to make something special for Mommy!',
      timestamp: new Date(),
      action: 'start'
    },
    {
      id: '2',
      type: 'tma',
      message: 'Oh Emma, that\'s such a wonderful idea! What would you like to make for Mommy?',
      timestamp: new Date(),
      action: 'start'
    }
  ])
  
  const [cardElements, setCardElements] = useState<CardElement[]>([])
  const [currentAction, setCurrentAction] = useState<string | null>(null)
  const [showPhotoStudio, setShowPhotoStudio] = useState(false)
  const [showWritingBoard, setShowWritingBoard] = useState(false)
  const [showDecorationPanel, setShowDecorationPanel] = useState(false)
  const [emmaMessage, setEmmaMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [autoPlayStep, setAutoPlayStep] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  // Auto-play conversation flow
  useEffect(() => {
    if (!isAutoPlaying) return

    const autoPlayConversation = [
      { type: 'emma' as const, message: 'A card! But I want it to be special, not like the ones at the store.' },
      { type: 'tma' as const, message: 'That\'s perfect! You\'re so creative, Emma. Let\'s make something that\'s uniquely yours. What do you think Mommy would love the most?' },
      { type: 'emma' as const, message: 'I want to take a picture of myself for Mommy!' },
      { type: 'tma' as const, message: 'Great idea! Let\'s take a beautiful picture of you for Mommy. I\'ll open the camera for you!', action: 'photo' as const },
      { type: 'emma' as const, message: 'Now I want to write a special message to Mommy.' },
      { type: 'tma' as const, message: 'Perfect! Let\'s write a special message to Mommy. What do you want to tell her?', action: 'message' as const },
      { type: 'emma' as const, message: 'I want to write: "Dear Mommy, I love your hugs and stories. You\'re the best mommy ever!"' },
      { type: 'tma' as const, message: 'That\'s such a beautiful message, Emma! Mommy will be so touched.' },
      { type: 'emma' as const, message: 'I want to make it beautiful with pink flowers!' },
      { type: 'tma' as const, message: 'Oh yes! Let\'s make it beautiful with decorations. What would you like to add?', action: 'decoration' as const },
      { type: 'emma' as const, message: 'I want to add red roses!' },
      { type: 'tma' as const, message: 'Perfect choice! Red roses will make your card extra special for Mommy.' },
      { type: 'emma' as const, message: 'And I want gold sparkles everywhere!' },
      { type: 'tma' as const, message: 'Gold sparkles will make your card look like a royal gift!' },
      { type: 'emma' as const, message: 'And a big red heart for Mommy!' },
      { type: 'tma' as const, message: 'A heart is perfect for Mommy! That shows how much you love her.' },
      { type: 'emma' as const, message: 'Perfect! Mommy is going to love this card so much!' },
      { type: 'tma' as const, message: 'Emma, your card is absolutely beautiful! Mommy is going to be so happy when she sees it. You\'ve created something truly special with love.' }
    ]

         if (autoPlayStep < autoPlayConversation.length) {
       const step = autoPlayConversation[autoPlayStep]
       const delay = step.type === 'emma' ? 5000 : 4000 // Much slower timing for team visibility

      const timer = setTimeout(() => {
        // Simulate voice interaction for Emma's messages
        if (step.type === 'emma') {
          setIsListening(true)
          setTimeout(() => {
            setIsListening(false)
            addMessage(step.type, step.message, step.action)
          }, 2000)
        } else {
          addMessage(step.type, step.message, step.action)
        }
        
        // Handle special actions with 3-second delay for team visibility
        if (step.action === 'photo') {
          setTimeout(() => {
            setShowPhotoStudio(true)
          }, 3000)
        } else if (step.action === 'message') {
          setTimeout(() => {
            setShowWritingBoard(true)
          }, 3000)
        } else if (step.action === 'decoration') {
          setTimeout(() => {
            setShowDecorationPanel(true)
          }, 3000)
        }

                 // Auto-add elements for demo
         if (step.message.includes('picture') && step.type === 'emma') {
           setTimeout(() => {
             handleTakePhoto()
             // Hide photo studio after taking photo
             setTimeout(() => {
               setShowPhotoStudio(false)
             }, 5000)
           }, 4000)
                 } else if (step.message.includes('write: "Dear Mommy') && step.type === 'emma') {
           setTimeout(() => {
             setShowHandwriting(true)
             // Simulate handwriting appearing gradually
             let progress = 0
             const interval = setInterval(() => {
               progress += 0.05
               setHandwritingProgress(progress)
               if (progress >= 1) {
                 clearInterval(interval)
                 setTimeout(() => {
                   handleWriteMessage()
                 }, 2000)
               }
             }, 300)
           }, 4000)
                 } else if (step.message.includes('red roses') && step.type === 'emma') {
           setTimeout(() => {
             handleAddDecoration('flower')
           }, 4000)
                 } else if (step.message.includes('gold sparkles') && step.type === 'emma') {
           setTimeout(() => {
             handleAddDecoration('sparkle')
             setTimeout(() => {
               handleAddDecoration('sparkle')
             }, 1200)
             setTimeout(() => {
               handleAddDecoration('sparkle')
             }, 2400)
           }, 4000)
                          } else if (step.message.includes('big red heart') && step.type === 'emma') {
           setTimeout(() => {
             handleAddDecoration('heart')
             // Hide decoration panel after all decorations are added
             setTimeout(() => {
               setShowDecorationPanel(false)
             }, 2000)
           }, 4000)
         }

        setAutoPlayStep(prev => prev + 1)
      }, delay)

      return () => clearTimeout(timer)
    } else {
      // Auto-play completed
      setIsAutoPlaying(false)
      setAutoPlayStep(0)
    }
  }, [isAutoPlaying, autoPlayStep])

  const addMessage = (type: 'emma' | 'tma', message: string, action?: 'start' | 'photo' | 'message' | 'decoration' | 'review', context?: string) => {
    const newMessage: ConversationMessage = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      action,
      context
    }
    setConversation(prev => [...prev, newMessage])
  }

  const handleEmmaMessage = (message: string) => {
    if (!message.trim()) return

    addMessage('emma', message)
    setEmmaMessage('')
    setIsTyping(true)

    // TMA responds based on Emma's message
    setTimeout(() => {
      const response = generateTMAResponse(message)
      addMessage('tma', response.message, response.action, response.context)
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay to feel more natural
  }

  const generateTMAResponse = (emmaMessage: string): { message: string; action?: 'start' | 'photo' | 'message' | 'decoration' | 'review'; context?: string } => {
    const lowerMessage = emmaMessage.toLowerCase()

    // Photo-related responses
    if (lowerMessage.includes('picture') || lowerMessage.includes('photo') || lowerMessage.includes('camera')) {
      setShowPhotoStudio(true)
      return {
        message: 'Great idea! Let\'s take a beautiful picture of you for Mommy. I\'ll open the camera for you!',
        action: 'photo',
        context: 'emma_wants_photo'
      }
    }

    // Message writing responses
    if (lowerMessage.includes('write') || lowerMessage.includes('message') || lowerMessage.includes('tell') || lowerMessage.includes('say')) {
      setShowWritingBoard(true)
      return {
        message: 'Perfect! Let\'s write a special message to Mommy. What do you want to tell her?',
        action: 'message',
        context: 'emma_wants_to_write'
      }
    }

    // Decoration responses
    if (lowerMessage.includes('flower') || lowerMessage.includes('rose') || lowerMessage.includes('sparkle') || lowerMessage.includes('heart') || lowerMessage.includes('beautiful')) {
      setShowDecorationPanel(true)
      return {
        message: 'Oh yes! Let\'s make it beautiful with decorations. What would you like to add?',
        action: 'decoration',
        context: 'emma_wants_decorations'
      }
    }

    // Color preferences
    if (lowerMessage.includes('pink') || lowerMessage.includes('red') || lowerMessage.includes('blue') || lowerMessage.includes('purple')) {
      return {
        message: `${emmaMessage.includes('pink') ? 'Pink' : emmaMessage.includes('red') ? 'Red' : emmaMessage.includes('blue') ? 'Blue' : 'Purple'} is a beautiful choice! Mommy will love that color.`,
        context: 'emma_chose_color'
      }
    }

    // General encouragement
    if (lowerMessage.includes('mommy') || lowerMessage.includes('love') || lowerMessage.includes('special')) {
      return {
        message: 'You\'re so thoughtful, Emma! Mommy is going to love whatever you create for her.',
        context: 'emma_expressing_love'
      }
    }

    // Default response
    return {
      message: 'That\'s a wonderful idea, Emma! What would you like to do next? We could take a picture, write a message, or add some beautiful decorations.',
      context: 'general_guidance'
    }
  }

  const handleTakePhoto = () => {
    // Add photo after 5 seconds to show the photo being taken
    setTimeout(() => {
      const newPhoto: CardElement = {
        type: 'photo',
        content: '/testdata/girl.png',
        position: { x: 50, y: 40 }
      }
      setCardElements(prev => [...prev, newPhoto])
    }, 5000)
    
    addMessage('tma', 'Perfect! Your picture looks beautiful, Emma! Mommy will love seeing your smile.', 'photo')
  }

  const handleWriteMessage = () => {
    const newMessage: CardElement = {
      type: 'message',
      content: 'Dear Mommy, I love your hugs and stories. You\'re the best mommy ever! ❤️ Love, Emma',
      position: { x: 75, y: 80 }
    }
    setCardElements(prev => [...prev, newMessage])
    setShowWritingBoard(false)
    setShowHandwriting(false)
    setHandwritingProgress(0)
    addMessage('emma', 'I want to write: "Dear Mommy, I love your hugs and stories. You\'re the best mommy ever!"', 'message')
    addMessage('tma', 'That\'s such a beautiful message, Emma! Mommy will be so touched.', 'message')
  }

  const handleAddDecoration = (type: 'flower' | 'sparkle' | 'heart') => {
    const x = Math.random() * 80 + 10
    const y = Math.random() * 80 + 10
    console.log(`Adding ${type} at position: x=${x.toFixed(1)}, y=${y.toFixed(1)}`)
    
    const newDecoration: CardElement = {
      type,
      position: { x, y }
    }
    setCardElements(prev => [...prev, newDecoration])
    
    const decorationNames = {
      flower: 'red roses',
      sparkle: 'gold sparkles',
      heart: 'a big red heart'
    }
    
    addMessage('emma', `I want to add ${decorationNames[type]}!`, 'decoration')
    addMessage('tma', `Perfect choice! ${decorationNames[type]} will make your card extra special for Mommy.`, 'decoration')
  }

    const renderCardPreview = () => {
    return (
      <div className="bg-gradient-to-br from-pink-200 via-purple-100 to-pink-300 rounded-2xl p-8 min-h-[400px] relative shadow-xl overflow-hidden">
        {/* Background Image */}
        {cardElements.find(el => el.type === 'photo') && (
          <div className="absolute inset-0">
            <img 
              src="/testdata/girl.png" 
              alt="Emma Background" 
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        )}
        
        {/* Content Overlay */}
        <div className="relative z-10 h-full">
          {cardElements.map((element, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="absolute"
              style={{
                left: `${element.position?.x || 50}%`,
                top: `${element.position?.y || 50}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {element.type === 'message' && (
                <div className="text-gray-800 text-lg font-medium max-w-[200px] text-right leading-relaxed bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  "{element.content}"
                </div>
              )}
              {element.type === 'flower' && (
                <Flower className="w-10 h-10 text-pink-500 drop-shadow-sm" />
              )}
              {element.type === 'sparkle' && (
                <Sparkles className="w-8 h-8 text-yellow-500 drop-shadow-sm" />
              )}
              {element.type === 'heart' && (
                <Heart className="w-10 h-10 text-red-500 drop-shadow-sm" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            {onBack && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ← Back to Projects
              </motion.button>
            )}
            <div className="flex-1" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Emma's Mother's Day Card Project</h1>
          <p className="text-lg text-gray-600">A conversation-driven journey with AI Assistant collaboration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conversation Area */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-[600px] flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center relative">
                  <span className="text-white font-bold text-lg">AI Assistant</span>
                  {/* Voice listening indicator */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Volume2 className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">AI Assistant</h3>
                  <p className="text-sm text-gray-600">Emma's helpful assistant • Voice-enabled</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {conversation.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.type === 'emma' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'tma' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">AI</span>
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      message.type === 'emma'
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {message.type === 'emma' && (
                      <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center flex-shrink-0 relative">
                        <span className="text-pink-600 font-bold text-sm">E</span>
                        {/* Voice indicator */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                          <Mic className="w-2 h-2 text-white" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">AI</span>
                    </div>
                    <div className="bg-gray-100 text-gray-900 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex gap-2">
                  {/* Voice Mode Indicator */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-pink-100 rounded-xl">
                    <div className="flex items-center gap-1">
                      <Mic className="w-4 h-4 text-pink-600" />
                      <span className="text-xs text-pink-600 font-medium">Voice Mode</span>
                    </div>
                    {isListening && (
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 h-4 bg-pink-500 rounded-full"
                            animate={{
                              scaleY: [1, 2, 1],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Text Input (for demo purposes) */}
                  <input
                    type="text"
                    value={emmaMessage}
                    onChange={(e) => setEmmaMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleEmmaMessage(emmaMessage)}
                    placeholder={isAutoPlaying ? "Auto-demo in progress..." : "Voice transcription appears here..."}
                    disabled={isAutoPlaying}
                    className="flex-1 px-3 py-2 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  
                  {/* Voice Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsListening(!isListening)
                      if (!isListening) {
                        // Simulate voice input
                        setTimeout(() => {
                          setEmmaMessage("I want to take a picture of myself for Mommy!")
                          setIsListening(false)
                        }, 2000)
                      }
                    }}
                    disabled={isAutoPlaying}
                    className={`p-2 rounded-xl transition-colors disabled:opacity-50 ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-pink-500 text-white hover:bg-pink-600'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </motion.button>
                </div>
                
                {/* Voice Status */}
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-center"
                  >
                    <p className="text-xs text-pink-600 font-medium">🎤 Listening to Emma's voice...</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Workspace */}
          <div className="space-y-6">
            {/* Card Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Emma's Card</h3>
              {renderCardPreview()}
            </div>

            {/* Dynamic Tools */}
            <AnimatePresence>
              {showPhotoStudio && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Take Your Picture</h3>
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mx-auto flex items-center justify-center">
                      <Camera className="w-16 h-16 text-pink-500" />
                    </div>
                    <p className="text-gray-600">Click to take your picture for Mommy!</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleTakePhoto}
                      className="px-6 py-3 bg-pink-500 text-white rounded-full font-semibold"
                    >
                      📸 Take Photo
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {showWritingBoard && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Write Your Message</h3>
                  <div className="space-y-4">
                    {/* Handwriting Canvas */}
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl p-4 relative overflow-hidden">
                        {/* Paper texture lines */}
                        <div className="absolute inset-0 opacity-20">
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className="border-b border-pink-200"
                              style={{ top: `${i * 24}px`, height: '24px' }}
                            />
                          ))}
                        </div>
                        
                        {/* Handwriting area */}
                        <div className="relative z-10 h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl mb-2">✏️</div>
                            <p className="text-gray-500 text-sm">Draw your message here!</p>
                            <p className="text-gray-400 text-xs mt-1">Use your finger or mouse to write</p>
                          </div>
                        </div>
                        
                        {/* Simulated handwriting for demo */}
                        {showHandwriting && (
                          <div className="absolute inset-0 z-20 pointer-events-none">
                            <div className="p-4">
                              <div 
                                className="text-pink-600 text-lg leading-relaxed opacity-80"
                                style={{
                                  fontFamily: 'cursive, "Comic Sans MS", "Brush Script MT", serif',
                                  transform: 'rotate(-2deg)',
                                  transformOrigin: 'top left'
                                }}
                              >
                                <div style={{ opacity: Math.min(handwritingProgress * 3, 1) }}>
                                  Dear Mommy,
                                </div>
                                <div style={{ opacity: Math.max(0, Math.min((handwritingProgress - 0.2) * 3, 1)) }}>
                                  I love your hugs
                                </div>
                                <div style={{ opacity: Math.max(0, Math.min((handwritingProgress - 0.4) * 3, 1)) }}>
                                  and stories. You're
                                </div>
                                <div style={{ opacity: Math.max(0, Math.min((handwritingProgress - 0.6) * 3, 1)) }}>
                                  the best mommy
                                </div>
                                <div style={{ opacity: Math.max(0, Math.min((handwritingProgress - 0.8) * 3, 1)) }}>
                                  ever! ❤️
                                </div>
                                <div style={{ opacity: Math.max(0, Math.min((handwritingProgress - 0.9) * 10, 1)) }}>
                                  Love, Emma
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Writing tools */}
                      <div className="flex gap-2 mt-3 justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-pink-100 rounded-lg hover:bg-pink-200 transition-colors"
                        >
                          <span className="text-pink-600">🖊️</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
                        >
                          <span className="text-purple-600">🎨</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <span className="text-red-600">🧽</span>
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleWriteMessage}
                        className="px-6 py-3 bg-pink-500 text-white rounded-full font-semibold"
                      >
                        ✏️ Save Message
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {showDecorationPanel && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Add Beautiful Decorations</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddDecoration('flower')}
                      className="p-4 bg-pink-100 rounded-xl text-center hover:bg-pink-200 transition-colors"
                    >
                      <Flower className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold">Add Roses</p>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddDecoration('sparkle')}
                      className="p-4 bg-yellow-100 rounded-xl text-center hover:bg-yellow-200 transition-colors"
                    >
                      <Sparkles className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold">Add Sparkles</p>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddDecoration('heart')}
                      className="p-4 bg-red-100 rounded-xl text-center hover:bg-red-200 transition-colors"
                    >
                      <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold">Add Heart</p>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>


      </div>
    </div>
  )
} 