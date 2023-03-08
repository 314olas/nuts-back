import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const headers = {
  "Access-Control-Allow-Headers" : "Content-Type",
  "Access-Control-Allow-Origin": process.env.ALLOW_ORIGIN,
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  "Content-Type": "application/json"
}

export const formatJSONResponse = (response: any, statusCode: number) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(response)
  }
}
