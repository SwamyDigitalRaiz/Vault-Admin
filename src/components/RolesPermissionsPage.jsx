import React from 'react'
import { motion } from 'framer-motion'
import RolesPermissionsTable from './RolesPermissionsTable'

const RolesPermissionsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RolesPermissionsTable />
      </div>
    </motion.div>
  )
}

export default RolesPermissionsPage

