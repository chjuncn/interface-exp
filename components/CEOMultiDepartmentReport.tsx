'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  Database, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  Clock, 
  Target,
  ArrowLeft,
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  Volume2,
  Building2,
  PieChart,
  Activity,
  DollarSign,
  ShoppingCart,
  Settings,
  Eye,
  Download,
  Share2,
  X
} from 'lucide-react'

interface ConversationMessage {
  id: string
  type: 'ceo' | 'tma' | 'marketing' | 'sales' | 'operations' | 'analytics' | 'design'
  message: string
  timestamp: Date
  action?: 'request' | 'coordination' | 'data-collection' | 'analysis' | 'insights' | 'design' | 'delivery'
  context?: string
  department?: string
}

interface DepartmentData {
  name: string
  icon: React.ReactNode
  metrics: { label: string; value: string; trend: 'up' | 'down' | 'stable' }[]
  status: 'pending' | 'collecting' | 'completed'
  color: string
}

interface DashboardMetric {
  id: string
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'stable'
  category: string
}

export default function CEOMultiDepartmentReport({ onBack }: { onBack?: () => void }) {
  const [conversation, setConversation] = useState<ConversationMessage[]>([
    {
      id: '1',
      type: 'ceo',
      message: 'I need a comprehensive business report that pulls data from all departments to understand our company\'s performance.',
      timestamp: new Date(),
      action: 'request'
    },
    {
      id: '2',
      type: 'tma',
      message: 'I understand you need a comprehensive business report. I\'ll coordinate with all departments to gather the necessary data and create actionable insights for you.',
      timestamp: new Date(),
      action: 'request'
    }
  ])
  
  const [currentPhase, setCurrentPhase] = useState<'request' | 'coordination' | 'data-collection' | 'analysis' | 'insights' | 'design' | 'delivery'>('request')
  const [departments, setDepartments] = useState<DepartmentData[]>([
    {
      name: 'Marketing',
      icon: <ShoppingCart className="w-4 h-4" />,
      metrics: [],
      status: 'pending',
      color: 'bg-blue-500'
    },
    {
      name: 'Sales',
      icon: <TrendingUp className="w-4 h-4" />,
      metrics: [],
      status: 'pending',
      color: 'bg-green-500'
    },
    {
      name: 'Operations',
      icon: <Settings className="w-4 h-4" />,
      metrics: [],
      status: 'pending',
      color: 'bg-purple-500'
    },
    {
      name: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      metrics: [],
      status: 'pending',
      color: 'bg-orange-500'
    },
    {
      name: 'Design',
      icon: <Eye className="w-4 h-4" />,
      metrics: [],
      status: 'pending',
      color: 'bg-pink-500'
    }
  ])
  
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetric[]>([])
  const [showDepartmentPanel, setShowDepartmentPanel] = useState(false)
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false)
  const [showInsightsPanel, setShowInsightsPanel] = useState(false)
  const [showDesignPanel, setShowDesignPanel] = useState(false)
  const [showFinalReport, setShowFinalReport] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [autoPlayStep, setAutoPlayStep] = useState(0)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceLevel, setVoiceLevel] = useState(0)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [showDataUpload, setShowDataUpload] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dataProcessing, setDataProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  // Auto-play conversation flow
  useEffect(() => {
    if (!isAutoPlaying) return

    const autoPlayConversation = [
      // Phase 1: Executive Request
      { type: 'ceo' as const, message: 'I need to understand our overall business performance. Can you coordinate with all departments to create a comprehensive report?' },
      { type: 'tma' as const, message: 'Absolutely! I\'ll coordinate with Marketing, Sales, Operations, and Analytics teams to gather comprehensive data and create actionable insights.', action: 'coordination' as const },
      
      // Phase 2: Department Coordination
      { type: 'tma' as const, message: 'Initiating coordination with all departments. I\'ll request campaign metrics from Marketing, revenue data from Sales, efficiency metrics from Operations, and analysis support from Analytics.', action: 'coordination' as const },
      { type: 'marketing' as const, message: 'Marketing team here. We\'ll provide campaign metrics, CAC data, and brand awareness metrics. Data will be ready in 2 hours.' },
      { type: 'sales' as const, message: 'Sales team reporting. We\'ll share revenue data, conversion rates, and pipeline information. Should have everything ready by end of day.' },
      { type: 'operations' as const, message: 'Operations team. We\'ll provide efficiency metrics, cost data, and resource utilization reports. Data collection in progress.' },
      { type: 'analytics' as const, message: 'Analytics team ready. We\'ll handle data integration, correlation analysis, and statistical validation. Setting up the pipeline now.' },
      
      // Phase 3: Data Collection
      { type: 'tma' as const, message: 'Excellent! All departments are on board. Now I\'ll start collecting and integrating the data from each department.', action: 'data-collection' as const },
      { type: 'marketing' as const, message: 'Marketing data collected: Campaign ROI 320%, CAC reduced by 15%, Brand awareness up 25%. Data quality validated.' },
      { type: 'sales' as const, message: 'Sales data ready: Q4 revenue $2.4M (up 18%), Conversion rate 3.2%, Pipeline value $8.7M. All metrics verified.' },
      { type: 'operations' as const, message: 'Operations metrics: Efficiency improved 12%, Costs reduced by 8%, Resource utilization at 87%. Data standardized.' },
      { type: 'analytics' as const, message: 'Analytics team: Data integration complete. Cross-department correlations identified. Statistical validation passed. Ready for analysis.' },
      
      // Phase 4: Analysis
      { type: 'tma' as const, message: 'Perfect! All data has been collected and integrated. Now I\'ll perform comprehensive analysis to identify key insights and trends.', action: 'analysis' as const },
      { type: 'tma' as const, message: 'Analysis complete! Key findings: Marketing campaigns driving 40% of sales, Operations efficiency gains contributing to 15% cost reduction, Cross-department collaboration showing strong ROI.' },
      
      // Phase 5: Insights Generation
      { type: 'tma' as const, message: 'Based on the analysis, I\'ve identified several strategic insights and recommendations for business optimization.', action: 'insights' as const },
      { type: 'tma' as const, message: 'Key Insights: 1) Marketing-Sales alignment driving 25% revenue growth, 2) Operational efficiency gains freeing up $500K annually, 3) Data-driven decision making improving outcomes by 30%.' },
      
      // Phase 6: Design & Presentation
      { type: 'tma' as const, message: 'Now I\'ll work with the design team to create an executive dashboard that presents these insights clearly and actionably.', action: 'design' as const },
      { type: 'design' as const, message: 'Design team here. Creating executive dashboard with interactive visualizations, key metrics overview, and actionable insights presentation. Will be ready shortly.' },
      { type: 'tma' as const, message: 'Design complete! The executive dashboard is ready with interactive charts, trend analysis, and strategic recommendations.' },
      
      // Phase 7: Final Delivery
      { type: 'tma' as const, message: 'CEO, your comprehensive business report is ready! I\'ve created an executive dashboard with all department insights, strategic recommendations, and actionable next steps.', action: 'delivery' as const },
      { type: 'ceo' as const, message: 'Excellent work! This gives me exactly what I need to understand our business performance and make strategic decisions. Thank you for coordinating this across all departments.' },
      { type: 'tma' as const, message: 'You\'re welcome! The report shows strong performance across all departments with clear opportunities for continued growth. I\'ve set up monitoring for the key metrics we identified.' }
    ]

    if (autoPlayStep < autoPlayConversation.length) {
      const step = autoPlayConversation[autoPlayStep]
      const delay = step.type === 'ceo' ? 6000 : 5000 // Slower timing for team visibility

      const timer = setTimeout(() => {
        // Simulate voice interaction for CEO's messages
        if (step.type === 'ceo') {
          setIsListening(true)
          setTimeout(() => {
            setIsListening(false)
            addMessage(step.type, step.message, step.action)
          }, 3000)
        } else {
          addMessage(step.type, step.message, step.action)
        }
        
        // Handle special actions with delays for team visibility
        if (step.action === 'coordination') {
          setTimeout(() => {
            setShowDepartmentPanel(true)
            setCurrentPhase('coordination')
          }, 3000)
        } else if (step.action === 'data-collection') {
          setTimeout(() => {
            setCurrentPhase('data-collection')
            updateDepartmentStatuses()
          }, 3000)
        } else if (step.action === 'analysis') {
          setTimeout(() => {
            setShowAnalysisPanel(true)
            setCurrentPhase('analysis')
            generateDashboardMetrics()
          }, 3000)
        } else if (step.action === 'insights') {
          setTimeout(() => {
            setShowInsightsPanel(true)
            setCurrentPhase('insights')
          }, 3000)
        } else if (step.action === 'design') {
          setTimeout(() => {
            setShowDesignPanel(true)
            setCurrentPhase('design')
          }, 3000)
        } else if (step.action === 'delivery') {
          setTimeout(() => {
            setShowFinalReport(true)
            setCurrentPhase('delivery')
          }, 3000)
        }

        setAutoPlayStep(prev => prev + 1)
      }, delay)

      return () => clearTimeout(timer)
    } else {
      // Auto-play completed
      setIsAutoPlaying(false)
      setAutoPlayStep(0)
    }
  }, [isAutoPlaying, autoPlayStep])

  const addMessage = (type: 'ceo' | 'tma' | 'marketing' | 'sales' | 'operations' | 'analytics' | 'design', message: string, action?: 'request' | 'coordination' | 'data-collection' | 'analysis' | 'insights' | 'design' | 'delivery', context?: string) => {
    const newMessage: ConversationMessage = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      action,
      context,
      department: type !== 'ceo' && type !== 'tma' ? type : undefined
    }
    setConversation(prev => [...prev, newMessage])
  }

  const updateDepartmentStatuses = () => {
    const statuses: ('pending' | 'collecting' | 'completed')[] = ['collecting', 'collecting', 'collecting', 'collecting', 'collecting']
    
    setTimeout(() => {
      setDepartments(prev => prev.map((dept, index) => ({
        ...dept,
        status: statuses[index]
      })))
    }, 2000)

    // Complete data collection after 8 seconds
    setTimeout(() => {
      setDepartments(prev => prev.map(dept => ({
        ...dept,
        status: 'completed',
        metrics: generateDepartmentMetrics(dept.name)
      })))
    }, 8000)
  }

  const generateDepartmentMetrics = (department: string) => {
    const metrics = {
      'Marketing': [
        { label: 'Campaign ROI', value: '320%', trend: 'up' as const },
        { label: 'CAC', value: '$45', trend: 'down' as const },
        { label: 'Brand Awareness', value: '+25%', trend: 'up' as const }
      ],
      'Sales': [
        { label: 'Q4 Revenue', value: '$2.4M', trend: 'up' as const },
        { label: 'Conversion Rate', value: '3.2%', trend: 'up' as const },
        { label: 'Pipeline Value', value: '$8.7M', trend: 'up' as const }
      ],
      'Operations': [
        { label: 'Efficiency', value: '+12%', trend: 'up' as const },
        { label: 'Cost Reduction', value: '8%', trend: 'down' as const },
        { label: 'Resource Utilization', value: '87%', trend: 'up' as const }
      ],
      'Analytics': [
        { label: 'Data Quality', value: '99.2%', trend: 'up' as const },
        { label: 'Processing Time', value: '-30%', trend: 'down' as const },
        { label: 'Insight Accuracy', value: '94%', trend: 'up' as const }
      ],
      'Design': [
        { label: 'Dashboard Creation', value: 'Complete', trend: 'stable' as const },
        { label: 'Visual Quality', value: 'A+', trend: 'up' as const },
        { label: 'User Experience', value: 'Excellent', trend: 'up' as const }
      ]
    }
    return metrics[department as keyof typeof metrics] || []
  }

  const generateDashboardMetrics = () => {
    const metrics: DashboardMetric[] = [
      { id: '1', title: 'Total Revenue', value: '$2.4M', change: '+18%', trend: 'up', category: 'financial' },
      { id: '2', title: 'Marketing ROI', value: '320%', change: '+45%', trend: 'up', category: 'marketing' },
      { id: '3', title: 'Operational Efficiency', value: '+12%', change: '+3%', trend: 'up', category: 'operations' },
      { id: '4', title: 'Customer Acquisition Cost', value: '$45', change: '-15%', trend: 'down', category: 'marketing' },
      { id: '5', title: 'Conversion Rate', value: '3.2%', change: '+0.4%', trend: 'up', category: 'sales' },
      { id: '6', title: 'Resource Utilization', value: '87%', change: '+5%', trend: 'up', category: 'operations' }
    ]
    setDashboardMetrics(metrics)
  }

  const getAvatarIcon = (type: string) => {
    switch (type) {
      case 'ceo': return <User className="w-5 h-5" />
      case 'tma': return <Bot className="w-5 h-5" />
      case 'marketing': return <ShoppingCart className="w-5 h-5" />
      case 'sales': return <TrendingUp className="w-5 h-5" />
      case 'operations': return <Settings className="w-5 h-5" />
      case 'analytics': return <BarChart3 className="w-5 h-5" />
      case 'design': return <Eye className="w-5 h-5" />
      default: return <User className="w-5 h-5" />
    }
  }

  const getAvatarColor = (type: string) => {
    switch (type) {
      case 'ceo': return 'bg-purple-500'
      case 'tma': return 'bg-blue-500'
      case 'marketing': return 'bg-blue-500'
      case 'sales': return 'bg-green-500'
      case 'operations': return 'bg-purple-500'
      case 'analytics': return 'bg-orange-500'
      case 'design': return 'bg-pink-500'
      default: return 'bg-gray-500'
    }
  }

  const getDepartmentName = (type: string) => {
    switch (type) {
      case 'ceo': return 'CEO'
      case 'tma': return 'AI Assistant'
      case 'marketing': return 'Marketing Team'
      case 'sales': return 'Sales Team'
      case 'operations': return 'Operations Team'
      case 'analytics': return 'Analytics Team'
      case 'design': return 'Design Team'
      default: return 'Team Member'
    }
  }

  const handleDepartmentClick = (departmentName: string) => {
    console.log('Department clicked:', departmentName, 'Current phase:', currentPhase)
    setSelectedDepartment(departmentName)
    setShowDataUpload(true)
    setUploadProgress(0)
    setDataProcessing(false)
  }

  const simulateDataUpload = () => {
    setUploadProgress(0)
    setDataProcessing(true)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setDataProcessing(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getDepartmentDataSources = (department: string) => {
    const dataSources = {
      'Marketing': [
        { name: 'Google Analytics', type: 'API', status: 'connected' },
        { name: 'Facebook Ads Manager', type: 'API', status: 'connected' },
        { name: 'Email Campaign Data', type: 'CSV', status: 'uploaded' },
        { name: 'Brand Survey Results', type: 'Database', status: 'connected' }
      ],
      'Sales': [
        { name: 'Salesforce CRM', type: 'API', status: 'connected' },
        { name: 'HubSpot Pipeline', type: 'API', status: 'connected' },
        { name: 'Revenue Reports', type: 'Excel', status: 'uploaded' },
        { name: 'Customer Feedback', type: 'Database', status: 'connected' }
      ],
      'Operations': [
        { name: 'ERP System', type: 'API', status: 'connected' },
        { name: 'Time Tracking Tools', type: 'API', status: 'connected' },
        { name: 'Cost Analysis Sheets', type: 'Excel', status: 'uploaded' },
        { name: 'Resource Allocation', type: 'Database', status: 'connected' }
      ],
      'Analytics': [
        { name: 'Data Warehouse', type: 'Database', status: 'connected' },
        { name: 'ETL Pipeline', type: 'System', status: 'running' },
        { name: 'Statistical Models', type: 'Python', status: 'processing' },
        { name: 'Quality Control', type: 'System', status: 'active' }
      ],
      'Design': [
        { name: 'Figma Design Files', type: 'Cloud', status: 'connected' },
        { name: 'User Research Data', type: 'Database', status: 'connected' },
        { name: 'Prototype Feedback', type: 'Survey', status: 'uploaded' },
        { name: 'Design System', type: 'Repository', status: 'connected' }
      ]
    }
    return dataSources[department as keyof typeof dataSources] || []
  }

  const getDepartmentMetrics = (department: string) => {
    const metrics = {
      'Marketing': [
        { metric: 'Campaign ROI', value: '320%', source: 'Google Analytics', trend: 'up' },
        { metric: 'Customer Acquisition Cost', value: '$45', source: 'Facebook Ads', trend: 'down' },
        { metric: 'Brand Awareness', value: '+25%', source: 'Brand Survey', trend: 'up' },
        { metric: 'Email Open Rate', value: '34.2%', source: 'Email Platform', trend: 'up' }
      ],
      'Sales': [
        { metric: 'Q4 Revenue', value: '$2.4M', source: 'Salesforce', trend: 'up' },
        { metric: 'Conversion Rate', value: '3.2%', source: 'HubSpot', trend: 'up' },
        { metric: 'Pipeline Value', value: '$8.7M', source: 'CRM System', trend: 'up' },
        { metric: 'Average Deal Size', value: '$45K', source: 'Sales Reports', trend: 'up' }
      ],
      'Operations': [
        { metric: 'Efficiency Gain', value: '+12%', source: 'ERP System', trend: 'up' },
        { metric: 'Cost Reduction', value: '8%', source: 'Cost Analysis', trend: 'down' },
        { metric: 'Resource Utilization', value: '87%', source: 'Time Tracking', trend: 'up' },
        { metric: 'Process Automation', value: '65%', source: 'Workflow Tools', trend: 'up' }
      ],
      'Analytics': [
        { metric: 'Data Quality Score', value: '99.2%', source: 'Quality Control', trend: 'up' },
        { metric: 'Processing Speed', value: '-30%', source: 'ETL Pipeline', trend: 'down' },
        { metric: 'Model Accuracy', value: '94%', source: 'Statistical Models', trend: 'up' },
        { metric: 'Insight Generation', value: '150/day', source: 'AI Pipeline', trend: 'up' }
      ],
      'Design': [
        { metric: 'User Satisfaction', value: '4.8/5', source: 'User Research', trend: 'up' },
        { metric: 'Design Consistency', value: '95%', source: 'Design System', trend: 'up' },
        { metric: 'Prototype Feedback', value: '92%', source: 'User Testing', trend: 'up' },
        { metric: 'Design Delivery Time', value: '-40%', source: 'Figma Analytics', trend: 'down' }
      ]
    }
    return metrics[department as keyof typeof metrics] || []
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Projects</span>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span className="font-semibold">CEO Multi-Department Report</span>
          </div>
          {isVoiceActive && (
            <div className="flex items-center space-x-2 bg-blue-500/20 px-3 py-1 rounded-full">
              <Volume2 className="w-4 h-4" />
              <span className="text-sm">Voice Active</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)] w-full">
        {/* Conversation Panel */}
        <div className="w-1/3 border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold mb-2">Executive Collaboration</h2>
            <div className="flex items-center space-x-2 text-sm text-white/70">
              <Clock className="w-4 h-4" />
              <span>Phase: {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex space-x-3 ${message.type === 'ceo' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type !== 'ceo' && (
                  <div className={`w-8 h-8 rounded-full ${getAvatarColor(message.type)} flex items-center justify-center flex-shrink-0`}>
                    {getAvatarIcon(message.type)}
                  </div>
                )}
                <div className={`max-w-[80%] ${message.type === 'ceo' ? 'order-first' : ''}`}>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'ceo' 
                      ? 'bg-purple-600 text-white' 
                      : message.type === 'tma'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white'
                  }`}>
                    <div className="text-xs text-white/70 mb-1">
                      {getDepartmentName(message.type)}
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
                {message.type === 'ceo' && (
                  <div className={`w-8 h-8 rounded-full ${getAvatarColor(message.type)} flex items-center justify-center flex-shrink-0`}>
                    {getAvatarIcon(message.type)}
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col w-full">
          {/* Phase Indicator */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Multi-Department Business Report</h1>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span className="text-sm text-white/70">Auto-play Demo</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto w-full">
            <AnimatePresence mode="wait">
              {/* Department Coordination Panel */}
              {showDepartmentPanel && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full space-y-6"
                >
                  <h2 className="text-2xl font-bold">Department Coordination</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
                    {departments.map((dept, index) => (
                      <motion.div
                        key={dept.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10 cursor-pointer hover:bg-white/10 hover:scale-105 transition-all duration-200"
                        onClick={() => handleDepartmentClick(dept.name)}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-8 h-8 rounded-full ${dept.color} flex items-center justify-center`}>
                            {dept.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{dept.name}</h3>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                dept.status === 'completed' ? 'bg-green-500' :
                                dept.status === 'collecting' ? 'bg-yellow-500' : 'bg-gray-500'
                              }`} />
                              <span className="text-xs text-white/70 capitalize">{dept.status}</span>
                            </div>
                          </div>
                        </div>
                        {dept.metrics.length > 0 && (
                          <div className="space-y-2">
                            {dept.metrics.map((metric, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-white/70">{metric.label}</span>
                                <span className={`font-semibold ${
                                  metric.trend === 'up' ? 'text-green-400' :
                                  metric.trend === 'down' ? 'text-red-400' : 'text-white'
                                }`}>
                                  {metric.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-3 text-xs text-blue-400">
                          Click to view data sources and metrics
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Data Upload Panel */}
              {showDataUpload && selectedDepartment && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-0 right-0 w-2/3 h-full bg-slate-900/95 backdrop-blur-sm z-10 p-6 overflow-y-auto"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{selectedDepartment} Data Collection</h2>
                    <button
                      onClick={() => setShowDataUpload(false)}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                    {/* Data Sources */}
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold mb-4 text-blue-400">Data Sources</h3>
                      <div className="space-y-3">
                        {getDepartmentDataSources(selectedDepartment).map((source, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                source.status === 'connected' ? 'bg-green-500' :
                                source.status === 'uploaded' ? 'bg-blue-500' :
                                source.status === 'running' ? 'bg-yellow-500' : 'bg-gray-500'
                              }`} />
                              <div>
                                <div className="font-medium">{source.name}</div>
                                <div className="text-xs text-white/70">{source.type}</div>
                              </div>
                            </div>
                            <div className="text-xs text-white/70 capitalize">{source.status}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Metrics Extraction */}
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold mb-4 text-green-400">Metrics Extraction</h3>
                      <div className="space-y-3">
                        {getDepartmentMetrics(selectedDepartment).map((metric, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                          >
                            <div>
                              <div className="font-medium">{metric.metric}</div>
                              <div className="text-xs text-white/70">Source: {metric.source}</div>
                            </div>
                            <div className="text-right">
                              <div className={`font-semibold ${
                                metric.trend === 'up' ? 'text-green-400' :
                                metric.trend === 'down' ? 'text-red-400' : 'text-white'
                              }`}>
                                {metric.value}
                              </div>
                              <div className="text-xs text-white/70">
                                {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Data Processing Pipeline */}
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold mb-4 text-purple-400">Data Processing Pipeline</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Data Validation</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                            <span className="text-sm text-green-400">✓</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Data Transformation</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                            <span className="text-sm text-green-400">✓</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Quality Assurance</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                            <span className="text-sm text-green-400">✓</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Integration with TMA</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                            <span className="text-sm text-green-400">✓</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>



                  {/* Upload Progress */}
                  {dataProcessing && (
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold mb-4 text-yellow-400">Processing Data</h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="text-lg">Extracting metrics from {selectedDepartment} data sources...</span>
                          <span className="text-lg font-semibold text-yellow-400">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-4">
                          <motion.div
                            className="bg-yellow-500 h-4 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                        <div className="text-center text-lg text-white/80">
                          {uploadProgress < 30 && "🔗 Connecting to data sources..."}
                          {uploadProgress >= 30 && uploadProgress < 60 && "📊 Extracting and validating metrics..."}
                          {uploadProgress >= 60 && uploadProgress < 90 && "⚙️ Processing and transforming data..."}
                          {uploadProgress >= 90 && "🤖 Finalizing integration with TMA..."}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowDataUpload(false)}
                      className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={simulateDataUpload}
                      disabled={dataProcessing}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      {dataProcessing ? 'Processing...' : 'Process Data'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Analysis Panel */}
              {showAnalysisPanel && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Data Analysis & Integration</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardMetrics.map((metric) => (
                      <motion.div
                        key={metric.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm">{metric.title}</h3>
                          <div className={`w-2 h-2 rounded-full ${
                            metric.trend === 'up' ? 'bg-green-500' :
                            metric.trend === 'down' ? 'bg-red-500' : 'bg-gray-500'
                          }`} />
                        </div>
                        <div className="text-2xl font-bold mb-1">{metric.value}</div>
                        <div className={`text-sm ${
                          metric.trend === 'up' ? 'text-green-400' :
                          metric.trend === 'down' ? 'text-red-400' : 'text-white/70'
                        }`}>
                          {metric.change}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Insights Panel */}
              {showInsightsPanel && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Strategic Insights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold mb-4 text-green-400">Key Findings</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>Marketing-Sales alignment driving 25% revenue growth</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>Operational efficiency gains freeing up $500K annually</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>Data-driven decision making improving outcomes by 30%</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h3 className="text-lg font-semibold mb-4 text-blue-400">Recommendations</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start space-x-3">
                          <Target className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>Increase cross-department collaboration initiatives</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <Target className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>Invest in operational automation tools</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <Target className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>Expand data analytics capabilities</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Design Panel */}
              {showDesignPanel && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Executive Dashboard Design</h2>
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Dashboard Features</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Interactive KPI dashboard</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Real-time data visualization</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Department performance comparison</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Strategic insights presentation</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Visual Elements</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4 text-blue-400" />
                            <span>Trend analysis charts</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <PieChart className="w-4 h-4 text-green-400" />
                            <span>Revenue breakdown</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-purple-400" />
                            <span>Performance metrics</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-yellow-400" />
                            <span>Financial indicators</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Final Report */}
              {showFinalReport && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Executive Business Report</h2>
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">Comprehensive Business Analysis</h3>
                      <div className="flex space-x-2">
                        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Download Report</span>
                        </button>
                        <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors">
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400 mb-2">$2.4M</div>
                        <div className="text-sm text-white/70">Q4 Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-2">320%</div>
                        <div className="text-sm text-white/70">Marketing ROI</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-2">+12%</div>
                        <div className="text-sm text-white/70">Efficiency Gain</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Executive Summary</h4>
                      <p className="text-white/80 leading-relaxed">
                        The comprehensive business analysis reveals strong performance across all departments with significant opportunities for continued growth. 
                        Marketing-Sales alignment is driving exceptional results, while operational improvements are creating substantial cost savings. 
                        The data-driven approach is yielding measurable improvements in decision-making and outcomes.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
} 