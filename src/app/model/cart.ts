  export interface CartItem {
    itemId: string; // Set to borrower uid
    catId: string;  // loan categotry Id
    price: number;  // price based on category
  }

  export interface ShoppingCart {
    items: Array<CartItem>;
    deliveryId: string;
    itemsTotal: number;
    updateTime: string;
  }

  export class ShoppingCartClass {
    public items = new Array<CartItem>();
    public deliveryId = '';
    public itemsTotal = 0;
    public updateTime  = new Date().toString();

    public getObject(): {} {
        return  {
                    'items'     : this.items,
                    'itemsTotal': this.itemsTotal,
                    'deliveryId': this.deliveryId,
                    'updateTime': this.updateTime,
                };
    }
/*
    public setAll(cart: ShoppingCart): void {
        if (cart.items.length !== 0) {
            this.items = cart.items;
            this.itemsTotal = this.calculateTotal(cart.items);
        } else {
            this.itemsTotal = 0;
        }
        if (cart.deliveryId) {
            this.deliveryId = cart.deliveryId;
        }
    }

    public calculateTotal(items: CartItem[]): number {
        let prices: number[];
        items.forEach(item => prices.push(item.price));
        return prices.reduce((a, b) => a + b, 0);
    }
*/
  }
