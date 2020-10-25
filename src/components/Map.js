import React, { useState, useEffect } from 'react';
import MapView, { Marker, Callout, CalloutSubview } from 'react-native-maps';
import { View, Text, StyleSheet, Dimensions, Image, Button, Platform, Linking } from 'react-native';
import * as Location from 'expo-location';
import MapViewDirections from '../MapViewDirections';

const height = Dimensions.get('window');

const Map = () => {
    const [location, setLocation] = useState({ coords: { latitude: 0, longitude: 0 } });
    const [errorMsg, setErrorMsg] = useState(null);
    const markers = [
        {
            "title": "Chula Vista Aquatica San Diego",
            "address": "2052 Entertainment Cir, Chula Vista, CA 91911",
            "coordinates": {
                "latitude": 32.5873404,
                "longitude": -117.0107804
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "Mar Vista High School",
            "address": "505 Elm Avenue, Imperial Beach, CA 91932",
            "coordinates": {
                "latitude": 32.5792622,
                "longitude": -117.1218399
            },
            url: null,
        },
        {
            "title": "Chula Vista (Old Sears building)",
            "address": "565 Broadway, Chula Vista, CA 91910",
            "coordinates": {
                "latitude": 32.6310051,
                "longitude": -117.0836367
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "St. Anthony's of Padua Parking Lot",
            "address": "410 W 18th St, National City, CA 91950",
            "coordinates": {
                "latitude": 32.6656983,
                "longitude": -117.1080542
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "Kimball Senior Center",
            "address": "1221 D Ave, National City, CA 919150",
            "coordinates": {
                "latitude": 32.6730326,
                "longitude": -117.1008332
            },
            url: "https://lhi.care/covidtesting",
        },
        {
            "title": "Euclid Health Center",
            "address": "292 Euclid Avenue, San Diego, CA 92114",
            "coordinates": {
                "latitude": 32.707314,
                "longitude": -117.0860519
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "Tubman-Chavez Community Center",
            "address": "415 Euclid Ave, San Diego, CA 92114",
            "coordinates": {
                "latitude": 32.7099393,
                "longitude": -117.0846946
            },
            url: null,
        },
        {
            "title": "County Fire - Spring Valley County Library",
            "address": "836 Kempton St, Spring Valley, CA 91977",
            "coordinates": {
                "latitude": 32.7121974,
                "longitude": -117.0023237
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "The San Diego LGBT Community Center",
            "address": "3909 Centre St, San Diego, CA, 92103",
            "coordinates": {
                "latitude": 32.7488891,
                "longitude": -117.1476567
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "The San Diego LGBT Community Center",
            "address": "11555 Via Rancho San Diego, El Cajon, CA 92019",
            "coordinates": {
                "latitude": 32.7491196,
                "longitude": -116.9289217
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "San Diego State University Parking Lot 17B",
            "address": "6200 Alvarado Road, San Diego, CA 92120",
            "coordinates": {
                "latitude": 32.77919582623916,
                "longitude": -117.06425353362494
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "County Fire - Jamul/Deerhorn Jamul Intermediate School",
            "address": "14545 Lyons Valley Road, Jamul, CA 91935",
            "coordinates": {
                "latitude": 32.7283233,
                "longitude": -116.8546311
            },
            url: null
        },
        {
            "title": "University of San Diego (USD) Parking Lot",
            "address": "5998 Alcala Park, San Diego, CA 92110",
            "coordinates": {
                "latitude": 32.7707449,
                "longitude": -117.1920641
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "Assessor Recorder County Clerk Building",
            "address": "200 South Magnolia Ave, El Cajon, CA 92020",
            "coordinates": {
                "latitude": 32.7936558,
                "longitude": -116.9627345
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "Sycuan Market",
            "address": "4915 Dehesa Rd, El Cajon CA 92019",
            "coordinates": {
                "latitude": 32.78790014162771,
                "longitude": -116.84520434908
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "Pacific Beach Taylor Branch Library",
            "address": "4275 Cass Street, San Diego, CA 92109",
            "coordinates": {
                "latitude": 32.7942657,
                "longitude": -117.2498942
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "County Fire - Lakeside Library",
            "address": "9839 Vine St, Lakeside, CA 92040",
            "coordinates": {
                "latitude": 32.8587313,
                "longitude": -116.9204957
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "Mira Mesa Senior Center",
            "address": "8460 Mira Mesa Blvd. San Diego, CA 92126",
            "coordinates": {
                "latitude": 32.9133438,
                "longitude": -117.140488
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "County Fire - Ramona Library",
            "address": "1275 Main Street, Ramona, CA 92065",
            "coordinates": {
                "latitude": 33.0398629,
                "longitude": -116.8732471
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "California Center for the Arts, Escondido Center Theater",
            "address": "260 N. Escondido Blvd, Escondido CA, 92025",
            "coordinates": {
                "latitude": 33.12194383887574,
                "longitude": -117.08513086368667
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "County Fire - Valley Center Elementary",
            "address": "28751 Cole Grade Rd, Valley Center, CA 92082",
            "coordinates": {
                "latitude": 33.235957,
                "longitude": -117.0216908
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "North Coastal Live Well Health Center",
            "address": "1701 Mission Ave, Oceanside, CA 92058",
            "coordinates": {
                "latitude": 33.2024883,
                "longitude": -117.3664611
            },
            url: "https://covidtest.sandiegocounty.gov/healthbook",
        },
        {
            "title": "Cal State University San Marcos, Viasat Engineering Pavilion",
            "address": "333 S. Twin Oaks Valley Rd, San Marcos, CA 92078",
            "coordinates": {
                "latitude": 33.1285209,
                "longitude": -117.1626994
            },
            url: null,
        },
        {
            "title": "San Ysidro Border Test Site",
            "address": "795 E. San Ysidro Blvd, San Ysidro, CA 92173",
            "coordinates": {
                "latitude": 32.5436704,
                "longitude": -117.0286176
            },
            url: null,
        },
        {
            "title": "Jacob Center",
            "address": "404 Euclid Ave. San Diego, CA",
            "coordinates": {
                "latitude": 32.7092293,
                "longitude": -117.0876539
            },
            url: null,
            "isFoodDist": true
        },
        {
            "title": "Food Center #2",
            "address": "6601 Imperial Ave. San Diego, CA",
            "coordinates": {
                "latitude": 32.7104482,
                "longitude": -117.0559976
            },
            url: null,
            "isFoodDist": true
        },
        {
            "title": "Food Center #3",
            "address": "7373 Tooma St. San Diego, CA",
            "coordinates": {
                "latitude": 32.6807999,
                "longitude": -117.03558
            },
            url: null,
            "isFoodDist": true
        }
    ];

    const GOOGLE_MAPS_APIKEY = 'AIzaSyALxVcQZDG7p4qh_89RmPJ8pguo-mtYyRI';

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied.');
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    return (

        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={Platform.OS === 'android' ? styles.androidHeader : styles.iosHeader}>Covid Help</Text>
            </View>
            <MapView
                style={styles.map}
                showsUserLocation
                zoomEnabled
                zoomControlEnabled
                followsUserLocation
                region={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: .15,
                    longitudeDelta: .15
                }}
            >
                {markers.map(marker => (
                    <Marker
                        key={marker.address}
                        title={marker.title}
                        coordinate={marker.coordinates}
                        description={marker.address}
                        pinColor={marker.isFoodDist ? '#3300ff' : '#ff0000'}
                        onPress={() => { }}
                    >
                        <Callout tooltip style={{ minWidth: 300 }}>
                            <View style={styles.calloutStyle}>
                                <Text style={styles.calloutHeader}>{marker.title}</Text>
                                <Text style={styles.calloutAddress}>{marker.address}</Text>
                                <View style={styles.siteInfoContainer}>
                                    <Text style={styles.sitInfoText}>Walk-in  <Image source={require('../../assets/checkmark.png')} style={styles.icons} /></Text>
                                    <Text style={styles.sitInfoText}>Appointment Needed  <Image source={require('../../assets/checkmark.png')} style={styles.icons} /></Text>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <Button
                                        title={marker.url ? 'Set Appointment' : 'No Appointment Required'}

                                        style={styles.buttonStyle}
                                        onPress={
                                            marker.url != null ?
                                                null : null
                                        }></Button>
                                    <Button title='Navigate' style={styles.buttonStyle}></Button>
                                </View>
                            </View>
                        </Callout>
                    </Marker>
                ))}
                {/* <MapViewDirections
                    origin={location?.coordinates[0]}
                    destination={location?.coordinates}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={3}
                    strokeColor="hotpink"
                    onReady={this.onReady}
                    onError={this.onError}
                /> */}
            </MapView>
        </View >
    )
}

const styles = StyleSheet.create({
    map: {
        height: '100%',
        width: '100%',
    },
    icons: {
        width: 20,
        height: 20,
        tintColor: 'green'
    },
    headerContainer: {
        padding: 20,
        backgroundColor: '#0000'
    },
    iosHeader: {
        fontSize: 40,
        color: '#444',
        textShadowColor: '#000000',
        textShadowOffset: {
            height: 1,
            width: 1,
        },
        textShadowRadius: 2,
        shadowOpacity: 0.3
    },
    androidHeader: {
        fontSize: 40,
        color: '#444',
        textShadowColor: '#000000',
        textShadowOffset: {
            height: -1,
            width: -1,
        },
        textShadowRadius: 6,
        shadowOpacity: .1
    },
    container: {
        alignItems: 'center'
    },
    calloutStyle: {
        flex: -1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderColor: '#777777',
        borderRadius: 10,
        borderWidth: 1,
    },
    calloutHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 10,
        marginRight: 10,
    },
    calloutAddress: {
        fontSize: 15,
        marginLeft: 5,
        marginRight: 5,
    },
    buttonStyle: {
        fontSize: 8
    },
    siteInfoContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginTop: 10,
        padding: 5,
        width: '100%',
    },
    siteInfoText: {
        marginRight: 5
    },
    buttonContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginTop: 10,
        padding: 5,
        width: '100%',
        borderTopWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#777777',
        borderStyle: 'solid',
        backgroundColor: '#ffffff',
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10
    }
})

export default Map;