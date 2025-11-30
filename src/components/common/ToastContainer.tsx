import React from 'react'

import { useNotificationContext } from '../../context/NotificationContext'

import Toast from './Toast'

const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotificationContext()

  if (notifications.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-[9999] flex flex-col items-end"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="pointer-events-auto">
        {notifications.map(notification => (
          <Toast
            key={notification.id}
            {...notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </div>
  )
}

export default ToastContainer
