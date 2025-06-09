import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { getStyles } from '../styles/common';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../common/theme';

const SecBtn = ({ onPress, title, icon }) => {
    const mode = useColorScheme();

    return(
        <TouchableOpacity onPress={ onPress } style={ getStyles(mode).secBtn }>
            { icon && <MaterialCommunityIcons name={ icon } size={ 15 } color={ colors.gray50 } style={{ marginRight: 10 }} /> }
            <Text style={ getStyles(mode).secBtnText }>{ title }</Text>
        </TouchableOpacity>
    )
}
export default SecBtn;