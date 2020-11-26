import _ from 'lodash';
import MapView, { Marker, Callout } from 'react-native-maps';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Button, Platform, Linking } from 'react-native';
import * as Location from 'expo-location';
import { OpenMapDirections } from 'react-native-navigation-directions';
import Amplify, { Analytics, Logger } from 'aws-amplify';
import { AppLoading } from 'expo';
import { useFonts, Lora_400Regular } from '@expo-google-fonts/lora';

const { width, height } = Dimensions.get('window');

const Map = (props) => {

    let [fontsLoaded] = useFonts({
        Lora_400Regular
    });

    const [location, setLocation] = useState({ latitude: 32.78915, longitude: -117.0524 });
    const [currentMarker, setCurrentMarker] = useState(null);
    const mapRef = useRef(null);
    const maxTitleLength = 42;
    const header = "Covid Help";
    const subHeader = "FREE TESTING LOCATIONS";

    const [markers, setMarkers] = useState([
        {
            "address": "212 West Park Ave, San Ysidro, CA 92173",
            "appointment": "No appointment required",
            "hours": "Tuesday - Saturday: 7 AM - 7 PM",
            "latitude": 32.5548668,
            "longitude": -117.0443825,
            "title": "San Ysidro Civic Center",
            "isWalkIn": true,
            "isDriveUp": false,
            "isAppointmentAvailable": false,
            "isAppointmentRequired": false,
            "description": "This is a Walk-In testing site. No appointment necessary. Testing is free",
        },
        {
            "address": "2052 Entertainment Cir, Chula Vista, CA 91911",
            "appointment": "No appointment required",
            "hours": "Monday - Friday: 8:30 AM - 3:30 PM",
            "latitude": 32.5873404,
            "longitude": -117.0107804,
            "title": "Chula Vista Aquatica San Diego",
            "isWalkIn": false,
            "isDriveUp": true,
            "isAppointmentAvailable": false,
            "isAppointmentRequired": false,
            "description": "This is a Drive-Up testing site. No appointment necessary. Testing is free",
        },
        // {
        //     "address": "505 Elm Avenue, Imperial Beach, CA 91932",
        //     "appointment": "No appointment required",
        //     "hours": "Monday - Friday 8:30 AM - 3:30 PM",
        //     "latitude": 32.5792622,
        //     "longitude": -117.1218399,
        //     "title": "Mar Vista High School",
        //     "isWalkIn": false,
        //     "isDriveUp": true,
        //     "isAppointmentAvailable": false,
        //     "isAppointmentRequired": false,
        //     "description": "This is a Drive-Up testing site. No Appointments are required. Testing is free.",
        // },
        {
            "address": "565 Broadway, Chula Vista, CA 91910",
            "appointment": "https://lhi.care/covidtesting",
            "hours": "Tuesday - Saturday: 7 AM - 7 PM",
            "latitude": 32.6310051,
            "longitude": -117.0836367,
            "title": "Chula Vista (Old Sears building)",
            "isWalkIn": true,
            "isDriveUp": false,
            "isAppointmentAvailable": true,
            "isAppointmentRequired": false,
            "description": "This is a Walk-In testing site. Appointments Available but Not Required. Walk- Ins Welcome.Testing is free.",
        },
        {
            "address": "410 W 18th St, National City, CA 91950",
            "appointment": "https://covidtest.sandiegocounty.gov/healthbook",
            "hours": "Sunday: 9 AM - 2 PM",
            "latitude": 32.6656983,
            "longitude": -117.1080542,
            "title": "St. Anthony's of Padua Parking Lot",
            "isWalkIn": false,
            "isDriveUp": true,
            "isAppointmentAvailable": true,
            "isAppointmentRequired": true,
            "description": "This is a Drive-Up testing site. Appointments are required. Testing is free.",
        },
        {
            "address": "1221 D Ave, National City, CA 919150",
            "appointment": "https://lhi.care/covidtesting",
            "hours": "Tuesday - Saturday: 7 AM - 7 PM",
            "latitude": 32.6730326,
            "longitude": -117.1008332,
            "title": "Kimball Senior Center",
            "isWalkIn": true,
            "isDriveUp": false,
            "isAppointmentAvailable": true,
            "isAppointmentRequired": false,
            "description": "This is a Walk-In testing site.Appointments Available but Not Required. Walk- Ins Welcome.Testing is free.",
        },
        {
            "address": "292 Euclid Avenue, San Diego, CA 92114",
            "appointment": "https://covidtest.sandiegocounty.gov/healthbook",
            "hours": "Saturday: 8:30 AM - 3:30 PM",
            "latitude": 32.707314,
            "longitude": -117.0860519,
            "title": "Euclid Health Center",
            "isWalkIn": false,
            "isDriveUp": true,
            "isAppointmentAvailable": true,
            "isAppointmentRequired": true,
            "description": "This is a Drive-Up testing site. Appointments are required. Testing is free.",
        },
        {
            "address": "415 Euclid Ave, San Diego, CA 92114",
            "appointment": "No appointment required",
            "hours": "Monday - Sunday: 8:30 AM - 5:30PM",
            "latitude": 32.7099393,
            "longitude": -117.0846946,
            "title": "Tubman-Chavez Community Center",
            "isWalkIn": true,
            "isDriveUp": false,
            "isAppointmentAvailable": false,
            "isAppointmentRequired": false,
            "description": "This is a Walk-In testing site. No appointment necessary. Testing is free.",
        },
        // {
        //     "address": "836 Kempton St, Spring Valley, CA 91977",
        //     "appointment": "https://covidtest.sandiegocounty.gov/healthbook",
        //     "hours": "Monday 8/10, Wednesday 8/12: 9 AM - 2 PM",
        //     "latitude": 32.7121974,
        //     "longitude": -117.0023237,
        //     "title": "County Fire - Spring Valley County Library",
        //     "isWalkIn": true,
        //     "isDriveUp": true,
        //     "isAppointmentAvailable": true,
        //     "isAppointmentRequired": false,
        //     "description": "This is a Drive-Up (Accepts Walk-ins) testing site. Appointments Available but Not Required. Walk- Ins Welcome",
        // },
        // {
        //     "address": "11555 Via Rancho San Diego, El Cajon, CA 92019",
        //     "appointment": "https://covidtest.sandiegocounty.gov/healthbook",
        //     "hours": "Saturday  8AM - 12 PM",
        //     "latitude": 32.7491196,
        //     "longitude": -116.9289217,
        //     "title": "County Fire - Rancho San Diego Library",
        //     "isWalkIn": true,
        //     "isDriveUp": true,
        //     "isAppointmentAvailable": true,
        //     "isAppointmentRequired": false,
        //     "description": "This is a Drive-Up (Accepts Walk-ins) testing site. Appointments Available but Not Required. Walk- Ins Welcome. Testing is free",
        // },
        // {
        //     "address": "14545 Lyons Valley Road, Jamul, CA 91935",
        //     "appointment": "No appointment required",
        //     "hours": "Tuesday 8/11: 9 AM - 2 PM",
        //     "latitude": 32.7283233,
        //     "longitude": -116.8546311,
        //     "title": "County Fire - Jamul/Deerhorn Jamul Intermediate School",
        //     "isWalkIn": true,
        //     "isDriveUp": true,
        //     "isAppointmentAvailable": true,
        //     "isAppointmentRequired": false,
        //     "description": "This is a Drive-Up (Accepts Walk-ins) testing site. Appointments Available but Not Required. Walk- Ins Welcome. Testing is free",
        // },
        {
            "address": "200 South Magnolia Ave, El Cajon, CA 92020",
            "appointment": "https://lhi.care/covidtesting",
            "hours": "Tuesday - Saturday: 7 AM - 7 PM",
            "latitude": 32.7936558,
            "longitude": -116.9627345,
            "title": "Assessor Recorder County Clerk Building",
            "isWalkIn": true,
            "isDriveUp": false,
            "isAppointmentAvailable": true,
            "isAppointmentRequired": false,
            "description": "This is a Walk-In testing site. Appointments Available but Not Required. Walk- Ins Welcome",
        },
        {
            "address": "4915 Dehesa Rd, El Cajon CA 92019",
            "appointment": "https://covidtest.sandiegocounty.gov/healthbook",
            "hours": "Mon - Th: 8:30 AM - 12:00 PM and 1:00 - 3:30 PM",
            "latitude": 32.78790014162771,
            "longitude": -116.84520434908,
            "title": "Sycuan Market",
            "isWalkIn": false,
            "isDriveUp": true,
            "isAppointmentAvailable": true,
            "isAppointmentRequired": true,
            "description": "This is a Drive-Up testing site. Appointments are required. Testing is free.",
        },
        {
            "address": "8460 Mira Mesa Blvd. San Diego, CA 92126",
            "appointment": "https://covidtest.sandiegocounty.gov/healthbook",
            "hours": "Fridays: 9 AM - 3:30 PM",
            "latitude": 32.9133438,
            "longitude": -117.140488,
            "title": "Mira Mesa Senior Center",
            "isWalkIn": false,
            "isDriveUp": true,
            "isAppointmentAvailable": true,
            "isAppointmentRequired": true,
            "description": "This is a Drive-Up testing site. Appointments are required. Testing is free.",
        },
        {
            "address": "260 N. Escondido Blvd, Escondido CA, 92025",
            "appointment": "https://lhi.care/covidtesting",
            "hours": "Tuesday - Saturday: 7 AM - 7 PM",
            "latitude": 33.12194383887574,
            "longitude": -117.08513086368667,
            "title": "California Center for the Arts, Escondido Center Theater",
            "isWalkIn": true,
            "isDriveUp": false,
            "isAppointmentAvailable": true,
            "isAppointmentRequired": false,
            "description": "This is a Walk-In testing site. Appointments Available but Not Required. Walk- Ins Welcome. Testing is free",
        },
        {
            "address": "333 S. Twin Oaks Valley Rd, San Marcos, CA 92078",
            "appointment": "No appointment required",
            "hours": "Monday - Sunday: 8:30AM - 5:30 PM",
            "latitude": 33.1285209,
            "longitude": -117.1626994,
            "title": "Cal State University San Marcos, Viasat Engineering Pavilion",
            "isWalkIn": true,
            "isDriveUp": false,
            "isAppointmentAvailable": false,
            "isAppointmentRequired": false,
            "description": "This is a Walk-In testing site. No appointment necessary. Testing is free.",
        },
        {
            "address": "795 E. San Ysidro Blvd, San Ysidro, CA 92173",
            "appointment": "No appointment required",
            "hours": "Monday - Friday: 6 AM - 1 PM",
            "latitude": 32.5436704,
            "longitude": -117.0286176,
            "title": "San Ysidro Port of Entry",
            "isWalkIn": true,
            "isDriveUp": false,
            "isAppointmentAvailable": false,
            "isAppointmentRequired": false,
            "description": "This is a Walk-In testing site. No appointment necessary. Testing is free.",
        },
        {
            "address": "389 Orange Avenue, 91911",
            "appointment": "No appointment required",
            "hours": "Sunday-Thursday - 12:30 PM - 8 PM",
            "latitude": 32.6018016,
            "longitude": -117.0680779,
            "title": "Chula Vista, South Chula Vista Branch Library",
            "isWalkIn": false,
            "isDriveUp": true,
            "isAppointmentAvailable": false,
            "isAppointmentRequired": false,
            "description": "This is a Drive-Up testing site. No appointment necessary. Testing is free",
        },
        {
            "address": "5330 Linda Vista Rd, San Diego, CA 92110",
            "appointment": "No appointment required",
            "hours": "Monday - Sunday: 8:30 AM - 5:30 PM",
            "latitude": 32.7670995,
            "longitude": -117.1964758,
            "title": "San Diego, Former USD Electronics Recycling Center",
            "isWalkIn": true,
            "isDriveUp": false,
            "isAppointmentAvailable": false,
            "isAppointmentRequired": false,
            "description": "This is a Walk-In testing site. No appointment necessary. Testing is free",
        },
        {
            "address": "1549 India St, San Diego, CA 92101",
            "appointment": "No appointment required",
            "hours": "Mondays: 8 AM - 3:30 PM",
            "latitude": 32.721612,
            "longitude": -117.1679967,
            "title": "San Diego, Mexican Consulate",
            "isWalkIn": true,
            "isDriveUp": false,
            "isAppointmentAvailable": false,
            "isAppointmentRequired": false,
            "description": "This is a Walk-In testing site. No appointment necessary. Testing is free.",
        },
        // {
        //     "address": "5222 Trojan Ave, San Diego, CA 92115",
        //     "appointment": "No appointment required",
        //     "hours": "Tuesdays: 11 AM - 6 PM",
        //     "latitude": 32.7551417,
        //     "longitude": -117.0831373,
        //     "title": "San Diego, Chicano Federation: Trojan Place",
        //     "isWalkIn": true,
        //     "isDriveUp": false,
        //     "isAppointmentAvailable": false,
        //     "isAppointmentRequired": false,
        //     "description": "This is a Walk-In testing site. No appointment necessary. Testing is free",
        // },
        {
            "address": "5250 55th St, San Diego, CA 92182",
            "appointment": "No appointment required",
            "hours": "Monday - Friday: 8:30 AM - 4 PM",
            "latitude": 32.77286592192972,
            "longitude": -117.07638231107813,
            "title": "SDSU Parma Payne Goodall Alumni Center",
            "isWalkIn": true,
            "isDriveUp": false,
            "isAppointmentAvailable": false,
            "isAppointmentRequired": false,
            "description": "This is a Walk-In testing site. No appointment necessary. Testing is free",
        },
        {
            "address": "936 Genevieve St, Solana Beach, CA 92075",
            "appointment": "",
            "hours": "Saturdays: 8:30 AM - 3:30 PM",
            "latitude": 32.9898095,
            "longitude": -117.2566499,
            "title": "Solana Beach, St. Leo Mission Church",
            "isWalkIn": false,
            "isDriveUp": true,
            "isAppointmentAvailable": true,
            "isAppointmentRequired": true,
            "description": "This is a Drive-Up testing site. Appointments are required. Testing is free",
        },
        // {
        //     "address": "2001 Tavern Rd, Alpine, CA 91901",
        //     "appointment": "https://covidtest.sandiegocounty.gov/healthbook",
        //     "hours": "Thursday 10/22: 9 AM - 1 PM",
        //     "latitude": 32.8250122,
        //     "longitude": -116.7734689,
        //     "title": "Alpine, County Fire - Alpine Joan MacQueen School",
        //     "isWalkIn": true,
        //     "isDriveUp": true,
        //     "isAppointmentAvailable": true,
        //     "isAppointmentRequired": false,
        //     "description": "This is a Drive-Up (Accepts Walk-ins) testing site. Appointments Available but Not Required. Walk- Ins Welcome. Testing is free",
        // },
        // {
        //     "address": "1401 Hanson Lane, Ramona, CA 92065",
        //     "appointment": "https://covidtest.sandiegocounty.gov/healthbook",
        //     "hours": "Monday 10/26: 8 AM - 12 PM",
        //     "latitude": 33.0275076,
        //     "longitude": -116.8691171,
        //     "title": "Ramona, County Fire - Ramona High School",
        //     "isWalkIn": true,
        //     "isDriveUp": true,
        //     "isAppointmentAvailable": true,
        //     "isAppointmentRequired": false,
        //     "description": "This is a Drive-Up (Accepts Walk-ins) testing site. Appointments Available but Not Required. Walk- Ins Welcome. Testing is free.",
        // },
        {
            "address": "3146 School Lane, Lemon Grove, CA 91945",
            "appointment": "https://covidtest.sandiegocounty.gov/healthbook",
            "hours": "Monday- Sunday: 8:30 AM - 5:30 PM",
            "latitude": 32.7400314,
            "longitude": -117.02980160000001,
            "title": "Ramona, County Fire - Ramona High School",
            "isWalkIn": true,
            "isDriveUp": false,
            "isAppointmentAvailable": false,
            "isAppointmentRequired": false,
            "description": "This is a Drive-Up (Accepts Walk-ins) testing site. Appointments Available but Not Required. Walk- Ins Welcome. Testing is free.",
        },
        {
            "address": "404 Euclid Ave. San Diego, CA",
            "appointment": "",
            "hours": "Tuesday 12-4pm",
            "latitude": 32.7092293,
            "longitude": -117.0876539,
            "title": "Jacob Center",
            "isWalkIn": true,
            "isDriveUp": false,
            "isAppointmentAvailable": false,
            "isAppointmentRequired": false,
            "isFoodDist": true,
            "description": "",
        },
        {
            "address": "6601 Imperial Ave. San Diego, CA",
            "appointment": "",
            "hours": "Friday 11-2pm",
            "latitude": 32.7104482,
            "longitude": -117.0559976,
            "title": "Food Distribution Location",
            "isWalkIn": true,
            "isDriveUp": false,
            "isAppointmentAvailable": false,
            "isAppointmentRequired": false,
            "isFoodDist": true,
            "description": "",
        },
        {
            "address": "7373 Tooma St. San Diego, CA",
            "appointment": "",
            "hours": "Friday 11-2pm",
            "latitude": 32.6807999,
            "longitude": -117.03558,
            "title": "Food Distribution Location",
            "isWalkIn": true,
            "isDriveUp": false,
            "isAppointmentAvailable": false,
            "isAppointmentRequired": false,
            "isFoodDist": true,
            "description": "",
        },
    ]);

    useEffect(() => {

        (async () => {

            let { status } = await Location.requestPermissionsAsync();

            if (status !== 'granted') {
                // alert('CovidHelp requires Location permissions in order to work');
                return;
            }

            await Location.getCurrentPositionAsync().then((r) => {
                setLocation(r.coords);
            }).catch(l => {
                console.log(l);
            });

            // _map.root.animateToRegion(location, 1000);

            const newMarkers = [];

            for (const l of markers) {

                if (l.latitude == null || l.longitude == null) {
                    console.log(l);
                    await Location.geocodeAsync(l.address).then(r => {
                        if (r == null || r[0] == null) {
                            console.log("Couldn't retrieve location");
                            return;
                        }

                        const newMarker = { ...l, latitude: r[0].latitude, longitude: r[0].longitude }
                        console.log(newMarker);
                        newMarkers.push(newMarker);
                    }, e => console.log(`Error decoding ${e}`)).catch(r => console.log(r))
                    setMarkers(newMarkers);
                }
            }
        })()
    }, []);

    function onMarkerPress(mapEventData) {
        let selectedMarker = markers[parseInt(mapEventData.nativeEvent.id)];

        Analytics.record({ name: 'Pin Selected', attributes: [`IsFoodDistribution: ${!!selectedMarker.isFoodDist}`, `Title: ${selectedMarker.title}`, `Address: ${selectedMarker.address}`] });
        setCurrentMarker(selectedMarker);
    };

    const onNavigate = (address) => {
        Analytics.record({ name: 'Navigation Clicked', attributes: [`IsFoodDistribution: ${address.isFoodDist}`] });
        return address && OpenMapDirections(null, address, 'd');
    }

    const onSetAppointment = (url) => {
        Analytics.record({ name: 'Appointment Clicked' });
        return Linking.canOpenURL(url) ? Linking.openURL(url) : null;
    }

    // Android
    if (!fontsLoaded) {
        return <AppLoading />;
    }
    else if (Platform.OS == 'android') {
        return (
            <View style={{ height: '100%', backgroundColor: '#000' }}>
                {/* Header */}
                <View style={styles.headerStyle}>
                    <Text style={[styles.androidHeader]}>{header}</Text>
                    <Text style={[styles.androidSubHeader]}>{subHeader}</Text>
                </View>

                {/* Map */}
                <View style={{ flex: 7 }}>
                    <MapView
                        ref={mapRef}
                        style={styles.map} rr
                        showsUserLocation
                        zoomControlEnabled
                        // onLayout={() => _map.root.animateToRegion(location.coords)}
                        onPress={() => setCurrentMarker(null)}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.45,
                            longitudeDelta: 0.45
                        }}
                        onMapReady={() => mapRef.current.fitToCoordinates()}
                    // onRegionChange={() => { console.warn(`region changed!`) }}
                    >
                        {markers && markers.every(m => m.latitude != null && m.longitude != null) && markers.map((marker, index) => (
                            <Marker
                                identifier={index.toString()}
                                key={index}
                                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                                onPress={(e) => onMarkerPress(e)}
                                pinColor={marker.isFoodDist ? '#3300ff' : '#ff0000'}
                                tooltip={false}
                            />
                        ))}
                    </MapView>
                </View>

                {/* Footer */}
                {currentMarker && <View style={{ flex: 0, justifyContent: 'flex-end', flexShrink: 1, backgroundColor: 'white', alignItems: 'center' }}>
                    {/* Title */}
                    <Text style={[styles.calloutHeader, { maxWidth: width }]}>{currentMarker.title.length > maxTitleLength ? `${currentMarker.title.substring(0, maxTitleLength)}...` : currentMarker.title}</Text>
                    {/* Address */}
                    <Text style={[styles.calloutAddress, { maxWidth: width }]}>{currentMarker.address}</Text>
                    {/* Hours */}
                    <Text style={[styles.calloutAddress, { maxWidth: width }]}>{currentMarker.hours}</Text>

                    {/* Walk-In, Drive-Up, and testing */}
                    {!currentMarker.isFoodDist ? <View style={styles.siteInfoContainer}>
                        <Text style={styles.sitInfoText}>Walk-in  {currentMarker.isWalkIn ? <Image source={require('../../assets/checkmark.png')} style={styles.checkmark} /> : <Image source={require('../../assets/xmark.png')} style={styles.xmark} />} </Text>
                        <Text style={styles.sitInfoText}>Drive-up  {currentMarker.isDriveUp ? <Image source={require('../../assets/checkmark.png')} style={styles.checkmark} /> : <Image source={require('../../assets/xmark.png')} style={styles.xmark} />} </Text>
                        <Text style={styles.sitInfoText}>Testing Free <Image source={require('../../assets/checkmark.png')} style={styles.checkmark} /></Text>
                    </View> : null}

                    {/* Appointments */}
                    {!currentMarker.isFoodDist && currentMarker.isAppointmentRequired ?
                        <View style={styles.siteInfoContainer}>
                            <Text style={styles.sitInfoText}>Appointment Required </Text>
                        </View> : null}

                    {!currentMarker.isFoodDist && !currentMarker.isAppointmentRequired && currentMarker.isAppointmentAvailable ?
                        <View style={styles.siteInfoContainer}>
                            <Text style={styles.sitInfoText}>Appointment Available, Not Required </Text>
                        </View> : null}

                    {!currentMarker.isFoodDist && !currentMarker.isAppointmentRequired && !currentMarker.isAppointmentAvailable ?
                        <View style={styles.siteInfoContainer}>
                            <Text style={styles.sitInfoText}>No Appointment Necessary </Text>
                        </View> : null}

                    <View style={styles.buttonContainer}>
                        <Button
                            disabled={!currentMarker.isAppointmentAvailable}
                            title='Set Appointment'
                            style={styles.buttonStyle}
                            onPress={() => onSetAppointment(currentMarker.appointment)}
                        ></Button>

                        <Button
                            title='Navigate'
                            style={styles.buttonStyle}
                            onPress={() => onNavigate(currentMarker)}
                        ></Button>
                    </View>
                </View>}
            </View>
        )
    }
    // iOS
    else
        return (

            <View style={styles.container}>
                <View style={[styles.headerContainer, { alignItems: 'center' }]}>
                    <Text style={styles.iosHeader}>{header}</Text>
                    <Text style={styles.iosSubHeader}>{subHeader}</Text>
                </View>

                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                    zoomControlEnabled={false}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.45,
                        longitudeDelta: 0.45
                    }}
                    ref={mapRef}
                >
                    {markers && markers.every(m => m.latitude != null && m.longitude != null) && markers.map((marker, index) => (
                        <Marker
                            key={index}
                            title={marker.title}
                            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                            description={marker.address}
                            pinColor={marker.isFoodDist ? '#3300ff' : '#ff0000'}
                            tooltip={true}
                        >

                            <Callout tooltip>
                                <View style={[styles.calloutStyle, { maxWidth: width }]}>
                                    {/* Title */}
                                    <Text style={[styles.calloutHeader, { maxWidth: width }]}>{marker.title.length > maxTitleLength ? `${marker.title.substring(0, maxTitleLength)}...` : marker.title}</Text>
                                    {/* Address */}
                                    <Text style={[styles.calloutAddress, { maxWidth: width }]}>{marker.address}</Text>
                                    {/* Hours */}
                                    <Text style={[styles.calloutAddress, { maxWidth: width }]}>{marker.hours}</Text>

                                    {/* Walk-In, Drive-Up, and testing */}
                                    {!marker.isFoodDist ? <View style={styles.siteInfoContainer}>
                                        <Text style={styles.sitInfoText}>Walk-in  {marker.isWalkIn ? <Image source={require('../../assets/checkmark.png')} style={styles.checkmark} /> : <Image source={require('../../assets/xmark.png')} style={styles.xmark} />} </Text>
                                        <Text style={styles.sitInfoText}>Drive-up  {marker.isDriveUp ? <Image source={require('../../assets/checkmark.png')} style={styles.checkmark} /> : <Image source={require('../../assets/xmark.png')} style={styles.xmark} />} </Text>
                                        <Text style={styles.sitInfoText}>Testing Free <Image source={require('../../assets/checkmark.png')} style={styles.checkmark} /></Text>
                                    </View> : null}

                                    {/* Appointments */}
                                    {!marker.isFoodDist && marker.isAppointmentRequired ?
                                        <View style={styles.siteInfoContainer}>
                                            <Text style={styles.sitInfoText}>Appointment Required</Text>
                                        </View> : null}

                                    {!marker.isFoodDist && !marker.isAppointmentRequired && marker.isAppointmentAvailable ?
                                        <View style={styles.siteInfoContainer}>
                                            <Text style={styles.sitInfoText}>Appointment Available, Not Required </Text>
                                        </View> : null}

                                    {!marker.isFoodDist && !marker.isAppointmentRequired && !marker.isAppointmentAvailable ?
                                        <View style={styles.siteInfoContainer}>
                                            <Text style={styles.sitInfoText}>No Appointment Necessary </Text>
                                        </View> : null}


                                    <View style={styles.buttonContainer}>
                                        <Button
                                            disabled={!marker.isAppointmentAvailable}
                                            title='Set Appointment'
                                            style={styles.buttonStyle}
                                            onPress={() => onSetAppointment(marker.appointment)}
                                        ></Button>

                                        <Button
                                            title='Navigate'
                                            style={styles.buttonStyle}
                                            onPress={() => onNavigate(marker)}
                                        ></Button>
                                    </View>
                                </View>
                            </Callout>

                        </Marker>
                    ))}
                </MapView>
            </View >
        )
}

