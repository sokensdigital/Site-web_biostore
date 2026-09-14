import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// "237690000000" -> "+237 690 00 00 00" (country code, then groups of 3 then 2s)
export function formatPhoneNumber(digits: string) {
  const clean = digits.replace(/\D/g, '')
  const countryCode = clean.slice(0, 3)
  const rest = clean.slice(3)
  const groups = [rest.slice(0, 3), ...rest.slice(3).match(/.{1,2}/g) ?? []]
  return `+${[countryCode, ...groups].filter(Boolean).join(' ')}`
}
