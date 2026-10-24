export type PortfolioKey =
  | 'PRODUCT_TECHNOLOGY'
  | 'SPONSORSHIP_EVENTS'
  | 'MARKETING_GROWTH'
  | 'RESEARCH_LEAD_GENERATION'
  | 'SOCIAL_MEDIA_CONTENT'

export interface PortfolioDefinition {
  key: PortfolioKey
  title: string
  description: string
  responsibilities: string[]
  learningOutcomes: string[]
}

export const PORTFOLIOS: PortfolioDefinition[] = [
  {
    key: 'PRODUCT_TECHNOLOGY',
    title: 'Product & Technology',
    description: 'Build and improve the actual product travelers and planners use every day.',
    responsibilities: [
      'Website development and feature improvements',
      'UI/UX enhancements and mobile responsiveness',
      'Testing, debugging and performance improvements',
      'Supporting product development',
    ],
    learningOutcomes: [
      'Practical software development',
      'Product lifecycle and testing',
      'Technical problem-solving',
      'Collaborative development workflows',
    ],
  },
  {
    key: 'SPONSORSHIP_EVENTS',
    title: 'Sponsorship & Events',
    description: 'Open doors into college festivals and events as partnership opportunities for Beacon.',
    responsibilities: [
      'Identify suitable college festivals and events',
      'Research sponsorship opportunities',
      'Prepare sponsorship proposals',
      'Contact event organisers and explore collaborations',
      'Track opportunities and partnership outcomes',
    ],
    learningOutcomes: [
      'Sponsorship proposal writing',
      'Professional communication',
      'Negotiation and relationship management',
      'Event partnership strategy',
    ],
  },
  {
    key: 'MARKETING_GROWTH',
    title: 'Marketing & Growth',
    description: 'Bring travel planners onto the platform and help them succeed on it.',
    responsibilities: [
      'Contact and onboard travel planners',
      'Conduct product demonstrations',
      'Help interested planners publish packages',
      'Develop acquisition and referral strategies',
      'Analyse onboarding and conversion results',
    ],
    learningOutcomes: [
      'Sales and business development',
      'Customer discovery',
      'Growth strategy',
      'Communication and conversion analytics',
    ],
  },
  {
    key: 'RESEARCH_LEAD_GENERATION',
    title: 'Research & Lead Generation',
    description: 'Build the structured pipeline of planners, partners and organisers Beacon reaches out to.',
    responsibilities: [
      'Research travel planners and relevant businesses',
      'Find potential event organisers and institutional partners',
      'Verify publicly available business information',
      'Categorise and prioritise leads',
      'Maintain structured lead databases with source references',
    ],
    learningOutcomes: [
      'Market research',
      'Competitor analysis',
      'Lead qualification',
      'Spreadsheet management and business intelligence',
    ],
  },
  {
    key: 'SOCIAL_MEDIA_CONTENT',
    title: 'Social Media & Content',
    description: 'Tell Beacon’s story and showcase real travel packages to a growing audience.',
    responsibilities: [
      'Create social media posts, reels and stories',
      'Prepare content calendars',
      'Produce product demonstrations and promotional creatives',
      'Showcase travel packages and Beacon’s work',
      'Analyse content performance',
    ],
    learningOutcomes: [
      'Content strategy',
      'Digital marketing',
      'Creative communication',
      'Social media analytics and brand building',
    ],
  },
]

export const PORTFOLIO_KEYS = PORTFOLIOS.map(p => p.key) as [PortfolioKey, ...PortfolioKey[]]

export function getPortfolio(key: PortfolioKey): PortfolioDefinition | undefined {
  return PORTFOLIOS.find(p => p.key === key)
}
