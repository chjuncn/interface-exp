'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, LineChart, PieChart, TrendingUp, Activity, Database } from 'lucide-react';

interface DashboardPreviewProps {
  code: string;
}

interface ChartConfig {
  type: string;
  title: string;
  colors: string[];
  data: any[];
}

export default function DashboardPreview({ code }: DashboardPreviewProps) {
  const [config, setConfig] = useState<{
    name: string;
    theme: string;
    charts: Record<string, ChartConfig>;
    features: Record<string, boolean>;
  }>({
    name: 'Data Analytics Dashboard',
    theme: 'modern',
    charts: {},
    features: {}
  });

  // Parse dashboard configuration from code
  useEffect(() => {
    try {
      // Simple parsing for demo purposes
      const lines = code.split('\n');
      const parsedConfig: any = {
        name: 'Data Analytics Dashboard',
        theme: 'modern',
        charts: {},
        features: {}
      };

      let currentSection = '';
      let currentChart = '';

      lines.forEach(line => {
        const trimmed = line.trim();
        
        if (trimmed.includes('name:')) {
          const name = trimmed.split('name:')[1]?.trim().replace(/"/g, '');
          if (name) parsedConfig.name = name;
        }
        
        if (trimmed.includes('theme:')) {
          const theme = trimmed.split('theme:')[1]?.trim().replace(/"/g, '');
          if (theme) parsedConfig.theme = theme;
        }

        if (trimmed.includes('charts {')) {
          currentSection = 'charts';
        } else if (trimmed.includes('features {')) {
          currentSection = 'features';
        } else if (trimmed.includes('}')) {
          currentSection = '';
          currentChart = '';
        } else if (currentSection === 'charts' && trimmed.includes('{')) {
          currentChart = trimmed.split('{')[0].trim();
          parsedConfig.charts[currentChart] = {
            type: 'bar',
            title: 'Chart',
            colors: ['#3B82F6'],
            data: []
          };
        } else if (currentChart && trimmed.includes('type:')) {
          const type = trimmed.split('type:')[1]?.trim().replace(/"/g, '');
          if (type && parsedConfig.charts[currentChart]) {
            parsedConfig.charts[currentChart].type = type;
          }
        } else if (currentChart && trimmed.includes('title:')) {
          const title = trimmed.split('title:')[1]?.trim().replace(/"/g, '');
          if (title && parsedConfig.charts[currentChart]) {
            parsedConfig.charts[currentChart].title = title;
          }
        } else if (currentChart && trimmed.includes('colors:')) {
          const colorsMatch = trimmed.match(/\[(.*?)\]/);
          if (colorsMatch && parsedConfig.charts[currentChart]) {
            const colors = colorsMatch[1].split(',').map(c => c.trim().replace(/"/g, ''));
            parsedConfig.charts[currentChart].colors = colors;
          }
        } else if (currentSection === 'features' && trimmed.includes('true')) {
          const feature = trimmed.split(':')[0].trim();
          parsedConfig.features[feature] = true;
        }
      });

      setConfig(parsedConfig);
    } catch (error) {
      console.error('Error parsing dashboard config:', error);
    }
  }, [code]);

  // Generate sample data for charts
  const generateChartData = (type: string) => {
    if (type === 'pie') {
      return [
        { label: 'Electronics', value: 35, color: '#3B82F6' },
        { label: 'Clothing', value: 25, color: '#10B981' },
        { label: 'Books', value: 20, color: '#F59E0B' },
        { label: 'Home', value: 15, color: '#EF4444' },
        { label: 'Other', value: 5, color: '#8B5CF6' }
      ];
    }
    
    return [
      { label: 'Jan', value: 65, color: '#3B82F6' },
      { label: 'Feb', value: 78, color: '#10B981' },
      { label: 'Mar', value: 90, color: '#F59E0B' },
      { label: 'Apr', value: 81, color: '#EF4444' },
      { label: 'May', value: 95, color: '#8B5CF6' },
      { label: 'Jun', value: 88, color: '#06B6D4' }
    ];
  };

  const renderChart = (chartKey: string, chartConfig: ChartConfig) => {
    const data = generateChartData(chartConfig.type);
    
    if (chartConfig.type === 'pie') {
      return (
        <div className="w-full h-48 flex items-center justify-center">
          <div className="relative w-32 h-32">
            {data.map((item, index) => {
              const percentage = item.value / 100;
              const angle = percentage * 360;
              const radius = 60;
              const circumference = 2 * Math.PI * radius;
              const strokeDasharray = circumference;
              const strokeDashoffset = circumference - (percentage * circumference);
              
              return (
                <svg key={item.label} className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(${index * 72}, 64, 64)`}
                  />
                </svg>
              );
            })}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold">{data.reduce((sum, item) => sum + item.value, 0)}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="w-full h-48 flex items-end justify-between space-x-2 p-4">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          
          return (
            <motion.div
              key={item.label}
              className="flex-1 flex flex-col items-center"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-xs text-gray-600 mb-2 text-center">{item.label}</div>
              <div className="relative w-full">
                {chartConfig.type === 'bar' && (
                  <motion.div
                    className="rounded-t"
                    style={{ 
                      height: `${height}%`,
                      backgroundColor: chartConfig.colors[index % chartConfig.colors.length] || '#3B82F6'
                    }}
                    whileHover={{ scale: 1.05 }}
                  />
                )}
                {chartConfig.type === 'line' && (
                  <motion.div
                    className="rounded-full w-3 h-3"
                    style={{ 
                      marginBottom: `${height}%`,
                      backgroundColor: chartConfig.colors[index % chartConfig.colors.length] || '#3B82F6'
                    }}
                    whileHover={{ scale: 1.2 }}
                  />
                )}
              </div>
              <div className="text-xs font-medium mt-1">{item.value}</div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{config.name}</h1>
              <p className="text-gray-600">Live preview of dashboard configuration</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                <Activity className="w-4 h-4" />
                Preview Mode
              </div>
            </div>
          </div>
          
          {/* Feature Indicators */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(config.features).map(([feature, enabled]) => (
              <div key={feature} className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {feature}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(config.charts).map(([chartKey, chartConfig], index) => (
            <motion.div
              key={chartKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border"
            >
              <div className="flex items-center gap-2 mb-4">
                {chartConfig.type === 'bar' && <BarChart3 className="w-5 h-5 text-blue-600" />}
                {chartConfig.type === 'line' && <LineChart className="w-5 h-5 text-green-600" />}
                {chartConfig.type === 'pie' && <PieChart className="w-5 h-5 text-purple-600" />}
                <h3 className="font-semibold text-gray-900">{chartConfig.title}</h3>
              </div>
              
              {renderChart(chartKey, chartConfig)}
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Type: {chartConfig.type}</span>
                  <span>Data: {generateChartData(chartConfig.type).length} points</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Configuration Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-white rounded-xl p-6 shadow-sm border"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Configuration Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Theme:</span>
              <span className="ml-2 text-gray-600">{config.theme}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Charts:</span>
              <span className="ml-2 text-gray-600">{Object.keys(config.charts).length}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Features:</span>
              <span className="ml-2 text-gray-600">{Object.keys(config.features).length}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 