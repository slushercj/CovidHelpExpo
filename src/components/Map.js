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
                latitude: 32.7157,
                longitude: 117.1611,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121
            }}
        >
            <MapView.Marker
                coordinate={{
                    latitude: 32.7157,
                    longitude: 117.1611,
                }}
                title={"Title 1"}
                description={"Description 1"}
            />
            <MapView.Marker
                coordinate={{
                    latitude: 32.7157,
                    longitude: 117.1611,
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