import { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from "./components/Home.tsx";
import Pick from "./components/Pick.tsx";
import Deliveries from "./components/Deliveries";
import { Base } from "./styles/index.js";

const routeIcons = {
  "Lager": "home",
  "Plock": "list",
  "Inleveranser": "car-outline",
};

const Tab = createBottomTabNavigator();

export default function App() {
  const [products, setProducts] = useState([]);

  return (
    <SafeAreaView style={Base.container}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName = routeIcons[route.name] || "alert";
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}
        >
          <Tab.Screen name="Lager">
            {() => <Home products={products} setProducts={setProducts}/>}
          </Tab.Screen>
          <Tab.Screen name="Plock">
            {() => <Pick setProducts={setProducts}/>}
          </Tab.Screen>
          <Tab.Screen name="Inleveranser">
            {() => <Deliveries setProducts={setProducts}/>}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

