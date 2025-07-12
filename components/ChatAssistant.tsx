'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Send, Bot, User } from 'lucide-react'

interface ChatAssistantProps {
  userInput: string
  context: string[]
}

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatAssistant({ userInput, context }: ChatAssistantProps) {
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

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

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
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateResponse(newMessage, context),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    }, 1000)
  }

  const generateResponse = (message: string, context: string[]): string => {
    const lowerMessage = message.toLowerCase()
    
    // Context-specific responses
    if (context.includes('technical') || context.includes('data')) {
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

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-full bg-white rounded-2xl shadow-soft border border-gray-100 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-sm text-gray-500">Context-aware guidance</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'assistant' && (
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-600" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {message.type === 'user' && (
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
} 