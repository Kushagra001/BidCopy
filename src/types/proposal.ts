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

export interface HumaniseTipDetail {
  original:    string
  replacement: string
  explanation: string
}

export interface ProposalOutput {
  proposal:       string
  pricing:        PricingRow[]
  timeline:       TimelinePhase[]
  followup:       string
  humanise_tips:  HumaniseTipDetail[]
  /** Currency symbol/code used in the pricing table (e.g. "$", "£", "€", "₹", "AUD"). Inferred by the AI from the job budget; falls back to the freelancer's profile currency. */
  currency?:      string
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  humanise_tips:   any[]
  model_used?:     string
  word_count?:     number
  rating?:         number
  is_saved:        boolean
  created_at:      string
}
