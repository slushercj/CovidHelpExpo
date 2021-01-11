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
    const header = "Super Pantry";
    const subHeader = "FREE FOOD LOCATIONS";

    const [markers, setMarkers] = useState([
      {
        address: "8804 Balboa Avenue San Diego, CA 92123",
        description: "This site can provide diapers upon request",
        holidays: "December 3 - January 1, January 18, March 29",
        hours: "Monday - Friday 11:00 am - 1:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.8211436,
        longitude: -117.1385462,
        title: "Jewish Family Service of San Diego",
        isFoodDist: true,
      },
      {
        address: "2444 Congress Street San Diego, CA 92112",
        description: "",
        holidays: "31-May",
        hours: "Mondays, Tuesdays, Wednesdays 12:00 pm - 3:00",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.7513368,
        longitude: -117.1942963,
        title: "Old Town Community Church",
        isFoodDist: true,
      },
      {
        address: "3350 E Street San Diego, CA 92102",
        description: "This site can provide diapers upon request",
        holidays:
          "December 31 - January 1, January 18, February 15, March 31, May 31, July 5, September 6, November 11, November 25-26, December 25-27",
        hours: "Monday, Thursday, & Friday 12:00 pm - 2:00",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.7149346,
        longitude: -117.122144,
        title: "Father Joe's Village",
        isFoodDist: true,
      },
      {
        address: "4060 Fairmount Avenue San Diego, CA 92105",
        description: "This site can provide diapers upon request",
        holidays: "",
        hours: "Monday and Wednesday 9:00 am - 2:00 pm\nFriday 10:00 am - 3:00",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.7505395,
        longitude: -117.1013459,
        title: "La Maestra",
        isFoodDist: true,
      },
      {
        address: "4021 Goldfinch Street San Diego, CA 92103",
        description: "",
        holidays: "31-May",
        hours: "Monday-Thursday 11:00 am - 1:30 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.7503378,
        longitude: -117.1711827,
        title: "Special Delivery San Diego",
        isFoodDist: true,
      },
      {
        address: "1962 Euclid Avenue San Diego, CA 92105",
        description: "",
        holidays: "",
        hours: "Friday from 9:45 am - 12:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.7265475,
        longitude: -117.0861765,
        title: "Ministerio Tiempo Nuevo at Bethel Baptist Church",
        isFoodDist: true,
      },
      {
        address: "404 Euclid Avenue San Diego, CA 92114",
        description: "",
        holidays: "",
        hours: "Tuesdays 2:00 pm - 4:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.7092293,
        longitude: -117.0876539,
        title:
          "Paving Great Futures at Jacobs Center for Neighborhood Innovation",
        isFoodDist: true,
      },
      {
        address: "6601 Imperial Avenue San Diego, CA 92102",
        description: "",
        holidays: "",
        hours: "Fridays 11:00 am - 2:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.7104482,
        longitude: -117.0559976,
        title: "Paving Great Futures at I Am My Brothers Keeper",
        isFoodDist: true,
      },
      {
        address: "2515 Lemon Grove Avenue Lemon Grove, CA 91945",
        description: "",
        holidays: "December 28 - January 1",
        hours: "Tuesdays, Wednesdays, Thursdays 12:00 pm - 3:00",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.7328501,
        longitude: -117.0325363,
        title: "North Park Apostolic Church",
        isFoodDist: true,
      },
      {
        address: "4975 University Avenue San Diego, CA 92015",
        description: "",
        holidays: "",
        hours: "Mondays, Wednesdays, Fridays 12:00 pm - 3:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.7492381,
        longitude: -117.087365,
        title: "Somali Bantu Association of America",
        isFoodDist: true,
      },
      {
        address: "3725 30th San Diego, CA",
        description: "",
        holidays: "December 31 - January 1",
        hours: "Drive Thru - Mondays and Fridays 3:00 pm - 6:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.7458806,
        longitude: -117.1297978,
        title: "Uptown Community Service",
        isFoodDist: true,
      },
      {
        address: "3725 30th San Diego, CA",
        description: "",
        holidays: "December 31 - January 1",
        hours: "Walk up Distribution: Thursdays 11 am - 1:45 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.7458806,
        longitude: -117.1297978,
        title: "St Luke's Episcopal Church",
        isFoodDist: true,
      },
      {
        address: "1445 Engineer Street, Suite #110 Vista, CA 92081",
        description:
          "This site can provide diapers upon request. If carpooling, must show proof of different addresses",
        holidays:
          "December 31 - January 1, January 18, February 15, March 31, May 31",
        hours: "Monday - Friday 9:00 am - 4:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 33.1519668,
        longitude: -117.2376491,
        title: "North County Food Bank",
        isFoodDist: true,
      },
      {
        address: "3260 Production Avenue Oceanside, CA 92058",
        description: "",
        holidays: "January 1, May 31",
        hours: "Monday - Friday 6:30 am - 10:45 am and 11:30 am - 12:00",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 33.2164317,
        longitude: -117.3474799,
        title: "Brother Benno Foundation",
        isFoodDist: true,
      },
      {
        address: "140 N. Brandon Road Fallbrook, CA 92028",
        description: "",
        holidays: "December 31 - January 1",
        hours: "Monday - Friday 9:30 am - 12:30 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 33.3826762,
        longitude: -117.2445353,
        title: "Fallbrook Food Pantry",
        isFoodDist: true,
      },
      {
        address: "4070 Mission Avenue Oceanside, CA 92507",
        description: "This site can provide diapers upon request",
        holidays: "December 25 - January 5",
        hours: "Tuesday, Wednesday, and Thursday 9:00 am - 3:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 33.2322463,
        longitude: -117.3174661,
        title: "Mission San Luis Rey Parish",
        isFoodDist: true,
      },
      {
        address: "1917 East Washington Avenue Escondido, CA 92027",
        description: "",
        holidays: "",
        hours: "Fridays 4:30 pm to 7:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 33.1402654,
        longitude: -117.0551027,
        title: "Ministerio Tiempo Nuevo at The Church of Jesus Christ",
        isFoodDist: true,
      },
      {
        address: "885 Vista Way Vista, CA 92084",
        description: "",
        holidays: "",
        hours: "Wednesdays 7:00 am to 10:00 am",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 33.210282,
        longitude: -117.2324864,
        title: "Ministerio Tiempo Nuevo at Calvary Church",
        isFoodDist: true,
      },
      {
        address: "550 West Washington Avenue Escondido, CA 92025",
        description:
          "Upcoming closures 1st Friday of each mont. This site can provide diapers upon request.",
        holidays:
          "December 31 - January 1, January 18, February 15, March 31, May 31, June 18",
        hours: "Monday-Friday 8:00 am - 11:00 am and 1:00 pm - 3:00",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 33.125092,
        longitude: -117.0919507,
        title: "Interfaith Community Services",
        isFoodDist: true,
      },
      {
        address: "363 Woodland Parkway San Marcos, CA 92081",
        description: "",
        holidays: "",
        hours: "Drive-thru Tuesdays 4:00 pm - 6:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 33.1437185,
        longitude: -117.1350095,
        title: "San Marcos Adventist Church",
        isFoodDist: true,
      },
      {
        address: "364 Woodland Parkway San Marcos, CA 92081",
        description: "",
        holidays: "",
        hours: "Walk-up Saturdays 1:00 pm - 4:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 33.1431985,
        longitude: -117.1371287,
        title: "San Marcos Adventist Church",
        isFoodDist: true,
      },
      {
        address: "365 Woodland Parkway San Marcos, CA 92081",
        description: "",
        holidays: "",
        hours: "Walk-up Sundays from 2:30 pm - 6:30 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 33.1436441,
        longitude: -117.1358518,
        title: "San Marcos Adventist Church",
        isFoodDist: true,
      },
      {
        address: "1305 Deodar Road Escondido, CA 92026",
        description: "",
        holidays:
          "January 1, 18, February 15, April 2, May 31, July 2, September 6, October 11, November 24 - 26, December 22 - January 2",
        hours: "Monday, Wednesday, Friday 12-2:30\nSunday 11:00-12:30",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 33.1402415,
        longitude: -117.1071257,
        title: "San Diego Christian Center (The Center)",
        isFoodDist: true,
      },
      {
        address: "292 E. Barham Drive San Marcos, CA 92078",
        description: "",
        holidays: "",
        hours:
          "2nd & 4th Saturdays of each month, 10:30 am - 12:00 pm; Tuesdays 11:00 am - 2:00 pm\n Thursdays 3:00 pm - 6:00 pm\n Sundays 10:00 am - 1:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 33.1343835,
        longitude: -117.158277,
        title: "Summit Church",
        isFoodDist: true,
      },
      {
        address:
          "8848 Troy Street Spring Valley, CA 91977 At Goodland Acres County Park",
        description: "",
        holidays: "December 31-January 4, February 12-15, April 2, May 28-31",
        hours: "Tuesday - Friday from 9:00 am - 12:00",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.7369628,
        longitude: -117.0089754,
        title: "Heaven's Windows",
        isFoodDist: true,
      },
      {
        address: "1025 East Main Street El Cajon, CA 92021",
        description:
          "Tuesdays and Fridays 9:00 am - 12:00 pm homeless services",
        holidays: "",
        hours:
          "Mondays 1:00 pm - 4:00 pm\n Wednesdays 1:00 pm - 4:00 pm\n Fridays 1:00 pm - 6:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.7942709,
        longitude: -116.9469832,
        title: "Salvation Army - El Cajon",
        isFoodDist: true,
      },
      {
        address: "9715 Halberns Blvd Santee, CA 92071",
        description: "",
        holidays: "",
        hours:
          "Wednesdays, Fridays, and Saturdays 8:00am - 11:00am\n 1ST and 3rd Tuesday of each month from 8:00 am - 11:00 am",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.8544833,
        longitude: -116.993417,
        title: "Santee Food Bank",
        isFoodDist: true,
      },
      {
        address: "2055 Skyline Drive Lemon Grove, CA 91945",
        description: "",
        holidays: "",
        hours: "Mondays, Tuesdays, Wednesdays 9:00 am - 12:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.7286548,
        longitude: -117.0265683,
        title: "Samoa Independent",
        isFoodDist: true,
      },
      {
        address: "138th 28th Street San Diego, CA 92102",
        description: "",
        holidays: "",
        hours: "Tuesdays, Wednesdays, and Thursdays 10:00 am - 1:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.7072234,
        longitude: -117.1340494,
        title: "Stepping Higher Incorporated",
        isFoodDist: true,
      },
      {
        address: "8179 Broadway Boulevard Lemon Grove, CA 91945",
        description: "",
        holidays: "",
        hours: "Monday - Friday 8:00 am - 11:45 am",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.7439617,
        longitude: -117.0209803,
        title: "Ministerio Tiempo Nuevo",
        isFoodDist: true,
      },
      {
        address: "1929 Arnold Way Alpine, CA 91901",
        description: "",
        holidays: "",
        hours: "Thursdays from 10:00 am - 12:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.835254,
        longitude: -116.7743148,
        title: "Ministerio Tiempo Nuevo at Bethel Assembly of God",
        isFoodDist: true,
      },
      {
        address: "1624 East 18th Street National City, CA 91950",
        description: "",
        holidays: "",
        hours: "Wednesdays 1:00 pm - 4:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.6716861,
        longitude: -117.0862449,
        title: "Ministerio Tiempo Nuevo",
        isFoodDist: true,
      },
      {
        address: "2020 Alaquinas Drive San Ysidro, CA 92173",
        description: "",
        holidays: "",
        hours:
          "Mondays Food Pantry 3:00 pm - 6:00 pm\n Fridays Food Pantry 3:00 pm - 6:00 pm\n Sundays Food distribution 9:00 am - 12:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.5601326,
        longitude: -117.0442143,
        title: "St Vincent de Paul Our Lady Mount Carmel",
        isFoodDist: true,
      },
      {
        address: "663 E San Ysidro Boulevard San Ysidro, CA 92173",
        description: "",
        holidays: "January 18, February 15, March 31, May 31",
        hours: "Monday - Friday from 3:00 pm - 5:30 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.547457,
        longitude: -117.0326191,
        title: "Hearts & Hands Working Together",
        isFoodDist: true,
      },
      {
        address: "465 C Street Chula Vista, CA 91910",
        description: "This site can provide diapers upon request",
        holidays: "",
        hours:
          "Every Wednesday from 9:00 am - 11:00 am (walk-ups)\nEvery Thursday from 8:00 am - 2:00 pm (drive-thru)",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.6503086,
        longitude: -117.0907353,
        title: "Community Through Hope",
        isFoodDist: true,
      },
      {
        address: "630 Corte Maria Avenue Chula Vista, CA 91910",
        description: "Diapers are distributed on Mondays and Wednesdays",
        holidays: "",
        hours:
          "Monday 1:00 pm - 3:00 pm, Wednesday 1:00 pm - 4:00 pm, Thursday 1:00 pm - 5:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.6325065,
        longitude: -117.0658112,
        title: "Operation Promise Community Services",
        isFoodDist: true,
      },
      {
        address: "7373 Tooma St San Diego, CA 92139",
        description: "",
        holidays: "",
        hours: "Fridays 11:00 am - 2:00 pm",
        isAppointmentAvailable: false,
        isAppointmentRequired: false,
        isDriveUp: false,
        isWalkIn: false,
        latitude: 32.6807999,
        longitude: -117.03558,
        title: "Paving Great Futures at Bay Terrace Community Parks",
        isFoodDist: true,
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
                        {/* <Button
                            disabled={!currentMarker.isAppointmentAvailable}
                            title='Set Appointment'
                            style={styles.buttonStyle}
                            onPress={() => onSetAppointment(currentMarker.appointment)}
                        ></Button> */}

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
                                        {/* <Button
                                            disabled={!marker.isAppointmentAvailable}
                                            title='Set Appointment'
                                            style={styles.buttonStyle}
                                            onPress={() => onSetAppointment(marker.appointment)}
                                        ></Button> */}

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
        paddingTop: 10,
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
        padding: 5,
        width: '95%'
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
        marginRight: 5,
        textAlign: 'center'
    },
    buttonStyle: {
        fontSize: 8,
    },
    siteInfoContainer: {
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
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