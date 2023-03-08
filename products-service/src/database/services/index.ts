import createDynamoDBClient from "../db";
import ProductsService from "./productsService";
import ProductStockServece from "./productStockServece";

const {PRODUCTS_TABLE, PRODUCTS_STOCK_TABLE} = process.env;

const productsService = new ProductsService(createDynamoDBClient(), PRODUCTS_TABLE);
const productsStockService = new ProductStockServece(createDynamoDBClient(), PRODUCTS_STOCK_TABLE)

export {productsService, productsStockService};