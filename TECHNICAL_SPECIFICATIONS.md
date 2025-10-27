# Vault Admin Panel - Technical Specifications

## System Architecture

### Frontend Architecture
```
Vault Admin Panel
├── React 18 Application
│   ├── Component-Based Architecture
│   ├── Context-Based State Management
│   ├── Custom Hooks
│   └── Utility Functions
├── Styling System
│   ├── TailwindCSS Framework
│   ├── Custom Design System
│   ├── Responsive Design
│   └── Dark/Light Theme Support
├── UI Components
│   ├── ShadCN UI Library
│   ├── Lucide React Icons
│   ├── Framer Motion Animations
│   └── Recharts Data Visualization
└── Development Tools
    ├── Vite Build System
    ├── ESLint Code Quality
    ├── PostCSS Processing
    └── Hot Module Replacement
```

### Component Hierarchy
```
App.jsx
├── ThemeProvider (Context)
├── Sidebar (Navigation)
└── Main Content Router
    ├── Dashboard
    │   ├── TopBar
    │   ├── SummaryCards
    │   ├── Charts
    │   ├── ActivitiesTable
    │   └── QuickActions
    ├── UsersPage
    │   ├── TopBar
    │   ├── UsersTable
    │   └── UserDetailPanel
    ├── ContactsPage
    │   ├── TopBar
    │   ├── ContactsTable
    │   ├── ContactModal
    │   └── ContactDetailPanel
    ├── FilesPage
    │   ├── TopBar
    │   ├── FilesTable
    │   ├── FilesGrid
    │   ├── FileModal
    │   └── FileDetailPanel
    ├── SchedulesPage
    │   ├── TopBar
    │   ├── SchedulesTable
    │   ├── ScheduleModal
    │   └── ScheduleDetailPanel
    ├── NotificationsPage
    │   ├── TopBar
    │   ├── NotificationsList
    │   ├── NotificationDetailPanel
    │   ├── SendNotificationModal
    │   └── NotificationSettingsModal
    ├── ReportsPage
    │   ├── TopBar
    │   ├── ReportsSummaryCards
    │   ├── ReportsCharts
    │   └── ReportsTable
    ├── StorageAnalyticsPage
    │   ├── TopBar
    │   ├── StorageAnalyticsCharts
    │   └── StorageAnalyticsTable
    ├── SystemSettingsPage
    │   ├── TopBar
    │   └── SystemSettingsPanel
    └── AdminRolesPage
        ├── TopBar
        └── AdminRolesTable
```

---

## Technology Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | Frontend framework |
| JavaScript | ES6+ | Programming language |
| HTML5 | Latest | Markup language |
| CSS3 | Latest | Styling language |

### Build Tools
| Tool | Version | Purpose |
|------|---------|---------|
| Vite | 4.x | Build tool and dev server |
| PostCSS | 8.x | CSS processing |
| TailwindCSS | 3.x | CSS framework |
| ESLint | 8.x | Code linting |

### UI Libraries
| Library | Version | Purpose |
|---------|---------|---------|
| ShadCN UI | Latest | Component library |
| Lucide React | Latest | Icon library |
| Framer Motion | 10.x | Animation library |
| Recharts | 2.x | Chart library |

### Development Dependencies
```json
{
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0"
  }
}
```

