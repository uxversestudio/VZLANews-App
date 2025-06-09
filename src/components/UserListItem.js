import React from 'react';
import { View, Text, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { colors, tStyles } from '../common/theme';
import { getStyles } from '../styles/common';
import PillBtn from './PillBtn';

const UserListItem = ({item, btnPress}) => {
    const mode = useColorScheme();

    return(
        <View style={[tStyles.row, {paddingVertical: 12}]}>
            <TouchableOpacity>
                <Image
                    source={{uri: item.img}}
                    style={getStyles(mode).userAvatar}
                />
            </TouchableOpacity>
            

            <View style={[tStyles.flex1, tStyles.spacedRow, {marginLeft: 15}]}>
                <View>
                    <Text style={getStyles(mode).userText}>{item.name}</Text>
                    <Text style={getStyles(mode).userNameText}>@{item.username}</Text>
                </View>
                {
                    (!item.followed)
                    ?
                        <PillBtn onPress={btnPress} title="+ Follow" color={ colors.primary } />
                    :
                        <PillBtn onPress={btnPress} title="Followed" color={ colors.gray25 } />
                }
                
            </View>
        </View>
    )
}
export default UserListItem;