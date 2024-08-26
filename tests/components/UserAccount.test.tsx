import { render, screen } from '@testing-library/react'
import UserAccount from '../../src/components/UserAccount'
import { User } from '../../src/entities'

function renderComponent(isAdmin?: boolean) {
  const user: User = {
    id: 3,
    name: "John",
    isAdmin
  }

  render(<UserAccount user={user} />)
  const name = screen.getByText(RegExp(`${user.name}`, "i"))
  const button = screen.queryByRole("button", { name: /edit/i})

  return { name, button }
}

describe('UserAccount', () => {
  it('should render user name', () => {
  const { name } =  renderComponent()
  expect(name).toBeInTheDocument()
  })

  it('should render edit button when user is admin', () => {
  const { button } =  renderComponent(true)
  expect(button).toBeInTheDocument()
  })

  it('should not render edit button when user is not admin', () => {
    const { button } =  renderComponent()
    expect(button).not.toBeInTheDocument()
  })
})