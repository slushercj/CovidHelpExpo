import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';

const height = Dimensions.get('window');
const Map = () => {
    return (
        <MapView
            style={styles.map}
            loadingEnabled={true}
            region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121
            }}
        >
            <MapView.Marker
                coordinate={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                }}
                title={"Title 1"}
                description={"Description 1"}
            />
            <MapView.Marker
                coordinate={{
                    latitude: 37.78925,
                    longitude: -122.4324,
                }}
                title={"Title 1"}
                description={"Description 1"}
            />
        </MapView>
    )
}

const styles = StyleSheet.create({
    map: {
        height: '100%'
    }
})

export default Map;