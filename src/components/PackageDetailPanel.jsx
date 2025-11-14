import React from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  Package, 
  IndianRupee, 
  Calendar, 
  CheckCircle, 
  Star,
  Users,
  Edit,
  Trash2,
  Clock,
  TrendingUp,
  FileText
} from 'lucide-react'

const PackageDetailPanel = ({ package: packageData, onClose, onEdit, onDelete }) => {
  if (!packageData) return null

  const getBillingCycleColor = (cycle) => {
    switch (cycle) {
      case 'monthly':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'yearly':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'lifetime':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
    }
  }

  const formatStorage = (bytes) => {
    if (!bytes) return '0 GB'
    const gb = bytes / (1024 * 1024 * 1024)
    return `${gb.toFixed(gb % 1 === 0 ? 0 : 2)} GB`
  }

  const panelVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300
      }
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed right-0 top-0 h-full w-full sm:w-96 lg:w-[28rem] bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-500 rounded-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Package Details
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View package information
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </motion.button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onEdit(packageData)
              onClose()
            }}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this package?')) {
                if (onDelete) {
                  onDelete(packageData._id || packageData.id)
                }
                onClose()
              }
            }}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Package Header */}
        <div className="relative">
          {packageData.isPopular && (
            <div className="absolute -top-2 -right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Star className="h-3 w-3 mr-1" />
              Popular
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {packageData.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {packageData.description}
            </p>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-6">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ₹{packageData.price}
              </span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getBillingCycleColor(packageData.billingCycle)}`}>
                /{packageData.billingCycle}
              </span>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              packageData.isActive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {packageData.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="mt-3 flex items-center text-sm text-gray-700 dark:text-gray-300">
            <Package className="h-4 w-4 mr-2" />
            <span className="font-medium">Storage Limit: {formatStorage(packageData.storageLimit)}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Subscribers</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {packageData.subscribers || 0}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <IndianRupee className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Revenue</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{packageData.revenue?.toFixed(0) || '0'}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Package className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Storage</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatStorage(packageData.storageLimit)}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="h-5 w-5 text-primary-500" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Features
            </h4>
          </div>
          <div className="space-y-2">
            {packageData.features && packageData.features.length > 0 ? (
              packageData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No features added
              </div>
            )}
          </div>
        </div>

        {/* Package Information */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-primary-500" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Package Information
            </h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Billing Cycle</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBillingCycleColor(packageData.billingCycle)}`}>
                {packageData.billingCycle.charAt(0).toUpperCase() + packageData.billingCycle.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                packageData.isActive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {packageData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Popular</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                packageData.isPopular 
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {packageData.isPopular ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Calculation */}
        {packageData.subscribers > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-400">
                Monthly Revenue
              </span>
            </div>
            <div className="text-lg font-bold text-blue-900 dark:text-blue-300">
              ₹{((packageData.price || 0) * (packageData.subscribers || 0)).toFixed(2)}
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              {packageData.subscribers} subscribers × ₹{packageData.price}/{packageData.billingCycle}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default PackageDetailPanel

