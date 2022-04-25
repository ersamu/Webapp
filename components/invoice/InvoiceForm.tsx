import { useState, useEffect } from 'react';
import { Platform, ScrollView, Text, Button, View } from "react-native";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import Invoice from "../../interfaces/invoice";
import invoiceModel from "../../models/invoices";
import Order from "../../interfaces/order";
import orderModel from "../../models/orders";
import { Base, Typography} from "../../styles";

export default function InvoiceForm({ navigation }) {
    const [invoice, setInvoice] = useState<Partial<Invoice>>({});

    async function addInvoice() {
        await invoiceModel.addInvoice(invoice);
        navigation.navigate("List", { reload: true });
    }

    return (
        <ScrollView style={Base.base}>
            <Text style={Typography.header2}>Ny faktura</Text>

            <Text style={Typography.label}>Order</Text>
            <OrderDropDown
                invoice={invoice}
                setInvoice={setInvoice}
            />

            <Text style={Typography.label}>Faktura datum</Text>
            <Text>Datum: {invoice.creation_date}</Text>
            <DateDropDown
                invoice={invoice}
                setInvoice={setInvoice}
            />

            <Button
                title="Skapa faktura"
                onPress={() => {
                    addInvoice();
                }}
            />
        </ScrollView>
    )
}

function OrderDropDown(props) {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(async () => {
        setOrders(await orderModel.getOrders());
    }, []);

    const orderList = orders.filter(order => order.status === "Packad")
        .map((order, index) => {
            return <Picker.Item key={index} label={order.name} value={order.id} />;
    });

    return (
        <Picker
            selectedValue={props.invoice?.order_id}
            onValueChange={(itemValue) => {
                props.setInvoice({ ...props.invoice, order_id: itemValue });
            }}>
            {orderList}
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

                        props.setInvoice({
                            ...props.invoice,
                            creation_date: formatDate(date),
                        });

                        setShow(false);
                    }}
                    value={dropDownDate}
                />
            )}
        </View>
    );
}

function zeroPad(number: number): string {
    if (number < 10) {
        return "0" + number;
    }
    return "" + number;
}

function formatDate(date: Date): string {
    return `${date.getFullYear()}-${zeroPad(date.getMonth()+1)}-${zeroPad(date.getDate())}`;
}
