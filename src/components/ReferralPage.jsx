import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Gift, 
  TrendingUp, 
  UserPlus,
  Search,
  Filter,
  Download,
  Eye,
  Copy,
  CheckCircle,
  Calendar,
  Settings,
  Save
} from 'lucide-react'
import apiService from '../services/api'

const ReferralPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [referrals, setReferrals] = useState([])
  const [stats, setStats] = useState({
    totalUsersWithReferralCode: 0,
    totalReferrals: 0,
    recentReferrals: 0,
    averageReferralsPerUser: 0,
    topReferrers: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewingReferral, setViewingReferral] = useState(null)
  const [copiedCode, setCopiedCode] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({
    referrerAmount: 10,
    referredUserAmount: 5
  })
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)

  // Fetch referrals and stats on mount and when filters change
  useEffect(() => {
    fetchReferrals()
    fetchStats()
    fetchSettings()
  }, [page, sortBy, sortOrder])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        setPage(1) // Reset to first page on search
        fetchReferrals()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const fetchReferrals = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = {
        page,
        limit: 10,
        sortBy,
        sortOrder
      }
      if (searchTerm) params.search = searchTerm
      
      const response = await apiService.getReferrals(params)
      if (response.success) {
        setReferrals(response.data.referrals || [])
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages || 1)
        }
      } else {
        setError(response.message || 'Failed to fetch referrals')
      }
    } catch (err) {
      console.error('Error fetching referrals:', err)
      setError(err.message || 'Failed to fetch referrals')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await apiService.getReferralStats()
      if (response.success) {
        setStats(response.data.stats)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const fetchSettings = async () => {
    try {
      setSettingsLoading(true)
      const response = await apiService.getReferralSettings()
      if (response.success) {
        setSettings({
          referrerAmount: response.data.referrerAmount || 10,
          referredUserAmount: response.data.referredUserAmount || 5
        })
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
    } finally {
      setSettingsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true)
      const response = await apiService.updateReferralSettings(settings)
      if (response.success) {
        alert('Referral settings updated successfully!')
        setShowSettings(false)
      } else {
        alert(response.message || 'Failed to update settings')
      }
    } catch (err) {
      console.error('Error updating settings:', err)
      alert('Failed to update settings')
    } finally {
      setSavingSettings(false)
    }
  }

  const handleViewReferral = async (referralId) => {
    try {
      const response = await apiService.getReferralById(referralId)
      if (response.success) {
        setViewingReferral(response.data.referral)
      }
    } catch (err) {
      console.error('Error fetching referral details:', err)
      alert('Failed to fetch referral details')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(text)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
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
                  Referral Management
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  View users who registered with referral codes
                </p>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Users with Referral Code</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalUsersWithReferralCode}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Referrals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalReferrals}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Gift className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Recent (7 days)</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.recentReferrals}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg per User</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {parseFloat(stats.averageReferralsPerUser || 0).toFixed(1)}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <UserPlus className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Top Referrers */}
          {stats.topReferrers && stats.topReferrers.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Referrers
              </h2>
              <div className="space-y-3">
                {stats.topReferrers.slice(0, 5).map((referrer, index) => (
                  <div key={referrer.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{referrer.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{referrer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">{referrer.referralCount}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">referrals</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Search and Filters */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6 flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or referral code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="referralCount">Sort by Referrals</option>
              <option value="name">Sort by Name</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </motion.div>

          {/* Referrals Table */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading referrals...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : referrals.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">No referrals found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Referral Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Referred By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Amounts
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {referrals.map((referral) => (
                        <tr key={referral.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {referral.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {referral.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-mono text-gray-900 dark:text-white">
                                {referral.referralCode || 'N/A'}
                              </span>
                              {referral.referralCode && referral.referralCode !== 'N/A' && (
                                <button
                                  onClick={() => copyToClipboard(referral.referralCode)}
                                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                  title="Copy code"
                                >
                                  {copiedCode === referral.referralCode ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {referral.referredBy ? (
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {referral.referredBy.name}
                                </div>
                                <div className="text-xs">{referral.referredBy.email}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {referral.status === 'completed' ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                Completed
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {referral.status === 'completed' ? (
                              <div className="text-sm">
                                <div className="text-gray-900 dark:text-white">
                                  <span className="font-medium">Referrer:</span> ₹{referral.referrerAmount || 0}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 mt-1">
                                  <span className="font-medium">Referred:</span> ₹{referral.referredUserAmount || 0}
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(referral.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewReferral(referral.id)}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 flex items-center space-x-1"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Page {page} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </main>

      {/* Referral Detail Modal */}
      <AnimatePresence>
        {viewingReferral && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setViewingReferral(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Referral Details
                  </h2>
                  <button
                    onClick={() => setViewingReferral(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">User</label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {viewingReferral.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{viewingReferral.email}</p>
                    {viewingReferral.status && (
                      <div className="mt-2 flex items-center gap-3 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          viewingReferral.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        }`}>
                          {viewingReferral.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                        {viewingReferral.status === 'completed' && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Amounts:</span> Referrer ₹{viewingReferral.referrerAmount || 0} | Referred ₹{viewingReferral.referredUserAmount || 0}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {viewingReferral.referralCode && viewingReferral.referralCode !== 'N/A' && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Referral Code</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-lg font-mono text-gray-900 dark:text-white">
                          {viewingReferral.referralCode}
                        </p>
                        <button
                          onClick={() => copyToClipboard(viewingReferral.referralCode)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          title="Copy code"
                        >
                          {copiedCode === viewingReferral.referralCode ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  {viewingReferral.referredBy && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Referred By</label>
                      <p className="text-lg text-gray-900 dark:text-white">
                        {viewingReferral.referredBy.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {viewingReferral.referredBy.email}
                      </p>
                      {viewingReferral.referredBy.referralCode && (
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                            Code: {viewingReferral.referredBy.referralCode}
                          </span>
                          <button
                            onClick={() => copyToClipboard(viewingReferral.referredBy.referralCode)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            title="Copy referral code"
                          >
                            {copiedCode === viewingReferral.referredBy.referralCode ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {viewingReferral.referredUsers && viewingReferral.referredUsers.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                        Referred Users ({viewingReferral.referredUsers.length})
                      </label>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {viewingReferral.referredUsers.map((user) => (
                          <div
                            key={user.id}
                            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                              {user.referralCode && user.referralCode !== 'N/A' && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                                  Code: {user.referralCode}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(user.joinedAt)}
                              </p>
                              {user.status && (
                                <div className="mt-1 space-y-1">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    user.status === 'completed'
                                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                  }`}>
                                    {user.status === 'completed' ? 'Completed' : 'Pending'}
                                  </span>
                                  {user.status === 'completed' && user.amount && (
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                      Amount: ₹{user.amount}
                                    </div>
                                  )}
                                </div>
                              )}
                              {user.isActive !== undefined && (
                                <span className={`text-xs px-2 py-1 rounded-full mt-1 ${
                                  user.isActive
                                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                }`}>
                                  {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => !savingSettings && setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Referral Reward Settings
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  disabled={savingSettings}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Referrer Amount (User A) - ₹
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Amount User A gets when User B completes first transfer
                  </p>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.referrerAmount}
                    onChange={(e) => setSettings({ ...settings, referrerAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={savingSettings}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Referred User Amount (User B) - ₹
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Amount User B gets when they complete first transfer
                  </p>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.referredUserAmount}
                    onChange={(e) => setSettings({ ...settings, referredUserAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={savingSettings}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {savingSettings ? 'Saving...' : 'Save Settings'}
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    disabled={savingSettings}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ReferralPage

