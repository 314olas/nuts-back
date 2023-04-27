import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  HttpStatus,
} from '@nestjs/common';

import { AppRequest } from '../shared';
import { CartItemsService } from './services';

@Controller('api/profile/cart-items')
export class CartItemsController {
  constructor(private CartItemsService: CartItemsService) {}

  @Get()
  async getCartItemsByCartId(@Req() req: AppRequest) {
    try {
      const items = await this.CartItemsService.getCartItemsByCartId(
        String(req.query.userId),
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { items },
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'NOT FOUND',
      };
    }
  }

  @Delete()
  async removeCartIemById(@Req() req: AppRequest) {
    try {
      console.log(req.query.cartId);
      const cartItems = await this.CartItemsService.removeCartIemById(
        String(req.query.cartId),
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: cartItems,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'error',
      };
    }
  }

  @Put()
  async addItemToCart(@Req() req: AppRequest, @Body() body) {
    try {
      console.log(req.query.userId, JSON.parse(body), req);

      await this.CartItemsService.addItemToCart(
        String(req.query.userId),
        JSON.parse(body),
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error,
      };
    }
  }
}
