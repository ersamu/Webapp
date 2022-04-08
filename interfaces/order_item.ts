export default interface OrderItem {
    product_id: number,
    amount: number,
    article_number: string,
    name: string,
    description: string,
    specifiers: object,
    stock: number,
    location: string,
    price: number,
};
