import { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet } from "react-native";

import MapView from 'react-native-maps';
import { Marker } from "react-native-maps";
import * as Location from 'expo-location';

import getCoordinates from "../../models/nominatim";
import { Base, Typography } from "../../styles";

export default function ShipOrder({ route }) {
    const {order} = route.params;
    const [marker, setMarker] = useState(null);
    const [locationMarker, setLocationMarker] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [shipRegion, setShipRegion] = useState(null);

    const map = useRef(null);

    useEffect(() => {
        (async () => {
            const results = await getCoordinates(`${order.address}, ${order.city}`);

            setMarker(<Marker
                coordinate={{ latitude: parseFloat(results[0].lat), longitude: parseFloat(results[0].lon) }}
                title={results[0].display_name}
                identifier="order"
            />);

            setShipRegion({
                latitude: parseFloat(results[0].lat),
                longitude: parseFloat(results[0].lon),
                latitudeDelta: 24,
                longitudeDelta: 0.1,
             })
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
    
            if (status !== "granted") {
                setErrorMessage("Permission to access location was denied");
                return;
            }
    
            const currentLocation = await Location.getCurrentPositionAsync({});
    
            setLocationMarker(<Marker
                coordinate={{
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude
                }}
                title="Min plats"
                pinColor="blue"
                identifier="my"
            />);
        })();
    }, []);

    function fitMarkers() {
        if (map?.current) {
          map.current.fitToSuppliedMarkers(["my", "order"], true);
        }
    }

    return (
        <View style={Base.base}>
            <Text style={Typography.header2}>Skicka order</Text>
            <Text>{order.name}</Text>
            <Text>{order.address}</Text>
            <Text>{order.zip} {order.city}</Text>
            <View style={Base.containerMap}>
                <MapView
                    ref={map}
                    style={styles.map}
                    onMapReady={fitMarkers}
                    onMapLoaded={fitMarkers}
                    initialRegion={shipRegion}
                >
                    {marker}
                    {locationMarker}
                </MapView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
