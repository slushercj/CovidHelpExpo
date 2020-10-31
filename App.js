import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import MapScreen from './src/screens/MapScreen';
import { setNavigator } from "./src/navigationRef";

const AppsScreen = () => {
  return (
    <View>
      <MapScreen />
    </View>
  )
}

export default AppsScreen;

