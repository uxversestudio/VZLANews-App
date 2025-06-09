import React from 'react';
import { View, Text, Pressable, Image, useColorScheme, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { getStyles } from '../styles/common';
import { tStyles, colors } from '../common/theme';



const CenterImgCatItem = ({ item, selected, setSelected }) => {
    const mode = useColorScheme();
    const isSelected = () => selected.includes(item.id);
    const { width } = useWindowDimensions();

    function toggleSelected(element) {
        let sel = [...selected];
        const index = sel.indexOf(element);
        if (index === -1) {
            sel.push(element);
        } else {
            sel.splice(index, 1);
        }
        setSelected(sel);
    }

    return(
        <Pressable 
            onPress={() => toggleSelected(item.id)}
            style={[ 
                { width: (width-45)*.5, height: width*0.53 },
                (!isSelected()) ? getStyles(mode).centerImageCatContainer : getStyles(mode).centerImageCatContainerSel
            ]}
        >
            <View style={ tStyles.centery }>
               <Image
                    source={{ uri: item.image }}
                    style={{ width: 80, height: 80, borderRadius: 40 }}
                /> 
                <Text style={ getStyles(mode).sourceName }>{ item.title }</Text>
            </View>

            <View style={{ position: 'absolute',top: 25, right: 20, }}>
                {
                    (isSelected())
                    &&
                    <View style={ getStyles(mode).checkBox }>
                        <Feather name='check' size={ 12 } color={ colors.white } />
                    </View>
                }
            </View>

        </Pressable>
    )
}


export default CenterImgCatItem;