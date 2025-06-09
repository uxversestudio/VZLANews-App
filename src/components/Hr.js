import React from 'react';
import { View } from 'react-native';

const Hr = ({size, color}) => {
    return(
        <View style={{ width: '100%', height: size, backgroundColor: color }} />
    )
}
export default Hr;