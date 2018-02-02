  export interface CartItem {
    itemId: string; // Set to borrower uid
    catId: string;  // loan categotry Id
    price: number;  // price based on category
  }

  export interface ShoppingCart {
    items: Array<CartItem>;
    // items: {};
    // numOfItems: number;
    deliveryId: string;
    itemsTotal: number;
    upateTime: string;
  }

  export class ShoppingCartClass {
    public items = new Array<CartItem>();
    // public items = {};
    // public numOfItems = 0;
    public deliveryId = '';
    public itemsTotal = 0;
    public updateTime  = new Date().toString();

    public getObject(): {} {
        return  {
                    'cart': {
                        'items'     : this.items,
                        'itemsTotal': this.itemsTotal,
                        'deliveryId': this.deliveryId,
                        'updateTime': this.updateTime,
                    }
                };
    }

    public setAll(cart: ShoppingCart): void {
        if (cart.items.length !== 0) {
            this.items = cart.items;
            this.calculateTotal(this.items);
        }
        if (cart.deliveryId) {
            this.deliveryId = cart.deliveryId;
        }
    }

    private calculateTotal(items: CartItem[]): number {
        let prices: number[];
        items.forEach(item => prices.push(item.price));
        return prices.reduce((a, b) => a + b, 0);
    }

  }
