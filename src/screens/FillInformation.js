import React from 'react';
import { View, Text, useColorScheme, Image, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles } from '../styles/auth';
import BackHeader from '../components/BackHeader';
import VogueHeading from '../components/VogueHeading';
import MainBtn from '../components/MainBtn';
import HazyTextInput from '../components/HazyTextInput';
import { tStyles } from '../common/theme';


const FillInformation = ({ navigation }) => {
    const mode = useColorScheme();

    return(
        <SafeAreaView style={ getStyles(mode).container }>
            <KeyboardAvoidingView behavior='height' style={[ tStyles.flex1, { justifyContent: 'space-between' } ]}>
                {/* Back Header */}
                <View style={{ paddingHorizontal: 15 }}>
                    <BackHeader />
                </View>

                
                <View style={[ tStyles.flex1, { paddingHorizontal: 15, marginTop: 25 }]}>
                    {/* Screen Heading */}
                    <VogueHeading f_line="Fill your" s_line="information" />

                    {/* Profile Image */}
                    <View style={[tStyles.centery, { marginTop: 25 }]}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/302' }}
                            style={ [getStyles(mode).avatar, { borderWidth: 0, width: 120, height: 120 }] }
                            resizeMode='cover'
                        />
                    </View>
                    
                    <View style={{ marginTop: 20 }}>
                        <HazyTextInput icon="user" placeholder="Username" />
                    </View>

                </View>

                

                
                {/* Continue Button */}
                <View style={{ marginTop: 80, marginBottom: 25, paddingHorizontal: 15 }}>
                    <MainBtn onPress={() => navigation.navigate('AccountReady')} title="Continue" />
                </View>
            </KeyboardAvoidingView> 
        </SafeAreaView>
    )
}
export default FillInformation;