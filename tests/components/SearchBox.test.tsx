import { render, screen } from '@testing-library/react'
import SearchBox from '../../src/components/SearchBox'
import userEvent from '@testing-library/user-event'

describe('SearchBox', () => {
  function renderComponent (){
    const onChange = vi.fn()
    render(<SearchBox onChange={onChange}/>)

    return {
      input: screen.getByRole('textbox'),
      onChange
    }
  }

  it('should render properly', () => {
    const { input } = renderComponent()
    expect(input).toBeInTheDocument()
  })

  it('should call on change function when enter is pressed', async () => {
    const search = 'Cachorro'
    const { input, onChange } = renderComponent()
    
    await userEvent.type(input, `${search}{enter}`)
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith(search)
  })

  it('should not call on change function when enter is pressed without a value', async () => {
    const { input, onChange } = renderComponent()
    
    await userEvent.type(input, `{enter}`)
    expect(onChange).not.toHaveBeenCalled()
  })
})