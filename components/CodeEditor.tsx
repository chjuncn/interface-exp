'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Save, Code, Eye, RotateCcw } from 'lucide-react'
import { validateDSL, parseDSL } from '@/utils/dslParser'
import AnimationPreview from './AnimationPreview'
import DashboardPreview from './DashboardPreview'

interface CodeEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (code: string) => void
  projectType?: 'bubble-sort' | 'dashboard' | null
}

export default function CodeEditor({ isOpen, onClose, onSave, projectType }: CodeEditorProps) {
  // Get default code based on project type
  const getDefaultCode = () => {
    if (projectType === 'dashboard') {
      return `// Dashboard Configuration
dashboard {
  name: "Data Analytics Dashboard"
  theme: "modern"
  layout: "responsive"
  refresh-rate: 5000ms
}

charts {
  primary: {
    type: "bar"
    data-source: "sales-data"
    title: "Monthly Sales"
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]
  }
  secondary: {
    type: "line"
    data-source: "trends"
    title: "Revenue Trends"
    colors: ["#8B5CF6", "#06B6D4"]
  }
  tertiary: {
    type: "pie"
    data-source: "categories"
    title: "Category Distribution"
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]
  }
}

data-sources {
  sales-data: {
    type: "api"
    endpoint: "/api/sales"
    refresh: true
    cache: 300s
  }
  trends: {
    type: "database"
    query: "SELECT * FROM revenue_trends"
    refresh: true
  }
  categories: {
    type: "static"
    data: [
      { label: "Electronics", value: 35 },
      { label: "Clothing", value: 25 },
      { label: "Books", value: 20 },
      { label: "Home", value: 15 },
      { label: "Other", value: 5 }
    ]
  }
}

features {
  real-time: true
  export: true
  filters: true
  drill-down: true
  alerts: true
}`
    }
    
    // Default bubble sort code
    return `// Bubble Sort Animation DSL
animation {
  name: "Bubble Sort Visualization"
  algorithm: "bubble-sort"
  speed: 1000ms
  colors: {
    default: "#ffffff"
    comparing: "#fbbf24"
    swapping: "#ef4444"
    sorted: "#10b981"
  }
}

input {
  type: "number-array"
  default: [64, 34, 25, 12, 22, 11, 90]
  placeholder: "Enter comma-separated numbers"
}

visualization {
  type: "array-bars"
  style: "rounded-cards"
  animation: "smooth-transitions"
  show-timeline: true
  show-description: true
}

controls {
  play: true
  pause: true
  reset: true
  step-forward: true
  step-backward: true
  speed-control: true
}`
  }

  const [code, setCode] = useState(getDefaultCode())

  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code')
  const [isValid, setIsValid] = useState(true)
  const [validationError, setValidationError] = useState<string>('')

  const handleSave = () => {
    if (isValid) {
      onSave(code)
      onClose()
    }
  }

  // Validate code when it changes
  useEffect(() => {
    const result = parseDSL(code)
    setIsValid(result.success)
    setValidationError(result.error || '')
  }, [code])

  const handleReset = () => {
    setCode(getDefaultCode())
  }

  // Simple syntax highlighting
  const highlightSyntax = (text: string) => {
    return text
      .replace(/(\/\/.*)/g, '<span class="text-green-600">$1</span>')
      .replace(/\b(animation|input|visualization|controls|dashboard|charts|data-sources|features)\b/g, '<span class="text-blue-600 font-semibold">$1</span>')
      .replace(/\b(name|algorithm|speed|colors|type|default|style|animation|show-timeline|show-description|play|pause|reset|step-forward|step-backward|speed-control|theme|layout|refresh-rate|data-source|title|endpoint|refresh|cache|query|real-time|export|filters|drill-down|alerts)\b/g, '<span class="text-purple-600">$1</span>')
      .replace(/\b(bubble-sort|number-array|array-bars|rounded-cards|smooth-transitions|bar|line|pie|api|database|static|modern|responsive)\b/g, '<span class="text-orange-600">$1</span>')
      .replace(/\b(true|false)\b/g, '<span class="text-red-600">$1</span>')
      .replace(/(\d+ms|\d+s)/g, '<span class="text-indigo-600">$1</span>')
      .replace(/(#[0-9a-fA-F]{6})/g, '<span class="text-pink-600">$1</span>')
      .replace(/(\[.*?\])/g, '<span class="text-gray-700">$1</span>')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {projectType === 'dashboard' ? 'Edit Dashboard Configuration' : 'Edit Animation Code'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {projectType === 'dashboard' ? 'Modify the dashboard layout, charts, and data sources' : 'Modify the bubble sort animation configuration'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Reset to default"
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('code')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'code'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Code className="w-4 h-4 inline mr-2" />
                Source Code
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Live Preview
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex">
              {activeTab === 'code' ? (
                <div className="flex-1 flex flex-col">
                  {/* Code Editor */}
                  <div className="flex-1 p-6">
                    <div className="h-full bg-gray-900 rounded-lg overflow-hidden">
                      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-400 text-sm ml-2">
                            {projectType === 'dashboard' ? 'dashboard-config.dsl' : 'bubble-sort.dsl'}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 h-full overflow-auto">
                        <textarea
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full h-full bg-transparent text-gray-100 font-mono text-sm leading-relaxed resize-none outline-none"
                          spellCheck={false}
                          placeholder="Enter your animation DSL code here..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Code Info */}
                  <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Lines: {code.split('\n').length}</span>
                        <span>Characters: {code.length}</span>
                        <span className={`flex items-center gap-1 ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                          <div className={`w-2 h-2 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          {isValid ? 'Valid' : 'Invalid'}
                        </span>
                        {!isValid && validationError && (
                          <span className="text-xs text-red-600 max-w-xs truncate" title={validationError}>
                            {validationError}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab('preview')}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          <Play className="w-4 h-4" />
                          Preview
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSave}
                          disabled={!isValid}
                          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
                             ) : (
                 <div className="flex-1">
                   {projectType === 'dashboard' ? (
                     <DashboardPreview code={code} />
                   ) : (
                     <AnimationPreview code={code} />
                   )}
                 </div>
               )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 