import {  } from "@serverless/typescript";
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const origin = "https://d2w4kj23aei0p4.cloudfront.net"

const headers = {
  "Access-Control-Allow-Headers" : "Content-Type",
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
}

export const formatJSONResponse = (response: any, statusCode: number) => {
  return {
    statusCode: statusCode,
    headers,
    body: JSON.stringify(response)
  }
}
