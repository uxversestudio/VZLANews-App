import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { tStyles } from '../common/theme';
import { getStyles } from '../styles/common';

const HeadingSub = ({heading, sub}) => {
    const mode = useColorScheme();

    return(
        <View>
            <Text style={getStyles(mode).smallHeadingText}>{heading}</Text>
            <Text style={getStyles(mode).subHeadingText}>{sub}</Text>
        </View>
    )
}
export default HeadingSub;