export interface PricingRow {
  item:  string
  hours: number
  rate:  number
  total: number
  notes: string
}

export interface TimelinePhase {
  phase:        string
  duration:     string
  deliverables: string[]
}

export interface ProposalOutput {
  proposal:       string
  pricing:        PricingRow[]
  timeline:       TimelinePhase[]
  followup:       string
  humanise_tips:  string[]
}

export interface Proposal {
  id:              string
  user_id:         string
  job_title?:      string
  job_description: string
  job_budget?:     string
  platform:        string
  extra_context?:  string
  proposal_text?:  string
  pricing_table:   PricingRow[]
  timeline:        TimelinePhase[]
  followup_text?:  string
  humanise_tips:   string[]
  model_used?:     string
  word_count?:     number
  rating?:         number
  is_saved:        boolean
  created_at:      string
}
