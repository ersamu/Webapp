import { useState, useEffect } from 'react';
import { View, Text, Button } from "react-native";

import orderModel from "../../models/orders";
import { Base, Typography } from "../../styles";

export default function ShipList({ route, navigation }) {
    const { reload } = route.params || false;
    const [allOrders, setAllOrders] = useState([]);

    if (reload) {
        reloadOrders();
    }

    async function reloadOrders() {
        setAllOrders(await orderModel.getOrders());
        navigation.navigate("List", {reload: false});
    }

    useEffect(() => {
        reloadOrders();
    }, []);

    const listOfOrders = allOrders
        .filter(order => order.status_id >= 200)
        .map((order, index) => {
            return <Button
                title={order.name}
                key={index}
                onPress={() => {
                    navigation.navigate("Order", {
                        order: order
                    });
                }}
            />
        });

    return (
        <View style={Base.base}>
            <Text style={Typography.header2}>Ordrar redo att levereras</Text>
            {listOfOrders}
        </View>
    );
}
