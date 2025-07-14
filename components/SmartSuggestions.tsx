'use client'

import { motion } from 'framer-motion'
import { 
  Activity, 
  BarChart3, 
  FileText, 
  Users, 
  Database, 
  GraduationCap,
  ShoppingCart,
  TrendingUp,
  Calendar,
  CheckCircle,
  Search,
  Zap
} from 'lucide-react'

interface SmartSuggestionsProps {
  context: string[]
  currentProjectType?: 'bubble-sort' | 'dashboard' | 'tumor-board' | null
  userInput?: string
  onSuggestionClick?: (suggestionId: string) => void
}

interface Suggestion {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: string
  priority: number
}

export default function SmartSuggestions({ context, currentProjectType, userInput, onSuggestionClick }: SmartSuggestionsProps) {
  const allSuggestions: Suggestion[] = [
    // Medical/Healthcare
    {
      id: 'tumor-board',
      title: 'Tumor Board Template',
      description: 'Comprehensive medical case review system with patient data visualization',
      icon: <Users className="w-5 h-5" />,
      category: 'medical',
      priority: 1
    },
    
    // E-commerce
    {
      id: 'ecommerce-analytics',
      title: 'E-commerce Analytics Dashboard',
      description: 'Real-time sales metrics, customer behavior, and inventory tracking',
      icon: <BarChart3 className="w-5 h-5" />,
      category: 'ecommerce',
      priority: 1
    },
    {
      id: 'sales-pipeline',
      title: 'Sales Pipeline Tracker',
      description: 'Lead management and conversion tracking with forecasting',
      icon: <TrendingUp className="w-5 h-5" />,
      category: 'business',
      priority: 2
    },
    
    // Technical/Data
    {
      id: 'bubble-sort',
      title: 'Bubble Sort Animation',
      description: 'Interactive algorithm visualization with step-by-step execution',
      icon: <Activity className="w-5 h-5" />,
      category: 'technical',
      priority: 1
    },
    {
      id: 'data-integration',
      title: 'Scientific Data Integration',
      description: 'Multi-source data aggregation and analysis platform',
      icon: <Database className="w-5 h-5" />,
      category: 'data',
      priority: 1
    },
    
    // Education
    {
      id: 'class-catalog',
      title: 'MIT Class Catalog',
      description: 'Course management system with prerequisites and scheduling',
      icon: <GraduationCap className="w-5 h-5" />,
      category: 'education',
      priority: 1
    },
    {
      id: 'graduation-tracker',
      title: 'Graduation Credit Tracker',
      description: 'Academic progress monitoring with degree requirement checking',
      icon: <CheckCircle className="w-5 h-5" />,
      category: 'education',
      priority: 2
    },
    
    // Business/HR
    {
      id: 'hiring-data',
      title: 'Hiring Data Analytics',
      description: 'Recruitment metrics and candidate pipeline analysis',
      icon: <Users className="w-5 h-5" />,
      category: 'hr',
      priority: 1
    },
    {
      id: 'job-checklist',
      title: 'Job Search Checklist',
      description: 'Application tracking and interview preparation system',
      icon: <Search className="w-5 h-5" />,
      category: 'hr',
      priority: 2
    },
    
    // General
    {
      id: 'restaurant-profitability',
      title: 'Restaurant Profitability Analysis',
      description: 'Financial modeling and operational efficiency tracking',
      icon: <TrendingUp className="w-5 h-5" />,
      category: 'business',
      priority: 1
    },
    {
      id: 'conflict-finder',
      title: 'SIGMOD Conflict Finder',
      description: 'Academic conflict of interest detection system',
      icon: <FileText className="w-5 h-5" />,
      category: 'academic',
      priority: 1
    }
  ]

  // Get context-aware suggestions based on current project type
  const getContextAwareSuggestions = (): Suggestion[] => {
    // Project-specific suggestions
    const projectSpecificSuggestions: Record<string, Suggestion[]> = {
      'bubble-sort': [
        {
          id: 'quick-sort',
          title: 'Quick Sort Animation',
          description: 'Divide and conquer sorting algorithm with pivot visualization',
          icon: <Activity className="w-5 h-5" />,
          category: 'algorithm',
          priority: 1
        },
        {
          id: 'merge-sort',
          title: 'Merge Sort Visualization',
          description: 'Recursive sorting with merge step animations',
          icon: <Activity className="w-5 h-5" />,
          category: 'algorithm',
          priority: 1
        },
        {
          id: 'binary-search',
          title: 'Binary Search Demo',
          description: 'Interactive search algorithm with step-by-step highlighting',
          icon: <Search className="w-5 h-5" />,
          category: 'algorithm',
          priority: 2
        },
        {
          id: 'pathfinding',
          title: 'Pathfinding Algorithms',
          description: 'A* and Dijkstra algorithms with visual path exploration',
          icon: <TrendingUp className="w-5 h-5" />,
          category: 'algorithm',
          priority: 2
        },
        {
          id: 'data-structures',
          title: 'Data Structure Visualizer',
          description: 'Trees, graphs, and linked lists with interactive manipulation',
          icon: <Database className="w-5 h-5" />,
          category: 'algorithm',
          priority: 3
        }
      ],
      'dashboard': [
        {
          id: 'real-time-monitoring',
          title: 'Real-time Monitoring',
          description: 'Live system metrics with alerts and notifications',
          icon: <Activity className="w-5 h-5" />,
          category: 'monitoring',
          priority: 1
        },
        {
          id: 'predictive-analytics',
          title: 'Predictive Analytics',
          description: 'Machine learning models with trend forecasting',
          icon: <TrendingUp className="w-5 h-5" />,
          category: 'analytics',
          priority: 1
        },
        {
          id: 'interactive-filters',
          title: 'Advanced Filters',
          description: 'Multi-dimensional data filtering and drill-down capabilities',
          icon: <Search className="w-5 h-5" />,
          category: 'analytics',
          priority: 2
        },
        {
          id: 'data-export',
          title: 'Data Export Tools',
          description: 'Multiple format export with scheduled reports',
          icon: <FileText className="w-5 h-5" />,
          category: 'analytics',
          priority: 2
        },
        {
          id: 'collaborative-dashboard',
          title: 'Collaborative Dashboard',
          description: 'Team sharing with comments and annotations',
          icon: <Users className="w-5 h-5" />,
          category: 'collaboration',
          priority: 3
        }
      ],
      'tumor-board': [
        {
          id: 'patient-portal',
          title: 'Patient Portal Integration',
          description: 'Secure patient data access with consent management',
          icon: <Users className="w-5 h-5" />,
          category: 'medical',
          priority: 1
        },
        {
          id: 'imaging-viewer',
          title: 'Advanced Imaging Viewer',
          description: 'DICOM image analysis with annotation tools',
          icon: <FileText className="w-5 h-5" />,
          category: 'medical',
          priority: 1
        },
        {
          id: 'treatment-planner',
          title: 'Treatment Planning Module',
          description: 'Evidence-based treatment recommendations',
          icon: <Activity className="w-5 h-5" />,
          category: 'medical',
          priority: 2
        },
        {
          id: 'clinical-trials',
          title: 'Clinical Trials Integration',
          description: 'Eligibility checking and trial matching',
          icon: <CheckCircle className="w-5 h-5" />,
          category: 'medical',
          priority: 2
        },
        {
          id: 'outcome-tracking',
          title: 'Outcome Tracking System',
          description: 'Long-term patient outcome monitoring',
          icon: <TrendingUp className="w-5 h-5" />,
          category: 'medical',
          priority: 3
        }
      ]
    }

    // If we have a specific project type, show relevant suggestions
    if (currentProjectType && projectSpecificSuggestions[currentProjectType]) {
      return projectSpecificSuggestions[currentProjectType]
    }

    // Fallback to context-based filtering
    if (context.length === 0) {
      return allSuggestions.slice(0, 4) // Show general suggestions
    }

    const relevantSuggestions = allSuggestions.filter(suggestion =>
      context.some(ctx => 
        suggestion.category.includes(ctx) || 
        ctx.includes(suggestion.category)
      )
    )

    // Sort by priority and relevance
    return relevantSuggestions
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 5) // Show max 5 suggestions
  }

  const suggestions = getContextAwareSuggestions()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {currentProjectType === 'bubble-sort' ? 'Algorithm Suggestions' :
             currentProjectType === 'dashboard' ? 'Analytics Enhancements' :
             currentProjectType === 'tumor-board' ? 'Medical Enhancements' :
             'Smart Suggestions'}
          </h3>
          <p className="text-sm text-gray-500">
            {currentProjectType === 'bubble-sort' ? 'Related algorithms and data structures to explore' :
             currentProjectType === 'dashboard' ? 'Advanced analytics and monitoring features' :
             currentProjectType === 'tumor-board' ? 'Medical workflow and patient care features' :
             `Based on your context: ${context.join(', ')}`}
          </p>
        </div>
        <div className="flex items-center gap-2 text-primary-600">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">
            {currentProjectType ? 'Context-Aware' : 'AI-Powered'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {suggestions.map((suggestion: Suggestion, index: number) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="group cursor-pointer"
          >
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200 hover:border-primary-200 transition-all duration-300 h-full">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <div className="text-primary-600">
                    {suggestion.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-primary-700 transition-colors">
                    {suggestion.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="mt-3 pt-3 border-t border-gray-200"
              >
                <button 
                  onClick={() => onSuggestionClick?.(suggestion.id)}
                  className="w-full text-xs bg-primary-600 text-white py-2 px-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Start Building
                </button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {suggestions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500">No specific suggestions found. Try refining your request.</p>
        </motion.div>
      )}
    </motion.div>
  )
} 