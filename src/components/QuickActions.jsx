import React from 'react'
import { motion } from 'framer-motion'
import { UserPlus, FolderPlus, FilePlus, Calendar, Plus } from 'lucide-react'

const QuickActions = () => {
  const actions = [
    {
      title: 'Create User',
      description: 'Add new user account',
      icon: UserPlus,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'Add Contact',
      description: 'Create new contact',
      icon: UserPlus,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      title: 'Upload Folder',
      description: 'Create new folder',
      icon: FolderPlus,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      title: 'Upload File',
      description: 'Add new file',
      icon: FilePlus,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      title: 'Create Schedule',
      description: 'Set up new schedule',
      icon: Calendar,
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600'
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

  const actionVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-500 rounded-lg">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h3>
        </div>
      </div>

      <div className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={index}
              variants={actionVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${action.color} ${action.hoverColor} text-white group`}
            >
              <Icon className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Click any action to get started quickly
        </p>
      </div>
    </motion.div>
  )
}

export default QuickActions
