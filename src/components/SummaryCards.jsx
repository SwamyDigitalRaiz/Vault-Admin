import React from 'react'
import { motion } from 'framer-motion'
import { Users, FolderOpen, FileText, Clock, HardDrive, TrendingUp, TrendingDown } from 'lucide-react'

const SummaryCards = () => {
  const cards = [
    {
      title: 'Users',
      totalValue: '2,847',
      todayValue: '12',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Folders',
      totalValue: '15,432',
      todayValue: '23',
      change: '+8%',
      trend: 'up',
      icon: FolderOpen,
      color: 'bg-green-500'
    },
    {
      title: 'Files',
      totalValue: '89,156',
      todayValue: '156',
      change: '+23%',
      trend: 'up',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      title: 'Schedules',
      totalValue: '1,247',
      todayValue: '8',
      change: '-3%',
      trend: 'down',
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: 'Storage Used',
      totalValue: '68%',
      todayValue: '+0.5%',
      change: '+5%',
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
