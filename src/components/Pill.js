import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { getStyles } from '../styles/common';
import { colors } from '../common/theme';

const Pill = ({ title, backgroundColor=colors.lynch, color=colors.white }) => {
    const mode = useColorScheme();

    return(
        <View style={ [getStyles(mode).pillContainer, {backgroundColor}] }>
            <Text style={ [getStyles(mode).pillText, {color}] }>{ title }</Text>
        </View>
    )
}
export default Pill;