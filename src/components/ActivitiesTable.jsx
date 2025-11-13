import React from 'react'
import { motion } from 'framer-motion'
import { Upload, Trash2, Clock, AlertTriangle, User, FileText, FolderOpen } from 'lucide-react'

const ActivitiesTable = ({ stats, loading }) => {
  const activities = stats?.activities || []

  const getActionIcon = (action) => {
    switch (action) {
      case 'upload':
        return <Upload className="h-4 w-4" />
      case 'delete':
        return <Trash2 className="h-4 w-4" />
      case 'schedule':
        return <Clock className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'upload':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'delete':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'schedule':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getItemIcon = (type) => {
    return type === 'folder' ? 
      <FolderOpen className="h-4 w-4" /> : 
      <FileText className="h-4 w-4" />
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const rowVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
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
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activities
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Latest user actions and system events
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date/Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Loading activities...
                </td>
              </tr>
            ) : activities.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No recent activities
                </td>
              </tr>
            ) : (
              activities.map((activity) => (
                <motion.tr
                  key={activity.id}
                  variants={rowVariants}
                  whileHover={{ 
                    backgroundColor: 'rgba(99, 24, 63, 0.05)',
                    transition: { duration: 0.2 }
                  }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.user}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                      {getActionIcon(activity.action)}
                      <span className="ml-1 capitalize">{activity.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <span className="mr-2 text-gray-500 dark:text-gray-400">
                        {getItemIcon(activity.type)}
                      </span>
                      {activity.item}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {activity.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {activity.status === 'failed' ? (
                      <div className="flex items-center text-red-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Failed</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">Success</span>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
          View all activities →
        </button>
      </div>
    </motion.div>
  )
}

export default ActivitiesTable
