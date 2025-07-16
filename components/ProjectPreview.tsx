'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Copy, 
  Star, 
  Clock, 
  Users, 
  Tag, 
  User,
  Activity,
  BarChart3,
  Users as UsersIcon,
  Zap,
  Eye,
  Play
} from 'lucide-react'

interface Project {
  id: string
  name: string
  type: 'bubble-sort' | 'dashboard' | 'tumor-board' | null
  userInput: string
  context: string[]
  createdAt: Date
  isActive: boolean
  description?: string
  tags?: string[]
  author?: string
  rating?: number
  usageCount?: number
  preview?: string
}

interface ProjectPreviewProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onClone: (project: Project) => void
}

export default function ProjectPreview({ project, isOpen, onClose, onClone }: ProjectPreviewProps) {
  if (!project) return null

  const getProjectIcon = (project: Project) => {
    switch (project.type) {
      case 'bubble-sort':
        return <Activity className="w-6 h-6" />
      case 'dashboard':
        return <BarChart3 className="w-6 h-6" />
      case 'tumor-board':
        return <UsersIcon className="w-6 h-6" />
      default:
        return <Zap className="w-6 h-6" />
    }
  }

  const getProjectColor = (project: Project) => {
    switch (project.type) {
      case 'bubble-sort':
        return 'bg-blue-100 text-blue-700'
      case 'dashboard':
        return 'bg-green-100 text-green-700'
      case 'tumor-board':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getProjectTypeName = (project: Project) => {
    switch (project.type) {
      case 'bubble-sort':
        return 'Algorithm Visualization'
      case 'dashboard':
        return 'Data Dashboard'
      case 'tumor-board':
        return 'Medical Template'
      default:
        return 'Custom Project'
    }
  }

  return (
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${getProjectColor(project)}`}>
              {getProjectIcon(project)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
              <p className="text-gray-600">{getProjectTypeName(project)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
          {/* Left Panel - Project Details */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {project.description || project.userInput}
                </p>
              </div>

              {/* Original Request */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Original Request</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 italic">"{project.userInput}"</p>
                </div>
              </div>

              {/* Project Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Author: {project.author || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        Created: {project.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        Used {project.usageCount || 0} times
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-600">
                        Rating: {project.rating || 0}/5
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Context & Tags</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Context</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.context.map((ctx) => (
                          <span
                            key={ctx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {ctx}
                          </span>
                        ))}
                      </div>
                    </div>
                    {project.tags && project.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:w-96 border-l border-gray-200 p-6 bg-gray-50">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              
              {/* Preview Placeholder */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Project Preview</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => onClone(project)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Copy className="w-4 h-4" />
                  Clone & Edit
                </button>
                <button
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Live Demo
                </button>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Interactive visualization
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Real-time updates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Customizable parameters
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Export capabilities
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
} 