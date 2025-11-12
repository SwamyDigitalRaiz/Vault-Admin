export const ToastType = {
  success: 'success',
  error: 'error',
  info: 'info',
}

export function showToast(message, type = ToastType.info, duration = 2500) {
  const containerId = 'vault-toast-container'
  let container = document.getElementById(containerId)
  if (!container) {
    container = document.createElement('div')
    container.id = containerId
    container.style.position = 'fixed'
    container.style.top = '16px'
    container.style.left = '50%'
    container.style.transform = 'translateX(-50%)'
    container.style.zIndex = '9999'
    container.style.display = 'flex'
    container.style.flexDirection = 'column'
    container.style.gap = '8px'
    document.body.appendChild(container)
  }

  const toast = document.createElement('div')
  toast.style.padding = '10px 14px'
  toast.style.borderRadius = '10px'
  toast.style.color = '#fff'
  toast.style.minWidth = '200px'
  toast.style.maxWidth = '80vw'
  toast.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'
  toast.style.fontSize = '14px'
  toast.style.fontWeight = '600'
  toast.style.textAlign = 'left'
  toast.style.display = 'flex'
  toast.style.alignItems = 'center'
  toast.style.gap = '10px'

  const bg = type === ToastType.success
    ? '#16A34A'
    : type === ToastType.error
      ? '#DC2626'
      : '#334155'
  toast.style.background = bg

  const icon = document.createElement('span')
  icon.innerText = type === ToastType.success ? '✔' : type === ToastType.error ? '⚠' : 'ℹ'
  icon.style.fontSize = '16px'
  toast.appendChild(icon)

  const text = document.createElement('div')
  text.innerText = message
  text.style.lineHeight = '1.3'
  toast.appendChild(text)

  container.appendChild(toast)

  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transition = 'opacity 200ms ease'
    setTimeout(() => container.removeChild(toast), 220)
  }, duration)
}

export const toast = {
  success: (msg, d) => showToast(msg, ToastType.success, d),
  error: (msg, d) => showToast(msg, ToastType.error, d),
  info: (msg, d) => showToast(msg, ToastType.info, d),
}


