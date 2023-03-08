import type {AWS} from '@serverless/typescript'

const dynamoResouses: AWS['resources']['Resources'] = {
    productsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
            TableName: process.env.PRODUCTS_TABLE,
            AttributeDefinitions: [
                {
                AttributeName: 'id',
                AttributeType: 'S',
                }
            ],
            KeySchema: [
                {
                AttributeName: 'id',
                KeyType: 'HASH',
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            },
        }
    },
    productsStockTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
            TableName: process.env.PRODUCTS_STOCK_TABLE,
            AttributeDefinitions: [
                {
                AttributeName: 'id',
                AttributeType: 'S',
                }
            ],
            KeySchema: [
                {
                AttributeName: 'id',
                KeyType: 'HASH',
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            },
        }
    }
}

export default dynamoResouses