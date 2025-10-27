import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  Shield, 
  UserX, 
  Lock, 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  MapPin,
  Filter,
  Search,
  Flag,
  CheckCircle,
  XCircle
} from 'lucide-react'

const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Mock audit log data
  const auditLogs = [
    {
      id: 1,
      timestamp: '2024-01-15 14:30:25',
      user: 'Mike Johnson',
      action: 'Failed Login Attempt',
      severity: 'high',
      type: 'security',
      details: 'Multiple failed login attempts from IP 192.168.1.100',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      flagged: true
    },
    {
      id: 2,
      timestamp: '2024-01-15 13:45:12',
      user: 'Sarah Wilson',
      action: 'File Deleted',
      severity: 'medium',
      type: 'action',
      details: 'Deleted file: confidential_report.pdf',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      flagged: false
    },
    {
      id: 3,
      timestamp: '2024-01-15 12:20:45',
      user: 'John Doe',
      action: 'Role Changed',
      severity: 'high',
      type: 'permission',
      details: 'User role changed from Editor to Admin',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      flagged: true
    },
    {
      id: 4,
      timestamp: '2024-01-15 11:15:30',
      user: 'Emily Davis',
      action: 'Bulk Export',
      severity: 'low',
      type: 'action',
      details: 'Exported 150 user records to CSV',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      flagged: false
    },
    {
      id: 5,
      timestamp: '2024-01-15 10:30:15',
      user: 'David Brown',
      action: 'Suspicious Activity',
      severity: 'critical',
      type: 'security',
      details: 'Unusual file access pattern detected',
      ipAddress: '192.168.1.104',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      flagged: true
    },
    {
      id: 6,
      timestamp: '2024-01-15 09:45:22',
      user: 'Lisa Garcia',
      action: 'Account Blocked',
      severity: 'high',
      type: 'security',
      details: 'Account blocked due to multiple policy violations',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)',
      flagged: true
    }
  ]

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter
    const matchesType = typeFilter === 'all' || log.type === typeFilter
    return matchesSearch && matchesSeverity && matchesType
  })

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />
      case 'high':
        return <Shield className="h-4 w-4" />
      case 'medium':
        return <Eye className="h-4 w-4" />
      case 'low':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'security':
        return <Shield className="h-4 w-4" />
      case 'permission':
        return <UserX className="h-4 w-4" />
      case 'action':
        return <Edit className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security & Audit Logs
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor security events and user activities
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="security">Security</option>
              <option value="permission">Permission</option>
              <option value="action">Action</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredLogs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
              log.flagged ? 'bg-red-50 dark:bg-red-900/10' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`p-2 rounded-lg border ${getSeverityColor(log.severity)}`}>
                  {getSeverityIcon(log.severity)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {log.action}
                    </h4>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(log.severity)}`}>
                      <span className="capitalize">{log.severity}</span>
                    </div>
                    {log.flagged && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <Flag className="h-4 w-4" />
                        <span className="text-xs font-medium">Flagged</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {log.details}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{log.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <UserX className="h-3 w-3" />
                      <span>{log.user}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{log.ipAddress}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTypeIcon(log.type)}
                      <span className="capitalize">{log.type}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {log.flagged && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 text-red-500 hover:text-red-600"
                    title="Review Flagged Event"
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 text-gray-500 hover:text-gray-600"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredLogs.length} of {auditLogs.length} log entries
          </div>
          <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
            View All Logs →
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuditLogs
