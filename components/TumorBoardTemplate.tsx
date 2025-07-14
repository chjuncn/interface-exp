'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Database, 
  Upload, 
  FileText, 
  User, 
  Stethoscope, 
  Image, 
  Edit3, 
  Save, 
  Download,
  Plus,
  Trash2,
  Eye,
  Settings,
  Users,
  Shield,
  Code,
  Brain,
  Play,
  Copy,
  X
} from 'lucide-react'
import ImagingViewer from './ImagingViewer'

interface PatientData {
  id: string
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  occupation: string
  contactInfo: {
    phone: string
    email: string
    address: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
}

interface MedicalData {
  diagnosis: string[]
  treatments: string[]
  medications: string[]
  allergies: string[]
  labResults: Record<string, any>
  imagingReports: Record<string, any>
  clinicalNotes: string[]
}

interface TemplateSection {
  id: string
  title: string
  type: 'demographics' | 'medical' | 'imaging' | 'imaging-viewer' | 'notes' | 'ai-diagnose' | 'custom'
  fields: string[]
  isVisible: boolean
  order: number
  sourceCode?: string
  output?: string
}

interface TumorBoardTemplateProps {
  userInput: string
  context: string[]
}

export default function TumorBoardTemplate({ userInput, context }: TumorBoardTemplateProps) {
  const [currentPhase, setCurrentPhase] = useState<'loading' | 'extraction' | 'editing'>('loading')
  const [dataSources, setDataSources] = useState<Array<{
    id: string
    name: string
    type: 'database' | 'file' | 'api'
    status: 'connected' | 'loading' | 'error'
    data?: any
  }>>([])
  
  const [extractedData, setExtractedData] = useState<{
    patient: PatientData | null
    medical: MedicalData | null
  }>({
    patient: null,
    medical: null
  })
  
  const [templateSections, setTemplateSections] = useState<TemplateSection[]>([
    {
      id: 'demographics',
      title: 'Patient Demographics',
      type: 'demographics',
      fields: ['name', 'age', 'gender', 'occupation', 'contactInfo'],
      isVisible: true,
      order: 1,
      sourceCode: `// Patient Demographics Extraction
function extractDemographics(data) {
  return {
    name: data.patient?.name || 'Unknown',
    age: data.patient?.age || 0,
    gender: data.patient?.gender || 'Unknown',
    occupation: data.patient?.occupation || 'Unknown',
    contactInfo: {
      phone: data.patient?.contactInfo?.phone || '',
      email: data.patient?.contactInfo?.email || '',
      address: data.patient?.contactInfo?.address || ''
    }
  };
}`,
      output: ''
    },
    {
      id: 'medical',
      title: 'Medical Information',
      type: 'medical',
      fields: ['diagnosis', 'treatments', 'medications', 'allergies'],
      isVisible: true,
      order: 2,
      sourceCode: `// Medical Information Processing
function processMedicalData(data) {
  return {
    diagnosis: data.medical?.diagnosis || [],
    treatments: data.medical?.treatments || [],
    medications: data.medical?.medications || [],
    allergies: data.medical?.allergies || []
  };
}`,
      output: ''
    },
    {
      id: 'imaging',
      title: 'Imaging & Lab Results',
      type: 'imaging',
      fields: ['labResults', 'imagingReports'],
      isVisible: true,
      order: 3,
      sourceCode: `// Imaging and Lab Results Analysis
function analyzeImagingData(data) {
  return {
    labResults: data.medical?.labResults || {},
    imagingReports: data.medical?.imagingReports || {},
    summary: generateImagingSummary(data.medical?.imagingReports)
  };
}

function generateImagingSummary(reports) {
  if (!reports) return 'No imaging reports available';
  return Object.keys(reports).map(key => 
    \`\${key}: \${reports[key]}\`
  ).join('\\n');
}`,
      output: ''
    },
    {
      id: 'imaging-viewer',
      title: 'Advanced Imaging Viewer',
      type: 'imaging-viewer',
      fields: ['dicomImages', 'annotations', 'measurements'],
      isVisible: true,
      order: 4,
      sourceCode: `// Advanced Imaging Viewer Integration
function initializeImagingViewer(patientData) {
  return {
    dicomImages: loadDICOMImages(patientData.patientId),
    annotations: loadAnnotations(patientData.patientId),
    measurements: loadMeasurements(patientData.patientId),
    viewerConfig: {
      windowLevel: { window: 2000, level: 400 },
      zoom: 1,
      rotation: 0,
      showAnnotations: true,
      showMeasurements: true
    }
  };
}

function loadDICOMImages(patientId) {
  // Load DICOM images from PACS or local storage
  return [
    {
      id: '1',
      name: 'Chest CT - Axial',
      type: 'CT',
      series: 'Chest CT Series 1',
      date: '2024-01-15',
      description: 'Axial view showing 2.5cm mass in right upper lobe',
      url: \`/api/dicom/\${patientId}/chest-ct-axial\`,
      metadata: {
        modality: 'CT',
        bodyPart: 'CHEST',
        sliceThickness: '2.5mm',
        pixelSpacing: '0.7mm x 0.7mm'
      }
    },
    {
      id: '2',
      name: 'PET Scan - Fusion',
      type: 'PET',
      series: 'PET-CT Series 1',
      date: '2024-01-16',
      description: 'FDG-avid mass with SUV max 8.2',
      url: \`/api/dicom/\${patientId}/pet-fusion\`,
      metadata: {
        modality: 'PET',
        bodyPart: 'CHEST',
        sliceThickness: '3.0mm',
        pixelSpacing: '2.7mm x 2.7mm'
      }
    }
  ];
}

function loadAnnotations(patientId) {
  // Load existing annotations for this patient
  return [
    {
      id: '1',
      type: 'marker',
      x: 150,
      y: 200,
      color: '#ff6b6b',
      description: 'Primary tumor location',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'measurement',
      x: 200,
      y: 250,
      width: 50,
      height: 30,
      color: '#4ecdc4',
      description: 'Tumor size: 2.5cm',
      timestamp: new Date()
    }
  ];
}

function loadMeasurements(patientId) {
  // Load measurements and quantitative data
  return {
    tumorSize: '2.5cm',
    lymphNodeStatus: 'N0',
    metastasis: 'M0',
    suvMax: '8.2',
    measurements: [
      { name: 'Tumor Diameter', value: '2.5cm', unit: 'cm' },
      { name: 'SUV Max', value: '8.2', unit: '' },
      { name: 'CT Density', value: '45', unit: 'HU' }
    ]
  };
}`,
      output: ''
    },
    {
      id: 'notes',
      title: 'Clinical Notes',
      type: 'notes',
      fields: ['clinicalNotes'],
      isVisible: true,
      order: 5,
      sourceCode: `// Clinical Notes Processing
function processClinicalNotes(data) {
  return {
    clinicalNotes: data.medical?.clinicalNotes || [],
    summary: generateNotesSummary(data.medical?.clinicalNotes)
  };
}

function generateNotesSummary(notes) {
  if (!notes || notes.length === 0) return 'No clinical notes available';
  return notes.join('\\n\\n');
}`,
      output: ''
    },
    {
      id: 'ai-diagnose',
      title: 'AI Diagnosis',
      type: 'ai-diagnose',
      fields: ['aiAnalysis', 'recommendations', 'riskAssessment'],
      isVisible: true,
      order: 6,
      sourceCode: `// AI Diagnosis and Analysis
function performAIAnalysis(patientData, medicalData) {
  const analysis = {
    primaryDiagnosis: analyzePrimaryDiagnosis(medicalData.diagnosis),
    riskFactors: assessRiskFactors(patientData, medicalData),
    treatmentRecommendations: generateTreatmentRecommendations(medicalData),
    prognosis: calculatePrognosis(patientData, medicalData),
    followUpPlan: createFollowUpPlan(medicalData)
  };
  
  return analysis;
}

function analyzePrimaryDiagnosis(diagnoses) {
  if (!diagnoses || diagnoses.length === 0) return 'No diagnosis available';
  
  // AI logic to prioritize diagnoses
  const cancerDiagnoses = diagnoses.filter(d => d.toLowerCase().includes('cancer'));
  if (cancerDiagnoses.length > 0) {
    return {
      primary: cancerDiagnoses[0],
      confidence: 0.95,
      reasoning: 'Cancer diagnosis detected as primary concern'
    };
  }
  
  return {
    primary: diagnoses[0],
    confidence: 0.85,
    reasoning: 'First diagnosis listed as primary'
  };
}

function assessRiskFactors(patientData, medicalData) {
  const risks = [];
  
  if (patientData.age > 65) risks.push('Advanced age');
  if (medicalData.allergies && medicalData.allergies.length > 0) {
    risks.push('Multiple drug allergies');
  }
  
  return {
    highRisk: risks.length > 2,
    riskFactors: risks,
    overallRisk: risks.length > 2 ? 'High' : risks.length > 0 ? 'Medium' : 'Low'
  };
}

function generateTreatmentRecommendations(medicalData) {
  const recommendations = [];
  
  if (medicalData.diagnosis) {
    medicalData.diagnosis.forEach(diagnosis => {
      if (diagnosis.toLowerCase().includes('cancer')) {
        recommendations.push({
          type: 'Chemotherapy',
          priority: 'High',
          reasoning: 'Standard treatment for cancer diagnosis'
        });
        recommendations.push({
          type: 'Radiation Therapy',
          priority: 'Medium',
          reasoning: 'Adjuvant therapy for cancer treatment'
        });
      }
    });
  }
  
  return recommendations;
}

function calculatePrognosis(patientData, medicalData) {
  // Simplified prognosis calculation
  let score = 0;
  
  if (patientData.age < 50) score += 2;
  else if (patientData.age < 70) score += 1;
  
  if (medicalData.diagnosis) {
    medicalData.diagnosis.forEach(diagnosis => {
      if (diagnosis.toLowerCase().includes('stage i')) score += 3;
      else if (diagnosis.toLowerCase().includes('stage ii')) score += 2;
      else if (diagnosis.toLowerCase().includes('stage iii')) score += 1;
    });
  }
  
  return {
    score: score,
    prognosis: score >= 4 ? 'Good' : score >= 2 ? 'Fair' : 'Poor',
    confidence: 0.8
  };
}

function createFollowUpPlan(medicalData) {
  return {
    nextAppointment: '2 weeks',
    tests: ['Blood work', 'Imaging follow-up'],
    monitoring: 'Weekly check-ins',
    emergencyContact: 'Immediate if symptoms worsen'
  };
}`,
      output: ''
    }
  ])

  const [isEditing, setIsEditing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [editingCode, setEditingCode] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [showImagingViewer, setShowImagingViewer] = useState(false)

  // Simulate data loading
  const handleDataSourceAdd = (type: 'database' | 'file' | 'api') => {
    const newSource = {
      id: Date.now().toString(),
      name: type === 'database' ? 'Medical Database' : type === 'file' ? 'Patient Data File' : 'FHIR API',
      type,
      status: 'loading' as const
    }
    
    setDataSources(prev => [...prev, newSource])
    
    // Simulate connection/loading
    setTimeout(() => {
      setDataSources(prev => prev.map(source => 
        source.id === newSource.id 
          ? { ...source, status: 'connected', data: generateMockData() }
          : source
      ))
      
      // Auto-advance to extraction phase if this is the first source
      if (dataSources.length === 0) {
        setTimeout(() => setCurrentPhase('extraction'), 1000)
      }
    }, 2000)
  }

  const generateMockData = () => {
    return {
      patient: {
        id: 'P001',
        name: 'John Smith',
        age: 58,
        gender: 'Male' as const,
        occupation: 'Retired Teacher',
        contactInfo: {
          phone: '(555) 123-4567',
          email: 'john.smith@email.com',
          address: '123 Main St, Anytown, ST 12345'
        },
        emergencyContact: {
          name: 'Mary Smith',
          relationship: 'Spouse',
          phone: '(555) 123-4568'
        }
      },
      medical: {
        diagnosis: ['Lung Cancer - Stage IIB', 'Hypertension', 'Type 2 Diabetes'],
        treatments: ['Chemotherapy - Carboplatin + Paclitaxel', 'Radiation Therapy', 'Metformin'],
        medications: ['Metformin 500mg BID', 'Lisinopril 10mg daily', 'Aspirin 81mg daily'],
        allergies: ['Penicillin', 'Sulfa drugs'],
        labResults: {
          'CBC': { 'WBC': '8.2', 'RBC': '4.1', 'Hgb': '13.2', 'Plt': '250' },
          'CMP': { 'Glucose': '145', 'Creatinine': '1.1', 'ALT': '25', 'AST': '28' },
          'Tumor Markers': { 'CEA': '5.2', 'CA-125': '15' }
        },
        imagingReports: {
          'Chest CT': '2.5cm mass in right upper lobe, no mediastinal lymphadenopathy',
          'PET Scan': 'FDG-avid mass in right upper lobe, SUV max 8.2',
          'Brain MRI': 'No evidence of brain metastases'
        },
        clinicalNotes: [
          'Patient presents with 3-month history of cough and weight loss',
          'Biopsy confirmed adenocarcinoma of the lung',
          'Good performance status, ECOG 1',
          'Family history positive for lung cancer in father'
        ]
      }
    }
  }

  const handleAutoExtraction = () => {
    // Simulate AI-powered extraction
    const mockData = generateMockData()
    setExtractedData(mockData)
    
    setTimeout(() => {
      setCurrentPhase('editing')
    }, 1500)
  }

  const handleTemplateSave = () => {
    const template = {
      id: Date.now().toString(),
      name: 'Tumor Board Template v1',
      sections: templateSections,
      data: extractedData,
      createdAt: new Date(),
      version: '1.0'
    }
    
    // In a real implementation, this would save to a database or file
    console.log('Saving template:', template)
    
    // Show success message
    alert('Template saved successfully!')
  }

  const handleSectionToggle = (sectionId: string) => {
    setTemplateSections(prev => prev.map(section =>
      section.id === sectionId 
        ? { ...section, isVisible: !section.isVisible }
        : section
    ))
  }

  const handleSectionReorder = (fromIndex: number, toIndex: number) => {
    const newSections = [...templateSections]
    const [movedSection] = newSections.splice(fromIndex, 1)
    newSections.splice(toIndex, 0, movedSection)
    
    // Update order numbers
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index + 1
    }))
    
