import { CustomerDetailHeader } from '@/components/customer/CustomerPage'
import {
  PersonalInfoTab,
  FinancialTab,
  OrdersTab,
  LoyaltyTab,
  DocumentsTab,
  ActivityLogsTab,
} from '@/components/customer/CustomerPage/tabs'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
export default function CustomerDetailPage() {
  const [activeTab, setActiveTab] = useState('personal')
  const navigate = useNavigate()
  const { customerId } = useParams()

  return (
    <div>
      <CustomerDetailHeader
        customerId={customerId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBackClick={() => navigate('/customers')}
        onSettingsClick={() => console.log('Settings clicked')}
      />

      {activeTab === 'personal' && <PersonalInfoTab />}
      {activeTab === 'financial' && <FinancialTab />}
      {activeTab === 'orders' && <OrdersTab />}
      {activeTab === 'loyalty' && <LoyaltyTab />}
      {activeTab === 'documents' && <DocumentsTab />}
      {activeTab === 'activity' && <ActivityLogsTab />}
    </div>
  )
}
