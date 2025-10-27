# Vault Admin Panel - Modern Sidebar

A modern, professional sidebar navigation component for the Vault Admin Panel built with React, TailwindCSS, and Framer Motion.

## ✨ Features

- **Collapsible Design**: Smooth 260px ↔ 80px width transition
- **Dark/Light Theme**: Toggle between themes with persistent storage
- **Responsive**: Mobile-friendly with drawer overlay
- **Smooth Animations**: Framer Motion powered transitions
- **Accessibility**: Keyboard navigation and ARIA labels
- **Modern Icons**: Lucide React icons throughout
- **Active State**: Visual feedback for current route
- **Hover Effects**: Subtle scale and color transitions

## 🎨 Design System

- **Primary Color**: #3C467B
- **Typography**: Inter font family
- **Border Radius**: Rounded corners (xl/2xl)
- **Shadows**: Soft drop shadows for depth
- **Animations**: 0.3s ease-in-out transitions

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:3000`

## 📱 Navigation Sections

### 1. Dashboard
- Overview of system metrics

### 2. User Management
- 👥 Users
- 📇 Contacts

### 3. File Management
- 📁 Folders
- 📄 Files

### 4. Scheduling
- 🕒 Schedules
- 📆 Calendar View

### 5. Reports & Analytics
- 📈 Reports
- 📉 Storage Analytics

### 6. Activity Logs
- 🧾 Activity Logs
- ⚠️ Failed Deliveries

### 7. System Settings
- ⚙️ System Settings
- 🧑‍💻 Admin Roles

## 🎛️ Controls

- **Desktop**: Click the chevron button to collapse/expand
- **Mobile**: Tap the hamburger menu to open drawer
- **Theme**: Click the moon/sun icon to toggle dark/light mode
- **Navigation**: Click any menu item to change routes

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Vite** - Build tool

## 📁 Project Structure

```
src/
├── components/
│   └── Sidebar.jsx          # Main sidebar component
├── contexts/
│   └── ThemeContext.jsx     # Theme management
├── App.jsx                  # Main app component
├── main.jsx                 # Entry point
└── index.css               # Global styles
```

## 🎯 Customization

### Adding New Navigation Items

Edit the `navigationSections` array in `Sidebar.jsx`:

```jsx
{
  title: 'New Section',
  items: [
    { title: 'New Item', icon: YourIcon, route: '/new-route' }
  ]
}
```

### Changing Colors

Update the primary color in `tailwind.config.js`:

```js
colors: {
  primary: {
    500: '#YOUR_COLOR', // Main brand color
    // ... other shades
  }
}
```

### Modifying Animations

Adjust animation durations in the component or add new keyframes in `tailwind.config.js`.

## 📱 Responsive Behavior

- **Desktop (≥768px)**: Fixed sidebar with collapse functionality
- **Mobile (<768px)**: Overlay drawer with backdrop
- **Touch-friendly**: Large tap targets and smooth gestures

## ♿ Accessibility Features

- Keyboard navigation support
- ARIA labels and roles
- High contrast mode support
- Focus indicators
- Screen reader friendly

## 🎨 Theme Support

The sidebar automatically adapts to light and dark themes:

- **Light**: Clean white background with gray accents
- **Dark**: Dark gray background with light text
- **Persistence**: Theme preference saved to localStorage

Enjoy your modern, professional sidebar! 🚀
