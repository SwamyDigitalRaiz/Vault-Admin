import React, { useEffect, useMemo, useState } from 'react'
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
import api from '../services/api'

const FilesTable = ({ onFileSelect, onEditFile, fileType, onFileSelectNav }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [sortField, setSortField] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState('desc')
  const [showFilters, setShowFilters] = useState(false)

  const [items, setItems] = useState([])
  const [allCount, setAllCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [foldersRes, filesRes] = await Promise.all([
        api.getAdminFolders(),
        api.getAdminFiles(),
      ])

      const folders = (
        foldersRes?.data?.folders ??
        foldersRes?.folders ??
        (Array.isArray(foldersRes) ? foldersRes : [])
      )
      const files = (
        filesRes?.data?.files ??
        filesRes?.files ??
        (Array.isArray(filesRes) ? filesRes : [])
      )

      return { folders, files }
    } catch (err) {
      console.error('Error loading folders/files:', err)
      setError(err.message || 'Failed to load data')
      throw err
    } finally {
      setLoading(false)
      setLastRefresh(new Date())
    }
  }

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        const { folders, files } = await loadData()

        const mappedFolders = folders.map((f) => ({
          id: f.id || f._id,
          name: f.name,
          type: 'folder',
          owner: f.owner?.email || f.ownerEmail || 'unknown',
          ownerName: f.owner?.name || f.ownerName || '—',
          fileCount: f.itemCount ?? f.childrenCount ?? 0,
          size: f.totalSize != null ? `${Math.max(1, Math.round((f.totalSize / (1024*1024)) * 10) / 10)} MB` : '—',
          sizeBytes: f.totalSize ?? 0,
          createdAtRaw: f.createdAt ? new Date(f.createdAt).toISOString() : null,
          lastModifiedRaw: (f.updatedAt || f.createdAt) ? new Date(f.updatedAt || f.createdAt).toISOString() : null,
          createdAt: f.createdAt ? new Date(f.createdAt).toLocaleString() : '—',
          lastModified: (f.updatedAt || f.createdAt) ? new Date(f.updatedAt || f.createdAt).toLocaleString() : '—',
          isShared: !!f.isShared,
          sharedWith: Array.isArray(f.sharedWith) ? f.sharedWith : [],
        }))

        const mappedFiles = files.map((fi) => ({
          id: fi.id || fi._id,
          name: fi.name || fi.originalName,
          type: 'file',
          fileType: (fi.mimeType || '').includes('image') ? 'image' : (fi.mimeType || '').includes('video') ? 'video' : (fi.extension ? 'document' : 'file'),
          owner: fi.owner?.email || fi.ownerEmail || 'unknown',
          ownerName: fi.owner?.name || fi.ownerName || '—',
          size: fi.size != null ? (fi.size > 1024*1024 ? `${(fi.size/(1024*1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(fi.size/1024))} KB`) : '—',
          sizeBytes: fi.size ?? 0,
          createdAtRaw: fi.createdAt ? new Date(fi.createdAt).toISOString() : null,
          lastModifiedRaw: (fi.updatedAt || fi.createdAt) ? new Date(fi.updatedAt || fi.createdAt).toISOString() : null,
          createdAt: fi.createdAt ? new Date(fi.createdAt).toLocaleString() : '—',
          lastModified: (fi.updatedAt || fi.createdAt) ? new Date(fi.updatedAt || fi.createdAt).toLocaleString() : '—',
          isShared: !!fi.isShared,
          sharedWith: Array.isArray(fi.sharedWith) ? fi.sharedWith : [],
        }))

        if (isMounted) {
          setItems([...mappedFolders, ...mappedFiles])
          setAllCount(mappedFolders.length + mappedFiles.length)
        }
      } catch (e) {
        if (isMounted) setError(e?.message || 'Failed to load files')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => { isMounted = false }
  }, [])

  // Filter items based on fileType prop
  const filteredByType = useMemo(() => items.filter(item => {
    if (fileType === 'all') return true
    if (fileType === 'folders') return item.type === 'folder'
    if (fileType === 'files') return item.type === 'file'
    return true
  }), [items, fileType])

  const filteredItems = filteredByType.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOwner = ownerFilter === 'all' || item.owner === ownerFilter
    return matchesSearch && matchesOwner
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    // Handle date fields explicitly
    if (sortField === 'createdAt') {
      const aTime = a.createdAtRaw ? new Date(a.createdAtRaw).getTime() : 0
      const bTime = b.createdAtRaw ? new Date(b.createdAtRaw).getTime() : 0
      return sortDirection === 'asc' ? aTime - bTime : bTime - aTime
    }
    if (sortField === 'lastModified') {
      const aTime = a.lastModifiedRaw ? new Date(a.lastModifiedRaw).getTime() : 0
      const bTime = b.lastModifiedRaw ? new Date(b.lastModifiedRaw).getTime() : 0
      return sortDirection === 'asc' ? aTime - bTime : bTime - aTime
    }

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
    const owners = [...new Set(items.map(item => item.owner))]
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
        {loading && (
          <div className="p-6 text-sm text-gray-600 dark:text-gray-400">Loading...</div>
        )}
        {error && (
          <div className="p-6 text-sm text-red-600">{error}</div>
        )}
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
            Showing {sortedItems.length} of {allCount} items
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
