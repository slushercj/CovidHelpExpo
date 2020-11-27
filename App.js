import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import MapScreen from './src/screens/MapScreen';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import * as SplashScreen from 'expo-splash-screen';

// Prevent native splash screen from autohiding before App component declaration
SplashScreen.preventAutoHideAsync()
  .then(result => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
  .catch(console.warn); // it's good to explicitly catch and inspect any error

Amplify.configure(awsconfig);

const AppsScreen = () => {

  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    setTimeout(async () => {
      await SplashScreen.hideAsync();
      setAppReady(true);
    }, 1500);
  });

  if (appReady)
    return (
      <View>
        <MapScreen />
      </View>
    )
  else return null;
}

export default AppsScreen;

