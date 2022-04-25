import { useState, useEffect } from 'react';
import { ScrollView, Text, Button, View } from "react-native";
import { DataTable } from "react-native-paper";

import authModel from "../../models/auth";
import invoiceModel from "../../models/invoices";
import { Base, Typography } from '../../styles';

export default function InvoiceList({ route, navigation, setIsLoggedIn }) {
    const { reload } = route.params || false;
    const [allInvoices, setInvoices] = useState([]);

    if (reload) {
        reloadInvoices();
    }

    async function reloadInvoices() {
        setInvoices(await invoiceModel.getInvoices());
        navigation.navigate("List", {reload: false});
    }

    useEffect(() => {
        reloadInvoices();
    }, []);

    async function logOut() {
        await authModel.logout();
        setIsLoggedIn(false);
    }

    const invoicesRows = allInvoices
    .map((invoice, index) => {
        return (<DataTable.Row key={index}>
            <DataTable.Cell>{invoice.name}</DataTable.Cell>
            <DataTable.Cell numeric>{invoice.total_price}</DataTable.Cell>
            <DataTable.Cell>{invoice.due_date}</DataTable.Cell>
        </DataTable.Row>)
    });

    return (
        <ScrollView>
            <View style={Base.base}>
                <Text style={Typography.header2}>Fakturor</Text>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Namn</DataTable.Title>
                        <DataTable.Title>Pris</DataTable.Title>
                        <DataTable.Title>Förfallodatum</DataTable.Title>
                    </DataTable.Header>
                    {invoicesRows}
                </DataTable>
                <Button
                    title="Skapa ny faktura"
                    onPress={() => {
                        navigation.navigate('Form');
                    }}
                />
                <Button
                    title="Logga ut"
                    onPress={() => {
                        logOut();
                    }}
                />
            </View>
        </ScrollView>
    );
};
