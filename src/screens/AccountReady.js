import React from 'react';
import { View, Text, useColorScheme, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles } from '../styles/auth';
import BackHeader from '../components/BackHeader';
import VogueHeading from '../components/VogueHeading';
import MainBtn from '../components/MainBtn';
import { tStyles } from '../common/theme';


const AccountReady = ({ navigation }) => {
    const mode = useColorScheme();

    return(
        <SafeAreaView style={ getStyles(mode).container }>
            <View style={[ tStyles.flex1, { justifyContent: 'space-between' } ]}>
                {/* Back Header */}
                <View style={{ paddingHorizontal: 15 }}>
                    <BackHeader />
                </View>

                {/* Screen Heading */}
                <View style={{ paddingHorizontal: 15, marginTop: 25 }}>
                    <VogueHeading f_line="Your account is" s_line="ready to use 🎉" />
                </View>

                {/* Profile Details */}
                <View style={[tStyles.centerx, tStyles.centery, tStyles.flex1, { paddingHorizontal: 15 }]}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/302' }}
                        style={ getStyles(mode).avatar }
                        resizeMode='cover'
                    />

                    <Text style={ getStyles(mode).oauthNameText }>John Doe</Text>
                    <Text style={ getStyles(mode).oauthUsernameText }>@jdoe</Text>
                </View>

                
                {/* Continue Button */}
                <View style={{ marginTop: 80, marginBottom: 25, paddingHorizontal: 15 }}>
                    <MainBtn onPress={() => navigation.navigate('BottomTabNavigator')} title="Browse Home" />
                </View>
            </View> 
        </SafeAreaView>
    )
}
export default AccountReady;