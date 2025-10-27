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
  FolderOpen,
  User,
  FileText,
  Calendar,
  Clock,
  Share2,
  Lock,
  HardDrive,
  UserCheck
} from 'lucide-react'

const FoldersTable = ({ onFolderSelect, onEditFolder }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data
  const folders = [
    {
      id: 1,
      name: 'Project Documents',
      owner: 'john.doe@example.com',
      ownerName: 'John Doe',
      fileCount: 12,
      size: '2.4 MB',
      sizeBytes: 2516582,
      createdAt: '2024-01-15',
      lastModified: '2024-01-15 14:30',
      isShared: true,
      sharedWith: ['sarah@example.com', 'mike@example.com']
    },
    {
      id: 2,
      name: 'Client Resources',
      owner: 'sarah.wilson@example.com',
      ownerName: 'Sarah Wilson',
      fileCount: 8,
      size: '1.8 MB',
      sizeBytes: 1887436,
      createdAt: '2024-01-14',
      lastModified: '2024-01-15 13:45',
      isShared: false,
      sharedWith: []
    },
    {
      id: 3,
      name: 'Meeting Notes',
      owner: 'mike.johnson@example.com',
      ownerName: 'Mike Johnson',
      fileCount: 15,
      size: '3.2 MB',
      sizeBytes: 3355443,
      createdAt: '2024-01-13',
      lastModified: '2024-01-15 12:20',
      isShared: true,
      sharedWith: ['john@example.com']
    },
    {
      id: 4,
      name: 'Personal Files',
      owner: 'emily.davis@example.com',
      ownerName: 'Emily Davis',
      fileCount: 5,
      size: '890 KB',
      sizeBytes: 911872,
      createdAt: '2024-01-12',
      lastModified: '2024-01-14 16:30',
      isShared: false,
      sharedWith: []
    },
    {
      id: 5,
      name: 'Shared Resources',
      owner: 'david.brown@example.com',
      ownerName: 'David Brown',
      fileCount: 22,
      size: '5.7 MB',
      sizeBytes: 5976883,
      createdAt: '2024-01-11',
      lastModified: '2024-01-15 10:15',
      isShared: true,
      sharedWith: ['sarah@example.com', 'mike@example.com', 'emily@example.com']
    },
    {
      id: 6,
      name: 'Archive',
      owner: 'lisa.garcia@example.com',
      ownerName: 'Lisa Garcia',
      fileCount: 3,
      size: '456 KB',
      sizeBytes: 466944,
      createdAt: '2024-01-10',
      lastModified: '2024-01-13 09:45',
      isShared: false,
      sharedWith: []
    }
  ]

  const filteredFolders = folders.filter(folder => {
    const matchesSearch = folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         folder.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         folder.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOwner = ownerFilter === 'all' || folder.owner === ownerFilter
    return matchesSearch && matchesOwner
  })

  const sortedFolders = [...filteredFolders].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    
    if (sortField === 'name') {
      aValue = a.name.toLowerCase()
      bValue = b.name.toLowerCase()
    } else if (sortField === 'sizeBytes') {
      aValue = a.sizeBytes
      bValue = b.sizeBytes
    } else if (sortField === 'fileCount') {
      aValue = a.fileCount
      bValue = b.fileCount
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

  const handleAction = (action, folder) => {
    if (action === 'view') {
      onFolderSelect(folder)
    } else if (action === 'edit') {
      onEditFolder(folder)
    } else {
      console.log(`${action} folder:`, folder.name)
    }
  }

  const getOwnerOptions = () => {
    const owners = [...new Set(folders.map(folder => folder.owner))]
    return owners
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
              placeholder="Search folders..."
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
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Owners</option>
              {getOwnerOptions().map(owner => (
                <option key={owner} value={owner}>{owner}</option>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Creation Date
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
                  Number of Files
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Any</option>
                  <option>1-5</option>
                  <option>6-15</option>
                  <option>16-25</option>
                  <option>25+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Folder Size
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Any Size</option>
                  <option>Small (&lt; 1MB)</option>
                  <option>Medium (1-5MB)</option>
                  <option>Large (&gt; 5MB)</option>
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
                  <option value="createdAt">Creation Date</option>
                  <option value="fileCount">File Count</option>
                  <option value="sizeBytes">Size</option>
                  <option value="lastModified">Last Modified</option>
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
                  <span>Folder Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Owner
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('fileCount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Files</span>
                  {getSortIcon('fileCount')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('sizeBytes')}
              >
                <div className="flex items-center space-x-1">
                  <span>Size</span>
                  {getSortIcon('sizeBytes')}
                </div>
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
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('lastModified')}
              >
                <div className="flex items-center space-x-1">
                  <span>Last Modified</span>
                  {getSortIcon('lastModified')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedFolders.map((folder, index) => (
              <motion.tr
                key={folder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ 
                  backgroundColor: 'rgba(99, 24, 63, 0.05)',
                  transition: { duration: 0.2 }
                }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                onClick={() => handleAction('view', folder)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center mr-4">
                      <FolderOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {folder.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <User className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium">{folder.ownerName}</div>
                      <div className="text-xs text-gray-500">{folder.owner}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FileText className="h-4 w-4 mr-2" />
                    {folder.fileCount}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <HardDrive className="h-4 w-4 mr-2" />
                    {folder.size}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    {folder.createdAt}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    {folder.lastModified}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    folder.isShared 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {folder.isShared ? (
                      <Share2 className="h-3 w-3 mr-1" />
                    ) : (
                      <Lock className="h-3 w-3 mr-1" />
                    )}
                    <span>{folder.isShared ? 'Shared' : 'Private'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAction('view', folder)
                      }}
                      className="text-primary-500 hover:text-primary-600"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAction('edit', folder)
                      }}
                      className="text-blue-500 hover:text-blue-600"
                      title="Edit Folder"
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAction('changeOwner', folder)
                      }}
                      className="text-orange-500 hover:text-orange-600"
                      title="Change Owner"
                    >
                      <UserCheck className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAction('delete', folder)
                      }}
                      className="text-red-500 hover:text-red-600"
                      title="Delete Folder"
                    >
                      <Trash2 className="h-4 w-4" />
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
            Showing {sortedFolders.length} of {folders.length} folders
          </div>
          <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
            View all folders →
          </button>
        </div>
      </div>
    </div>
  )
}

export default FoldersTable
