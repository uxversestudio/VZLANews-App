import React from 'react';
import { View, FlatList, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tStyles } from '../common/theme';
import BackHeader from '../components/BackHeader';
import HazyTextInput from '../components/HazyTextInput';
import NewsListItem from '../components/NewsListItem';
import UserListItem from '../components/UserListItem';
import ImageCatItem from '../components/ImageCatItem';
import PillBtn from '../components/PillBtn';
import { getStyles } from '../styles/search';



const SearchResults = () => {
    const mode = useColorScheme();
    const [sel, setSel] = React.useState('News');

    


    return(
        <SafeAreaView edges={['top', 'right', 'left']} style={ getStyles(mode).container }>
            {/* Top Bar  */}
            <View style={{paddingHorizontal: 15}}>
                <BackHeader />
            </View>

            {/* Search Bar */}
            <View style={{paddingHorizontal: 15, marginTop: 10, marginBottom: 10}}>
                <HazyTextInput 
                    placeholder="Search news..." 
                    icon="search" 
                    reverse={true} 
                />

                {/* Option Pill Buttons */}
                <View style={[tStyles.row, {marginTop: 25, marginBottom: 5}]}>
                    <PillBtn onPress={() => setSel('News')} title="News" transparent={(sel !== 'News')} />
                    <PillBtn onPress={() => setSel('Source')} title="Source" transparent={(sel !== 'Source')} />
                    <PillBtn onPress={() => setSel('Category')} title="Category" transparent={(sel !== 'Category')} />
                </View>

            </View>


            {/* Category Listings */}
            {
                (sel == 'News')
                ?
                    <NewsListing />
                :
                (sel == 'Source')
                ?
                    <SourceListing />
                :
                (sel == 'Category')
                ?
                    <CategoryListing />
                :
                    <></>
            }
            
        </SafeAreaView>
    )
}


const NewsListing = () => {
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
        <FlatList
            data={news}
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => <NewsListItem item={item} />}
            style={tStyles.flex1}
            contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 30 }}
        />
    )
}


const SourceListing = () => {
    const sources = [
        {id:1, name: 'CNN', username: 'cnn', img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/CNN_International_logo.svg/600px-CNN_International_logo.svg.png"},
        {id:2, name: 'BBC', username: 'bbc', img: "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/BBC_Worldwide_Logo.svg/1280px-BBC_Worldwide_Logo.svg.png"},
        {id:3, name: 'Al-Jazeera', username: 'al_jazeera', img: "https://static.wikia.nocookie.net/youtube/images/6/68/Al_Jazeera_English.jpg/revision/latest?cb=20230127151411"},
        {id:4, name: 'Fox News', username: 'fox.news', img: "https://www.hatchwise.com/wp-content/uploads/2023/08/Fox-News-Channel-Emblem-600x338.png.webp"},
        {id:5, name: 'CNET', username: 'cnet', img: "https://static.wikia.nocookie.net/ultimatepopculture/images/8/8f/Cnetlogo.png/revision/latest/scale-to-width-down/150?cb=20191022130326"},
        {id:6, name: 'Reuters', username: 'reuters', img: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQGImiC0n_bM_r6d0b9j-fsq4Rmj1t6nqtQH67JgSibn2erpGJO"},
    ];

    

    return(
        <FlatList 
            data={sources}
            style={[tStyles.flex1, {marginTop: 10}]}
            keyExtractor={(item, index) => index}
            renderItem={({item}) => <UserListItem item={item} btnPress={() => alert('Backend Feature')} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 15 }}
        /> 
    )
}


const CategoryListing = () => {
    const topics = [
        {id:1, title: 'National', subtitle: '102 News', image: "https://images.stockcake.com/public/6/4/e/64e85ac8-fa25-4531-8456-fe578e14037a_large/rallying-national-pride-stockcake.jpg"},
        {id:2, title: 'Business', subtitle: '50 News', image: "https://images.stockcake.com/public/c/b/9/cb99c622-332d-4cbb-ad65-672b615654e0_large/business-news-review-stockcake.jpg"},
        {id:3, title: 'Sports', subtitle: '150 News', image: "https://images.stockcake.com/public/2/f/4/2f45d23b-9ba8-4b8a-9ff8-609021bbbde0_large/excited-sports-commentator-stockcake.jpg"},
        {id:4, title: 'Politics', subtitle: '25 News', image: "https://images.stockcake.com/public/f/1/1/f1187ba6-4ea7-4dd5-9a3c-7f3990d15ea7_large/political-event-broadcast-stockcake.jpg"},
        {id:5, title: 'Science', subtitle: '18 News', image: "https://images.stockcake.com/public/5/1/1/511aa674-0c8b-4241-bb42-1fe5d15cb077_large/educational-science-fun-stockcake.jpg"},
        {id:6, title: 'Technology', subtitle: '10 News', image: "https://images.stockcake.com/public/7/a/f/7af222ad-e1ef-43d1-acb2-f8f0510e63f9_large/child-exploring-technology-stockcake.jpg"},
    ];

    const [selected, setSelected] = React.useState([2, 3, 5]);

    return(
        <FlatList
            showsVerticalScrollIndicator={ false }
            data={ topics }
            keyExtractor={(item) => item.id}
            renderItem={({item}) => <ImageCatItem item={item} selected={ selected } setSelected={ setSelected } />}
            style={tStyles.flex1}
            contentContainerStyle={[{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 30 }]}
            numColumns={ 2 }
            columnWrapperStyle={ tStyles.spacedRow }
            ItemSeparatorComponent={<View style={{ height: 15 }} />}
        />
    )
}


export default SearchResults;