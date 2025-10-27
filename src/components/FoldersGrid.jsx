import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  FolderOpen,
  User,
  FileText,
  Calendar,
  Clock,
  Share2,
  Lock,
  HardDrive,
  UserCheck,
  MoreVertical
} from 'lucide-react'

const FoldersGrid = ({ onFolderSelect, onEditFolder }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data (same as table)
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
      {/* Header with Search and Filters */}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
          </motion.div>
        )}
      </div>

      {/* Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFolders.map((folder, index) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => handleAction('view', folder)}
            >
              {/* Folder Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                  <FolderOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAction('edit', folder)
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAction('delete', folder)
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              {/* Folder Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 truncate">
                    {folder.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <User className="h-3 w-3 mr-1" />
                    <span className="truncate">{folder.ownerName}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>{folder.fileCount} files</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <HardDrive className="h-4 w-4 mr-1" />
                    <span>{folder.size}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {folder.createdAt}
                  </div>
                </div>

                {/* Shared Count */}
                {folder.isShared && folder.sharedWith.length > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Shared with {folder.sharedWith.length} user{folder.sharedWith.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFolders.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No folders found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredFolders.length} of {folders.length} folders
          </div>
          <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
            View all folders →
          </button>
        </div>
      </div>
    </div>
  )
}

export default FoldersGrid
