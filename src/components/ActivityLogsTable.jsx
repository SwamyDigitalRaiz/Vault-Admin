import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Eye, 
  ChevronUp, 
  ChevronDown,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  FolderOpen,
  Mail,
  Settings,
  Lock,
  Unlock,
  X
} from 'lucide-react'

const ActivityLogsTable = ({ dateRange, logType }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('timestamp')
  const [sortDirection, setSortDirection] = useState('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedLog, setSelectedLog] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Mock data
  const activityLogs = [
    {
      id: 1,
      timestamp: '2024-01-15 14:30:25',
      user: 'john.doe@example.com',
      userType: 'user',
      action: 'File Upload',
      target: 'project_proposal.pdf',
      targetType: 'file',
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Document uploaded successfully to Project Documents folder',
      severity: 'info'
    },
    {
      id: 2,
      timestamp: '2024-01-15 14:25:10',
      user: 'admin@vault.com',
      userType: 'admin',
      action: 'User Blocked',
      target: 'suspicious_user@example.com',
      targetType: 'user',
      status: 'warning',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      details: 'User blocked due to multiple failed login attempts',
      severity: 'warning'
    },
    {
      id: 3,
      timestamp: '2024-01-15 14:20:45',
      user: 'sarah.wilson@example.com',
      userType: 'user',
      action: 'Schedule Created',
      target: 'Weekly Report Schedule',
      targetType: 'schedule',
      status: 'success',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)',
      details: 'Weekly schedule created for team updates',
      severity: 'info'
    },
    {
      id: 4,
      timestamp: '2024-01-15 14:15:30',
      user: 'system',
      userType: 'system',
      action: 'Schedule Failed',
      target: 'client_report.xlsx',
      targetType: 'file',
      status: 'error',
      ipAddress: '127.0.0.1',
      userAgent: 'Vault-Scheduler/1.0',
      details: 'Email server timeout - retry scheduled for next hour',
      severity: 'error'
    },
    {
      id: 5,
      timestamp: '2024-01-15 14:10:15',
      user: 'mike.johnson@example.com',
      userType: 'user',
      action: 'Folder Shared',
      target: 'Client Resources',
      targetType: 'folder',
      status: 'success',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Folder shared with 3 external recipients',
      severity: 'info'
    },
    {
      id: 6,
      timestamp: '2024-01-15 14:05:00',
      user: 'admin@vault.com',
      userType: 'admin',
      action: 'System Backup',
      target: 'Full System Backup',
      targetType: 'system',
      status: 'success',
      ipAddress: '192.168.1.1',
      userAgent: 'Vault-Backup/2.1',
      details: 'Daily backup completed successfully - 2.3GB compressed',
      severity: 'info'
    },
    {
      id: 7,
      timestamp: '2024-01-15 14:00:30',
      user: 'unknown',
      userType: 'unknown',
      action: 'Failed Login',
      target: 'admin@vault.com',
      targetType: 'user',
      status: 'error',
      ipAddress: '203.0.113.42',
      userAgent: 'curl/7.68.0',
      details: 'Multiple failed login attempts detected from suspicious IP',
      severity: 'critical'
    },
    {
      id: 8,
      timestamp: '2024-01-15 13:55:20',
      user: 'emily.davis@example.com',
      userType: 'user',
      action: 'Password Changed',
      target: 'emily.davis@example.com',
      targetType: 'user',
      status: 'success',
      ipAddress: '192.168.1.115',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      details: 'Password successfully updated',
      severity: 'info'
    }
  ]

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ipAddress.includes(searchTerm)
    
    const matchesType = logType === 'all' || 
                       (logType === 'user' && log.userType === 'user') ||
                       (logType === 'admin' && log.userType === 'admin') ||
                       (logType === 'system' && log.userType === 'system') ||
                       (logType === 'security' && (log.severity === 'critical' || log.severity === 'warning'))
    
    return matchesSearch && matchesType
  })

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    
    if (sortField === 'timestamp') {
      aValue = new Date(a.timestamp)
      bValue = new Date(b.timestamp)
    } else if (sortField === 'user') {
      aValue = a.user.toLowerCase()
      bValue = b.user.toLowerCase()
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

  const handleViewDetails = (log) => {
    setSelectedLog(log)
    setIsDetailOpen(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-3 w-3" />
      case 'error':
        return <XCircle className="h-3 w-3" />
      case 'warning':
        return <AlertTriangle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500'
      case 'error':
        return 'bg-orange-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'info':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case 'admin':
        return <Shield className="h-4 w-4 text-purple-500" />
      case 'user':
        return <User className="h-4 w-4 text-blue-500" />
      case 'system':
        return <Settings className="h-4 w-4 text-gray-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getTargetIcon = (targetType) => {
    switch (targetType) {
      case 'file':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'folder':
        return <FolderOpen className="h-4 w-4 text-primary-500" />
      case 'user':
        return <User className="h-4 w-4 text-green-500" />
      case 'schedule':
        return <Clock className="h-4 w-4 text-purple-500" />
      case 'system':
        return <Settings className="h-4 w-4 text-gray-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Table Header with Search and Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activity logs..."
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
                    Severity
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>All Severities</option>
                    <option>Critical</option>
                    <option>Error</option>
                    <option>Warning</option>
                    <option>Info</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Action Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>All Actions</option>
                    <option>File Upload</option>
                    <option>User Blocked</option>
                    <option>Schedule Created</option>
                    <option>Failed Login</option>
                    <option>Password Changed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>All Status</option>
                    <option>Success</option>
                    <option>Error</option>
                    <option>Warning</option>
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
                    <option value="timestamp">Timestamp</option>
                    <option value="user">User</option>
                    <option value="action">Action</option>
                    <option value="severity">Severity</option>
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
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Timestamp</span>
                    {getSortIcon('timestamp')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('user')}
                >
                  <div className="flex items-center space-x-1">
                    <span>User</span>
                    {getSortIcon('user')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ 
                    backgroundColor: 'rgba(99, 24, 63, 0.05)',
                    transition: { duration: 0.2 }
                  }}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    log.severity === 'critical' || log.severity === 'error'
                      ? 'bg-red-50 dark:bg-red-900/10' 
                      : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      {getUserTypeIcon(log.userType)}
                      <span className="ml-2">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      {getTargetIcon(log.targetType)}
                      <span className="ml-2">{log.target}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {getStatusIcon(log.status)}
                      <span className="ml-1 capitalize">{log.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(log.severity)} mr-2`}></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {log.severity}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleViewDetails(log)}
                      className="text-primary-500 hover:text-primary-600"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {sortedLogs.length} of {activityLogs.length} logs
            </div>
            <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
              View all logs →
            </button>
          </div>
        </div>
      </div>

      {/* Log Detail Modal */}
      {isDetailOpen && selectedLog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsDetailOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Activity Log Details
                </h3>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Timestamp
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedLog.timestamp}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      User
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedLog.user}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Action
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedLog.action}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedLog.target}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Details
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedLog.details}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      IP Address
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedLog.ipAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      User Agent
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white truncate">{selectedLog.userAgent}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default ActivityLogsTable
