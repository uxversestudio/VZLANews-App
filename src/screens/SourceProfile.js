import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import Animated, {useAnimatedScrollHandler, useSharedValue} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import BackHeader from '../components/BackHeader';
import { getStyles } from '../styles/profile';
import { colors, tStyles } from '../common/theme';
import { Entypo } from '@expo/vector-icons';
import StatsBox from '../components/StatsBox';
import PillBtn from '../components/PillBtn';
import NewsListItem from '../components/NewsListItem';
import AnimProfileHeader from '../components/AnimProfileHeader';



const SourceProfile = () => {
    const mode = useColorScheme();
    const scroll = useSharedValue(0);
    

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (e) => {
            scroll.value = e.contentOffset.y
        }
    });



    const news = [
        {
            id: 1, 
            headline: "Biden, Harris meet with national security team as US watches for Iranian retaliation", 
            category: "Business", 
            img: "https://media.cnn.com/api/v1/images/stellar/prod/02-gettyimages-1731157124.JPG?c=16x9&q=h_653,w_1160,c_fill/f_webp", 
            read_time: 5, 
            time: "2024-08-06T03:36:57.865000000Z", 
            bookmarked: true 
        },
        {
            id: 2, 
            headline: "‘Fight for our future’: Kamala Harris and Tim Walz hold first rally", 
            category: "Politics", 
            img: "https://www.aljazeera.com/wp-content/uploads/2024/08/2024-08-06T233754Z_610419846_RC2MA9AWTWI6_RTRMADP_3_USA-ELECTION-HARRIS-1-1722993495.jpg?resize=730%2C410&quality=80", 
            read_time: 3, 
            time: "2024-08-07T03:36:57.865000000Z", 
            bookmarked: false 
        },
        {
            id: 3, 
            headline: "Chappell Roan may have had the biggest Lollapalooza set of all time", 
            category: "Entertainment", 
            img: "https://media.cnn.com/api/v1/images/stellar/prod/chappell-roan-by-pooneh-ghana-for-lollapalooza-2024-pgh04133-enhanced-nr.jpg?c=16x9&q=h_653,w_1160,c_fill/f_webp", 
            read_time: 2, 
            time: "2024-08-07T03:20:57.865000000Z", 
            bookmarked: true 
        },
        {
            id: 4, 
            headline: "Simone Biles tells CNN competing in Paris ‘meant the world’ after struggles in Tokyo", 
            category: "Sports", 
            img: "https://media.cnn.com/api/v1/images/stellar/prod/dfc9b330-f5c3-4fcc-90aa-de5b49ffb1f0.jpg?q=w_1110,c_fill/f_webp", 
            read_time: 4, 
            time: "2024-08-07T03:00:57.865000000Z", 
            bookmarked: false 
        },
        {
            id: 5, 
            headline: "NASA delays SpaceX astronaut mission as rumors swirl about Boeing Starliner’s safety", 
            category: "Science", 
            img: "https://media.cnn.com/api/v1/images/stellar/prod/iss071e182991-orig.jpg?c=16x9&q=h_653,w_1160,c_fill/f_webp", 
            read_time: 3, 
            time: "2024-08-06T03:00:57.865000000Z", 
            bookmarked: false 
        },
    ];

    return(
        <SafeAreaView style={getStyles(mode).container}>
            {/* Top Bar  */}
            <View style={{paddingHorizontal: 15, paddingBottom: 15}}>
                <BackHeader />
            </View>

            {/* User image */}
            <AnimProfileHeader 
                scroll={scroll} 
                name="CNN News" 
                userName="cnn" 
                image="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/CNN_International_logo.svg/600px-CNN_International_logo.svg.png"
                follow={true} 
                btnPress={() => alert('Backend Feature')}
            />


            {/* News Listing */}
            <Animated.FlatList
                data={news}
                bounces={false}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => <NewsListItem item={item} />}
                contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 60, paddingBottom: 70 }}
                ListHeaderComponent={<ListHeaderComponent />}
                scrollHandler={scrollHandler}
            />



            {/* Status Bar  */}
            <StatusBar style="dark" />
        </SafeAreaView>
    )
}


const ListHeaderComponent = () => {
    const mode = useColorScheme();
    const navigation = useNavigation();

    return(
        <>
            {/* User Bio */}
            <View style={{marginTop: 10}}>
                
                {/* User Bio Text */}
                <Text style={getStyles(mode).userBioText}>
                    It was popularised in the 1960s with the release of Letraset sheets containing 
                    Lorem Ipsum passages, and more...
                </Text>

                {/* User Link */}
                <View style={[tStyles.row, {marginTop: 10}]}>
                    <Entypo name="link" size={14} color={colors.primary} />
                    <Text 
                        onPress={() => Linking.openURL('https://codecanyon.net/user/geekspark/portfolio') }
                        style={getStyles(mode).linkText}
                    >
                        cnn.com
                    </Text>
                </View>

                {/* Option Pill Buttons */}
                <View style={[tStyles.row, {marginTop: 25}]}>
                    <PillBtn title="News" />
                    <PillBtn onPress={() => alert('Backend Feature')} title="Tagged" transparent={true} />
                </View>
            </View>


            {/* User Profile Stats */}
            <View style={{marginVertical: 25}}>
                <StatsBox 
                    items={[
                        {stat: 400, statInfo: 'News', onPress: () => {}},
                        {stat: '30k', statInfo: 'Followers', onPress: () => navigation.navigate('Followers')},
                        {stat: 30, statInfo: 'Following', onPress: () => navigation.navigate('Following')},
                        {stat: '100%', statInfo: 'Reliability', onPress: () => {}},
                    ]}
                />
            </View>
        </>
    )
}

export default SourceProfile;