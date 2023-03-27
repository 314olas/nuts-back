import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productsService } from '@db/services';

import schema from './schema';

const getAllProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const products = await productsService.getAllPosts();
    return formatJSONResponse(products, 200);
  } catch (err) {
    formatJSONResponse({message: err}, 400);
  }
};

export const main = middyfy(getAllProducts);
