import {render, screen} from "@testing-library/react";
import Greet from "../../src/components/Greet";

describe("Greet", () => {
  it("should render Hello with the name when provided", () => {
    render(<Greet name="John" />);

    const heading = screen.getByRole("heading", { name: /john/i })
    expect(heading).toBeInTheDocument();
  })

  it("should render login button when name not provided", () => {
    render(<Greet />);

    const button = screen.getByRole("button", { name: /login/i })
    expect(button).toBeInTheDocument();
  })
})