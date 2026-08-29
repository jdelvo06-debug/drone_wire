import { buildExplainerCategories } from '@/components/explainers/explainers-header'

describe('visual and freshness remediation contracts', () => {
  it('derives explainer filter counts from data and includes concepts', () => {
    const categories = buildExplainerCategories({
      systems: 8,
      threats: 6,
      countermeasures: 7,
      policy: 3,
      concepts: 16,
    })

    expect(categories[0]).toMatchObject({ value: 'all', count: 40 })
    expect(categories).toContainEqual({ value: 'concepts', label: 'Core Concepts', count: 16 })
  })
})
