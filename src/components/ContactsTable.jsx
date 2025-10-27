import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Eye, 
  ChevronUp, 
  ChevronDown,
  User,
  Mail,
  Phone,
  Calendar,
  UserPlus,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

const ContactsTable = ({ onContactSelect, onEditContact, onRecipientSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [domainFilter, setDomainFilter] = useState('all')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data
  const contacts = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      notes: 'Client contact for project Alpha',
      createdBy: 'Sarah Wilson',
      createdAt: '2024-01-15',
      isValid: true,
      isDuplicate: false
    },
    {
      id: 2,
      name: 'Emily Johnson',
      email: 'emily.johnson@company.com',
      phone: '+1 (555) 234-5678',
      notes: 'Marketing team lead',
      createdBy: 'Mike Johnson',
      createdAt: '2024-01-14',
      isValid: true,
      isDuplicate: false
    },
    {
      id: 3,
      name: 'David Brown',
      email: 'david.brown@invalid-email',
      phone: '+1 (555) 345-6789',
      notes: 'Invalid email format',
      createdBy: 'John Doe',
      createdAt: '2024-01-13',
      isValid: false,
      isDuplicate: false
    },
    {
      id: 4,
      name: 'Lisa Garcia',
      email: 'lisa.garcia@example.com',
      phone: '+1 (555) 456-7890',
      notes: 'Duplicate contact',
      createdBy: 'Emily Davis',
      createdAt: '2024-01-12',
      isValid: true,
      isDuplicate: true
    },
    {
      id: 5,
      name: 'Michael Wilson',
      email: 'michael.wilson@business.com',
      phone: '+1 (555) 567-8901',
      notes: 'Important client contact',
      createdBy: 'David Brown',
      createdAt: '2024-01-11',
      isValid: true,
      isDuplicate: false
    },
    {
      id: 6,
      name: 'Sarah Davis',
      email: 'sarah.davis@startup.io',
      phone: '+1 (555) 678-9012',
      notes: 'Startup founder contact',
      createdBy: 'Lisa Garcia',
      createdAt: '2024-01-10',
      isValid: true,
      isDuplicate: false
    }
  ]

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm)
    const matchesDomain = domainFilter === 'all' || 
                         contact.email.split('@')[1] === domainFilter
    return matchesSearch && matchesDomain
  })

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    
    if (sortField === 'name') {
      aValue = a.name.toLowerCase()
      bValue = b.name.toLowerCase()
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

  const handleAction = (action, contact) => {
    if (action === 'view') {
      if (onRecipientSelect) {
        // Navigate to user details page using the same navigation as Users
        onRecipientSelect(contact)
      } else {
        // Fallback to original contact selection
        onContactSelect(contact)
      }
    }
  }

  const getDomainOptions = () => {
    const domains = [...new Set(contacts.map(contact => contact.email.split('@')[1]))]
    return domains
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
              placeholder="Search recipients..."
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
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Domains</option>
              {getDomainOptions().map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Added Date
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>All Time</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assigned User
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>All Users</option>
                  <option>Sarah Wilson</option>
                  <option>Mike Johnson</option>
                  <option>John Doe</option>
                  <option>Emily Davis</option>
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
                  <option value="name">Name</option>
                  <option value="createdAt">Date Added</option>
                  <option value="createdBy">Created By</option>
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
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Full Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Notes
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
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date Added</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedContacts.map((contact, index) => (
              <motion.tr
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ 
                  backgroundColor: 'rgba(99, 24, 63, 0.05)',
                  transition: { duration: 0.2 }
                }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                onClick={() => handleAction('view', contact)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center mr-4 relative">
                      <User className="h-5 w-5 text-white" />
                      {!contact.isValid && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                      )}
                      {contact.isDuplicate && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                        <span>{contact.name}</span>
                        {!contact.isValid && (
                          <AlertTriangle className="h-4 w-4 text-red-500" title="Invalid email" />
                        )}
                        {contact.isDuplicate && (
                          <AlertTriangle className="h-4 w-4 text-orange-500" title="Duplicate email" />
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className={!contact.isValid ? 'text-red-500' : ''}>{contact.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4 mr-2" />
                    {contact.phone}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                    {contact.notes}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <UserPlus className="h-4 w-4 mr-2" />
                    {contact.createdBy}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    {contact.createdAt}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAction('view', contact)
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
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {sortedContacts.length} of {contacts.length} recipients
          </div>
          <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
            View all recipients →
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContactsTable
