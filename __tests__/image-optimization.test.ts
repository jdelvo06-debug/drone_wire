import { canOptimizeImage } from '@/lib/constants/images'

describe('selective image optimization', () => {
  it('optimizes local and inventoried HTTPS assets only', () => {
    expect(canOptimizeImage('/images/placeholder-article.svg')).toBe(true)
    expect(canOptimizeImage('https://upload.wikimedia.org/example.jpg')).toBe(true)
    expect(canOptimizeImage('http://upload.wikimedia.org/example.jpg')).toBe(false)
    expect(canOptimizeImage('https://unreviewed.example/image.jpg')).toBe(false)
  })
})
