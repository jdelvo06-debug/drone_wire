/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HeroSection from '@/components/home/hero-section'

describe('homepage hero', () => {
  it('keeps the View Explainers outline CTA visible on the dark hero', () => {
    render(<HeroSection />)

    const cta = screen.getByRole('button', { name: 'View Explainers' })
    expect(cta).toHaveClass('bg-transparent', 'text-white', 'hover:bg-white/10', 'hover:text-white')
    expect(cta).not.toHaveClass('bg-background')
  })
})
