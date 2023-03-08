import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { randomUUID } from "crypto";
import { Product } from "src/models/Products";

class ProductsService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  async getAllPosts(): Promise<Product[]> {
    const result = await this.docClient
      .scan({
        TableName: this.tableName,
      })
      .promise();

    return result.Items as Product[];
  }

  async getProductById(id: string): Promise<Product> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: { id },
      })
      .promise();

    return result.Item as Product;
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const id = randomUUID();
    const productItem = {...product, id}

    await this.docClient
      .put({
        TableName: this.tableName,
        Item: productItem,
      })
      .promise();

    return productItem;
  }

  async deleteProduct(id: string) {
    return this.docClient
      .delete({
        TableName: this.tableName,
        Key: { id },
      })
      .promise();
  }
}

export default ProductsService;