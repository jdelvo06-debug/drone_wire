import { escapeCsvCell, serializeContractsCsv } from '@/lib/contracts/csv'

describe('contracts CSV export', () => {
  it.each(['=2+2', '+SUM(A1:A2)', '-1+1', '@cmd', '\t=2+2', '\r=2+2', '\n=2+2', ' =2+2'])('neutralizes spreadsheet formula input %s', (value) => {
    expect(escapeCsvCell(value)).toContain(`'${value}`)
  })

  it('emits a UTF-8 CSV with Not reported for unsupported fields', () => {
    const csv = serializeContractsCsv([{
      contractNumber: null,
      title: 'Counter-UAS award',
      company: 'Example Co',
      agency: 'Army',
      category: 'counter-uas',
      status: null,
      value: '1000.00',
      currency: 'USD',
      awardDate: new Date('2026-08-01T00:00:00.000Z'),
      duration: null,
      location: null,
      sourceUrl: 'https://example.gov/award',
    }])

    expect(csv).toContain('Counter-UAS award')
    expect(csv).toContain('Not reported')
    expect(csv.split('\n')).toHaveLength(2)
  })
})
