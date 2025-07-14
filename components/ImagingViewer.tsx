'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw, 
  Move, 
  PenTool, 
  Square, 
  Circle, 
  Type, 
  Download,
  Share2,
  Settings,
  Eye,
  EyeOff,
  Layers,
  Palette,
  Undo,
  Redo,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Brain
} from 'lucide-react'

interface DICOMImage {
  id: string
  name: string
  type: 'CT' | 'MRI' | 'X-Ray' | 'PET' | 'Ultrasound'
  series: string
  date: string
  description: string
  url: string
  metadata: {
    patientId: string
    studyId: string
    modality: string
    bodyPart: string
    sliceThickness: string
    pixelSpacing: string
  }
}

interface Annotation {
  id: string
  type: 'measurement' | 'marker' | 'text' | 'region'
  x: number
  y: number
  width?: number
  height?: number
  text?: string
  color: string
  visible: boolean
  timestamp: Date
}

interface ImagingViewerProps {
  isOpen: boolean
  onClose: () => void
  patientData?: any
}

export default function ImagingViewer({ isOpen, onClose, patientData }: ImagingViewerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [selectedTool, setSelectedTool] = useState<'pan' | 'measurement' | 'marker' | 'text' | 'region'>('pan')
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [windowLevel, setWindowLevel] = useState({ window: 2000, level: 400 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Mock DICOM images for demonstration
  const mockImages: DICOMImage[] = [
    {
      id: '1',
      name: 'Chest CT - Axial',
      type: 'CT',
      series: 'Chest CT Series 1',
      date: '2024-01-15',
      description: 'Axial view showing 2.5cm mass in right upper lobe',
      url: '/api/mock-dicom/chest-ct-axial',
      metadata: {
        patientId: 'P001',
        studyId: 'S001',
        modality: 'CT',
        bodyPart: 'CHEST',
        sliceThickness: '2.5mm',
        pixelSpacing: '0.7mm x 0.7mm'
      }
    },
    {
      id: '2',
      name: 'Chest CT - Coronal',
      type: 'CT',
      series: 'Chest CT Series 1',
      date: '2024-01-15',
      description: 'Coronal view showing mediastinal lymph nodes',
      url: '/api/mock-dicom/chest-ct-coronal',
      metadata: {
        patientId: 'P001',
        studyId: 'S001',
        modality: 'CT',
        bodyPart: 'CHEST',
        sliceThickness: '2.5mm',
        pixelSpacing: '0.7mm x 0.7mm'
      }
    },
    {
      id: '3',
      name: 'PET Scan - Fusion',
      type: 'PET',
      series: 'PET-CT Series 1',
      date: '2024-01-16',
      description: 'FDG-avid mass with SUV max 8.2',
      url: '/api/mock-dicom/pet-fusion',
      metadata: {
        patientId: 'P001',
        studyId: 'S002',
        modality: 'PET',
        bodyPart: 'CHEST',
        sliceThickness: '3.0mm',
        pixelSpacing: '2.7mm x 2.7mm'
      }
    },
    {
      id: '4',
      name: 'Brain MRI - T1',
      type: 'MRI',
      series: 'Brain MRI Series 1',
      date: '2024-01-17',
      description: 'T1-weighted image showing no brain metastases',
      url: '/api/mock-dicom/brain-mri-t1',
      metadata: {
        patientId: 'P001',
        studyId: 'S003',
        modality: 'MR',
        bodyPart: 'BRAIN',
        sliceThickness: '5.0mm',
        pixelSpacing: '0.9mm x 0.9mm'
      }
    }
  ]

  const currentImage = mockImages[currentImageIndex]

  // Tool colors
  const toolColors = {
    measurement: '#ff6b6b',
    marker: '#4ecdc4',
    text: '#45b7d1',
    region: '#96ceb4'
  }

  // Handle mouse events for panning and annotations
  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedTool === 'pan') {
      setIsPanning(true)
    } else {
      // Add annotation
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const x = (e.clientX - rect.left) / zoom
        const y = (e.clientY - rect.top) / zoom
        
        const newAnnotation: Annotation = {
          id: Date.now().toString(),
          type: selectedTool,
          x,
          y,
          color: toolColors[selectedTool as keyof typeof toolColors],
          visible: true,
          timestamp: new Date()
        }
        
        setAnnotations(prev => [...prev, newAnnotation])
        setSelectedAnnotation(newAnnotation.id)
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && selectedTool === 'pan') {
      setPan(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }))
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5))
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1))
  const handleZoomReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setRotation(0)
  }

  // Rotation controls
  const handleRotateLeft = () => setRotation(prev => prev - 90)
  const handleRotateRight = () => setRotation(prev => prev + 90)

  // Window/Level controls
  const handleWindowChange = (value: number) => setWindowLevel(prev => ({ ...prev, window: value }))
  const handleLevelChange = (value: number) => setWindowLevel(prev => ({ ...prev, level: value }))

  // Annotation controls
  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id))
    setSelectedAnnotation(null)
  }

  const handleToggleAnnotationVisibility = (id: string) => {
    setAnnotations(prev => prev.map(ann => 
      ann.id === id ? { ...ann, visible: !ann.visible } : ann
    ))
  }

  // Playback controls
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % mockImages.length)
      }, 2000 / playbackSpeed)
      
      return () => clearInterval(interval)
    }
  }, [isPlaying, playbackSpeed, mockImages.length])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Advanced Imaging Viewer</h2>
                  <p className="text-sm text-gray-500">
                    {currentImage?.name} • {currentImage?.metadata.modality} • {currentImage?.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
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

            {/* Main Content */}
            <div className="flex-1 flex">
              {/* Left Sidebar - Tools */}
              <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
                {/* Navigation Tools */}
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedTool('pan')}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedTool === 'pan' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    title="Pan Tool"
                  >
                    <Move className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedTool('measurement')}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedTool === 'measurement' ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    title="Measurement Tool"
                  >
                    <Square className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedTool('marker')}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedTool === 'marker' ? 'bg-teal-100 text-teal-600' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    title="Marker Tool"
                  >
                    <Circle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedTool('text')}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedTool === 'text' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    title="Text Tool"
                  >
                    <Type className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedTool('region')}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedTool === 'region' ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    title="Region Tool"
                  >
                    <PenTool className="w-5 h-5" />
                  </button>
                </div>

                <div className="border-t border-gray-200 w-8 mx-auto"></div>

                {/* View Controls */}
                <div className="space-y-2">
                  <button
                    onClick={handleZoomIn}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleRotateLeft}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Rotate Left"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleRotateRight}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Rotate Right"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                </div>

                <div className="border-t border-gray-200 w-8 mx-auto"></div>

                {/* Annotation Controls */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowAnnotations(!showAnnotations)}
                    className={`p-2 rounded-lg transition-colors ${
                      showAnnotations ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    title="Toggle Annotations"
                  >
                    {showAnnotations ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setAnnotations([])}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Clear All Annotations"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Center - Image Viewer */}
              <div className="flex-1 flex flex-col">
                {/* Image Controls */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    {/* Image Navigation */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : mockImages.length - 1)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-sm text-gray-600">
                        {currentImageIndex + 1} of {mockImages.length}
                      </span>
                      <button
                        onClick={() => setCurrentImageIndex(prev => (prev + 1) % mockImages.length)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={1}>1x</option>
                        <option value={2}>2x</option>
                        <option value={4}>4x</option>
                      </select>
                    </div>

                    {/* Window/Level Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Window:</span>
                        <input
                          type="range"
                          min="100"
                          max="4000"
                          value={windowLevel.window}
                          onChange={(e) => handleWindowChange(Number(e.target.value))}
                          className="w-20"
                        />
                        <span className="text-sm text-gray-600 w-12">{windowLevel.window}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Level:</span>
                        <input
                          type="range"
                          min="-1000"
                          max="1000"
                          value={windowLevel.level}
                          onChange={(e) => handleLevelChange(Number(e.target.value))}
                          className="w-20"
                        />
                        <span className="text-sm text-gray-600 w-12">{windowLevel.level}</span>
                      </div>
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={handleZoomReset}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Reset View
                    </button>
                  </div>
                </div>

                {/* Image Display */}
                <div 
                  ref={containerRef}
                  className="flex-1 relative overflow-hidden bg-gray-900 flex items-center justify-center"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {/* Mock DICOM Image */}
                  <div className="relative">
                    <div 
                      className="w-96 h-96 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg border-2 border-gray-600 flex items-center justify-center"
                      style={{
                        transform: `scale(${zoom}) rotate(${rotation}deg) translate(${pan.x}px, ${pan.y}px)`,
                        transition: isPanning ? 'none' : 'transform 0.1s ease-out'
                      }}
                    >
                      <div className="text-center text-gray-300">
                        <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Eye className="w-8 h-8" />
                        </div>
                        <p className="text-lg font-semibold mb-2">{currentImage?.name}</p>
                        <p className="text-sm opacity-75">{currentImage?.description}</p>
                        <div className="mt-4 text-xs space-y-1">
                          <p>Modality: {currentImage?.metadata.modality}</p>
                          <p>Body Part: {currentImage?.metadata.bodyPart}</p>
                          <p>Slice Thickness: {currentImage?.metadata.sliceThickness}</p>
                          <p>Pixel Spacing: {currentImage?.metadata.pixelSpacing}</p>
                        </div>
                      </div>
                    </div>

                    {/* Annotations Overlay */}
                    {showAnnotations && annotations.map((annotation) => (
                      <div
                        key={annotation.id}
                        className="absolute"
                        style={{
                          left: annotation.x * zoom + pan.x,
                          top: annotation.y * zoom + pan.y,
                          transform: `rotate(${rotation}deg)`
                        }}
                      >
                        {annotation.type === 'measurement' && (
                          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                        )}
                        {annotation.type === 'marker' && (
                          <div className="w-6 h-6 bg-teal-500 rounded-full border-2 border-white shadow-lg"></div>
                        )}
                        {annotation.type === 'text' && (
                          <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs shadow-lg">
                            Note
                          </div>
                        )}
                        {annotation.type === 'region' && (
                          <div className="w-8 h-8 bg-green-500 rounded border-2 border-white shadow-lg"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Zoom Level Indicator */}
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                    {Math.round(zoom * 100)}%
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Annotations & Metadata */}
              <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
                {/* AI Annotations Panel */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-semibold text-gray-900">AI Annotations</h3>
                  </div>
                  
                  {/* Chest X-ray Analysis Table */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Chest X-ray Analysis</h4>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">Finding</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">Location</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">Confidence</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-900">Pulmonary Nodule</td>
                            <td className="px-3 py-2 text-gray-700">Right Upper Lobe</td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">95%</span>
                            </td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Abnormal</span>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-900">Mediastinal Widening</td>
                            <td className="px-3 py-2 text-gray-700">Mediastinum</td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">87%</span>
                            </td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Suspicious</span>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-900">Pleural Effusion</td>
                            <td className="px-3 py-2 text-gray-700">Right Hemithorax</td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">92%</span>
                            </td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Abnormal</span>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-900">Cardiomegaly</td>
                            <td className="px-3 py-2 text-gray-700">Cardiac Silhouette</td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">78%</span>
                            </td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Suspicious</span>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-900">Atelectasis</td>
                            <td className="px-3 py-2 text-gray-700">Left Lower Lobe</td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">82%</span>
                            </td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Mild</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* AI-Generated Annotations */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">AI-Generated Annotations</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {annotations.length === 0 ? (
                        <p className="text-sm text-gray-500">No AI annotations yet. AI will automatically detect and mark findings.</p>
                      ) : (
                        annotations.map((annotation) => (
                          <div
                            key={annotation.id}
                            className={`p-2 rounded border cursor-pointer transition-colors ${
                              selectedAnnotation === annotation.id ? 'bg-purple-100 border-purple-300' : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedAnnotation(annotation.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Brain className="w-3 h-3 text-purple-500" />
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: annotation.color }}
                                ></div>
                                <span className="text-sm font-medium capitalize">{annotation.type}</span>
                                <span className="text-xs text-purple-600 bg-purple-100 px-1 rounded">AI</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleToggleAnnotationVisibility(annotation.id)
                                  }}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                  {annotation.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteAnnotation(annotation.id)
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              AI detected at {annotation.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Image Metadata */}
                <div className="p-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Image Metadata</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Patient ID</label>
                      <p className="text-sm text-gray-900">{currentImage?.metadata.patientId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Study ID</label>
                      <p className="text-sm text-gray-900">{currentImage?.metadata.studyId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Modality</label>
                      <p className="text-sm text-gray-900">{currentImage?.metadata.modality}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Body Part</label>
                      <p className="text-sm text-gray-900">{currentImage?.metadata.bodyPart}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Slice Thickness</label>
                      <p className="text-sm text-gray-900">{currentImage?.metadata.sliceThickness}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Pixel Spacing</label>
                      <p className="text-sm text-gray-900">{currentImage?.metadata.pixelSpacing}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 