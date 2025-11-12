import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FilesTable from './FilesTable'
import FilesGrid from './FilesGrid'
import FileModal from './FileModal'
import FileDetailPanel from './FileDetailPanel'

const FilesPage = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFile, setEditingFile] = useState(null)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'
  const [fileType, setFileType] = useState('all') // 'all', 'folders', 'files'
  // Classic view only (new file manager removed)

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setIsDetailPanelOpen(true)
  }

  const handleCloseDetailPanel = () => {
    setIsDetailPanelOpen(false)
    setSelectedFile(null)
  }

  const handleAddFile = () => {
    setEditingFile(null)
    setIsModalOpen(true)
  }

  const handleEditFile = (file) => {
    setEditingFile(file)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingFile(null)
  }

  const handleSaveFile = (fileData) => {
    console.log('File saved:', fileData)
    setIsModalOpen(false)
    setEditingFile(null)
  }


  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* Top Bar */}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-3 sm:p-6">
            {/* Page Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 sm:mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Files Management
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Manage folders, files, and sharing permissions
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Export CSV</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

          {/* View Controls */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* File Type Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</span>
                  <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFileType('all')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        fileType === 'all'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      All
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFileType('folders')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        fileType === 'folders'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Folders
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFileType('files')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        fileType === 'files'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Files
                    </motion.button>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
                  <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setViewMode('table')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'table'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Table
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Grid
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Files Table/Grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {viewMode === 'table' ? (
              <FilesTable 
                onFileSelect={handleFileSelect}
                onEditFile={handleEditFile}
                fileType={fileType}
                onFileSelectNav={onFileSelect}
              />
            ) : (
              <FilesGrid 
                onFileSelect={handleFileSelect}
                onEditFile={handleEditFile}
                fileType={fileType}
                onFileSelectNav={onFileSelect}
              />
            )}
          </motion.div>
        </div>

        {/* File Detail Panel */}
        <AnimatePresence>
          {isDetailPanelOpen && selectedFile && (
            <FileDetailPanel
              file={selectedFile}
              onClose={handleCloseDetailPanel}
              onEdit={handleEditFile}
            />
          )}
        </AnimatePresence>

        {/* Add/Edit File Modal */}
        <FileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          file={editingFile}
          onSave={handleSaveFile}
        />
      </main>
    </motion.div>
  )
}

export default FilesPage
