import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { products } from 'src/mockData';

import schema from './schema';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const id = event.pathParameters.id;

  const product = products.find(product => product.id === id)

  if (product) {
    return formatJSONResponse(product, 200);
  }

  return formatJSONResponse({message: 'Product does not exist'}, 204)

};

export const main = middyfy(getProductById);
