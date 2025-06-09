import React from 'react';
import { View, Text, useColorScheme, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tStyles, fonts } from '../common/theme';
import { getStyles } from '../styles/hashdetails';
import BackHeader from '../components/BackHeader';
import NewsListItem from '../components/NewsListItem';
import HazyTextInput from '../components/HazyTextInput';


const HashDetails = () => {
    const mode = useColorScheme();

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
            <View style={{paddingHorizontal: 15, paddingBottom: 5}}>
                <BackHeader />
            </View>
            

            {/* Hash Tag */}
            <View style={{paddingHorizontal: 15}}>
                <View style={getStyles(mode).hashtag}>
                    <Text style={getStyles(mode).hashtagText}>#news</Text>
                </View>
                <Text style={[fonts.semibold, {fontSize: 11, marginTop: 10}]}>21 News</Text>
            </View>
           

            {/* Search Bar */}
            <View style={{paddingHorizontal: 15, marginTop: 20}}>
                <HazyTextInput placeholder="Search hash tag news..." icon="search" reverse={true} />
            </View>

            {/* Followers Listing  */}
            <FlatList 
                data={news}
                style={[tStyles.flex1, {marginTop: 5}]}
                keyExtractor={(item, index) => index}
                renderItem={({item}) => <NewsListItem item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
            /> 

        </SafeAreaView>
    )
}
export default HashDetails;