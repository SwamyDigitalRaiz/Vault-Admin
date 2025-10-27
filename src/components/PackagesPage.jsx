import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle, 
  Star,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Eye
} from 'lucide-react'

const PackagesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  // Mock data for packages
  const packages = [
    {
      id: 1,
      name: 'Basic Plan',
      description: 'Essential features for small teams',
      price: 9.99,
      billingCycle: 'monthly',
      features: ['5GB Storage', 'Basic Support', 'Up to 5 Users'],
      isPopular: false,
      isActive: true,
      subscribers: 45,
      revenue: 449.55
    },
    {
      id: 2,
      name: 'Premium Plan',
      description: 'Advanced features for growing businesses',
      price: 29.99,
      billingCycle: 'monthly',
      features: ['50GB Storage', 'Priority Support', 'Up to 25 Users', 'Advanced Analytics'],
      isPopular: true,
      isActive: true,
      subscribers: 128,
      revenue: 3838.72
    },
    {
      id: 3,
      name: 'Enterprise Plan',
      description: 'Full-featured solution for large organizations',
      price: 99.99,
      billingCycle: 'monthly',
      features: ['Unlimited Storage', '24/7 Support', 'Unlimited Users', 'Custom Integrations', 'Dedicated Manager'],
      isPopular: false,
      isActive: true,
      subscribers: 23,
      revenue: 2299.77
    },
    {
      id: 4,
      name: 'Starter Plan',
      description: 'Free tier for getting started',
      price: 0,
      billingCycle: 'monthly',
      features: ['1GB Storage', 'Community Support', 'Up to 2 Users'],
      isPopular: false,
      isActive: false,
      subscribers: 0,
      revenue: 0
    }
  ]

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'active' && pkg.isActive) ||
                         (filterType === 'inactive' && !pkg.isActive) ||
                         (filterType === 'popular' && pkg.isPopular)
    return matchesSearch && matchesFilter
  })

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

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-3 sm:p-6">
          {/* Page Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Package Management
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Manage subscription packages, pricing, and features
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Package</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Type Filter */}
              <div className="sm:w-48">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Packages</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="popular">Popular</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Packages Grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
          >
            {filteredPackages.map((pkg) => (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative"
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </div>
                )}

                {/* Package Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {pkg.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${pkg.price}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getBillingCycleColor(pkg.billingCycle)}`}>
                      /{pkg.billingCycle}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {pkg.subscribers}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Subscribers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${pkg.revenue.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Revenue</div>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-4 flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    pkg.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {pkg.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Packages</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {packages.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Packages</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {packages.filter(p => p.isActive).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {packages.reduce((sum, p) => sum + p.subscribers, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${packages.reduce((sum, p) => sum + p.revenue, 0).toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </motion.div>
  )
}

export default PackagesPage
