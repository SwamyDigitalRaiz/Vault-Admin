import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SchedulesTable from './SchedulesTable'
import ScheduleModal from './ScheduleModal'
import ScheduleDetailPanel from './ScheduleDetailPanel'
import apiService from '../services/api'

const SchedulesPage = ({ onScheduleSelect }) => {
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchSchedules()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('📡 [SchedulesPage] Fetching schedules...')
      const response = await apiService.getSchedules({ page: 1, limit: 20 }) // Reduced initial load to 20 for faster performance
      console.log('📡 [SchedulesPage] Response:', response)
      if (response.success) {
        setSchedules(response.data.schedules || [])
        console.log(`✅ [SchedulesPage] Loaded ${response.data.schedules?.length || 0} schedules`)
      } else {
        const errorMsg = response.message || 'Failed to fetch schedules'
        console.error('❌ [SchedulesPage] API Error:', errorMsg)
        setError(errorMsg)
      }
    } catch (err) {
      console.error('❌ [SchedulesPage] Error fetching schedules:', err)
      console.error('❌ [SchedulesPage] Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      })
      setError(err.message || 'Failed to fetch schedules. Please check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule)
    setIsDetailPanelOpen(true)
  }

  const handleCloseDetailPanel = () => {
    setIsDetailPanelOpen(false)
    setSelectedSchedule(null)
  }

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingSchedule(null)
  }

  const handleSaveSchedule = async (scheduleData) => {
    try {
      // Refresh schedules after save
      setRefreshKey(prev => prev + 1)
      setIsModalOpen(false)
      setEditingSchedule(null)
    } catch (err) {
      console.error('Error saving schedule:', err)
    }
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
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
                  Schedule Management
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Manage automated file sharing schedules and email deliveries
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


          {/* Schedules Table */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-gray-500 dark:text-gray-400">Loading schedules...</div>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="text-red-800 dark:text-red-200">{error}</div>
                <button
                  onClick={handleRefresh}
                  className="mt-2 text-red-600 dark:text-red-400 hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              <SchedulesTable 
                schedules={schedules}
                onScheduleSelect={handleScheduleSelect}
                onEditSchedule={handleEditSchedule}
                onScheduleSelectNav={onScheduleSelect}
                onRefresh={handleRefresh}
              />
            )}
          </motion.div>
        </div>

        {/* Schedule Detail Panel */}
        <AnimatePresence>
          {isDetailPanelOpen && selectedSchedule && (
            <ScheduleDetailPanel
              schedule={selectedSchedule}
              onClose={handleCloseDetailPanel}
              onEdit={handleEditSchedule}
            />
          )}
        </AnimatePresence>

        {/* Add/Edit Schedule Modal */}
        <ScheduleModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          schedule={editingSchedule}
          onSave={handleSaveSchedule}
        />
      </main>
    </motion.div>
  )
}

export default SchedulesPage
