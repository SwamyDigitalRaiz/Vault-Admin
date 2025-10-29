import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FolderIcon, 
  DocumentIcon, 
  PlusIcon, 
  ChevronRightIcon, 
  ChevronDownIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  PencilIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

const FolderFileManager = ({ onToggleView }) => {
  // State management
  const [currentPath, setCurrentPath] = useState('/')
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name') // 'name', 'date', 'size'
  const [sortOrder, setSortOrder] = useState('asc') // 'asc' or 'desc'
  const [selectedItems, setSelectedItems] = useState([])
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [showUploadFile, setShowUploadFile] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)

  // Mock data for demonstration
  const mockFolders = [
    {
      id: '1',
      name: 'Documents',
      path: '/Documents',
      parentId: null,
      itemCount: 12,
      totalSize: 2048576,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:22:00Z'
    },
    {
      id: '2',
      name: 'Photos',
      path: '/Photos',
      parentId: null,
      itemCount: 45,
      totalSize: 15728640,
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-22T16:45:00Z'
    },
    {
      id: '3',
      name: 'Work Projects',
      path: '/Work Projects',
      parentId: null,
      itemCount: 8,
      totalSize: 5242880,
      createdAt: '2024-01-05T08:00:00Z',
      updatedAt: '2024-01-21T11:30:00Z'
    },
    {
      id: '4',
      name: 'Q1 Reports',
      path: '/Work Projects/Q1 Reports',
      parentId: '3',
      itemCount: 5,
      totalSize: 1048576,
      createdAt: '2024-01-12T13:20:00Z',
      updatedAt: '2024-01-18T09:15:00Z'
    }
  ]

  const mockFiles = [
    {
      id: '1',
      name: 'Project Proposal.pdf',
      path: '/Documents/Project Proposal.pdf',
      folderId: '1',
      size: 2048576,
      mimeType: 'application/pdf',
      category: 'document',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:22:00Z'
    },
    {
      id: '2',
      name: 'Meeting Notes.docx',
      path: '/Documents/Meeting Notes.docx',
      folderId: '1',
      size: 1024000,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      category: 'document',
      createdAt: '2024-01-16T14:15:00Z',
      updatedAt: '2024-01-19T16:30:00Z'
    },
    {
      id: '3',
      name: 'vacation-photo.jpg',
      path: '/Photos/vacation-photo.jpg',
      folderId: '2',
      size: 3145728,
      mimeType: 'image/jpeg',
      category: 'image',
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-10T09:15:00Z'
    }
  ]

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Filter folders and files based on current path
      const currentFolderId = currentPath === '/' ? null : 
        folders.find(f => f.path === currentPath)?.id
      
      const filteredFolders = mockFolders.filter(f => f.parentId === currentFolderId)
      const filteredFiles = mockFiles.filter(f => f.folderId === currentFolderId)
      
      setFolders(filteredFolders)
      setFiles(filteredFiles)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPath])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Get file icon based on category
  const getFileIcon = (category, mimeType) => {
    switch (category) {
      case 'image':
        return '🖼️'
      case 'document':
        return '📄'
      case 'video':
        return '🎥'
      case 'audio':
        return '🎵'
      case 'archive':
        return '📦'
      default:
        return '📄'
    }
  }

  // Handle folder click
  const handleFolderClick = (folder) => {
    setCurrentPath(folder.path)
    setSelectedItems([])
  }

  // Handle file click
  const handleFileClick = (file) => {
    console.log('File clicked:', file)
  }

  // Handle back navigation
  const handleBack = () => {
    if (currentPath !== '/') {
      const pathParts = currentPath.split('/')
      pathParts.pop()
      const newPath = pathParts.join('/') || '/'
      setCurrentPath(newPath)
      setSelectedItems([])
    }
  }

  // Handle context menu
  const handleContextMenu = (e, item) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item: item
    })
  }

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu(null)
  }

  // Handle item selection
  const handleItemSelect = (item, isSelected) => {
    if (isSelected) {
      setSelectedItems(prev => [...prev, item])
    } else {
      setSelectedItems(prev => prev.filter(i => i.id !== item.id))
    }
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === folders.length + files.length) {
      setSelectedItems([])
    } else {
      setSelectedItems([...folders, ...files])
    }
  }

  // Breadcrumb component
  const Breadcrumb = () => {
    const pathParts = currentPath.split('/').filter(part => part)
    const breadcrumbItems = pathParts.map((part, index) => {
      const path = '/' + pathParts.slice(0, index + 1).join('/')
      return { name: part, path }
    })

    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <button
          onClick={() => setCurrentPath('/')}
          className="hover:text-gray-700 dark:hover:text-gray-300"
        >
          Root
        </button>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRightIcon className="w-4 h-4" />
            <button
              onClick={() => setCurrentPath(item.path)}
              className="hover:text-gray-700 dark:hover:text-gray-300"
            >
              {item.name}
            </button>
          </React.Fragment>
        ))}
      </nav>
    )
  }

  // Folder item component
  const FolderItem = ({ folder, isSelected }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onClick={() => handleFolderClick(folder)}
      onContextMenu={(e) => handleContextMenu(e, folder)}
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => handleItemSelect(folder, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 text-blue-600 rounded"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <FolderIcon className="w-6 h-6 text-blue-500" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {folder.name}
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {folder.itemCount} items • {formatFileSize(folder.totalSize)}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleContextMenu(e, folder)
          }}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <EllipsisVerticalIcon className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </motion.div>
  )

  // File item component
  const FileItem = ({ file, isSelected }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onClick={() => handleFileClick(file)}
      onContextMenu={(e) => handleContextMenu(e, file)}
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => handleItemSelect(file, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 text-blue-600 rounded"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getFileIcon(file.category, file.mimeType)}</span>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {file.name}
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatFileSize(file.size)} • {file.category}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleContextMenu(e, file)
          }}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <EllipsisVerticalIcon className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </motion.div>
  )

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              File Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your files and folders
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateFolder(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>New Folder</span>
            </button>
            <button
              onClick={() => setShowUploadFile(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <ArrowUpTrayIcon className="w-4 h-4" />
              <span>Upload File</span>
            </button>
            {onToggleView && (
              <button
                onClick={onToggleView}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <FunnelIcon className="w-4 h-4" />
                <span>Classic View</span>
              </button>
            )}
          </div>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
            >
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="size">Size</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowPathIcon className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FunnelIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Select All */}
        {folders.length > 0 || files.length > 0 ? (
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedItems.length === folders.length + files.length}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Select all ({folders.length + files.length} items)
              </span>
            </label>
          </div>
        ) : null}

        {/* Back Button */}
        {currentPath !== '/' && (
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center space-x-2"
          >
            <ChevronRightIcon className="w-4 h-4 rotate-180" />
            <span>Back</span>
          </button>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Folders */}
            {folders.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Folders
                </h2>
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {folders.map(folder => (
                    <FolderItem
                      key={folder.id}
                      folder={folder}
                      isSelected={selectedItems.some(item => item.id === folder.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Files */}
            {files.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Files
                </h2>
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {files.map(file => (
                    <FileItem
                      key={file.id}
                      file={file}
                      isSelected={selectedItems.some(item => item.id === file.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {folders.length === 0 && files.length === 0 && (
              <div className="text-center py-12">
                <FolderIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No files or folders
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  This folder is empty. Create a folder or upload a file to get started.
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setShowCreateFolder(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Folder
                  </button>
                  <button
                    onClick={() => setShowUploadFile(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Upload File
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50"
            style={{
              left: contextMenu.x,
              top: contextMenu.y
            }}
            onClick={closeContextMenu}
          >
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
              <PencilIcon className="w-4 h-4" />
              <span>Rename</span>
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
              <ArrowPathIcon className="w-4 h-4" />
              <span>Move</span>
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2">
              <TrashIcon className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Folder
            </h3>
            <input
              type="text"
              placeholder="Folder name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateFolder(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateFolder(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {showUploadFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upload File
            </h3>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <ArrowUpTrayIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop files here, or click to select
              </p>
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Select Files
              </label>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowUploadFile(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUploadFile(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FolderFileManager
