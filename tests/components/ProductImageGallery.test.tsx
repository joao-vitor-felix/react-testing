import { render, screen } from '@testing-library/react'
import ProductImageGallery from '../../src/components/ProductImageGallery'

describe('ProductImageGallery', () => {
  it('should render anything if imageUrls are an empty array', () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should render image gallery when provided a valid imageUrls', () => {
    const imageUrls = ['link1', 'link2', 'link3']
    render(<ProductImageGallery imageUrls={imageUrls} />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(3)
    imageUrls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute('src', url)
    })
   })
})