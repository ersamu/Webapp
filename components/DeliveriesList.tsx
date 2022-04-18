import { useState, useEffect } from 'react';
import { ScrollView, Text, Button, View } from "react-native";

import deliveryModel from "../models/deliveries";
import { Base, Typography } from '../styles';

export default function DeliveriesList({ route, navigation }) {
    const { reload } = route.params || false;
    const [allDeliveries, setDeliveries] = useState([]);

    if (reload) {
        reloadDeliveries();
    }

    async function reloadDeliveries() {
        setDeliveries(await deliveryModel.getDeliveries());
        navigation.navigate("List", {reload: false});
    }

    useEffect(() => {
        reloadDeliveries();
    }, []);

    const listOfDeliveries = allDeliveries
    .map((delivery, index) => {
        if (delivery.amount == 0 ) {
            return <Text style={Typography.normal}
            key={index}>
            Det finns inga inleveranser.
            </Text>
        } else {
            return <Text style={Typography.normal}
            key={index}>
            Antal: {delivery.amount}{"\n"}
            Produkt: {delivery.product_name}{"\n"}
            Leveransdatum: {delivery.delivery_date}{"\n"}
            Kommentar: {delivery.comment}{"\n"}
            </Text>
        }
    });

    return (
        <ScrollView>
            <View style={Base.base}>
                <Text style={Typography.header2}>Inleveranser</Text>
                {listOfDeliveries}
                <Button
                    title="Ny inleverans"
                    onPress={() => {
                        navigation.navigate('Form');
                    }}
                />
            </View>
        </ScrollView>
    );
};
