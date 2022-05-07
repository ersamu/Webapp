import { useState, useEffect } from 'react';
import { Platform, ScrollView, Text, TextInput, Button, View } from "react-native";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { showMessage } from "react-native-flash-message";

import { Base, Typography, Forms} from "../styles";
import Delivery from "../interfaces/delivery";
import deliveryModel from "../models/deliveries";
import productModel from "../models/products";

export default function DeliveryForm({ navigation, setProducts }) {
    const [delivery, setDelivery] = useState<Partial<Delivery>>({});
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

    function formIsValid() {
        if (Object.prototype.hasOwnProperty.call(delivery, "product_id")
            && Object.prototype.hasOwnProperty.call(delivery, "amount")
            && Object.prototype.hasOwnProperty.call(delivery, "delivery_date")) {
                return "success";
            }
        return "error";
    }

    function amountIsValid(amount: string) {
        if (!(parseInt(amount) > 0)) {
            showMessage({
                message: "Antal inte giltigt",
                description: "Antal måste vara större än 0",
                type: "warning",
            })
        }
    }

    async function addDelivery() {
        if (formIsValid() === "success" && delivery.amount > 0) {
            const result = await deliveryModel.addDelivery(delivery);

            showMessage({
                message: result.title,
                description: result.message,
                type: result.type,
            });

            const updatedProduct = {
                ...currentProduct,
                stock: (currentProduct.stock || 0) + (delivery.amount || 0)
            };

            await productModel.updateProduct(updatedProduct);
            setProducts(await productModel.getProducts());

            navigation.navigate("List", { reload: true });
        } else {
            showMessage({
                message: "Saknas information",
                description: "Du måste fylla i produkt, antal (större än 0) och leveransdatum.",
                type: "warning",
            });
        }
    }

    return (
        <ScrollView style={Base.base}>
            <Text style={Typography.header2}>Ny inleverans</Text>

            <Text style={Typography.label}>Produkt</Text>
                <ProductDropDown
                delivery={delivery}
                setDelivery={setDelivery}
                setCurrentProduct={setCurrentProduct}
            />

            <Text style={Typography.label}>Antal</Text>
            <TextInput
                style={Forms.input}
                onChangeText={(content: string) => {
                    amountIsValid(content);
                    setDelivery({ ...delivery, amount: parseInt(content)});
                }}
                value={delivery?.amount?.toString()}
                keyboardType="numeric"
            />

            <Text style={Typography.label}>Leveransdatum</Text>
            <Text>Datum: {delivery.delivery_date}</Text>
            <DateDropDown
                delivery={delivery}
                setDelivery={setDelivery}
            />

            <Text style={Typography.labelExtra}>Kommentar</Text>
            <TextInput
                style={Forms.input}
                onChangeText={(content: string) => {
                    setDelivery({ ...delivery, comment: content});
                }}
                value={delivery?.comment}
            />

            <Button
                title="Gör inleverans"
                onPress={() => {
                    addDelivery();
                }}
            />
        </ScrollView>
    )
}

function ProductDropDown(props) {
    const [products, setProducts] = useState<Product[]>([]);
    let productsHash: any = {};

    useEffect(async () => {
        setProducts(await productModel.getProducts());
    }, []);

    const itemsList = products.map((prod, index) => {
        productsHash[prod.id] = prod;
        return <Picker.Item key={index} label={prod.name} value={prod.id} />;
    });

    return (
        <Picker
            selectedValue={props.delivery?.product_id}
            onValueChange={(itemValue) => {
                props.setDelivery({ ...props.delivery, product_id: itemValue });
                props.setCurrentProduct(productsHash[itemValue]);
            }}>
            {itemsList}
        </Picker>
    );
}

function DateDropDown(props) {
    const [dropDownDate, setDropDownDate] = useState<Date>(new Date());
    const [show, setShow] = useState<Boolean>(false);

    const showDatePicker = () => {
        setShow(true);
    };

    return (
        <View>
            {Platform.OS === "android" && (
                <Button onPress={showDatePicker} title="Visa datumväljare" />
            )}
            {(show || Platform.OS === "ios") && (
                <DateTimePicker
                    onChange={(event, date) => {
                        setDropDownDate(date);

                        props.setDelivery({
                            ...props.delivery,
                            delivery_date: date.toLocaleDateString('se-SV'),
                        });

                        setShow(false);
                    }}
                    value={dropDownDate}
                />
            )}
        </View>
    );
}
