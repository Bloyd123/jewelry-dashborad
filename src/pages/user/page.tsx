import { UserProfileHeader } from '@/components/user/UserProfile'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  PersonalInfoTab,
  SecurityTab,
  PreferencesTab,
  ShopAccessTab,
  PerformanceTab,
  ActivityLogsTab,
} from '@/components/user/UserProfile'

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('personal')
  const navigate = useNavigate()
  const { customerId } = useParams()

  return (
    <>
      <UserProfileHeader
        onTabChange={tab => setActiveTab(tab)}
        onBackClick={() => navigate('/dashboard')}
        onSettingsClick={() => console.log('Settings')}
      />

      {activeTab === 'personal' && <PersonalInfoTab />}
      {activeTab === 'security' && <SecurityTab />}
      {activeTab === 'preferences' && <PreferencesTab />}
      {activeTab === 'shopAccess' && <ShopAccessTab />}
      {activeTab === 'performance' && <PerformanceTab />}
      {activeTab === 'activity' && <ActivityLogsTab />}
    </>
  )
}
