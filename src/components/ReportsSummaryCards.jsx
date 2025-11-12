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

const ReportsSummaryCards = ({ dateRange }) => {
  // Mock data based on date range
  const getDataForRange = (range) => {
    const data = {
      '7days': {
        totalUsers: 1247,
        totalFolders: 3421,
        totalFiles: 15678,
        upcomingSchedules: 23,
        storageUsed: 68.5,
        userGrowth: 2.3,
        fileGrowth: 12.5,
        scheduleSuccess: 94.2
      },
      '30days': {
        totalUsers: 1247,
        totalFolders: 3421,
        totalFiles: 15678,
        upcomingSchedules: 23,
        storageUsed: 68.5,
        userGrowth: 8.7,
        fileGrowth: 45.2,
        scheduleSuccess: 94.2
      },
      '90days': {
        totalUsers: 1247,
        totalFolders: 3421,
        totalFiles: 15678,
        upcomingSchedules: 23,
        storageUsed: 68.5,
        userGrowth: 23.1,
        fileGrowth: 156.8,
        scheduleSuccess: 94.2
      },
      '1year': {
        totalUsers: 1247,
        totalFolders: 3421,
        totalFiles: 15678,
        upcomingSchedules: 23,
        storageUsed: 68.5,
        userGrowth: 89.4,
        fileGrowth: 445.7,
        scheduleSuccess: 94.2
      }
    }
    return data[range] || data['30days']
  }

  const data = getDataForRange(dateRange)

  const cards = [
    {
      title: 'Total Users',
      value: data.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      growth: data.userGrowth,
      trend: 'up'
    },
    {
      title: 'Total Folders',
      value: data.totalFolders.toLocaleString(),
      icon: FolderOpen,
      color: 'bg-primary-500',
      growth: 5.2,
      trend: 'up'
    },
    {
      title: 'Total Files',
      value: data.totalFiles.toLocaleString(),
      icon: FileText,
      color: 'bg-green-500',
      growth: data.fileGrowth,
      trend: 'up'
    },
    {
      title: 'Upcoming Schedules',
      value: data.upcomingSchedules,
      icon: Clock,
      color: 'bg-purple-500',
      growth: -2.1,
      trend: 'down'
    },
    {
      title: 'Storage Used',
      value: `${data.storageUsed}%`,
      icon: HardDrive,
      color: 'bg-orange-500',
      growth: 3.4,
      trend: 'up'
    },
    {
      title: 'Schedule Success Rate',
      value: `${data.scheduleSuccess}%`,
      icon: Activity,
      color: 'bg-emerald-500',
      growth: 1.2,
      trend: 'up'
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
