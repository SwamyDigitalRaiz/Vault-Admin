import React, { useState, memo } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FolderOpen, 
  FileText, 
  Clock, 
  Calendar, 
  BarChart3, 
  TrendingDown, 
  ScrollText, 
  AlertTriangle, 
  Settings, 
  Shield, 
  UserCog,
  Bell,
  Moon, 
  Sun, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  CreditCard,
  Package,
  Receipt
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useRole } from '../contexts/RoleContext'
import PermissionGate from './PermissionGate'

const Sidebar = ({ currentRoute, onRouteChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  const { canAccessRoute } = useRole()

  const navigationSections = [
    {
      title: 'Dashboard',
      items: [
        { 
          title: 'Dashboard', 
          icon: LayoutDashboard, 
          route: '/dashboard',
          permission: 'view_dashboard'
        }
      ]
    },
    {
      title: 'User Management',
      items: [
        { 
          title: 'Users', 
          icon: Users, 
          route: '/users',
          permission: 'view_users'
        },
        { 
          title: 'Recipients', 
          icon: UserCheck, 
          route: '/contacts',
          permission: 'view_recipients'
        }
      ]
    },
    {
      title: 'File Management',
      items: [
        { 
          title: 'Files & Folders', 
          icon: FolderOpen, 
          route: '/files',
          permission: 'view_files'
        }
      ]
    },
    {
      title: 'Scheduling',
      items: [
        { 
          title: 'Schedules', 
          icon: Clock, 
          route: '/schedules',
          permission: 'view_schedules'
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        { 
          title: 'Notifications', 
          icon: Bell, 
          route: '/notifications',
          permission: 'view_notifications'
        }
      ]
    },
    {
      title: 'Billing & Subscriptions',
      items: [
        { 
          title: 'Subscriptions', 
          icon: CreditCard, 
          route: '/subscriptions',
          permission: 'view_subscriptions'
        },
        { 
          title: 'Packages', 
          icon: Package, 
          route: '/packages',
          permission: 'view_packages'
        },
        { 
          title: 'Transactions', 
          icon: Receipt, 
          route: '/transactions',
          permission: 'view_transactions'
        }
      ]
    },
    {
      title: 'Reports & Analytics',
      items: [
        { 
          title: 'Reports', 
          icon: BarChart3, 
          route: '/reports',
          permission: 'view_reports'
        },
        { 
          title: 'Storage Analytics', 
          icon: TrendingDown, 
          route: '/analytics',
          permission: 'view_analytics'
        }
      ]
    },
    {
      title: 'System Settings',
      items: [
        { 
          title: 'System Settings', 
          icon: Settings, 
          route: '/system-settings',
          permission: 'view_settings'
        },
        { 
          title: 'Admin Roles', 
          icon: UserCog, 
          route: '/admin-roles',
          permission: 'manage_admin_roles'
        }
      ]
    }
  ]

  const handleRouteChange = (route) => {
    onRouteChange(route)
    setIsMobileOpen(false)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const NavItem = ({ item, isActive, onClick }) => {
    const Icon = item.icon
    
    return (
      <PermissionGate 
        permission={item.permission}
        fallback={null}
      >
        <button
          onClick={onClick}
          className={`
            w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
            ${isActive 
              ? 'bg-primary-500 text-white shadow-md' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-500'
            }
            ${isCollapsed ? 'justify-center' : 'justify-start'}
          `}
          title={isCollapsed ? item.title : ''}
        >
          <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
          {!isCollapsed && (
            <span className="truncate">
              {item.title}
            </span>
          )}
        </button>
      </PermissionGate>
    )
  }

  const SectionHeader = ({ title }) => (
    <>
      {!isCollapsed && (
        <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
    </>
  )

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Vault Admin
            </span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">V</span>
          </div>
        )}
        
        {/* Desktop collapse button */}
        <button
          onClick={toggleCollapse}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-6">
          {navigationSections.map((section, index) => {
            // Filter items that user has permission to see
            const visibleItems = section.items?.filter(item => 
              canAccessRoute(item.route)
            ) || []
            
            // Only render section if it has visible items
            if (visibleItems.length === 0) return null
            
            return (
              <div key={index}>
                <SectionHeader title={section.title} />
                <div className="space-y-1 px-2">
                  {visibleItems.map((item) => (
                    <NavItem
                      key={item.route}
                      item={item}
                      isActive={currentRoute === item.route}
                      onClick={() => handleRouteChange(item.route)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`
            w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
            text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
            ${isCollapsed ? 'justify-center' : 'justify-start'}
          `}
          title={isCollapsed ? 'Toggle theme' : ''}
        >
          {isDark ? (
            <Sun className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
          ) : (
            <Moon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
          )}
          {!isCollapsed && (
            <span className="truncate">
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={() => handleRouteChange('/logout')}
          className={`
            w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
            text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
            ${isCollapsed ? 'justify-center' : 'justify-start'}
          `}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
          {!isCollapsed && (
            <span className="truncate">
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobile}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {isMobileOpen ? (
          <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden md:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          shadow-lg transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-65'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={toggleMobile}
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          
          {/* Mobile Sidebar */}
          <aside
            className="md:hidden fixed left-0 top-0 w-65 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl z-50"
          >
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}

export default memo(Sidebar)
