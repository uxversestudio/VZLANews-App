import React from 'react';
import { View, Text, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles } from '../styles/terms';
import BackHeader from '../components/BackHeader';
import VogueHeading from '../components/VogueHeading';
import SmallHeading from '../components/SmallHeading';

const Terms = () => {
    const mode = useColorScheme();

    return(
        <SafeAreaView style={ getStyles(mode).container }>
            {/* Back Header */}
            <View style={{ paddingHorizontal: 15 }}>
                <BackHeader  />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={ false }
                contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 15 }}  
            >
                {/* Screen Heading */}
                <VogueHeading f_line="Terms &" s_line="Conditions" />

                <Text style={ [getStyles(mode).termsText, {marginTop: 20}] }>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has 
                    been the industry's standard dummy text ever since the 1500s, when an unknown printer took 
                    a galley of type and scrambled it to make a type specimen book. It has survived not only 
                    five centuries, but also the leap into electronic typesetting, remaining essentially 
                    unchanged.
                </Text>

                <View style={{ marginTop: 25, marginBottom: 10 }}>
                    <SmallHeading heading="Privacy Policy" />
                </View>

                <Text style={getStyles(mode).termsText}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has 
                been the industry's standard dummy text ever since the 1500s, when an unknown printer took 
                a galley of type and scrambled it to make a type specimen book. It has survived not only 
                five centuries, but also the leap into electronic typesetting, remaining essentially 
                unchanged.
                </Text>


                <View style={{ marginTop: 25, marginBottom: 10 }}>
                    <SmallHeading heading="Our Proprietary Rights" />
                </View>

                <Text style={getStyles(mode).termsText}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has 
                    been the industry's standard dummy text ever since the 1500s, when an unknown printer took 
                    a galley of type and scrambled it to make a type specimen book. It has survived not only 
                    five centuries, but also the leap into electronic typesetting, remaining essentially 
                    unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has 
                    been the industry's standard dummy text ever since the 1500s, when an unknown printer took 
                    a galley of type and scrambled it to make a type specimen book. It has survived not only 
                    five centuries, but also the leap into electronic typesetting, remaining essentially 
                    unchanged.
                </Text>


                <View style={{ marginTop: 25, marginBottom: 10 }}>
                    <SmallHeading heading="Indeminity" />
                </View>
                
                <Text style={getStyles(mode).termsText}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has 
                    been the industry's standard dummy text ever since the 1500s, when an unknown printer took 
                    a galley of type and scrambled it to make a type specimen book. It has survived not only 
                    five centuries, but also the leap into electronic typesetting, remaining essentially 
                    unchanged. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially 
                    unchanged.
                </Text>

            </ScrollView>
        </SafeAreaView>
    )
}
export default Terms;