const styles = StyleSheet.create({
    map: {
        height: '100%',
        width: '100%'
    },
    checkmark: {
        width: 17,
        height: 17,
        tintColor: 'green',
    },
    xmark: {
        width: 17,
        height: 17,
        tintColor: 'red',
    },
    headerContainer: {
        padding: 20,
        backgroundColor: '#0000'
    },
    headerStyle: {
        flex: 1,
        minHeight: 15,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    iosHeader: {
        fontSize: 40,
        color: '#444',
        textShadowColor: '#000000',
        textShadowRadius: 1,
        shadowOpacity: 0.3,
        fontFamily: 'Times New Roman'
    },
    iosSubHeader: {
        fontSize: 12,
        color: '#444',
        textShadowColor: '#000000',
        textShadowRadius: 1,
        shadowOpacity: 0.3
    },
    androidHeader: {
        fontSize: 32,
        color: '#222',
        textShadowOffset: {
            height: -.5,
            width: -.5,
        },
        textShadowRadius: 3,
        shadowOpacity: .3,
        bottom: 10,
        fontFamily: 'Lora_400Regular'
    },
    androidSubHeader: {
        fontSize: 12,
        color: '#222',
        textShadowOffset: {
            height: -.5,
            width: -.5,
        },
        textShadowRadius: 3,
        shadowOpacity: .3,
        bottom: 10
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
        padding: 5
    },
    calloutHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
        marginTop: 5,
        marginRight: 5,
    },
    calloutAddress: {
        fontSize: 15,
        marginLeft: 5,
        marginRight: 5
    },
    buttonStyle: {
        fontSize: 8,
    },
    siteInfoContainer: {
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        // justifyContent: 'center',
        flexDirection: 'row',
        padding: 5,
    },
    siteInfoText: {
        margin: 25,
    },
    buttonContainer: {
        flexShrink: 1,
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
    },
})

export default Map;