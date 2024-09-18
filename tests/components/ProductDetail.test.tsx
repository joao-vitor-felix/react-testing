import { render, screen } from '@testing-library/react'
import ProductDetail from '../../src/components/ProductDetail'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'
import { db } from '../mocks/db'

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
    render(<ProductDetail productId={productId} />)
    expect(await screen.findByText(product!.name, { exact: false })).toBeInTheDocument()
    expect(await screen.findByText(`$${product!.price}`, { exact: false })).toBeInTheDocument()
  })

  it('should render loading message initially', () => {
    render(<ProductDetail productId={1} />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })  

  it('should render error message when there\'s no productId', () => {
    render(<ProductDetail productId={0} />)
    expect(screen.getByText(/invalid/i)).toBeInTheDocument()
  })  

  it('should render error message when fetch failed', async () => {
    server.use(
      http.get('/products/:id', async () => {
        return HttpResponse.error()
      }))
    render(<ProductDetail productId={24121} />)
    expect(await screen.findByText(/error/i)).toBeInTheDocument()
  })  

  it('should render not found message when product is not found', async () => {
    server.use(
    http.get('/products/:id', async () => {
      return HttpResponse.json(null, { status: 404 })
    }))
    render(<ProductDetail productId={24121} />)
    expect(await screen.findByText(/not found/i)).toBeInTheDocument()
  })  
})