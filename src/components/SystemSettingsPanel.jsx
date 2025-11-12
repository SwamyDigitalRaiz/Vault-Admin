import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Save, 
  FileText, 
  Shield, 
  Eye,
  Edit,
  Check,
  X,
  AlertTriangle,
  Info
} from 'lucide-react'

const SystemSettingsPanel = () => {
  const [activeTab, setActiveTab] = useState('terms')
  const [isEditing, setIsEditing] = useState(false)
  
  const [termsContent, setTermsContent] = useState({
    title: 'Terms and Conditions',
    lastUpdated: '2024-01-15',
    content: `1. ACCEPTANCE OF TERMS
By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement.

2. USE LICENSE
Permission is granted to temporarily download one copy of the materials on this platform for personal, non-commercial transitory viewing only.

3. DISCLAIMER
The materials on this platform are provided on an 'as is' basis. The platform makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.

4. LIMITATIONS
In no event shall the platform or its suppliers be liable for any damages arising out of the use or inability to use the materials on this platform.

5. ACCURACY OF MATERIALS
The materials appearing on this platform could include technical, typographical, or photographic errors.

6. LINKS
The platform has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site.

7. MODIFICATIONS
The platform may revise these terms of service for its website at any time without notice.

8. GOVERNING LAW
These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which the platform operates.`
  })

  const [privacyContent, setPrivacyContent] = useState({
    title: 'Privacy Policy',
    lastUpdated: '2024-01-15',
    content: `1. INFORMATION WE COLLECT
We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.

2. HOW WE USE YOUR INFORMATION
We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.

3. INFORMATION SHARING
We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.

4. DATA SECURITY
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

5. COOKIES AND TRACKING
We use cookies and similar tracking technologies to enhance your experience on our platform and analyze usage patterns.

6. THIRD-PARTY SERVICES
Our platform may contain links to third-party websites or services that are not owned or controlled by us.

7. DATA RETENTION
We retain your personal information for as long as necessary to provide our services and comply with legal obligations.

8. YOUR RIGHTS
You have the right to access, update, or delete your personal information, and to opt out of certain communications from us.

9. CHILDREN'S PRIVACY
Our services are not intended for children under 13 years of age, and we do not knowingly collect personal information from children.

10. CHANGES TO THIS POLICY
We may update this privacy policy from time to time, and we will notify you of any material changes.`
  })

  const handleSave = () => {
    console.log('Saving terms and privacy policy...')
    setIsEditing(false)
    // Here you would typically save to your backend
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original content if needed
  }

  const tabs = [
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield }
  ]

  const currentContent = activeTab === 'terms' ? termsContent : privacyContent
  const setCurrentContent = activeTab === 'terms' ? setTermsContent : setPrivacyContent

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-600">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentContent.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Last updated: {currentContent.lastUpdated}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </motion.button>
              ) : (
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={currentContent.title}
                    onChange={(e) => setCurrentContent(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content
                  </label>
                  <textarea
                    value={currentContent.content}
                    onChange={(e) => setCurrentContent(prev => ({ ...prev, content: e.target.value }))}
                    rows={20}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                    placeholder="Enter the terms and conditions or privacy policy content..."
                  />
                </div>
              </div>
            ) : (
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white font-mono leading-relaxed">
                    {currentContent.content}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-400">
                  Legal Document Management
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  These documents are legally binding and should be reviewed by legal counsel before publishing. 
                  Changes to these documents may require user notification and re-acceptance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Publish Changes
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Make the updated terms and privacy policy live for all users.
          </p>
          <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Publish Now
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Preview
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Preview how the terms and privacy policy will appear to users.
          </p>
          <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Preview
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Notify Users
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Send notifications to users about changes to terms and privacy policy.
          </p>
          <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            Send Notifications
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default SystemSettingsPanel