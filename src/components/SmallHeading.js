import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { getStyles } from '../styles/common';

const SmallHeading = ({ heading }) => {
    const mode = useColorScheme();

    return(
        <Text style={ getStyles(mode).smallHeadingText }>{ heading }</Text>
    )
}
export default SmallHeading;