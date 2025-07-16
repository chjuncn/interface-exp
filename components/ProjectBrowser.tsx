'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  Copy, 
  Star, 
  Clock, 
  Users,
  BarChart3,
  Activity,
  Users as UsersIcon,
  TrendingUp,
  Database,
  GraduationCap,
  ShoppingCart,
  Heart,
  Zap,
  ArrowRight,
  X
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

interface ProjectBrowserProps {
  projects: Project[]
  onSelectProject: (project: Project) => void
  onCloneProject: (project: Project) => void
  onClose: () => void
}

export default function ProjectBrowser({ projects, onSelectProject, onCloneProject, onClose }: ProjectBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent')

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])



  const categories = [
    { id: 'all', name: 'All Projects', icon: <Grid className="w-4 h-4" /> },
    { id: 'bubble-sort', name: 'Algorithms', icon: <Activity className="w-4 h-4" /> },
    { id: 'dashboard', name: 'Dashboards', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'tumor-board', name: 'Medical', icon: <UsersIcon className="w-4 h-4" /> },
    { id: 'ecommerce', name: 'E-commerce', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'education', name: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'data', name: 'Data Science', icon: <Database className="w-4 h-4" /> }
  ]

  const filteredProjects = useMemo(() => {
    let filtered = projects

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        project.context.some(ctx => ctx.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => 
        project.type === selectedCategory || 
        project.context.includes(selectedCategory)
      )
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'popular':
          return (b.usageCount || 0) - (a.usageCount || 0)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [projects, searchQuery, selectedCategory, sortBy])

  const getProjectIcon = (project: Project) => {
    switch (project.type) {
      case 'bubble-sort':
        return <Activity className="w-5 h-5" />
      case 'dashboard':
        return <BarChart3 className="w-5 h-5" />
      case 'tumor-board':
        return <UsersIcon className="w-5 h-5" />
      default:
        return <Zap className="w-5 h-5" />
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Browse Projects</h2>
            <p className="text-gray-600">Find and clone existing projects or create your own</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'rating')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid/List */}
        <div className="flex-1 overflow-auto p-6">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${
                    viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getProjectColor(project)}`}>
                            {getProjectIcon(project)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{project.name}</h3>
                            <p className="text-sm text-gray-500">{project.author || 'Anonymous'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{project.rating || 4.5}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2">
                        {project.description || project.userInput}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {project.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {project.usageCount || 0}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onSelectProject(project)}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </button>
                          <button
                            onClick={() => onCloneProject(project)}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            Clone
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <>
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-lg ${getProjectColor(project)}`}>
                          {getProjectIcon(project)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {project.description || project.userInput}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span>{project.author || 'Anonymous'}</span>
                            <span>•</span>
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{project.usageCount || 0} uses</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{project.rating || 4.5}</span>
                        </div>
                        <button
                          onClick={() => onSelectProject(project)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        <button
                          onClick={() => onCloneProject(project)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          Clone
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
} 