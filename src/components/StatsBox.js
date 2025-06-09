import React from 'react';
import { View, Text, useColorScheme, TouchableOpacity } from 'react-native';
import { tStyles } from '../common/theme';
import { getStyles } from '../styles/common';



const StatsBox = ({items}) => {
    const mode = useColorScheme();

    return(
        <View style={getStyles(mode).statsContainer}>
            {
                items.map((item, index) => (
                    <TouchableOpacity onPress={item.onPress} style={[tStyles.centery]} key={index}>
                        <Text style={getStyles(mode).statsText}>{ item.stat }</Text>
                        <Text style={getStyles(mode).statsInfoText}>{ item.statInfo }</Text>
                    </TouchableOpacity>
                ))
            }
            
        </View>
    )
}
export default StatsBox;