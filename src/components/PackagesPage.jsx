import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  IndianRupee, 
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
  Eye,
  AlertCircle
} from 'lucide-react'
import PackageModal from './PackageModal'
import PackageDetailPanel from './PackageDetailPanel'
import apiService from '../services/api'

const PackagesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  const [viewingPackage, setViewingPackage] = useState(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)
  const [packages, setPackages] = useState([])
  const [stats, setStats] = useState({
    totalPackages: 0,
    activePackages: 0,
    totalSubscribers: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingPackageId, setDeletingPackageId] = useState(null)

  // Fetch packages and stats on mount
  useEffect(() => {
    fetchPackages()
    fetchStats()
  }, [searchTerm, filterType])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (filterType !== 'all') params.filterType = filterType
      
      const response = await apiService.getPackages(params)
      if (response.success) {
        // Convert _id to id for consistency
        const formattedPackages = response.data.packages.map(pkg => ({
          ...pkg,
          id: pkg._id || pkg.id
        }))
        setPackages(formattedPackages)
      } else {
        setError(response.message || 'Failed to fetch packages')
      }
    } catch (err) {
      console.error('Error fetching packages:', err)
      setError(err.message || 'Failed to fetch packages')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await apiService.getPackageStats()
      if (response.success) {
        setStats(response.data.stats)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleSavePackage = async (packageData) => {
    try {
      let response
      if (editingPackage) {
        // Update existing package
        response = await apiService.updatePackage(editingPackage.id || editingPackage._id, packageData)
      } else {
        // Create new package
        response = await apiService.createPackage(packageData)
      }

      if (response.success) {
        // Refresh packages list
        await fetchPackages()
        await fetchStats()
        setShowAddModal(false)
        setEditingPackage(null)
        
        // Show success message
        alert(editingPackage ? 'Package updated successfully!' : 'Package created successfully!')
      } else {
        alert(response.message || 'Failed to save package')
      }
    } catch (err) {
      console.error('Error saving package:', err)
      alert(err.message || 'Failed to save package')
    }
  }

  const handleDeletePackage = async (packageId) => {
    if (!window.confirm('Are you sure you want to delete this package?')) {
      return
    }

    try {
      setDeletingPackageId(packageId)
      const response = await apiService.deletePackage(packageId)
      
      if (response.success) {
        // Refresh packages list
        await fetchPackages()
        await fetchStats()
        alert('Package deleted successfully!')
      } else {
        alert(response.message || 'Failed to delete package')
      }
    } catch (err) {
      console.error('Error deleting package:', err)
      alert(err.message || 'Failed to delete package')
    } finally {
      setDeletingPackageId(null)
    }
  }

  // Filter packages client-side (for better UX while API supports server-side filtering)
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = !searchTerm || 
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const formatStorage = (bytes) => {
    if (!bytes) return '0 GB'
    const gb = bytes / (1024 * 1024 * 1024)
    return `${gb.toFixed(gb % 1 === 0 ? 0 : 2)} GB`
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
                  onClick={() => {
                    setEditingPackage(null)
                    setShowAddModal(true)
                  }}
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

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3"
            >
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
              <button
                onClick={fetchPackages}
                className="ml-auto text-red-600 dark:text-red-400 hover:underline"
              >
                Retry
              </button>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          )}

          {/* Packages Grid */}
          {!loading && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
          >
              {filteredPackages.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm || filterType !== 'all' 
                      ? 'No packages match your filters' 
                      : 'No packages found. Create your first package!'}
                  </p>
                </div>
              ) : (
                filteredPackages.map((pkg) => (
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
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setEditingPackage(pkg)
                        setShowAddModal(true)
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeletePackage(pkg.id || pkg._id)}
                      disabled={deletingPackageId === (pkg.id || pkg._id)}
                      className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ₹{pkg.price}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getBillingCycleColor(pkg.billingCycle)}`}>
                      /{pkg.billingCycle}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Package className="h-4 w-4 mr-1" />
                    <span>Storage: {formatStorage(pkg.storageLimit)}</span>
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
                      ₹{pkg.revenue.toFixed(0)}
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
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setViewingPackage(pkg)
                      setIsDetailPanelOpen(true)
                    }}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <Eye className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
                ))
              )}
          </motion.div>
          )}

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
                    {stats.totalPackages}
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
                    {stats.activePackages}
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
                    {stats.totalSubscribers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <IndianRupee className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{stats.totalRevenue.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Package Detail Panel */}
      <AnimatePresence>
        {isDetailPanelOpen && viewingPackage && (
          <PackageDetailPanel
            package={viewingPackage}
            onClose={() => {
              setIsDetailPanelOpen(false)
              setViewingPackage(null)
            }}
            onEdit={(pkg) => {
              setEditingPackage(pkg)
              setShowAddModal(true)
              setIsDetailPanelOpen(false)
              setViewingPackage(null)
            }}
            onDelete={(packageId) => {
              handleDeletePackage(packageId)
              setIsDetailPanelOpen(false)
              setViewingPackage(null)
            }}
          />
        )}
      </AnimatePresence>

      {/* Package Modal */}
      <PackageModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingPackage(null)
        }}
        package={editingPackage}
        onSave={handleSavePackage}
      />
    </motion.div>
  )
}

export default PackagesPage
