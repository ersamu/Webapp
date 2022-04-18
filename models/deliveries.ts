import config from "../config/config.json";
import Delivery from "../interfaces/delivery";

const deliveries = {
    addDelivery: async function addDelivery(delivery: Partial<Delivery>) {
        try {
            delivery.api_key = config.api_key;

            await fetch(`${config.base_url}/deliveries`, {
                body: JSON.stringify(delivery),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST'
            });
        } catch (error) {
            console.log("Could not add delivery", error)
        }
    },
    getDeliveries: async function getDeliveries() {
        const response = await fetch(`${config.base_url}/deliveries?api_key=${config.api_key}`);
        const result = await response.json();

        return result.data;
    },
};

export default deliveries;
