// FILE: src/components/user/UserDetail/tabs/PersonalInfoTab.tsx

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Building2,
  Hash,
  Copy,
  Check,
} from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/layout/Accordion/Accordion'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { User as UserType } from '@/types/user.types'

// ── Copy Button ────────────────────────────────────────────
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 w-6 p-0">
      {copied ? (
        <Check className="h-3 w-3 text-status-success" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  )
}

// ── Props ──────────────────────────────────────────────────
interface PersonalInfoTabProps {
  user: UserType
}

// ── Component ──────────────────────────────────────────────
export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ user }) => {
  const { t } = useTranslation()

  const fullName = user.fullName || `${user.firstName} ${user.lastName || ''}`.trim()

  // ── Basic Info Section ─────────────────────────────────
  const BasicInfoSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('user.firstName')}
          </Label>
          <p className="text-sm font-medium text-text-primary">{user.firstName}</p>
        </div>

        {user.lastName && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('user.lastName')}
            </Label>
            <p className="text-sm font-medium text-text-primary">{user.lastName}</p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('user.username')}
          </Label>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm font-medium text-text-primary">
              @{user.username}
            </p>
            <CopyButton text={user.username} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('user.table.status')}
          </Label>
          <Badge variant={user.isActive ? 'active' : 'inactive'} size="sm">
            {user.isActive ? t('common.active') : t('common.inactive')}
          </Badge>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('user.table.role')}
          </Label>
          <Badge variant="default" size="sm">
            {t(`roles.${user.role}`)}
          </Badge>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('user.table.emailVerified')}
          </Label>
          <Badge variant={user.isEmailVerified ? 'success' : 'warning'} size="sm">
            {user.isEmailVerified ? t('common.verified') : t('common.pending')}
          </Badge>
        </div>

        {user.createdAt && (
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-1 text-xs text-text-secondary">
              <Calendar className="h-3 w-3" />
              {t('user.table.joinedAt')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {user.lastLogin && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('userProfile.lastLogin')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {new Date(user.lastLogin).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  )

  // ── Contact Info Section ───────────────────────────────
  const ContactInfoSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-1 text-xs text-text-secondary">
            <Mail className="h-3 w-3" />
            {t('user.email')}
          </Label>
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-text-primary">
              {user.email}
            </p>
            <CopyButton text={user.email} />
          </div>
        </div>

        {user.phone && (
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-1 text-xs text-text-secondary">
              <Phone className="h-3 w-3" />
              {t('user.phone')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text-primary">{user.phone}</p>
              <CopyButton text={user.phone} />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // ── Employee Info Section ──────────────────────────────
  const EmployeeInfoSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {user.designation && (
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-1 text-xs text-text-secondary">
              <Briefcase className="h-3 w-3" />
              {t('user.designation')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {user.designation}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-1 text-xs text-text-secondary">
            <Building2 className="h-3 w-3" />
            {t('user.department')}
          </Label>
          <p className="text-sm font-medium capitalize text-text-primary">
            {user.department?.replace('_', ' ') || '—'}
          </p>
        </div>

        {user.employeeId && (
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-1 text-xs text-text-secondary">
              <Hash className="h-3 w-3" />
              {t('user.employeeId')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium text-text-primary">
                {user.employeeId}
              </p>
              <CopyButton text={user.employeeId} />
            </div>
          </div>
        )}

        {user.joiningDate && (
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-1 text-xs text-text-secondary">
              <Calendar className="h-3 w-3" />
              {t('user.joiningDate')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {new Date(user.joiningDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
      <Accordion
        type="multiple"
        defaultValue={['basic', 'contact']}
        variant="separated"
        size="md"
      >
        <AccordionItem value="basic">
          <AccordionTrigger icon={<User className="h-5 w-5" />}>
            {t('user.basicInformation')}
          </AccordionTrigger>
          <AccordionContent>
            <BasicInfoSection />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact">
          <AccordionTrigger icon={<Phone className="h-5 w-5" />}>
            {t('user.contactInformation')}
          </AccordionTrigger>
          <AccordionContent>
            <ContactInfoSection />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="employee">
          <AccordionTrigger icon={<Briefcase className="h-5 w-5" />}>
            {t('user.employeeInformation')}
          </AccordionTrigger>
          <AccordionContent>
            <EmployeeInfoSection />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default PersonalInfoTab