import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import { Providers } from "../Providers";
import { db } from "../mocks/db";
import userEvent from "@testing-library/user-event";

describe("ProductForm", () => {
  let category: Category;
  let product: Product;

  beforeAll(() => {
    category = db.category.create();
    product = db.product.create({ categoryId: category.id });
  });

  afterAll(() => {
    db.category.delete({
      where: {
        id: {
          equals: category.id,
        },
      },
    });
    db.product.delete({
      where: {
        id: {
          equals: product.id,
        },
      },
    });
  });

  const renderComponent = (product?: Product) => {
    render(<ProductForm onSubmit={vi.fn()} product={product} />, {
      wrapper: Providers,
    });

    return {
      waitFormToAppear: async () => {
        await screen.findByRole("form");

        return {
          name: screen.getByPlaceholderText(/name/i),
          price: screen.getByPlaceholderText(/price/i),
          category: screen.getByRole("combobox", { name: /category/i }),
          submitButton: screen.getByRole("button", { name: /submit/i }),
        };
      },
    };
  };

  it("should render form fields", async () => {
    const { waitFormToAppear } = renderComponent();

    const inputs = await waitFormToAppear();

    expect(inputs.name).toBeInTheDocument();
    expect(inputs.price).toBeInTheDocument();
    expect(inputs.category).toBeInTheDocument();
  });

  it("should render with initial values", async () => {
    const { waitFormToAppear } = renderComponent(product);

    const inputs = await waitFormToAppear();

    expect(inputs.name).toHaveDisplayValue(new RegExp(product.name, "i"));
    expect(inputs.name).toHaveValue(product.name);
    expect(inputs.price).toHaveDisplayValue(
      new RegExp(product.price.toString(), "i")
    );
    expect(inputs.price).toHaveValue(product.price.toString());
    expect(inputs.category).toHaveTextContent(new RegExp(category.name, "i"));
  });

  it("should render name input with focus", async () => {
    const { waitFormToAppear } = renderComponent();

    const { name } = await waitFormToAppear();

    expect(name).toHaveFocus();
  });

  it.each([
    {
      scenario: "price is not provided",
      errorMessage: /required/i,
    },
    {
      scenario: "0 is provided as price",
      errorMessage: /greater than/,
      price: "0",
    },
    {
      scenario: "price higher than 1000",
      errorMessage: /less than/i,
      price: "1001",
    },
  ])(
    "should show an error message when $scenario",
    async ({ errorMessage, price }) => {
      const { waitFormToAppear } = renderComponent();

      const form = await waitFormToAppear();
      if (price !== undefined) await userEvent.type(form.price, price);

      await userEvent.type(form.name, "name");
      await userEvent.click(form.category);
      const options = screen.getAllByRole("option");
      await userEvent.click(options[0]);
      await userEvent.click(form.submitButton);
      const error = screen.getByRole("alert");
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(errorMessage);
    }
  );
});
