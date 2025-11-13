import React from 'react'
import { motion } from 'framer-motion'
import { Users, FolderOpen, FileText, Clock, HardDrive, TrendingUp, TrendingDown } from 'lucide-react'

// Helper function to format bytes
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const SummaryCards = ({ stats, loading }) => {
  // Extract data from API response
  const totalUsers = stats?.users?.total || 0
  const activeUsers = stats?.users?.active || 0
  const totalFolders = stats?.content?.folders || 0
  const totalFiles = stats?.content?.files || 0
  const totalSchedules = stats?.content?.schedules || 0
  const recentRegistrations = stats?.users?.recentRegistrations || 0

  // Calculate percentages for trends
  const userActivePercent = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
  const recentUsersPercent = totalUsers > 0 ? Math.round((recentRegistrations / totalUsers) * 100) : 0

  const cards = [
    {
      title: 'Users',
      totalValue: loading ? '...' : totalUsers.toLocaleString(),
      todayValue: loading ? '...' : activeUsers.toString(),
      change: loading ? '...' : `+${userActivePercent}%`,
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Folders',
      totalValue: loading ? '...' : totalFolders.toLocaleString(),
      todayValue: loading ? '...' : totalFolders.toString(),
      change: loading ? '...' : '+0%',
      trend: 'up',
      icon: FolderOpen,
      color: 'bg-green-500'
    },
    {
      title: 'Files',
      totalValue: loading ? '...' : totalFiles.toLocaleString(),
      todayValue: loading ? '...' : totalFiles.toString(),
      change: loading ? '...' : '+0%',
      trend: 'up',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      title: 'Schedules',
      totalValue: loading ? '...' : totalSchedules.toLocaleString(),
      todayValue: loading ? '...' : totalSchedules.toString(),
      change: loading ? '...' : '+0%',
      trend: 'up',
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: 'Storage Used',
      totalValue: loading ? '...' : `${stats?.storage?.percent || 0}%`,
      todayValue: loading ? '...' : formatBytes(stats?.storage?.totalUsed || 0),
      change: loading ? '...' : `${stats?.storage?.percent || 0}%`,
      trend: 'up',
      icon: HardDrive,
      color: 'bg-red-500'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
    >
      {cards.map((card, index) => {
        const Icon = card.icon
        const TrendIcon = card.trend === 'up' ? TrendingUp : TrendingDown
        
        return (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ 
              y: -2,
              transition: { duration: 0.2 }
            }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color} shadow-md`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                card.trend === 'up' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                <TrendIcon className="h-3 w-3" />
                <span>{card.change}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              {/* Today Count */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {card.todayValue}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Today {card.title}
                </p>
              </div>
              
              {/* Total Count */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Total
                  </span>
                  <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {card.totalValue}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default SummaryCards
