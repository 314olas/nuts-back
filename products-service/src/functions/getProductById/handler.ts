import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productsService, productsStockService } from '@db/services';

import schema from './schema';
import { Iid } from 'src/models/Products';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const id: unknown = event.pathParameters.id;

  try {
    const product = await productsService.getProductById(id as Iid)
    const stockCount = await productsStockService.getStockById(id as Iid)

    if (!product) {
      return formatJSONResponse({message: 'Product is not found'}, 204)
    }

    if (!stockCount) {
      return formatJSONResponse({message: 'Stock is not found'}, 204)
    }

    return formatJSONResponse({...product, count: stockCount.count}, 200);
  } catch (err) {
    formatJSONResponse({message: err}, 400)
  }
};

export const main = middyfy(getProductById);