    setTemplateSections(updatedSections)
  }

  const handleSectionClick = (sectionId: string) => {
    const section = templateSections.find(s => s.id === sectionId)
    if (section) {
      setSelectedSection(sectionId)
      setEditingCode(section.sourceCode || '')
      setShowCodeEditor(true)
    }
  }

  const handleCodeSave = () => {
    if (selectedSection) {
      setTemplateSections(prev => prev.map(section =>
        section.id === selectedSection
          ? { ...section, sourceCode: editingCode }
          : section
      ))
      setShowCodeEditor(false)
      setSelectedSection(null)
    }
  }

  const handleCodeExecute = async () => {
    if (!selectedSection) return
    
    setIsExecuting(true)
    
    try {
      // Create a safe execution environment
      const mockData = generateMockData()
      const section = templateSections.find(s => s.id === selectedSection)
      
      if (!section) return
      
      // Execute the code (in a real implementation, this would be done server-side)
      let result = ''
      
      if (section.type === 'ai-diagnose') {
        // Simulate AI analysis execution
        result = `AI Analysis Results:
        
Primary Diagnosis: ${mockData.medical.diagnosis[0]}
Confidence: 95%
Risk Assessment: Medium Risk
Treatment Recommendations:
- Chemotherapy (High Priority)
- Radiation Therapy (Medium Priority)
Prognosis: Fair (Score: 3/5)
Follow-up Plan: 2-week appointment, weekly monitoring

Analysis completed at: ${new Date().toLocaleString()}`

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000))
      } else {
        // For other sections, show a simple execution result
        result = `Execution completed successfully for ${section.title}
        
Input data processed: ${JSON.stringify(mockData, null, 2).substring(0, 200)}...
Output generated at: ${new Date().toLocaleString()}`

        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      // Update the section with the output
      setTemplateSections(prev => prev.map(section =>
        section.id === selectedSection
          ? { ...section, output: result }
          : section
      ))
      
    } catch (error) {
      console.error('Code execution error:', error)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleAddNewSection = () => {
    const newSection: TemplateSection = {
      id: `custom-${Date.now()}`,
      title: 'New Custom Section',
      type: 'custom',
      fields: ['customField1', 'customField2'],
      isVisible: true,
      order: templateSections.length + 1,
      sourceCode: `// Custom Section Code
function processCustomSection(data) {
  return {
    customField1: 'Custom value 1',
    customField2: 'Custom value 2',
    timestamp: new Date().toISOString()
  };
}`,
      output: ''
    }
    
    setTemplateSections(prev => [...prev, newSection])
  }

  const handleSuggestionClick = (suggestionId: string) => {
    switch (suggestionId) {
      case 'imaging-viewer':
        setShowImagingViewer(true)
        break
      case 'patient-portal':
        // Handle patient portal integration
        console.log('Patient portal integration clicked')
        break
      case 'treatment-planner':
        // Handle treatment planning
        console.log('Treatment planning clicked')
        break
      case 'clinical-trials':
        // Handle clinical trials
        console.log('Clinical trials clicked')
        break
      case 'outcome-tracking':
        // Handle outcome tracking
        console.log('Outcome tracking clicked')
        break
      default:
        console.log('Unknown suggestion:', suggestionId)
    }
  }

  return (
    <div className="h-full bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tumor Board Template</h1>
            <p className="text-blue-100">Medical case management and collaboration platform</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleTemplateSave}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Template
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="px-6 py-4 bg-gray-50 border-b">
        <div className="flex items-center gap-4">
          {[
            { phase: 'loading', label: 'Data Loading', icon: Database },
            { phase: 'extraction', label: 'Auto-Extraction', icon: FileText },
            { phase: 'editing', label: 'Template Editor', icon: Edit3 }
          ].map((step, index) => {
            const Icon = step.icon
            const isActive = currentPhase === step.phase
            const isCompleted = ['loading', 'extraction', 'editing'].indexOf(currentPhase) > index
            
            return (
              <div key={step.phase} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isActive ? 'bg-blue-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <span className="text-sm">✓</span>
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
                {index < 2 && (
                  <div className={`w-8 h-0.5 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {currentPhase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6"
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Load Data Sources</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Database Connection */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => handleDataSourceAdd('database')}
                  >
                    <Database className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Database Connection</h3>
                    <p className="text-gray-600 text-sm">Connect to medical databases (MySQL, PostgreSQL, MongoDB)</p>
                  </motion.div>

                  {/* File Upload */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors cursor-pointer"
                    onClick={() => handleDataSourceAdd('file')}
                  >
                    <Upload className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Local File Upload</h3>
                    <p className="text-gray-600 text-sm">Upload CSV, JSON, Excel files with patient data</p>
                  </motion.div>

                  {/* API Import */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors cursor-pointer"
                    onClick={() => handleDataSourceAdd('api')}
                  >
                    <FileText className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">API Import</h3>
                    <p className="text-gray-600 text-sm">Import from FHIR, DICOM, or other medical APIs</p>
                  </motion.div>
                </div>

                {/* Data Sources Status */}
                {dataSources.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Data Sources</h3>
                    <div className="space-y-3">
                      {dataSources.map(source => (
                        <div key={source.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              source.status === 'connected' ? 'bg-green-500' :
                              source.status === 'loading' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                            <span className="font-medium">{source.name}</span>
                            <span className="text-sm text-gray-500">({source.type})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {source.status === 'loading' && (
                              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            )}
                            <span className={`text-sm ${
                              source.status === 'connected' ? 'text-green-600' :
                              source.status === 'loading' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {source.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentPhase === 'extraction' && (
            <motion.div
              key="extraction"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6"
            >
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Auto-Extracted Information</h2>
                  <button
                    onClick={handleAutoExtraction}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Extract Information
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Patient Demographics */}
                  <div className="bg-white border rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-blue-500" />
                      <h3 className="text-lg font-semibold">Patient Demographics</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">John Smith</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">58</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium">Male</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Occupation:</span>
                        <span className="font-medium">Retired Teacher</span>
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="bg-white border rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Stethoscope className="w-5 h-5 text-green-500" />
                      <h3 className="text-lg font-semibold">Medical Information</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 text-sm">Diagnosis:</span>
                        <div className="mt-1 space-y-1">
                          {['Lung Cancer - Stage IIB', 'Hypertension', 'Type 2 Diabetes'].map((diagnosis, index) => (
                            <div key={index} className="text-sm bg-red-50 text-red-700 px-2 py-1 rounded">
                              {diagnosis}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Medications:</span>
                        <div className="mt-1 space-y-1">
                          {['Metformin 500mg BID', 'Lisinopril 10mg daily', 'Aspirin 81mg daily'].map((med, index) => (
                            <div key={index} className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              {med}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Imaging & Lab Results */}
                  <div className="bg-white border rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Image className="w-5 h-5 text-purple-500" />
                      <h3 className="text-lg font-semibold">Imaging & Lab Results</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 text-sm">Lab Results:</span>
                        <div className="mt-1 space-y-1">
                          <div className="text-sm bg-purple-50 text-purple-700 px-2 py-1 rounded">
                            CBC: WBC 8.2, Hgb 13.2
                          </div>
                          <div className="text-sm bg-purple-50 text-purple-700 px-2 py-1 rounded">
                            CMP: Glucose 145, Creatinine 1.1
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Imaging:</span>
                        <div className="mt-1 space-y-1">
                          <div className="text-sm bg-orange-50 text-orange-700 px-2 py-1 rounded">
                            Chest CT: 2.5cm mass RUL
                          </div>
                          <div className="text-sm bg-orange-50 text-orange-700 px-2 py-1 rounded">
                            PET: FDG-avid mass, SUV 8.2
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentPhase === 'editing' && (
            <motion.div
              key="editing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6"
            >
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Template Editor</h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isEditing 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Edit3 className="w-4 h-4" />
                      {isEditing ? 'Preview' : 'Edit'}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Template Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Sections Panel */}
                  <div className="lg:col-span-1">
                    <div className="bg-white border rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Sections</h3>
                      <div className="space-y-2">
                        {templateSections.map((section, index) => (
                          <div 
                            key={section.id} 
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                              section.isVisible ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-100 opacity-60'
                            }`}
                            onClick={() => handleSectionClick(section.id)}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={section.isVisible}
                                onChange={(e) => {
                                  e.stopPropagation()
                                  handleSectionToggle(section.id)
                                }}
                                className="w-4 h-4 text-blue-600"
                              />
                                                              <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{section.title}</span>
                                  {section.type === 'ai-diagnose' && (
                                    <Brain className="w-3 h-3 text-purple-500" />
                                  )}
                                  {section.type === 'imaging-viewer' && (
                                    <Eye className="w-3 h-3 text-blue-500" />
                                  )}
                                  {section.sourceCode && (
                                    <Code className="w-3 h-3 text-blue-500" />
                                  )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {section.output && (
                                <div className="w-2 h-2 bg-green-500 rounded-full" title="Has output" />
                              )}
                              {isEditing && (
                                <>
                                  <button 
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Eye className="w-3 h-3" />
                                  </button>
                                  <button 
                                    className="p-1 text-gray-400 hover:text-red-600"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {isEditing && (
                        <button 
                          onClick={handleAddNewSection}
                          className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Section
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Template Preview */}
                  <div className="lg:col-span-3">
                    <div className="bg-white border rounded-xl p-6">
                      <div className="space-y-6">
                        {templateSections
                          .filter(section => section.isVisible)
                          .sort((a, b) => a.order - b.order)
                          .map(section => (
                            <div key={section.id} className="border-b pb-6 last:border-b-0">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
                              
                              {section.type === 'demographics' && extractedData.patient && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm text-gray-600">Full Name</label>
                                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        {extractedData.patient.name}
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm text-gray-600">Age</label>
                                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        {extractedData.patient.age} years
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm text-gray-600">Gender</label>
                                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        {extractedData.patient.gender}
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm text-gray-600">Occupation</label>
                                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        {extractedData.patient.occupation}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {section.output && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                      <h5 className="text-sm font-medium text-green-800 mb-2">Processing Output:</h5>
                                      <pre className="text-sm text-green-700 whitespace-pre-wrap">
                                        {section.output}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              )}

                              {section.type === 'medical' && extractedData.medical && (
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm text-gray-600">Diagnosis</label>
                                    <div className="mt-1 space-y-2">
                                      {extractedData.medical.diagnosis.map((diagnosis, index) => (
                                        <div key={index} className="p-3 bg-red-50 text-red-700 rounded-lg">
                                          {diagnosis}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-600">Current Medications</label>
                                    <div className="mt-1 space-y-2">
                                      {extractedData.medical.medications.map((medication, index) => (
                                        <div key={index} className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                                          {medication}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {section.type === 'imaging' && extractedData.medical && (
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm text-gray-600">Lab Results</label>
                                    <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {Object.entries(extractedData.medical.labResults).map(([test, values]) => (
                                        <div key={test} className="p-3 bg-purple-50 rounded-lg">
                                          <div className="font-medium text-purple-900">{test}</div>
                                          <div className="text-sm text-purple-700 mt-1">
                                            {Object.entries(values).map(([key, value]) => (
                                              <div key={key}>{key}: {value}</div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-600">Imaging Reports</label>
                                    <div className="mt-1 space-y-2">
                                      {Object.entries(extractedData.medical.imagingReports).map(([study, report]) => (
                                        <div key={study} className="p-3 bg-orange-50 text-orange-700 rounded-lg">
                                          <div className="font-medium">{study}</div>
                                          <div className="text-sm mt-1">{report}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {section.type === 'notes' && extractedData.medical && (
                                <div>
                                  <label className="text-sm text-gray-600">Clinical Notes</label>
                                  <div className="mt-1 space-y-2">
                                    {extractedData.medical.clinicalNotes.map((note, index) => (
                                      <div key={index} className="p-3 bg-gray-50 text-gray-700 rounded-lg">
                                        {note}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {section.type === 'imaging-viewer' && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <Eye className="w-5 h-5 text-blue-500" />
                                    <h4 className="text-lg font-semibold text-gray-900">Advanced Imaging Viewer</h4>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* DICOM Images Summary */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                      <h5 className="text-sm font-medium text-blue-900 mb-3">Available DICOM Images</h5>
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                          <span className="text-blue-800">Chest CT - Axial</span>
                                          <span className="text-blue-600 text-xs">(CT)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                          <span className="text-blue-800">PET Scan - Fusion</span>
                                          <span className="text-blue-600 text-xs">(PET)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                          <span className="text-blue-800">Brain MRI - T1</span>
                                          <span className="text-blue-600 text-xs">(MRI)</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Measurements Summary */}
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                      <h5 className="text-sm font-medium text-green-900 mb-3">Key Measurements</h5>
                                      <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                          <span className="text-green-800">Tumor Size:</span>
                                          <span className="font-medium text-green-900">2.5cm</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-green-800">SUV Max:</span>
                                          <span className="font-medium text-green-900">8.2</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-green-800">CT Density:</span>
                                          <span className="font-medium text-green-900">45 HU</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {section.output ? (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                      <h5 className="text-sm font-medium text-blue-900 mb-2">Viewer Configuration:</h5>
                                      <pre className="text-sm text-blue-800 whitespace-pre-wrap">
                                        {section.output}
                                      </pre>
                                    </div>
                                  ) : (
                                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
                                      <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                      <p className="text-gray-500 text-sm mb-3">
                                        Advanced DICOM viewer with annotation tools and measurements
                                      </p>
                                      <div className="flex gap-2 justify-center">
                                        <button
                                          onClick={() => setShowImagingViewer(true)}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                        >
                                          <Eye className="w-4 h-4 inline mr-2" />
                                          Open Viewer
                                        </button>
                                        <button
                                          onClick={() => handleSectionClick(section.id)}
                                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                        >
                                          <Code className="w-4 h-4 inline mr-2" />
                                          Edit Code
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {section.type === 'ai-diagnose' && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <Brain className="w-5 h-5 text-purple-500" />
                                    <h4 className="text-lg font-semibold text-gray-900">AI Analysis</h4>
                                  </div>
                                  
                                  {section.output ? (
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                      <pre className="text-sm text-purple-800 whitespace-pre-wrap">
                                        {section.output}
                                      </pre>
                                    </div>
                                  ) : (
                                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
                                      <Brain className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                      <p className="text-gray-500 text-sm">
                                        Click on this section to edit the AI analysis code and execute it
                                      </p>
                                      <button
                                        onClick={() => handleSectionClick(section.id)}
                                        className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                      >
                                        <Code className="w-4 h-4 inline mr-2" />
                                        Edit AI Code
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}

                              {section.type === 'custom' && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <Code className="w-5 h-5 text-blue-500" />
                                    <h4 className="text-lg font-semibold text-gray-900">Custom Section</h4>
                                  </div>
                                  
                                  {section.output ? (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                      <pre className="text-sm text-blue-800 whitespace-pre-wrap">
                                        {section.output}
                                      </pre>
                                    </div>
                                  ) : (
                                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
                                      <Code className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                      <p className="text-gray-500 text-sm">
                                        Click on this section to edit the custom code and execute it
                                      </p>
                                      <button
                                        onClick={() => handleSectionClick(section.id)}
                                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                      >
                                        <Code className="w-4 h-4 inline mr-2" />
                                        Edit Custom Code
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

              {/* Imaging Viewer Modal */}
        <ImagingViewer
          isOpen={showImagingViewer}
          onClose={() => setShowImagingViewer(false)}
          patientData={extractedData}
        />

        {/* Code Editor Modal */}
        <AnimatePresence>
          {showCodeEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCodeEditor(false)}
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
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Code className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Edit {templateSections.find(s => s.id === selectedSection)?.title} Code
                    </h2>
                    <p className="text-sm text-gray-500">
                      Modify the source code for this section and execute to see results
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCodeExecute}
                    disabled={isExecuting}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isExecuting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {isExecuting ? 'Executing...' : 'Execute'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCodeSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCodeEditor(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 flex">
                <div className="flex-1 p-6">
                  <div className="h-full bg-gray-900 rounded-lg p-4">
                    <textarea
                      value={editingCode}
                      onChange={(e) => setEditingCode(e.target.value)}
                      className="w-full h-full bg-transparent text-green-400 font-mono text-sm resize-none outline-none"
                      placeholder="Enter your code here..."
                    />
                  </div>
                </div>
                
                {/* Output Panel */}
                <div className="w-1/3 border-l border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Output</h3>
                  <div className="bg-gray-50 rounded-lg p-4 h-full overflow-auto">
                    {templateSections.find(s => s.id === selectedSection)?.output ? (
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {templateSections.find(s => s.id === selectedSection)?.output}
                      </pre>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Execute the code to see output here...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 