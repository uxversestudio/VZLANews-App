import React from 'react';
import { View, Text, TextInput, useColorScheme, Pressable } from 'react-native';
import { getStyles } from '../styles/common';
import { Feather } from '@expo/vector-icons';
import { colors } from '../common/theme';


const HazyTextInput = ({ 
    icon, placeholder,
    keyboardType="default", 
    secureTextEntry=false,
    iconPress=() => {},
    reverse=false,
    onSubmitEditing=() => {}
}) => {
    const mode = useColorScheme();

    return(
        <View style={[getStyles(mode).textInputContainer, (reverse) ? { flexDirection: 'row-reverse' } : null]}>
            <TextInput
                style={[getStyles(mode).textInput, (reverse) ? { paddingLeft: 0 } : null]}
                placeholder={ placeholder }
                placeholderTextColor={ colors.gray25 }
                keyboardType={ keyboardType }
                secureTextEntry={ secureTextEntry }
                onSubmitEditing={ onSubmitEditing }
            />

            <Pressable onPress={ iconPress } style={{ padding: 10 }}>
                <Feather name={ icon } size={ 15 } color={ colors.gray30 } />
            </Pressable>
        </View>
    )
}
export default HazyTextInput;