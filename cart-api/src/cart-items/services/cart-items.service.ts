import { Injectable } from '@nestjs/common';
import { CartItem } from 'src/cart/models';
import { poolQuery } from 'src/database';

import { v4 } from 'uuid';

@Injectable()
export class CartItemsService {
  async getCartItemsByCartId(userId: string): Promise<CartItem[]> {
    const query = `SELECT * FROM carts c LEFT JOIN cart_items ci ON c.id = ci.cart_id where user_id='${userId}'`;

    const cartByUserID = await poolQuery(query);

    return cartByUserID.rows;
  }

  async addItemToCart(userId: string, item: CartItem) {
    const id = v4(v4());
    const cartsItemQuery = `INSERT INTO cart_items (cart_id, product_id, count) VALUES ('${id}', '${item.product.id}', ${item.count}) RETURNING *;`;
    const cartsQuery = `INSERT INTO carts (id, user_id, created_at, updated_at, status ) VALUES ('${id}', '${userId}', '2022-01-04','2022-01-04', 'OPEN');`;

    const newCartItem = await poolQuery(cartsQuery + cartsItemQuery);

    if (!!newCartItem) {
      return null;
    }

    return newCartItem.rows[0];
  }

  async removeCartIemById(cartId: string) {
    const cartItems = await poolQuery(
      `DELETE FROM cart_items WHERE cart_id='${cartId}' RETURNING *; DELETE FROM carts WHERE id='${cartId}' RETURNING *`,
    );

    return cartItems.rows;
  }
}
