import React from 'react';
import { View, Text, useColorScheme, ImageBackground, FlatList, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, tStyles } from '../common/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { getStyles } from '../styles/topicnews';
import BackHeader from '../components/BackHeader';
import HazyTextInput from '../components/HazyTextInput';
import HomeSlider from '../components/HomeSlider';
import NewsListItem from '../components/NewsListItem';



const TopicNews = ({ navigation }) => {
    const mode = useColorScheme();

    const sliderItems = [
        {
            id: 1, 
            img: "https://ichef.bbci.co.uk/ace/standard/1024/cpsprodpb/f3ff/live/0d0c6660-50d4-11ef-8f0f-0577398c3339.jpg",
            headline: "Kamala Harris expected to announce running mate for election",
            category: "Politics",
            source: {logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/BBC_Worldwide_Logo.svg/1280px-BBC_Worldwide_Logo.svg.png", name: "BBC news"},
            time: "2024-08-06T12:13:18.182000000Z"
        },
        {
            id: 2, 
            img: "https://media.cnn.com/api/v1/images/stellar/prod/01j4f1dmdtf8nmw4wn3y8feyc8.jpg?q=w_1110,c_fill/f_webp",
            headline: "Rioters carry out violent, racist attacks across several British cities. What comes next?",
            category: "Politics",
            source: {logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/CNN_International_logo.svg/600px-CNN_International_logo.svg.png", name: "CNN news"},
            time: "2024-08-06T12:13:18.182000000Z"
        },
        {
            id: 3, 
            img: "https://www.cnet.com/a/img/resize/6f87270bdc798df812df083adf089c92b48850c5/hub/2024/07/22/89c22f5a-9aa8-423e-950e-fdf36f5f39da/gettyimages-2162915707.jpg?auto=webp&fit=crop&height=675&width=1200",
            headline: "New Olympic Sports and Events at the 2024 Paris Games ",
            category: "Sports",
            source: {logo: "https://static.wikia.nocookie.net/ultimatepopculture/images/8/8f/Cnetlogo.png/revision/latest/scale-to-width-down/150?cb=20191022130326", name: "CNET news"},
            time: "2024-08-06T12:13:18.182000000Z"
        },
    ];

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
        <SafeAreaView edges={['top', 'right', 'left']} style={getStyles(mode).container}>
            <KeyboardAvoidingView behavior='height' style={ getStyles(mode).container }>
                {/* Top Bar Header*/}
                <View style={{paddingHorizontal: 15, paddingBottom: 5}}>
                    <BackHeader  />
                </View>

                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    style={tStyles.flex1}
                    contentContainerStyle={{ paddingBottom: 30 }}
                >
                    <View style={{ paddingHorizontal: 15 }}>
                        {/* Header Image */}
                        <ImageBackground
                            source={{ uri: "https://media.cnn.com/api/v1/images/stellar/prod/chappell-roan-by-pooneh-ghana-for-lollapalooza-2024-pgh04133-enhanced-nr.jpg" }}
                            style={getStyles(mode).coverImg}
                            imageStyle={{borderRadius: 20}}
                            resizeMode="cover"
                        >
                            
                            {/* News Title */}
                            <LinearGradient
                                colors={['transparent', 'rgba(25,46,81,0.4)','rgba(25,46,81,0.9)']}
                                style={ getStyles(mode).catHeaderContainer }
                            >  
                                {/* News Headline */}
                                <Text style={ getStyles(mode).catHeader }>Politics</Text>
                                <Text style={ getStyles(mode).catSubtitle }>100 News</Text>

                            </LinearGradient>
                        </ImageBackground>
                    </View>

                    {/* News Slider */}
                    <View style={{ marginTop: 15 }}>
                        <HomeSlider data={sliderItems} />
                    </View>

                    {/* Search Bar */}
                    <View style={{paddingHorizontal: 15, marginTop: 20, marginBottom: 10}}>
                        <HazyTextInput 
                            placeholder="Search topic news..." 
                            icon="search" 
                            reverse={true} 
                            onSubmitEditing={() => navigation.navigate('SearchResults')}
                        />
                    </View>

                    {/* News Listing  */}
                    <View style={{ paddingHorizontal: 15, marginTop: 15 }}>
                        {
                            news.map((item, index) => (
                                <NewsListItem item={ item } key={index} />
                            ))
                        }
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}








export default TopicNews;