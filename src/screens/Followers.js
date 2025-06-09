import React from 'react';
import { View, Text, useColorScheme, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tStyles } from '../common/theme';
import { getStyles } from '../styles/follow';
import BackHeader from '../components/BackHeader';
import HeadingSub from '../components/HeadingSub';
import UserListItem from '../components/UserListItem';
import HazyTextInput from '../components/HazyTextInput';


const Followers = () => {
    const mode = useColorScheme();
    const followers = [
        {id: 1, name: "John Smith", username: "j.smith", img: "https://i.pravatar.cc/200?u=john@geekspark.com", followed: false},
        {id: 2, name: "John Doe", username: "jdoe", img: "https://i.pravatar.cc/200?u=jdoe@geekspark.com", followed: true},
        {id: 3, name: "Jason Holder", username: "holder_j", img: "https://i.pravatar.cc/200?u=jason@geekspark.com", followed: true},
        {id: 4, name: "Ramsay Bolton", username: "ramy_blt", img: "https://i.pravatar.cc/200?u=ramsay@geekspark.com", followed: true},
        {id: 5, name: "John Snow", username: "jsonw", img: "https://i.pravatar.cc/200?u=jsnow@geekspark.com", followed: false},
        {id: 6, name: "James Anderson", username: "james_and", img: "https://i.pravatar.cc/200?u=jamie@geekspark.com", followed: false},
        {id: 7, name: "Jakie", username: "jakie157", img: "https://i.pravatar.cc/200?u=jakie@geekspark.com", followed: false},
        {id: 8, name: "Robin", username: "ro_bin", img: "https://i.pravatar.cc/200?u=robin@geekspark.com", followed: false},
        {id: 9, name: "Peterson", username: "pet.son", img: "https://i.pravatar.cc/200?u=peterson@geekspark.com", followed: true},
        {id: 10, name: "Rocky", username: "rocky", img: "https://i.pravatar.cc/200?u=rocky@geekspark.com", followed: true},
    ];

    return(
        <SafeAreaView style={getStyles(mode).container}>
            {/* Top Bar  */}
            <View style={{paddingHorizontal: 15, paddingBottom: 10}}>
                <BackHeader />
            </View>
            
            {/* Heading  */}
            <View style={{paddingHorizontal: 15}}>
                <HeadingSub heading="Followers" sub="26,215 followers" />
            </View>

            {/* Search Bar */}
            <View style={{paddingHorizontal: 15, marginTop: 20}}>
                <HazyTextInput placeholder="Search follower" icon="search" reverse={true} />
            </View>

            {/* Followers Listing  */}
            <FlatList 
                data={followers}
                style={[tStyles.flex1, {marginTop: 10}]}
                keyExtractor={(item, index) => index}
                renderItem={({item}) => <UserListItem item={item} btnPress={() => alert('Backend Feature')} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
            /> 

        </SafeAreaView>
    )
}
export default Followers;