import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Eye, 
  Trash2,
  ChevronUp, 
  ChevronDown,
  User,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import apiService from '../services/api'
import { toast } from '../utils/toast'

const RecipientsTable = ({ onRecipientSelect }) => {
  const [recipients, setRecipients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedOwner, setSelectedOwner] = useState('all')

  // Fetch recipients from API
  const fetchRecipients = async () => {
    try {
      setLoading(true)
      console.log('📋 Fetching recipients...')
      
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (selectedOwner !== 'all') params.owner = selectedOwner
      
      const response = await apiService.getRecipients(params)
      console.log('✅ Recipients fetched:', response)
      
      if (response.success && response.recipients) {
        setRecipients(response.recipients)
      } else {
        setRecipients([])
      }
    } catch (error) {
      console.error('❌ Error fetching recipients:', error)
      toast.error(error.message || 'Failed to load recipients')
      setRecipients([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipients()
  }, [selectedOwner])

  // Handle delete recipient
  const handleDelete = async (recipient, e) => {
    e.stopPropagation()
    
    if (!window.confirm(`Are you sure you want to delete ${recipient.name}?`)) {
      return
    }

    try {
      console.log('🗑️ Deleting recipient:', recipient._id)
      const response = await apiService.deleteRecipient(recipient._id)
      
      if (response.success) {
        toast.success('Recipient deleted successfully')
        fetchRecipients() // Refresh list
      }
    } catch (error) {
      console.error('❌ Error deleting recipient:', error)
      toast.error(error.message || 'Failed to delete recipient')
    }
  }


  // Handle view recipient
  const handleView = (recipient) => {
    if (onRecipientSelect) {
      onRecipientSelect(recipient)
    }
  }

  // Filter and sort recipients
  const filteredRecipients = recipients.filter(recipient => {
    if (!searchTerm) return true
    
    const search = searchTerm.toLowerCase()
    return (
      recipient.name?.toLowerCase().includes(search) ||
      recipient.email?.toLowerCase().includes(search) ||
      recipient.phone?.includes(search)
    )
  })

  const sortedRecipients = [...filteredRecipients].sort((a, b) => {
    let aValue = a[sortField] || ''
    let bValue = b[sortField] || ''
    
    if (sortField === 'name') {
      aValue = a.name?.toLowerCase() || ''
      bValue = b.name?.toLowerCase() || ''
    } else if (sortField === 'createdAt') {
      aValue = new Date(a.createdAt).getTime()
      bValue = new Date(b.createdAt).getTime()
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getOwnerName = (owner) => {
    if (!owner) return 'Unknown'
    return owner.name || owner.email || 'Unknown'
  }

  // Get unique owners for filter
  const getOwnerOptions = () => {
    const owners = new Map()
    recipients.forEach(recipient => {
      if (recipient.owner) {
        owners.set(recipient.owner._id || recipient.owner, getOwnerName(recipient.owner))
      }
    })
    return Array.from(owners.entries())
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header with Search and Filters */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchRecipients}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-semibold text-gray-900 dark:text-white">{recipients.length}</span> Total Recipients
          </div>
          <div>
            <span className="font-semibold text-gray-900 dark:text-white">{filteredRecipients.length}</span> Filtered
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">Loading recipients...</p>
          </div>
        </div>
      ) : sortedRecipients.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Recipients Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'No recipients available yet'}
          </p>
        </div>
      ) : (
        /* Table */
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Owner
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Created</span>
                      {getSortIcon('createdAt')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {sortedRecipients.map((recipient, index) => (
                    <motion.tr
                      key={recipient._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      whileHover={{ 
                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                        transition: { duration: 0.2 }
                      }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                      onClick={() => handleView(recipient)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-semibold text-sm">
                              {recipient.name?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {recipient.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {recipient.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          {recipient.phone ? (
                            <>
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              {recipient.phone}
                            </>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {recipient.notes || <span className="text-gray-400">—</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {getOwnerName(recipient.owner)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(recipient.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleView(recipient)
                            }}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleDelete(recipient, e)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {sortedRecipients.length} of {recipients.length} recipients
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default RecipientsTable

