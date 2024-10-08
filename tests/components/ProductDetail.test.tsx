import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import ProductDetail from '../../src/components/ProductDetail'
import { server } from '../mocks/server'
import { delay, http, HttpResponse } from 'msw'
import { db } from '../mocks/db'
import { Providers } from '../Providers'

describe('ProductDetail', () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  })

  it('should render product detail', async () => {
    const product = db.product.findFirst({ where: { id: { equals: productId }}})
    render(<ProductDetail productId={productId} />, { wrapper: Providers})
    expect(await screen.findByText(product!.name, { exact: false })).toBeInTheDocument()
    expect(await screen.findByText(`$${product!.price}`, { exact: false })).toBeInTheDocument()
  })

  it('should render loading message initially', async () => {
    server.use(http.get('/products/:id', async () => {
      await delay();
      return HttpResponse.json({ id: productId, name: 'Product 1', price: 100 });
    }));

   render(<ProductDetail productId={productId} />, { wrapper: Providers})
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  })

  it('should remove the loading indicator after data is fetched', async () => {
   render(<ProductDetail productId={productId} />, { wrapper: Providers});
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  })

  it('should remove the loading indicator if data fetching fails', async () => {
    server.use(http.get('/products/:id', () => HttpResponse.error()));
    
   render(<ProductDetail productId={productId} />, { wrapper: Providers});
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  })

  it('should render error message when fetch failed', async () => {
    server.use(http.get('/products/:id', () => HttpResponse.error()))
    render(<ProductDetail productId={0} />, { wrapper: Providers})
    expect(await screen.findByText(/error/i)).toBeInTheDocument()
  })  

  it('should render not found message when product is not found', async () => {
    server.use(
    http.get('/products/:id', async () => {
      return HttpResponse.json(null, { status: 404 })
    }))
    render(<ProductDetail productId={0} />, { wrapper: Providers})
    expect(await screen.findByText(/not found/i)).toBeInTheDocument()
  })  
})