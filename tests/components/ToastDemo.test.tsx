import { render, screen } from '@testing-library/react'
import ToastDemo from '../../src/components/ToastDemo'
import userEvent from '@testing-library/user-event'
import { Toaster } from 'react-hot-toast'


describe('ToastDemo', () => {
  it('should show toast when button is clicked', async () => {
    render(
    <>
      <ToastDemo />
      <Toaster />
    </>)
    
    const button = screen.getByRole('button', { name: /show/i })
    await userEvent.click(button)
    await screen.findByText(/success/i)
  })
})