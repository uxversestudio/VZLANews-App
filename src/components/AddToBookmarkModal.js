import React from "react";
import { View, Text, FlatList, useWindowDimensions } from "react-native";
import ImageCatItem from "./ImageCatItem";
import { tStyles, fonts } from "../common/theme";
import Modal from "./Modal";
import SecBtn from "./SecBtn";
import MainBtn from "./MainBtn";


const AddToBookmarkModal = ({ setStatus }) => {
    const bookmarks = [
        {id:1, title: 'Public', subtitle: '102 News', image: "https://images.stockcake.com/public/6/4/e/64e85ac8-fa25-4531-8456-fe578e14037a_large/rallying-national-pride-stockcake.jpg"},
        {id:2, title: 'Tech', subtitle: '50 News', image: "https://images.stockcake.com/public/c/b/9/cb99c622-332d-4cbb-ad65-672b615654e0_large/business-news-review-stockcake.jpg"},
        {id:3, title: 'Music', subtitle: '150 News', image: "https://images.stockcake.com/public/2/f/4/2f45d23b-9ba8-4b8a-9ff8-609021bbbde0_large/excited-sports-commentator-stockcake.jpg"},
    ];

    const [selected, setSelected] = React.useState([]);
    
    const { width } = useWindowDimensions();

    return(
        <Modal height={600} setStatus={setStatus}>
            <View style={[tStyles.centery, {marginVertical: 15}]}>
                <Text style={[fonts.bold, {fontSize: 16}]}>Select collection</Text>
                <Text style={[fonts.bold, {fontSize: 16, marginTop: 5}]}>to save bookmark</Text>
            </View>

        
            {/* Bookmark Listing */}
            <FlatList
                showsVerticalScrollIndicator={ false }
                data={ bookmarks }
                keyExtractor={(item) => item.id}
                renderItem={({item}) => <ImageCatItem item={item} selected={selected} setSelected={setSelected} wide={(width*0.91)} /> }
                style={tStyles.flex1}
                contentContainerStyle={[{ paddingTop: 10, paddingBottom: 30 }]}
                numColumns={ 2 }
                columnWrapperStyle={ tStyles.spacedRow }
                ItemSeparatorComponent={<View style={{ height: 15 }} />}
            />

            <View style={[tStyles.spacedRow, {marginTop: 10}]}>
                <View style={{ width: '46%' }}>
                    <SecBtn onPress={() => setStatus(false)} title="Cancel" />
                </View>
                
                <View style={{ width: '46%' }}>
                    <MainBtn onPress={() => setStatus(false)} title="Save" />
                </View>
            </View>
        </Modal>
    )
}


export default AddToBookmarkModal;