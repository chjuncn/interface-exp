'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'

interface InputBoxProps {
  onStartBuilding: (input: string) => void
}

export default function InputBox({ onStartBuilding }: InputBoxProps) {
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onStartBuilding(input.trim())
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto text-center"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <h1 className="text-5xl font-bold text-gradient mb-4">
          Build Something Amazing
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
        className="mt-12"
      >
        <p className="text-sm text-gray-500 mb-4">Try these examples:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            "Tumor board template",
            "E-commerce analytics",
            "Bubble sort animation",
            "Restaurant profitability",
            "Sales pipeline",
            "Job search checklist"
          ].map((example, index) => (
            <motion.button
              key={example}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setInput(example)}
              className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-gray-600 hover:bg-white/80 transition-all duration-200 border border-gray-200"
              style={{ animationDelay: `${1.2 + index * 0.1}s` }}
            >
              {example}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
} 