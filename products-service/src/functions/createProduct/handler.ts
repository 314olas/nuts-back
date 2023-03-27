import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productsService, productsStockService } from '@db/services';

import schema from './schema';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { description, price, title, count } = event.body;

  try {
    const product = await productsService.createProduct({
      description,
      price,
      title
    });
    const productStock = await productsStockService.createProductStock({
      count,
      product_id: product.id
    })
    return formatJSONResponse({...product, count: productStock.count}, 200);
  } catch (err) {
    formatJSONResponse({message: err}, 400);
  }
};

export const main = middyfy(createProduct);
