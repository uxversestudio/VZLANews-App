import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { getStyles } from '../styles/common';
import { colors } from '../common/theme';

const PillBtn = ({ onPress, title, transparent=false, color=colors.lynch }) => {
    const mode = useColorScheme();

    return(
        <TouchableOpacity onPress={ onPress } style={ [getStyles(mode).pillBtn, transparent ? { backgroundColor: 'transparent' } : { backgroundColor: color }] }>
            <Text style={ [getStyles(mode).pillBtnText, transparent ? { color: colors.gray75 } : null] }>{ title }</Text>
        </TouchableOpacity>
    )
}
export default PillBtn;