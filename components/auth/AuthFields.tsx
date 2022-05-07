import { View, Text, TextInput, Button } from "react-native";
import { showMessage } from "react-native-flash-message";

import { Typography, Forms, Base } from '../../styles';

export default function AuthFields({ auth, setAuth, title, submit, navigation}) {
    function validatePassword(text: string) {
        const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!\.-]).{4,}$/
        if (!text.match(pattern)) {
            showMessage({
                message: "Icke giltigt lösenord",
                description: "Lösenordet måste innehålla minst 4 tecken, små och stora bokstäver, siffror och ett specialtecken.",
                type: "warning",
            });
        }
    }

    function validateEmail(text: string) {
        if (!text.includes("@") || text.length < 5) {
            showMessage({
                message: "Icke giltig e-mail",
                description: "E-mail måste innehålla @ och minst fem tecken.",
                type: "warning",
            });
        }
    }
    return (
        <View style={Base.base}>
            <Text style={Typography.header2}>{title}</Text>
            <Text style={Typography.label}>E-post</Text>
            <TextInput
                style={Forms.input}
                onChangeText={(content: string) => {
                    validateEmail(content);
                    setAuth({ ...auth, email: content })
                }}
                value={auth?.email}
                keyboardType="email-address"
                autoCapitalize="none"
                testID="email-field"
            />
            <Text style={Typography.label}>Lösenord</Text>
            <TextInput
                style={Forms.input}
                onChangeText={(content: string) => {
                    validatePassword(content);
                    setAuth({ ...auth, password: content })
                }}
                value={auth?.password}
                secureTextEntry={true}
                autoCapitalize="none"
                testID="password-field"
            />
            <Button
                title={title}
                onPress={() => {
                    submit();
                }}
            />
            {title === "Logga in" &&
                <Button
                    title="Registrera istället"
                    onPress={() => {
                        navigation.navigate("Register");
                    }}
                />
            }
        </View>
    );
};
