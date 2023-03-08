export interface Product {
  id: string,
  title: string,
  description: string,
  price: number,
};

export interface ProductStock {
  product_id: string,
  count: number
}