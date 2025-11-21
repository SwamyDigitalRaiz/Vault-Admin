import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Save, 
  FileText, 
  Shield, 
  Edit,
  Check,
  X,
  AlertTriangle,
  Info,
  Loader2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock
} from 'lucide-react'
import apiService from '../services/api'

const SystemSettingsPanel = () => {
  const [activeTab, setActiveTab] = useState('terms')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  
  const [termsContent, setTermsContent] = useState({
    title: 'Terms of Service',
    lastUpdated: '',
    content: ''
  })

  const [privacyContent, setPrivacyContent] = useState({
    title: 'Privacy Policy',
    lastUpdated: '',
    content: ''
  })

  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    website: '',
    address: '',
    businessHours: ''
  })

  const [originalTermsContent, setOriginalTermsContent] = useState(null)
  const [originalPrivacyContent, setOriginalPrivacyContent] = useState(null)
  const [originalContactInfo, setOriginalContactInfo] = useState(null)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [termsResponse, privacyResponse, contactResponse] = await Promise.all([
        apiService.getTermsOfService(),
        apiService.getPrivacyPolicy(),
        apiService.getContactInfo()
      ])

      if (termsResponse.success && termsResponse.data) {
        const termsData = {
          title: termsResponse.data.title || 'Terms of Service',
          lastUpdated: termsResponse.data.lastUpdated 
            ? new Date(termsResponse.data.lastUpdated).toLocaleDateString()
            : '',
          content: termsResponse.data.content || ''
        }
        setTermsContent(termsData)
        setOriginalTermsContent(JSON.parse(JSON.stringify(termsData)))
      }

      if (privacyResponse.success && privacyResponse.data) {
        const privacyData = {
          title: privacyResponse.data.title || 'Privacy Policy',
          lastUpdated: privacyResponse.data.lastUpdated 
            ? new Date(privacyResponse.data.lastUpdated).toLocaleDateString()
            : '',
          content: privacyResponse.data.content || ''
        }
        setPrivacyContent(privacyData)
        setOriginalPrivacyContent(JSON.parse(JSON.stringify(privacyData)))
      }

      if (contactResponse.success && contactResponse.data) {
        const contactData = {
          email: contactResponse.data.email || '',
          phone: contactResponse.data.phone || '',
          website: contactResponse.data.website || '',
          address: contactResponse.data.address || '',
          businessHours: contactResponse.data.businessHours || ''
        }
        setContactInfo(contactData)
        setOriginalContactInfo(JSON.parse(JSON.stringify(contactData)))
      }
    } catch (err) {
      console.error('Error loading legal content:', err)
      setError(err.message || 'Failed to load content')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      setSuccessMessage(null)

      let response
      if (activeTab === 'terms') {
        const currentContent = termsContent
        response = await apiService.updateTermsOfService({
          title: currentContent.title,
          content: currentContent.content
        })
        if (response.success) {
          setSuccessMessage('Terms of Service updated successfully!')
          const updatedData = {
            ...currentContent,
            lastUpdated: response.data.lastUpdated 
              ? new Date(response.data.lastUpdated).toLocaleDateString()
              : new Date().toLocaleDateString()
          }
          setTermsContent(updatedData)
          setOriginalTermsContent(JSON.parse(JSON.stringify(updatedData)))
        }
      } else if (activeTab === 'privacy') {
        const currentContent = privacyContent
        response = await apiService.updatePrivacyPolicy({
          title: currentContent.title,
          content: currentContent.content
        })
        if (response.success) {
          setSuccessMessage('Privacy Policy updated successfully!')
          const updatedData = {
            ...currentContent,
            lastUpdated: response.data.lastUpdated 
              ? new Date(response.data.lastUpdated).toLocaleDateString()
              : new Date().toLocaleDateString()
          }
          setPrivacyContent(updatedData)
          setOriginalPrivacyContent(JSON.parse(JSON.stringify(updatedData)))
        }
      } else if (activeTab === 'contact') {
        response = await apiService.updateContactInfo(contactInfo)
        if (response.success) {
          setSuccessMessage('Contact information updated successfully!')
          setOriginalContactInfo(JSON.parse(JSON.stringify(contactInfo)))
        }
      }

      if (response && response.success) {

    setIsEditing(false)
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        throw new Error(response.message || 'Failed to save content')
      }
    } catch (err) {
      console.error('Error saving legal content:', err)
      setError(err.message || 'Failed to save content')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset to original content
    if (activeTab === 'terms' && originalTermsContent) {
      setTermsContent(JSON.parse(JSON.stringify(originalTermsContent)))
    } else if (activeTab === 'privacy' && originalPrivacyContent) {
      setPrivacyContent(JSON.parse(JSON.stringify(originalPrivacyContent)))
    } else if (activeTab === 'contact' && originalContactInfo) {
      setContactInfo(JSON.parse(JSON.stringify(originalContactInfo)))
    }
    setIsEditing(false)
    setError(null)
    setSuccessMessage(null)
  }

  const tabs = [
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'contact', label: 'Contact Us', icon: Phone }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center space-x-3"
        >
          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
          <p className="text-sm text-green-800 dark:text-green-400">{successMessage}</p>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-3"
        >
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-600">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (!isEditing) {
                      setActiveTab(tab.id)
                      setError(null)
                      setSuccessMessage(null)
                    }
                  }}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  } ${isEditing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  disabled={isEditing}
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
                {activeTab === 'contact' ? 'Contact Us' : (activeTab === 'terms' ? termsContent.title : privacyContent.title)}
              </h2>
              {activeTab !== 'contact' && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {activeTab === 'terms' 
                    ? (termsContent.lastUpdated ? `Last updated: ${termsContent.lastUpdated}` : 'Not yet updated')
                    : (privacyContent.lastUpdated ? `Last updated: ${privacyContent.lastUpdated}` : 'Not yet updated')}
                </p>
              )}
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
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                    <Save className="h-4 w-4" />
                    )}
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {activeTab === 'contact' ? (
              isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="inline h-4 w-4 mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="support@vault.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Phone className="inline h-4 w-4 mr-2" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Globe className="inline h-4 w-4 mr-2" />
                      Website
                    </label>
                    <input
                      type="url"
                      value={contactInfo.website}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://www.vault.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MapPin className="inline h-4 w-4 mr-2" />
                      Address (Optional)
                    </label>
                    <textarea
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="123 Main Street, City, State, ZIP"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Clock className="inline h-4 w-4 mr-2" />
                      Business Hours (Optional)
                    </label>
                    <input
                      type="text"
                      value={contactInfo.businessHours}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, businessHours: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Monday - Friday: 9:00 AM - 5:00 PM"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-primary-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</p>
                        <p className="text-base text-gray-900 dark:text-white">{contactInfo.email || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-primary-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</p>
                        <p className="text-base text-gray-900 dark:text-white">{contactInfo.phone || 'Not set'}</p>
                      </div>
                    </div>
                    {contactInfo.website && (
                      <div className="flex items-start space-x-3">
                        <Globe className="h-5 w-5 text-primary-500 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Website</p>
                          <p className="text-base text-gray-900 dark:text-white">{contactInfo.website}</p>
                        </div>
                      </div>
                    )}
                    {contactInfo.address && (
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-primary-500 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Address</p>
                          <p className="text-base text-gray-900 dark:text-white">{contactInfo.address}</p>
                        </div>
                      </div>
                    )}
                    {contactInfo.businessHours && (
                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-primary-500 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Business Hours</p>
                          <p className="text-base text-gray-900 dark:text-white">{contactInfo.businessHours}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            ) : (
              isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={activeTab === 'terms' ? termsContent.title : privacyContent.title}
                      onChange={(e) => {
                        if (activeTab === 'terms') {
                          setTermsContent(prev => ({ ...prev, title: e.target.value }))
                        } else {
                          setPrivacyContent(prev => ({ ...prev, title: e.target.value }))
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content
                    </label>
                    <textarea
                      value={activeTab === 'terms' ? termsContent.content : privacyContent.content}
                      onChange={(e) => {
                        if (activeTab === 'terms') {
                          setTermsContent(prev => ({ ...prev, content: e.target.value }))
                        } else {
                          setPrivacyContent(prev => ({ ...prev, content: e.target.value }))
                        }
                      }}
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
                      {(activeTab === 'terms' ? termsContent.content : privacyContent.content) || 'No content available. Click Edit to add content.'}
                    </pre>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Info Section */}
          {activeTab !== 'contact' && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-400">
                    Legal Document Management
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    These documents are legally binding and should be reviewed by legal counsel before publishing. 
                    Changes to these documents will be immediately reflected in the mobile app. 
                    Users will see the updated content when they view Terms of Service or Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'contact' && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-400">
                    Contact Information
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Update contact information that will be displayed to users in the mobile app. 
                    Changes will be immediately reflected when users view the Contact Us section.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SystemSettingsPanel
