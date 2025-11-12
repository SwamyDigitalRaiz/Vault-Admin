import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Clock,
  User,
  FolderOpen,
  FileText,
  Mail,
  Calendar,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react'

const SchedulesTable = ({ schedules: propsSchedules = [], onScheduleSelect, onEditSchedule, onScheduleSelectNav, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [frequencyFilter, setFrequencyFilter] = useState('all')
  const [sortField, setSortField] = useState('nextExecutionDate')
  const [sortDirection, setSortDirection] = useState('asc')
  const [showFilters, setShowFilters] = useState(false)

  // Transform API schedules to table format
  const schedules = propsSchedules.map(schedule => {
    const itemCount = schedule.items?.length || 0
    const enabledItems = schedule.items?.filter(item => item.isEnabled !== false) || []
    const enabledCount = enabledItems.length
    
    // Get first item for display
    const firstItem = schedule.items?.[0]
    const targetFolder = firstItem?.folder?.name || null
    const targetFile = firstItem?.file?.name || null
    
    // Get all unique recipients from all items
    const allRecipients = schedule.items?.flatMap(item => 
      item.recipients?.map(r => r.email) || []
    ) || []
    const uniqueRecipients = [...new Set(allRecipients)]
    
    // Calculate execution stats
    const executionHistory = schedule.executionHistory || []
    const totalSends = executionHistory.length
    const successfulSends = executionHistory.filter(e => e.status === 'success').length
    const failedSends = executionHistory.filter(e => e.status === 'failed').length
    const lastSent = schedule.lastExecutionDate 
      ? new Date(schedule.lastExecutionDate).toLocaleString()
      : null
    
    return {
      id: schedule.id || schedule._id,
      _id: schedule._id || schedule.id,
      createdBy: schedule.owner?.email || 'Unknown',
      createdByName: schedule.owner?.name || 'Unknown',
      ownerId: schedule.owner?.id || schedule.owner?._id,
      targetFolder,
      targetFile,
      recipients: uniqueRecipients,
      scheduleType: schedule.scheduleType || 'one-time',
      nextSend: schedule.nextExecutionDate 
        ? new Date(schedule.nextExecutionDate).toLocaleString()
        : 'Not scheduled',
      status: schedule.status || 'pending',
      isEnabled: schedule.isEnabled !== false,
      lastSent,
      totalSends,
      successfulSends,
      failedSends,
      itemCount,
      enabledCount,
      scheduleData: schedule // Keep full schedule data for detail view
    }
  })

  const filteredSchedules = schedules.filter(schedule => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = !searchTerm || 
      (schedule.id && schedule.id.toLowerCase().includes(searchLower)) ||
      (schedule.createdByName && schedule.createdByName.toLowerCase().includes(searchLower)) ||
      (schedule.createdBy && schedule.createdBy.toLowerCase().includes(searchLower)) ||
      (schedule.targetFolder && schedule.targetFolder.toLowerCase().includes(searchLower)) ||
      (schedule.targetFile && schedule.targetFile.toLowerCase().includes(searchLower))
    
    const matchesOwner = ownerFilter === 'all' || schedule.createdBy === ownerFilter
    const matchesStatus = statusFilter === 'all' || schedule.status?.toLowerCase() === statusFilter.toLowerCase()
    const matchesFrequency = frequencyFilter === 'all' || schedule.scheduleType?.toLowerCase() === frequencyFilter.toLowerCase()
    
    return matchesSearch && matchesOwner && matchesStatus && matchesFrequency
  })

  const sortedSchedules = [...filteredSchedules].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    
    if (sortField === 'nextExecutionDate' || sortField === 'nextSend') {
      aValue = a.nextSend === 'Not scheduled' ? new Date(0) : new Date(a.nextSend)
      bValue = b.nextSend === 'Not scheduled' ? new Date(0) : new Date(b.nextSend)
    } else if (sortField === 'createdBy') {
      aValue = a.createdByName?.toLowerCase() || ''
      bValue = b.createdByName?.toLowerCase() || ''
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

  if (schedules.length === 0 && !searchTerm && statusFilter === 'all') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No schedules found</h3>
        <p className="text-gray-600 dark:text-gray-400">Users haven't created any schedules yet.</p>
      </div>
    )
  }

  const handleAction = (action, schedule) => {
    if (action === 'view') {
      // Use the full schedule data for detail view
      const fullSchedule = schedule.scheduleData || schedule
      if (onScheduleSelectNav) {
        // Navigate to user details page using the same navigation as Users
        onScheduleSelectNav(fullSchedule)
      } else {
        // Fallback to original schedule selection
        onScheduleSelect(fullSchedule)
      }
    }
  }

  const getOwnerOptions = () => {
    const owners = [...new Set(schedules.map(schedule => schedule.createdBy))]
    return owners
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Play className="h-3 w-3" />
      case 'paused':
        return <Pause className="h-3 w-3" />
      case 'failed':
        return <XCircle className="h-3 w-3" />
      case 'completed':
        return <CheckCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getFrequencyColor = (frequency) => {
    switch (frequency.toLowerCase()) {
      case 'daily':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'weekly':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'monthly':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
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
              placeholder="Search schedules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </motion.button>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="failed">Failed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Owner
                </label>
                <select
                  value={ownerFilter}
                  onChange={(e) => setOwnerFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Owners</option>
                  {getOwnerOptions().map(owner => (
                    <option key={owner} value={owner}>{owner}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <select
                  value={frequencyFilter}
                  onChange={(e) => setFrequencyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Frequencies</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Next Send Date
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>All Dates</option>
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select 
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="nextSend">Next Send</option>
                  <option value="createdBy">Created By</option>
                  <option value="scheduleType">Frequency</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>Schedule ID</span>
                  {getSortIcon('id')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('createdBy')}
              >
                <div className="flex items-center space-x-1">
                  <span>Created By</span>
                  {getSortIcon('createdBy')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Target
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Recipients
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('scheduleType')}
              >
                <div className="flex items-center space-x-1">
                  <span>Frequency</span>
                  {getSortIcon('scheduleType')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('nextExecutionDate')}
              >
                <div className="flex items-center space-x-1">
                  <span>Next Send</span>
                  {getSortIcon('nextExecutionDate')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedSchedules.map((schedule, index) => (
              <motion.tr
                key={schedule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ 
                  backgroundColor: 'rgba(99, 24, 63, 0.05)',
                  transition: { duration: 0.2 }
                }}
                className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                  schedule.status === 'Failed' ? 'bg-red-50 dark:bg-red-900/10' : ''
                }`}
                onClick={() => handleAction('view', schedule)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center mr-4">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {schedule.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <User className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium">{schedule.createdByName}</div>
                      <div className="text-xs text-gray-500">{schedule.createdBy}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    {schedule.targetFolder ? (
                      <>
                        <FolderOpen className="h-4 w-4 mr-2" />
                        <span>{schedule.targetFolder}</span>
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        <span>{schedule.targetFile}</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{schedule.recipients.length} recipient{schedule.recipients.length > 1 ? 's' : ''}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFrequencyColor(schedule.scheduleType)}`}>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{schedule.scheduleType}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    {schedule.nextSend}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                    {getStatusIcon(schedule.status)}
                    <span className="ml-1">{schedule.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAction('view', schedule)
                      }}
                      className="text-primary-500 hover:text-primary-600"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      {sortedSchedules.length === 0 && searchTerm ? (
        <div className="px-6 py-12 text-center">
          <div className="text-gray-500 dark:text-gray-400">No schedules match your search criteria.</div>
        </div>
      ) : sortedSchedules.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No schedules found</h3>
          <p className="text-gray-600 dark:text-gray-400">Users haven't created any schedules yet.</p>
        </div>
      ) : (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {sortedSchedules.length} of {schedules.length} schedule{schedules.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SchedulesTable
