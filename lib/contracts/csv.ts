export interface CsvContract {
  contractNumber: string | null
  title: string
  company: string
  agency: string
  category: string
  status: string | null
  value: string | number
  currency: string
  awardDate: Date
  duration: number | null
  location: string | null
  sourceUrl: string | null
}

const FORMULA_PREFIX = /^[\u0000-\u0020]*[=+\-@]/

export function escapeCsvCell(value: string | number | null | undefined): string {
  let text = value === null || value === undefined || value === '' ? 'Not reported' : String(value)
  if (FORMULA_PREFIX.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

export function serializeContractsCsv(contracts: CsvContract[]): string {
  const header = ['Contract Number', 'Title', 'Company', 'Agency', 'Category', 'Status', 'Value', 'Currency', 'Award Date', 'Duration Months', 'Location', 'Source URL']
  const rows = contracts.map((contract) => [
    contract.contractNumber,
    contract.title,
    contract.company,
    contract.agency,
    contract.category,
    contract.status,
    contract.value,
    contract.currency,
    contract.awardDate.toISOString().slice(0, 10),
    contract.duration,
    contract.location,
    contract.sourceUrl,
  ].map(escapeCsvCell).join(','))
  return [header.map(escapeCsvCell).join(','), ...rows].join('\n')
}
