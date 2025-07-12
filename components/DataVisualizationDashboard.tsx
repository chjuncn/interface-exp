'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  Download, 
  RefreshCw, 
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface DataPoint {
  id: string;
  value: number;
  label: string;
  category: string;
  timestamp: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}

const DataVisualizationDashboard: React.FC = () => {
  const [activeChart, setActiveChart] = useState<'bar' | 'line' | 'pie' | 'area'>('bar');
  const [isRealTime, setIsRealTime] = useState(false);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate sample data
  const generateSampleData = (): DataPoint[] => {
    const categories = ['Sales', 'Marketing', 'Engineering', 'Support'];
    const data: DataPoint[] = [];
    const now = Date.now();
    
    for (let i = 0; i < 20; i++) {
      const timestamp = now - (20 - i) * 3600000; // Hourly data
      data.push({
        id: `point-${i}`,
        value: Math.floor(Math.random() * 1000) + 100,
        label: `Data Point ${i + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        timestamp
      });
    }
    
    return data;
  };

  // Initialize data
  useEffect(() => {
    setDataPoints(generateSampleData());
  }, []);

  // Real-time data simulation
  useEffect(() => {
    if (isRealTime && isPlaying) {
      intervalRef.current = setInterval(() => {
        setDataPoints(prev => {
          const newPoint: DataPoint = {
            id: `point-${Date.now()}`,
            value: Math.floor(Math.random() * 1000) + 100,
            label: `Real-time ${new Date().toLocaleTimeString()}`,
            category: ['Sales', 'Marketing', 'Engineering', 'Support'][Math.floor(Math.random() * 4)],
            timestamp: Date.now()
          };
          
          // Keep only last 50 points for performance
          const updated = [...prev, newPoint].slice(-50);
          return updated;
        });
      }, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRealTime, isPlaying]);

  // Process data for charts
  const processChartData = (): ChartData => {
    const filteredData = selectedCategory === 'all' 
      ? dataPoints 
      : dataPoints.filter(point => point.category === selectedCategory);

    const categories = [...new Set(filteredData.map(point => point.category))];
    const aggregatedData = categories.map(category => {
      const categoryData = filteredData.filter(point => point.category === category);
      return {
        category,
        total: categoryData.reduce((sum, point) => sum + point.value, 0),
        average: categoryData.reduce((sum, point) => sum + point.value, 0) / categoryData.length
      };
    });

    if (activeChart === 'pie') {
      return {
        labels: aggregatedData.map(d => d.category),
        datasets: [{
          label: 'Total Value',
          data: aggregatedData.map(d => d.total),
          backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
            '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
          ]
        }]
      };
    }

    return {
      labels: aggregatedData.map(d => d.category),
      datasets: [{
        label: activeChart === 'line' ? 'Average Value' : 'Total Value',
        data: aggregatedData.map(d => activeChart === 'line' ? d.average : d.total),
        borderColor: '#3B82F6',
        backgroundColor: activeChart === 'area' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.8)',
        fill: activeChart === 'area'
      }]
    };
  };

  const chartData = processChartData();

  // Simple chart rendering (in a real app, you'd use Chart.js or similar)
  const renderChart = () => {
    const maxValue = Math.max(...chartData.datasets[0].data);
    
    if (activeChart === 'pie') {
      return (
        <div className="relative w-full h-64 flex items-center justify-center">
          <svg className="w-48 h-48 transform -rotate-90">
            {chartData.labels.map((label, index) => {
              const value = chartData.datasets[0].data[index];
              const percentage = value / maxValue;
              const angle = percentage * 360;
              const radius = 60;
              const circumference = 2 * Math.PI * radius;
              const strokeDasharray = circumference;
              const strokeDashoffset = circumference - (percentage * circumference);
              
              return (
                <g key={label}>
                  <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    fill="none"
                    stroke={chartData.datasets[0].backgroundColor?.[index] || '#3B82F6'}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(${index * 90}, 96, 96)`}
                  />
                </g>
              );
            })}
          </svg>
          <div className="absolute text-center">
            <div className="text-2xl font-bold">{maxValue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-64 flex items-end justify-between space-x-2 p-4">
        {chartData.labels.map((label, index) => {
          const value = chartData.datasets[0].data[index];
          const height = (value / maxValue) * 100;
          
          return (
            <motion.div
              key={label}
              className="flex-1 flex flex-col items-center"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-xs text-gray-600 mb-2 text-center">{label}</div>
              <div className="relative w-full">
                {activeChart === 'bar' && (
                  <motion.div
                    className="bg-blue-500 rounded-t"
                    style={{ height: `${height}%` }}
                    whileHover={{ scale: 1.05 }}
                  />
                )}
                {activeChart === 'line' && (
                  <motion.div
                    className="bg-blue-500 rounded-full w-3 h-3"
                    style={{ marginBottom: `${height}%` }}
                    whileHover={{ scale: 1.2 }}
                  />
                )}
                {activeChart === 'area' && (
                  <motion.div
                    className="bg-blue-500 rounded-t"
                    style={{ height: `${height}%` }}
                    whileHover={{ scale: 1.05 }}
                  />
                )}
              </div>
              <div className="text-xs font-medium mt-1">{value.toLocaleString()}</div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Category,Value,Label,Timestamp\n"
      + dataPoints.map(point => 
          `${point.category},${point.value},${point.label},${new Date(point.timestamp).toISOString()}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dashboard_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Visualization Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time analytics and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={16} />
            <span>Export</span>
          </motion.button>
          <motion.button
            onClick={() => setDataPoints(generateSampleData())}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-sm border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Chart Type Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Chart Type:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { type: 'bar' as const, icon: BarChart3, label: 'Bar' },
                { type: 'line' as const, icon: LineChart, label: 'Line' },
                { type: 'pie' as const, icon: PieChart, label: 'Pie' },
                { type: 'area' as const, icon: TrendingUp, label: 'Area' }
              ].map(({ type, icon: Icon, label }) => (
                <motion.button
                  key={type}
                  onClick={() => setActiveChart(type)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeChart === type 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Engineering">Engineering</option>
              <option value="Support">Support</option>
            </select>
          </div>

          {/* Time Range */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* Real-time Controls */}
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isRealTime}
                onChange={(e) => setIsRealTime(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Real-time</span>
            </label>
            {isRealTime && (
              <motion.button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Chart Display */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-sm border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {activeChart.charAt(0).toUpperCase() + activeChart.slice(1)} Chart
          </h2>
          <p className="text-gray-600">
            {isRealTime && isPlaying ? 'Live data updating every 2 seconds' : 'Static data visualization'}
          </p>
        </div>
        
        <div className="w-full h-64">
          {renderChart()}
        </div>
      </motion.div>

      {/* Data Table */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-sm border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Data Points</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4">Category</th>
                <th className="text-left py-2 px-4">Value</th>
                <th className="text-left py-2 px-4">Label</th>
                <th className="text-left py-2 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {dataPoints.slice(-10).reverse().map((point) => (
                <motion.tr
                  key={point.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      point.category === 'Sales' ? 'bg-blue-100 text-blue-800' :
                      point.category === 'Marketing' ? 'bg-green-100 text-green-800' :
                      point.category === 'Engineering' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {point.category}
                    </span>
                  </td>
                  <td className="py-2 px-4 font-medium">{point.value.toLocaleString()}</td>
                  <td className="py-2 px-4 text-gray-600">{point.label}</td>
                  <td className="py-2 px-4 text-gray-500">
                    {new Date(point.timestamp).toLocaleString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {[
          { label: 'Total Points', value: dataPoints.length, color: 'blue' },
          { label: 'Average Value', value: Math.round(dataPoints.reduce((sum, p) => sum + p.value, 0) / dataPoints.length), color: 'green' },
          { label: 'Categories', value: new Set(dataPoints.map(p => p.category)).size, color: 'purple' },
          { label: 'Real-time', value: isRealTime && isPlaying ? 'Active' : 'Inactive', color: 'orange' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm border"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DataVisualizationDashboard; 