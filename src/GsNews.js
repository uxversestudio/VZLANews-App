import React from 'react';
import { View,Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainStackNavigator } from './navigators/MainStackNavigator';

const GsNews = () => {
    return(
        <SafeAreaProvider>
            <NavigationContainer>
                <MainStackNavigator />
            </NavigationContainer>
        </SafeAreaProvider>     
    )
}
export default GsNews;