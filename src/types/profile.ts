export interface UserProfile {
  id?: string
  user_id?: string
  name: string
  headline: string
  bio: string
  skills: string[]
  hourly_rate: number
  currency: string
  platforms: string[]
  portfolio_url: string
  projects: Project[]
  tone: 'professional' | 'friendly' | 'technical' | 'bold'
  speciality: string
  completed?: boolean
}

export interface Project {
  name: string
  description: string
  result: string
  url?: string
}

export type Tone = UserProfile['tone']
