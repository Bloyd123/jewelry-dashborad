import * as React from 'react'
import { MapPin } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface ShopLocationFilterProps {
  state?: string
  city?: string
  onStateChange: (value: string | undefined) => void
  onCityChange: (value: string | undefined) => void
  className?: string
}

// Indian states with their cities
const INDIAN_STATES_WITH_CITIES: Record<string, string[]> = {
  Maharashtra: [
    'Mumbai',
    'Pune',
    'Nagpur',
    'Nashik',
    'Aurangabad',
    'Solapur',
    'Kolhapur',
  ],
  Delhi: [
    'New Delhi',
    'Central Delhi',
    'North Delhi',
    'South Delhi',
    'East Delhi',
    'West Delhi',
  ],
  Karnataka: [
    'Bangalore',
    'Mysore',
    'Hubli',
    'Mangalore',
    'Belgaum',
    'Gulbarga',
  ],
  'Tamil Nadu': [
    'Chennai',
    'Coimbatore',
    'Madurai',
    'Tiruchirappalli',
    'Salem',
    'Tirunelveli',
  ],
  'Uttar Pradesh': [
    'Lucknow',
    'Kanpur',
    'Agra',
    'Varanasi',
    'Meerut',
    'Allahabad',
    'Noida',
    'Ghaziabad',
  ],
  Gujarat: [
    'Ahmedabad',
    'Surat',
    'Vadodara',
    'Rajkot',
    'Bhavnagar',
    'Jamnagar',
  ],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
  Telangana: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Andhra Pradesh': [
    'Visakhapatnam',
    'Vijayawada',
    'Guntur',
    'Nellore',
    'Tirupati',
  ],
  Kerala: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Kollam', 'Thrissur'],
  Punjab: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
  Haryana: ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Karnal'],
  Bihar: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
  Odisha: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur'],
  Assam: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat'],
  Jharkhand: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
  Chhattisgarh: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba'],
  Uttarakhand: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani'],
  Goa: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Manali', 'Solan'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag'],
  Puducherry: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  Tripura: ['Agartala', 'Udaipur', 'Dharmanagar'],
  Meghalaya: ['Shillong', 'Tura', 'Jowai'],
  Manipur: ['Imphal', 'Thoubal', 'Bishnupur'],
  Nagaland: ['Kohima', 'Dimapur', 'Mokokchung'],
  Mizoram: ['Aizawl', 'Lunglei', 'Champhai'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat'],
  Sikkim: ['Gangtok', 'Namchi', 'Gyalshing'],
  Ladakh: ['Leh', 'Kargil'],
}

const ALL_STATES = Object.keys(INDIAN_STATES_WITH_CITIES).sort()

export const ShopLocationFilter: React.FC<ShopLocationFilterProps> = ({
  state,
  city,
  onStateChange,
  onCityChange,
  className,
}) => {
  const { t } = useTranslation()

  // Get cities for selected state
  const cities = React.useMemo(() => {
    if (!state || state === 'all') return []
    return INDIAN_STATES_WITH_CITIES[state] || []
  }, [state])

  const handleStateChange = (value: string) => {
    if (value === 'all') {
      onStateChange(undefined)
      onCityChange(undefined)
    } else {
      onStateChange(value)
      onCityChange(undefined) // Clear city when state changes
    }
  }

  const handleCityChange = (value: string) => {
    if (value === 'all') {
      onCityChange(undefined)
    } else {
      onCityChange(value)
    }
  }

  return (
    <div className={cn('flex gap-2', className)}>
      {/* State Filter */}
      <Select value={state || 'all'} onValueChange={handleStateChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder={t('shops.filters.state')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t('shops.common.allStates')}
            </div>
          </SelectItem>
          {ALL_STATES.map(s => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* City Filter - Show when state is selected AND not 'all' */}
      {state && state !== 'all' && cities.length > 0 && (
        <Select value={city || 'all'} onValueChange={handleCityChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t('shops.filters.city')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.allCities')}</SelectItem>
            {cities.map(c => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
