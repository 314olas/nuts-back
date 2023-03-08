import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ProductStock } from "src/models/Products";

class ProductStockServece {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  async getAllStockItems(): Promise<ProductStock[]> {
    const result = await this.docClient
      .scan({
        TableName: this.tableName,
      })
      .promise();

    return result.Items as ProductStock[];
  }

  async getStockById(product_id: string): Promise<ProductStock> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: { product_id },
      })
      .promise();

    return result.Item as ProductStock;
  }

  async createProductStock(stockItem: ProductStock): Promise<ProductStock> {
    await this.docClient
      .put({
        TableName: this.tableName,
        Item: stockItem,
      })
      .promise();

    return stockItem;
  }

  async deleteStockItem(product_id: string) {
    return this.docClient
      .delete({
        TableName: this.tableName,
        Key: { product_id },
      })
      .promise();
  }
}

export default ProductStockServece;