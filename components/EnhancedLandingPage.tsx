'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Users, 
  TrendingUp,
  BarChart3,
  Activity,
  Users as UsersIcon,
  Database,
  GraduationCap,
  ShoppingCart,
  Zap,
  BookOpen,
  Lightbulb,
  Rocket
} from 'lucide-react'
import InputBox from './InputBox'
import ProjectBrowser from './ProjectBrowser'
import ProjectPreview from './ProjectPreview'

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

interface EnhancedLandingPageProps {
  projects: Project[]
  onStartBuilding: (input: string) => void
  onCloneProject: (project: Project) => void
}

export default function EnhancedLandingPage({ projects, onStartBuilding, onCloneProject }: EnhancedLandingPageProps) {
  const [showProjectBrowser, setShowProjectBrowser] = useState(false)
  const [showCreateNew, setShowCreateNew] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)



  const featuredProjects = projects.slice(0, 6) // Show first 6 projects as featured

  const categories = [
    { id: 'bubble-sort', name: 'Algorithms', icon: <Activity className="w-5 h-5" />, count: projects.filter(p => p.type === 'bubble-sort').length },
    { id: 'dashboard', name: 'Dashboards', icon: <BarChart3 className="w-5 h-5" />, count: projects.filter(p => p.type === 'dashboard').length },
    { id: 'tumor-board', name: 'Medical', icon: <UsersIcon className="w-5 h-5" />, count: projects.filter(p => p.type === 'tumor-board').length },
    { id: 'ecommerce', name: 'E-commerce', icon: <ShoppingCart className="w-5 h-5" />, count: projects.filter(p => p.context.includes('ecommerce')).length },
    { id: 'education', name: 'Education', icon: <GraduationCap className="w-5 h-5" />, count: projects.filter(p => p.context.includes('education')).length },
    { id: 'data', name: 'Data Science', icon: <Database className="w-5 h-5" />, count: projects.filter(p => p.context.includes('data')).length }
  ]

  const getProjectIcon = (project: Project) => {
    switch (project.type) {
      case 'bubble-sort':
        return <Activity className="w-4 h-4" />
      case 'dashboard':
        return <BarChart3 className="w-4 h-4" />
      case 'tumor-board':
        return <UsersIcon className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!showCreateNew ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Interface Builder
                    </h1>
                  </div>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Create, discover, and customize interactive interfaces with AI-powered suggestions
                  </p>
                </motion.div>

                {/* Main Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <button
                    onClick={() => setShowProjectBrowser(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200 group"
                  >
                    <Search className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Browse Templates</div>
                      <div className="text-sm text-gray-500">Find existing projects</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setShowCreateNew(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 group"
                  >
                    <Plus className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">Create New Project</div>
                      <div className="text-sm text-blue-100">Start from scratch</div>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </div>

              {/* Stats Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              >
                <div className="bg-white rounded-xl p-6 text-center shadow-sm border">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{projects.length}</div>
                  <div className="text-gray-600">Available Templates</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm border">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {projects.reduce((sum, p) => sum + (p.usageCount || 0), 0)}
                  </div>
                  <div className="text-gray-600">Total Uses</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm border">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {(projects.reduce((sum, p) => sum + (p.rating || 0), 0) / Math.max(projects.length, 1)).toFixed(1)}
                  </div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
              </motion.div>

              {/* Categories Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore by Category</h2>
                  <p className="text-gray-600">Find templates that match your needs</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setShowProjectBrowser(true)}
                      className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300 group"
                    >
                      <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        {category.icon}
                      </div>
                      <div className="font-medium text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.count} templates</div>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Featured Projects */}
              {featuredProjects.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Featured Templates</h2>
                      <p className="text-gray-600">Popular and recently created projects</p>
                    </div>
                    <button
                      onClick={() => setShowProjectBrowser(true)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredProjects.map((project) => (
                      <motion.div
                        key={project.id}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                        onClick={() => {
                          setSelectedProject(project)
                          setShowProjectBrowser(true)
                        }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-2 rounded-lg ${getProjectColor(project)}`}>
                            {getProjectIcon(project)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{project.rating || 4.5}</span>
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {project.description || project.userInput}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{project.author || 'Anonymous'}</span>
                          <span>{project.usageCount || 0} uses</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quick Start Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
              >
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Rocket className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
                  </div>
                  <p className="text-blue-100">
                    Describe what you want to build and let AI help you create the perfect interface
                  </p>
                  <button
                    onClick={() => setShowCreateNew(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    <Lightbulb className="w-5 h-5" />
                    Start Building
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="create"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center min-h-[80vh]"
            >
              <div className="w-full max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setShowCreateNew(false)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back to Browse
                  </button>
                </div>
                <InputBox onStartBuilding={onStartBuilding} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Browser Modal */}
        <AnimatePresence>
          {showProjectBrowser && (
            <ProjectBrowser
              key="project-browser"
              projects={projects}
              onSelectProject={(project) => {
                setSelectedProject(project)
              }}
              onCloneProject={onCloneProject}
              onClose={() => setShowProjectBrowser(false)}
            />
          )}
        </AnimatePresence>

        {/* Project Preview Modal */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectPreview
              key="project-preview"
              project={selectedProject}
              isOpen={true}
              onClose={() => setSelectedProject(null)}
              onClone={(project) => {
                onCloneProject(project)
                setSelectedProject(null)
                setShowProjectBrowser(false)
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 