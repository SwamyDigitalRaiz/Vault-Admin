import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  FolderOpen, 
  FileText, 
  Clock, 
  HardDrive,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react'

const ReportsSummaryCards = ({ summary }) => {
  // Use dynamic data from API or provide defaults
  const data = summary || {
    totalUsers: { value: 0, growth: 0 },
    totalFolders: { value: 0, growth: 0 },
    totalFiles: { value: 0, growth: 0 },
    upcomingSchedules: { value: 0, growth: 0 },
    storageUsed: { value: 0, growth: 0 },
    scheduleSuccessRate: { value: 0, growth: 0 }
  }

  const cards = [
    {
      title: 'Total Users',
      value: (data.totalUsers?.value || 0).toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      growth: data.totalUsers?.growth || 0,
      trend: (data.totalUsers?.growth || 0) >= 0 ? 'up' : 'down'
    },
    {
      title: 'Total Folders',
      value: (data.totalFolders?.value || 0).toLocaleString(),
      icon: FolderOpen,
      color: 'bg-primary-500',
      growth: data.totalFolders?.growth || 0,
      trend: (data.totalFolders?.growth || 0) >= 0 ? 'up' : 'down'
    },
    {
      title: 'Total Files',
      value: (data.totalFiles?.value || 0).toLocaleString(),
      icon: FileText,
      color: 'bg-green-500',
      growth: data.totalFiles?.growth || 0,
      trend: (data.totalFiles?.growth || 0) >= 0 ? 'up' : 'down'
    },
    {
      title: 'Upcoming Schedules',
      value: (data.upcomingSchedules?.value || 0).toLocaleString(),
      icon: Clock,
      color: 'bg-purple-500',
      growth: data.upcomingSchedules?.growth || 0,
      trend: (data.upcomingSchedules?.growth || 0) >= 0 ? 'up' : 'down'
    },
    {
      title: 'Storage Used',
      value: `${(data.storageUsed?.value || 0).toFixed(1)}%`,
      icon: HardDrive,
      color: 'bg-orange-500',
      growth: data.storageUsed?.growth || 0,
      trend: (data.storageUsed?.growth || 0) >= 0 ? 'up' : 'down'
    },
    {
      title: 'Schedule Success Rate',
      value: `${(data.scheduleSuccessRate?.value || 0).toFixed(1)}%`,
      icon: Activity,
      color: 'bg-emerald-500',
      growth: data.scheduleSuccessRate?.growth || 0,
      trend: (data.scheduleSuccessRate?.growth || 0) >= 0 ? 'up' : 'down'
    }
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.title}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.2 }
            }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {card.value}
                </p>
                <div className="flex items-center space-x-1">
                  {card.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.growth > 0 ? '+' : ''}{card.growth}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    vs last period
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ReportsSummaryCards
