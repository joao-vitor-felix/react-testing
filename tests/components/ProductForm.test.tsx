import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import { Providers } from "../Providers";
import { db } from "../mocks/db";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

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
    const onSubmit = vi.fn();
    render(
      <>
        <ProductForm onSubmit={onSubmit} product={product} />
        <Toaster />
      </>,
      {
        wrapper: Providers,
      }
    );

    const waitFormToAppear = async () => {
      await screen.findByRole("form");
      return {
        name: screen.getByPlaceholderText(/name/i),
        price: screen.getByPlaceholderText(/price/i),
        category: screen.getByRole("combobox", { name: /category/i }),
        submitButton: screen.getByRole("button", { name: /submit/i }),
      };
    };

    const fillFormIn = async (name?: string, price?: string) => {
      const form = await waitFormToAppear();

      if (name !== undefined) await userEvent.type(form.name, name);
      if (price !== undefined) await userEvent.type(form.price, price);

      await userEvent.tab();
      await userEvent.click(form.category);
      const options = screen.getAllByRole("option");
      await userEvent.click(options[0]);
      await userEvent.click(form.submitButton);

      return form;
    };

    const expectErrorToBeInTheDocument = (errorMessage: RegExp) => {
      const error = screen.getByRole("alert");
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(errorMessage);
    };

    return {
      waitFormToAppear,
      fillFormIn,
      expectErrorToBeInTheDocument,
      onSubmit,
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
      const { fillFormIn, expectErrorToBeInTheDocument } = renderComponent();

      await fillFormIn("name", price);
      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it("should call onSubmit with form values when submit button is clicked", async () => {
    const { fillFormIn, onSubmit } = renderComponent();

    await fillFormIn(product.name, product.price.toString());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expect(onSubmit).toHaveBeenCalledWith({
      name: product.name,
      price: product.price,
      categoryId: category.id,
    });
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("should show error toast when form submission fails", async () => {
    const { fillFormIn, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue({});
    await fillFormIn(product.name, product.price.toString());

    const toast = await screen.findByRole("status");
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/error/i);
  });

  it("should disable submit button when submitting", async () => {
    const { fillFormIn, onSubmit } = renderComponent();
    onSubmit.mockReturnValue(new Promise(() => {}));
    const form = await fillFormIn(product.name, product.price.toString());

    await userEvent.click(form.submitButton);
    expect(form.submitButton).toBeDisabled();
  });

  it("should re-enable the submit button after submission", async () => {
    const { fillFormIn, onSubmit } = renderComponent();
    onSubmit.mockResolvedValue({});
    const form = await fillFormIn(product.name, product.price.toString());
    await userEvent.click(form.submitButton);

    expect(form.submitButton).not.toBeDisabled();
  });

  it("should re-enable the submit button after submission", async () => {
    const { fillFormIn, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue("error");
    const form = await fillFormIn(product.name, product.price.toString());
    await userEvent.click(form.submitButton);

    expect(form.submitButton).not.toBeDisabled();
  });
});
