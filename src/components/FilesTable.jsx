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
  FileText,
  Image,
  Video,
  Archive,
  File,
  User,
  Calendar,
  Clock,
  Share2,
  Lock,
  HardDrive,
  UserCheck,
  Download
} from 'lucide-react'

const FilesTable = ({ onFileSelect, onEditFile, fileType, onFileSelectNav }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data combining folders and files
  const allItems = [
    // Folders
    {
      id: 1,
      name: 'Project Documents',
      type: 'folder',
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
      type: 'folder',
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
      type: 'folder',
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
    // Files
    {
      id: 4,
      name: 'project_proposal.pdf',
      type: 'file',
      fileType: 'document',
      owner: 'john.doe@example.com',
      ownerName: 'John Doe',
      size: '2.1 MB',
      sizeBytes: 2202009,
      createdAt: '2024-01-15',
      lastModified: '2024-01-15 14:30',
      isShared: false,
      sharedWith: []
    },
    {
      id: 5,
      name: 'team_photo.jpg',
      type: 'file',
      fileType: 'image',
      owner: 'sarah.wilson@example.com',
      ownerName: 'Sarah Wilson',
      size: '890 KB',
      sizeBytes: 911872,
      createdAt: '2024-01-14',
      lastModified: '2024-01-15 13:45',
      isShared: true,
      sharedWith: ['mike@example.com']
    },
    {
      id: 6,
      name: 'demo_video.mp4',
      type: 'file',
      fileType: 'video',
      owner: 'mike.johnson@example.com',
      ownerName: 'Mike Johnson',
      size: '15.2 MB',
      sizeBytes: 15938355,
      createdAt: '2024-01-13',
      lastModified: '2024-01-15 12:20',
      isShared: false,
      sharedWith: []
    },
    {
      id: 7,
      name: 'presentation.pptx',
      type: 'file',
      fileType: 'document',
      owner: 'emily.davis@example.com',
      ownerName: 'Emily Davis',
      size: '1.8 MB',
      sizeBytes: 1887436,
      createdAt: '2024-01-12',
      lastModified: '2024-01-14 16:30',
      isShared: true,
      sharedWith: ['john@example.com', 'sarah@example.com']
    },
    {
      id: 8,
      name: 'archive.zip',
      type: 'file',
      fileType: 'archive',
      owner: 'david.brown@example.com',
      ownerName: 'David Brown',
      size: '5.7 MB',
      sizeBytes: 5976883,
      createdAt: '2024-01-11',
      lastModified: '2024-01-15 10:15',
      isShared: false,
      sharedWith: []
    }
  ]

  // Filter items based on fileType prop
  const filteredByType = allItems.filter(item => {
    if (fileType === 'all') return true
    if (fileType === 'folders') return item.type === 'folder'
    if (fileType === 'files') return item.type === 'file'
    return true
  })

  const filteredItems = filteredByType.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOwner = ownerFilter === 'all' || item.owner === ownerFilter
    return matchesSearch && matchesOwner
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    
    if (sortField === 'name') {
      aValue = a.name.toLowerCase()
      bValue = b.name.toLowerCase()
    } else if (sortField === 'sizeBytes') {
      aValue = a.sizeBytes
      bValue = b.sizeBytes
    } else if (sortField === 'fileCount') {
      aValue = a.fileCount || 0
      bValue = b.fileCount || 0
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

  const handleAction = (action, item) => {
    if (action === 'view') {
      if (onFileSelectNav) {
        // Navigate to user details page using the same navigation as Users
        onFileSelectNav(item)
      } else {
        // Fallback to original file selection
        onFileSelect(item)
      }
    }
  }

  const getOwnerOptions = () => {
    const owners = [...new Set(allItems.map(item => item.owner))]
    return owners
  }

  const getItemIcon = (item) => {
    if (item.type === 'folder') {
      return <FolderOpen className="h-5 w-5 text-primary-500" />
    }
    
    switch (item.fileType) {
      case 'image':
        return <Image className="h-5 w-5 text-blue-500" />
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />
      case 'document':
        return <FileText className="h-5 w-5 text-green-500" />
      case 'archive':
        return <Archive className="h-5 w-5 text-orange-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const getFileTypeColor = (fileType) => {
    switch (fileType) {
      case 'image':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'video':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'document':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'archive':
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
              placeholder="Search files and folders..."
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
                  File Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>All Types</option>
                  <option>Documents</option>
                  <option>Images</option>
                  <option>Videos</option>
                  <option>Archives</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Size
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
                  <span>Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
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
            {sortedItems.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ 
                  backgroundColor: 'rgba(99, 24, 63, 0.05)',
                  transition: { duration: 0.2 }
                }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                onClick={() => handleAction('view', item)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                      {getItemIcon(item)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.type === 'folder' ? (
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                      <FolderOpen className="h-3 w-3 mr-1" />
                      Folder
                    </div>
                  ) : (
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFileTypeColor(item.fileType)}`}>
                      {getItemIcon(item)}
                      <span className="ml-1 capitalize">{item.fileType}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <User className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium">{item.ownerName}</div>
                      <div className="text-xs text-gray-500">{item.owner}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FileText className="h-4 w-4 mr-2" />
                    {item.fileCount || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <HardDrive className="h-4 w-4 mr-2" />
                    {item.size}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    {item.createdAt}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    {item.lastModified}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.isShared 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {item.isShared ? (
                      <Share2 className="h-3 w-3 mr-1" />
                    ) : (
                      <Lock className="h-3 w-3 mr-1" />
                    )}
                    <span>{item.isShared ? 'Shared' : 'Private'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAction('view', item)
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
            Showing {sortedItems.length} of {allItems.length} items
          </div>
          <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
            View all items →
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilesTable
