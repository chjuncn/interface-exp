'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Award, Calendar, MapPin, Briefcase, GraduationCap, Shield, CheckCircle, ExternalLink, Mail, Linkedin, Github } from 'lucide-react'

interface EngineerProfileProps {
  isOpen: boolean
  onClose: () => void
  engineer: {
    name: string
    title: string
    avatar: string
    rating: number
    verifiedProjects: number
    experience: string
    location: string
    certifications: string[]
    skills: string[]
    bio: string
    contact: {
      email: string
      linkedin: string
      github: string
    }
  }
}

export default function EngineerProfile({ isOpen, onClose, engineer }: EngineerProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'certifications' | 'projects'>('overview')

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
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {engineer.avatar}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{engineer.name}</h2>
                  <p className="text-blue-100 mb-2">{engineer.title}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-300 fill-current" />
                      <span>{engineer.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      <span>{engineer.verifiedProjects} verified projects</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                {[
                  { id: 'overview', label: 'Overview', icon: Briefcase },
                  { id: 'certifications', label: 'Certifications', icon: Award },
                  { id: 'projects', label: 'Projects', icon: CheckCircle }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {/* Bio */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                      <p className="text-gray-600 leading-relaxed">{engineer.bio}</p>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{engineer.experience}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{engineer.location}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {engineer.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contact */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
                      <div className="flex gap-3">
                        <a
                          href={`mailto:${engineer.contact.email}`}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </a>
                        <a
                          href={engineer.contact.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </a>
                        <a
                          href={engineer.contact.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          GitHub
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'certifications' && (
                  <motion.div
                    key="certifications"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
                    {engineer.certifications.map((cert, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Award className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{cert}</h4>
                          <p className="text-sm text-gray-500">Verified • Active</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'projects' && (
                  <motion.div
                    key="projects"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Verified Projects</h3>
                    {[
                      { name: 'E-commerce Platform', type: 'Full-stack', rating: 5 },
                      { name: 'AI Chat Assistant', type: 'Machine Learning', rating: 5 },
                      { name: 'Data Visualization Dashboard', type: 'Frontend', rating: 5 },
                      { name: 'Mobile Banking App', type: 'Mobile', rating: 5 },
                      { name: 'Real-time Analytics System', type: 'Backend', rating: 5 }
                    ].map((project, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{project.name}</h4>
                            <p className="text-sm text-gray-500">{project.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(project.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 