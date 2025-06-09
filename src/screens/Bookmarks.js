import React from 'react';
import { View, Text, useColorScheme, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tStyles, colors, fonts } from '../common/theme';
import BackHeader from '../components/BackHeader';
import SmallHeading from '../components/SmallHeading';
import HazyTextInput from '../components/HazyTextInput';
import ImageCatItem from '../components/ImageCatItem';
import Modal from '../components/Modal';
import { getStyles } from '../styles/search';
import MainBtn from '../components/MainBtn';
import SecBtn from '../components/SecBtn';

const Bookmarks = () => {
    const mode = useColorScheme();
    const [newModal, setNewModal] = React.useState(false);
    const [addModal, setAddModal] = React.useState(false);

    const bookmarks = [
        {id:1, title: 'Public', subtitle: '102 News', image: "https://images.stockcake.com/public/6/4/e/64e85ac8-fa25-4531-8456-fe578e14037a_large/rallying-national-pride-stockcake.jpg"},
        {id:2, title: 'Tech', subtitle: '50 News', image: "https://images.stockcake.com/public/c/b/9/cb99c622-332d-4cbb-ad65-672b615654e0_large/business-news-review-stockcake.jpg"},
        {id:3, title: 'Music', subtitle: '150 News', image: "https://images.stockcake.com/public/2/f/4/2f45d23b-9ba8-4b8a-9ff8-609021bbbde0_large/excited-sports-commentator-stockcake.jpg"},
        {id:4, title: 'Health', subtitle: '25 News', image: "https://images.stockcake.com/public/f/1/1/f1187ba6-4ea7-4dd5-9a3c-7f3990d15ea7_large/political-event-broadcast-stockcake.jpg"},
        {id:5, title: 'Religious', subtitle: '18 News', image: "https://images.stockcake.com/public/5/1/1/511aa674-0c8b-4241-bb42-1fe5d15cb077_large/educational-science-fun-stockcake.jpg"},
    ];


    return(
        <SafeAreaView style={getStyles(mode).container}>
            {/* Top Bar  */}
            <View style={{paddingHorizontal: 15, paddingBottom: 5}}>
                <BackHeader />
            </View>

            {/* Heading */}
            <View style={{ paddingHorizontal: 15 }}>
                <SmallHeading heading="Bookmarks" />
            </View>

            {/* Search Bar */}
            <View style={{paddingHorizontal: 15, marginTop: 20, marginBottom: 10}}>
                <HazyTextInput 
                    placeholder="Search bookmarks..." 
                    icon="search" 
                    reverse={true} 
                />
            </View>

            {/* Bookmark Listing */}
            <FlatList
                showsVerticalScrollIndicator={ false }
                data={ [...bookmarks, { add: true }] }
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (!item.add) ? <ImageCatItem item={item} /> : <AddBookmark setNewModal={setNewModal} />}
                style={tStyles.flex1}
                contentContainerStyle={[{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 90 }]}
                numColumns={ 2 }
                columnWrapperStyle={ tStyles.spacedRow }
                ItemSeparatorComponent={<View style={{ height: 15 }} />}
            />


            {/* New Bookmark Modal */}
            {newModal && <NewBookMarkModal setStatus={setNewModal} />}
        </SafeAreaView>
    )
}


const AddBookmark = ({ setNewModal }) => {
    const { width } = useWindowDimensions();
    const mode = useColorScheme();

    return(
        <TouchableOpacity 
            onPress={() => setNewModal(true)}
            style={[getStyles(mode).addBookmarkBtn, {width: (width-45)*.5, height: width*0.61}]}
        >
            <Text style={getStyles(mode).addBookmarkText}>+</Text>
        </TouchableOpacity>
    )
}


const NewBookMarkModal = ({ setStatus }) => {
    return(
        <Modal height={280} setStatus={setStatus}>
            <View style={[tStyles.flex1, { justifyContent: 'space-between' }]}>
                <View>
                    <View style={[tStyles.centery, {marginVertical: 15}]}>
                        <Text style={[fonts.bold, {fontSize: 16}]}>Add new bookmark</Text>
                    </View>
                    
                    <HazyTextInput 
                        placeholder="Bookmark title"
                        icon="bookmark"
                        reverse={true}
                    />    
                </View>  

                <View style={[tStyles.spacedRow, {marginTop: 10}]}>
                    <View style={{ width: '46%' }}>
                        <SecBtn onPress={() => setStatus(false)} title="Cancel" />
                    </View>
                    
                    <View style={{ width: '46%' }}>
                        <MainBtn onPress={() => setStatus(false)} title="Save" />
                    </View>
                </View>
            </View>
        </Modal>
    )
}


export default Bookmarks;