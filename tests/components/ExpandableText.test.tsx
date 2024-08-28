import { render, screen } from '@testing-library/react'
import ExpandableText from '../../src/components/ExpandableText'
import userEvent from '@testing-library/user-event'

describe('ExpandableText', () => {
  const limit = 255;
  const longText = 'a'.repeat(limit + 1);
  const truncatedText = `${longText.substring(0, limit)}...`;

  it('should show regular text if text is bellow limited text', () => {
    render(<ExpandableText text={`text`.repeat(254)} />)
    expect(screen.getByText(/text/i)).toBeInTheDocument()
  })

  it('should show truncated text alongside show more button if text is above limited text ', () => {
    render(<ExpandableText text={longText} />)
    
    expect(screen.getByText(truncatedText)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /more/i })).toBeInTheDocument()
  })

  it('should show full text when show more button is clicked', async () => {
    render(<ExpandableText text={longText} />)

    const showMoreButton = screen.getByRole('button', {name: /more/i})
    await userEvent.click(showMoreButton)
    
    expect(screen.getByText(longText)).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /less/i})).toBeInTheDocument()
  })

  it('should show full text when show more button is clicked', async () => {
    render(<ExpandableText text={longText} />)

    const showMoreButton = screen.getByRole('button', {name: /more/i})
    await userEvent.click(showMoreButton)
    const showLessButton = screen.getByRole('button', {name: /less/i})
    await userEvent.click(showLessButton)

    expect(screen.getByText(truncatedText)).toBeInTheDocument()
  })
})
