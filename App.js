import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import MapScreen from './src/screens/MapScreen';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const AppsScreen = () => {
  return (
    <View>
      <MapScreen />
    </View>
  )
}

export default AppsScreen;

