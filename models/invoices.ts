import config from "../config/config.json";
import Invoice from "../interfaces/invoice";
import orderModel from "./orders";
import storage from "./storage";

const invoices = {
    addInvoice: async function addInvoice(invoiceObject: Partial<Invoice>) {
        let order = await orderModel.getOrder(invoiceObject.order_id);

        let changedOrder = {
            id: order.id,
            name: order.name,
            status_id: 600,
            api_key: config.api_key,
        };
        orderModel.updateOrder(changedOrder);

        let totalPrice = order.order_items.reduce((price, item) => {
            return price + item.amount * item.price;
        }, 0);

        let dueDate = new Date(invoiceObject.creation_date);
        dueDate.setDate(dueDate.getDate() + 30);

        invoiceObject.due_date = formatDate(dueDate);
        invoiceObject.total_price = totalPrice;
        invoiceObject.api_key = config.api_key;

        const tokenObject: any = await storage.readToken();

        try {
            await fetch(`${config.base_url}/invoices`, {
                body: JSON.stringify(invoiceObject),
                headers: {
                    'content-type': 'application/json',
                    'x-access-token': tokenObject.token,
                },
                method: 'POST'
            });
        } catch (error) {
            console.log("Could not add invoice", error)
        }
    },
    getInvoices: async function getInvoices():Promise<any> {
        const tokenObject: any = await storage.readToken();
        const response = await fetch(`${config.base_url}/invoices?api_key=${config.api_key}`,
        {
            headers: {
                'x-access-token': tokenObject.token,
            },
        });
        const result = await response.json();

        return result.data;
    },
};

function zeroPad(number: number): string {
    if (number < 10) {
        return "0" + number;
    }
    return "" + number;
}

function formatDate(date: Date): string {
    return `${date.getFullYear()}-${zeroPad(date.getMonth()+1)}-${zeroPad(date.getDate())}`;
}

export default invoices;
