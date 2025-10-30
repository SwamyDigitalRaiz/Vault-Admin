import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
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
  Download,
  MoreVertical
} from 'lucide-react'
import api from '../services/api'

const FilesGrid = ({ onFileSelect, onEditFile, fileType, onFileSelectNav }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const [items, setItems] = useState([])
  const [allCount, setAllCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function load() {
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

  const orderedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const aTime = a.createdAtRaw ? new Date(a.createdAtRaw).getTime() : 0
      const bTime = b.createdAtRaw ? new Date(b.createdAtRaw).getTime() : 0
      return bTime - aTime // latest first
    })
  }, [filteredItems])

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
      return <FolderOpen className="h-6 w-6 text-primary-500" />
    }
    
    switch (item.fileType) {
      case 'image':
        return <Image className="h-6 w-6 text-blue-500" />
      case 'video':
        return <Video className="h-6 w-6 text-red-500" />
      case 'document':
        return <FileText className="h-6 w-6 text-green-500" />
      case 'archive':
        return <Archive className="h-6 w-6 text-orange-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
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
      {/* Header with Search and Filters */}
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
            </div>
          </motion.div>
        )}
      </div>

      {/* Grid */}
      <div className="p-6">
        {loading && (
          <div className="text-sm text-gray-600 dark:text-gray-400">Loading...</div>
        )}
        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orderedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => handleAction('view', item)}
            >
              {/* Item Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  item.type === 'folder' 
                    ? 'bg-primary-500' 
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                  {getItemIcon(item)}
                </div>
                <div className="flex items-center space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAction('view', item)
                    }}
                    className="p-1 text-gray-400 hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              {/* Item Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <User className="h-3 w-3 mr-1" />
                    <span className="truncate">{item.ownerName}</span>
                  </div>
                </div>

                {/* Type Badge */}
                <div>
                  {item.type === 'folder' ? (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                      <FolderOpen className="h-3 w-3 mr-1" />
                      Folder
                    </div>
                  ) : (
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getFileTypeColor(item.fileType)}`}>
                      {getItemIcon(item)}
                      <span className="ml-1 capitalize">{item.fileType}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {item.type === 'folder' ? (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>{item.fileCount} files</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>File</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <HardDrive className="h-4 w-4 mr-1" />
                    <span>{item.size}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.createdAt}
                  </div>
                </div>

                {/* Shared Count */}
                {item.isShared && item.sharedWith.length > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Shared with {item.sharedWith.length} user{item.sharedWith.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No items found
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
            Showing {filteredItems.length} of {allItems.length} items
          </div>
          <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
            View all items →
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilesGrid
