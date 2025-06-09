import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { getStyles } from '../styles/common';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../common/theme';

const MainBtn = ({ onPress, title, icon }) => {
    const mode = useColorScheme();

    return(
        <TouchableOpacity onPress={ onPress } style={ getStyles(mode).mainBtn }>
            { icon && <MaterialIcons name={ icon } size={ 15 } color={ colors.white } style={{ marginRight: 10 }} /> }
            <Text style={ getStyles(mode).mainBtnText }>{ title }</Text>
        </TouchableOpacity>
    )
}
export default MainBtn;