### Production Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.263.0",
    "recharts": "^2.7.0"
  }
}
```

---

## Design System

### Color Palette
```css
:root {
  /* Primary Colors */
  --primary-50: #f0f2f7;
  --primary-100: #e1e6ef;
  --primary-200: #c3cde0;
  --primary-300: #a5b4d0;
  --primary-400: #879bc1;
  --primary-500: #3C467B;  /* Main brand color */
  --primary-600: #303a63;
  --primary-700: #242e4a;
  --primary-800: #182132;
  --primary-900: #0c1519;

  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* Status Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

### Typography
```css
/* Font Family */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System
```css
/* Spacing Scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Border Radius
```css
--radius-sm: 0.125rem;   /* 2px */
--radius: 0.25rem;       /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;   /* Fully rounded */
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

---

## Component Specifications

### Button Components
```jsx
// Primary Button
<button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
  Primary Action
</button>

// Secondary Button
<button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
  Secondary Action
</button>

// Danger Button
<button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
  Delete
</button>
```

### Input Components
```jsx
// Text Input
<input 
  type="text"
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
  placeholder="Enter text..."
/>

// Select Input
<select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
  <option>Select option...</option>
</select>

// Textarea
<textarea 
  rows="4"
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
  placeholder="Enter message..."
></textarea>
```

### Card Components
```jsx
// Basic Card
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    Card Title
  </h3>
  <p className="text-gray-600 dark:text-gray-400">
    Card content goes here...
  </p>
</div>

// Interactive Card
<motion.div 
  whileHover={{ scale: 1.02 }}
  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer"
>
  Interactive card content...
</motion.div>
```

### Modal Components
```jsx
// Modal Structure
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        Modal content...
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

---

## State Management

### Context Providers
```jsx
// Theme Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Component State
```jsx
// Local State Management
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [selectedItem, setSelectedItem] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
```

### Custom Hooks
```jsx
// Custom Hook Example
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};
```

---

## Animation System

### Framer Motion Variants
```jsx
// Page Transitions
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

// Staggered Animations
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
};
```

### Hover Animations
```jsx
// Button Hover
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="px-4 py-2 bg-primary-500 text-white rounded-lg"
>
  Animated Button
</motion.button>

// Card Hover
<motion.div
  whileHover={{ scale: 1.02, y: -2 }}
  className="bg-white rounded-xl shadow-sm p-6"
>
  Hoverable Card
</motion.div>
```

---

## Responsive Design

### Breakpoints
```css
/* TailwindCSS Breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Responsive Classes
```jsx
// Responsive Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  Grid items...
</div>

// Responsive Text
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>

// Responsive Spacing
<div className="p-4 md:p-6 lg:p-8">
  Responsive padding...
</div>
```

### Mobile Navigation
```jsx
// Mobile Drawer
<motion.div
  initial={{ x: -300 }}
  animate={{ x: isOpen ? 0 : -300 }}
  className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg"
>
  Mobile navigation content...
</motion.div>
```

---

## Performance Optimization

### Code Splitting
```jsx
// Lazy Loading Components
const LazyComponent = lazy(() => import('./LazyComponent'));

// Usage with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>
```

### Memoization
```jsx
// React.memo for component optimization
const OptimizedComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// useCallback for function optimization
const handleClick = useCallback(() => {
  doSomething();
}, [dependency]);
```

### Image Optimization
```jsx
// Lazy loading images
<img 
  src="image.jpg" 
  loading="lazy"
  alt="Description"
  className="w-full h-auto"
/>
```

---

## Accessibility Features

### ARIA Labels
```jsx
// Accessible buttons
<button 
  aria-label="Close modal"
  aria-expanded={isOpen}
  onClick={handleClose}
>
  <X className="h-6 w-6" />
</button>

// Accessible forms
<label htmlFor="email" className="block text-sm font-medium">
  Email Address
</label>
<input 
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={hasError}
/>
```

### Keyboard Navigation
```jsx
// Focus management
const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    handleClose();
  }
  if (e.key === 'Enter' || e.key === ' ') {
    handleAction();
  }
};

// Focus trap for modals
useEffect(() => {
  if (isOpen) {
    const firstFocusable = modalRef.current.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  }
}, [isOpen]);
```

### Screen Reader Support
```jsx
// Screen reader announcements
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {announcement}
</div>

// Descriptive text
<button aria-describedby="button-description">
  Delete
</button>
<div id="button-description" className="sr-only">
  This will permanently delete the selected item
</div>
```

---

## Browser Compatibility

### Supported Browsers
| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Opera | 76+ | ✅ Full Support |

### Polyfills Required
- **ES6+ Features**: Modern JavaScript features
- **CSS Grid**: Layout system support
- **CSS Custom Properties**: CSS variables
- **Intersection Observer**: Lazy loading support

### Fallbacks
```css
/* CSS Fallbacks */
.grid {
  display: grid;
  display: -ms-grid; /* IE fallback */
}

.flex {
  display: flex;
  display: -webkit-box; /* Safari fallback */
  display: -ms-flexbox; /* IE fallback */
}
```

---

## Security Considerations

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:;">
```

### Input Validation
```jsx
// Client-side validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[0-9]/.test(password);
};
```

### XSS Prevention
```jsx
// Sanitize user input
const sanitizeInput = (input) => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Use dangerouslySetInnerHTML carefully
<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
```

---

## Testing Strategy

### Unit Testing
```jsx
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Integration Testing
```jsx
// Testing component interactions
test('modal opens and closes correctly', () => {
  render(<App />);
  
  // Open modal
  fireEvent.click(screen.getByText('Open Modal'));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  
  // Close modal
  fireEvent.click(screen.getByLabelText('Close modal'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
```

### E2E Testing
```javascript
// Cypress E2E tests
describe('User Management', () => {
  it('should create a new user', () => {
    cy.visit('/users');
    cy.get('[data-testid="add-user-button"]').click();
    cy.get('[data-testid="user-name-input"]').type('John Doe');
    cy.get('[data-testid="user-email-input"]').type('john@example.com');
    cy.get('[data-testid="save-user-button"]').click();
    cy.get('[data-testid="user-table"]').should('contain', 'John Doe');
  });
});
```

---

## Deployment Configuration

### Build Configuration
```javascript
// vite.config.js
export default {
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
          charts: ['recharts']
        }
      }
    }
  }
};
```

### Environment Variables
```bash
# .env.production
VITE_API_URL=https://api.vaultadmin.com
VITE_APP_NAME=Vault Admin Panel
VITE_APP_VERSION=1.0.0
```

### Server Configuration
```nginx
# Nginx configuration
server {
    listen 80;
    server_name vaultadmin.com;
    root /var/www/vault-admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Monitoring & Analytics

### Performance Monitoring
```javascript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Error Tracking
```javascript
// Error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

### User Analytics
```javascript
// User interaction tracking
const trackEvent = (eventName, properties = {}) => {
  // Send to analytics service
  console.log('Event:', eventName, properties);
};

// Usage
trackEvent('button_click', { 
  button_name: 'save_user',
  page: 'users' 
});
```

---

*This technical specification document provides comprehensive details about the Vault Admin Panel's architecture, implementation, and deployment requirements.*
