import { CustomerDetailHeader } from '@/components/customer/CustomerPage'
import {
  PersonalInfoTab,
  FinancialTab,
  OrdersTab,
  LoyaltyTab,
  DocumentsTab,
  ActivityLogsTab,
} from '@/components/customer/CustomerPage/tabs'
import { usePermissionCheck } from '@/hooks/auth/usePermissions'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/auth'
import { useCustomerById } from '@/hooks/customer/useCustomerById'
export default function CustomerDetailPage() {
  const [activeTab, setActiveTab] = useState('personal')
  const navigate = useNavigate()
  const { customerId } = useParams()
  const { currentShopId } = useAuth()
  const { customer, isLoading } = useCustomerById(currentShopId!, customerId!)
    const { can } = usePermissionCheck()

  if (isLoading || !customer) {
    return <div>Loading...</div> // later: skeleton
  }
  return (
    <div>
      <CustomerDetailHeader
        customer={customer}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBackClick={() => navigate('/customers')}
        onSettingsClick={() => console.log('Settings clicked')}
      />

{activeTab === 'personal' && <PersonalInfoTab customer={customer} />}
{activeTab === 'financial' && can('canViewCustomerFinancials') && <FinancialTab customer={customer} />}
{activeTab === 'orders' && can('canViewCustomerHistory') && <OrdersTab  customer={customer}/>}
{activeTab === 'loyalty' && <LoyaltyTab />}
{activeTab === 'documents' && <DocumentsTab />}
{activeTab === 'activity' && can('canViewCustomerHistory') && <ActivityLogsTab />}
    </div>
  )
}
