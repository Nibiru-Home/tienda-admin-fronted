export interface OrderItem {
    id: number;
    quantity: number;
    productId: number;
    productName: string;
    unitPrice: number;
    subtotal: number;
}

export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    total: number;
    date: string | number;
    status: string;
    cartId: number | null;
    items: OrderItem[];
}
