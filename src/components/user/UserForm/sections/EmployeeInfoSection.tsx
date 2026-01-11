// FILE: src/components/user/UserForm/sections/EmployeeInfoSection.tsx
// Employee Information Section - Designation, Department, Employee ID, Joining Date

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput'
import { FormSelect } from '@/components/forms/FormSelect'
import { FormDatePicker } from '@/components/forms/FormDatePicker'
import type { FormSectionProps } from '../UserForm.types'

export const EmployeeInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const departmentOptions = [
    { value: 'sales', label: t('user.departments.sales') },
    { value: 'purchase', label: t('user.departments.purchase') },
    { value: 'inventory', label: t('user.departments.inventory') },
    { value: 'accounts', label: t('user.departments.accounts') },
    { value: 'management', label: t('user.departments.management') },
    { value: 'workshop', label: t('user.departments.workshop') },
    { value: 'quality_check', label: t('user.departments.qualityCheck') },
    { value: 'customer_service', label: t('user.departments.customerService') },
    { value: 'other', label: t('user.departments.other') },
  ]

  return (
    <div className="space-y-4">
      {/* Designation */}
      <FormInput
        name="designation"
        label={t('user.designation')}
        value={data.designation || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.designation}
        placeholder={t('user.designationPlaceholder')}
        disabled={disabled}
        maxLength={100}
      />

      {/* Department */}
      <FormSelect
        name="department"
        label={t('user.department')}
        value={data.department || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.department}
        placeholder={t('user.selectDepartment')}
        options={departmentOptions}
        disabled={disabled}
      />

      {/* Employee ID */}
      <FormInput
        name="employeeId"
        label={t('user.employeeId')}
        value={data.employeeId || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.employeeId}
        placeholder={t('user.employeeIdPlaceholder')}
        disabled={disabled}
        maxLength={50}
        helpText={t('user.employeeIdHelpText')}
      />

      {/* Joining Date */}
      <FormDatePicker
        name="joiningDate"
        label={t('user.joiningDate')}
        value={data.joiningDate || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.joiningDate}
        placeholder={t('user.selectDate')}
        disabled={disabled}
        maxDate={new Date()}
      />
    </div>
  )
}