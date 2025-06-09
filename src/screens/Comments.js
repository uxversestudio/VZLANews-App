import React from 'react';
import { View, Text, useColorScheme, ImageBackground, FlatList, Image, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, tStyles } from '../common/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { getStyles } from '../styles/comments';
import ShareBackHeader from '../components/ShareBackHeader';
import HazyTextInput from '../components/HazyTextInput';
import HeadingSub from '../components/HeadingSub';
import AddToBookmarkModal from '../components/AddToBookmarkModal';
import Pill from '../components/Pill';


const Comments = () => {
    const mode = useColorScheme();
    const [addBookmark, setAddBookmark] = React.useState(false);

    return(
        <SafeAreaView edges={['top', 'right', 'left']} style={getStyles(mode).container}>
            <KeyboardAvoidingView behavior='height' style={ getStyles(mode).container }>
                {/* Top Bar Header*/}
                <View style={{paddingHorizontal: 15, paddingBottom: 5}}>
                    <ShareBackHeader addBookmark={setAddBookmark} share={() => alert('Backend Feature')} />
                </View>

                
                {/* Comments Listing */}
                <FlatList
                    data={[1,2,3,4]}
                    keyExtractor={(item,index) => index}
                    ListHeaderComponent={<ListHeader />}
                    renderItem={({item}) => <CommentItem item={item} />}
                    style={tStyles.flex1}
                    contentContainerStyle={{paddingHorizontal: 15, rowGap: 20}}
                    showsVerticalScrollIndicator={false}
                />


                {/* Comment Box */}
                <View style={{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 30 }}>
                    <HazyTextInput placeholder="Enter your comment" icon="send" iconPress={() => alert('Backend Feature')} />
                </View>
            </KeyboardAvoidingView>

            {/* Add to bookmark Modal */}
            {addBookmark && <AddToBookmarkModal setStatus={setAddBookmark} />}

        </SafeAreaView>
    )
}


const ListHeader = () => {
    const mode = useColorScheme();

    return(
        <>
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
                    style={ getStyles(mode).newsHeadlineContainer }
                >  
                    {/* News Category */}
                    <Pill title="Entertainment" />

                    {/* News Headline */}
                    {/* News Headline */}
                    <Text style={ getStyles(mode).newsHeadline }>Test news is here...</Text>

                </LinearGradient>
            </ImageBackground>

            {/* Heading  */}
            <View style={{marginTop: 20, marginBottom: 10}}>
                <HeadingSub heading="Comments" sub="20 comments" />
            </View>
        </>
    )
}


const CommentItem = () => {
    const mode = useColorScheme();
    const [replies, setReplies] = React.useState(false);

    return(
        <>
            <View style={getStyles(mode).commentContainer}>
                <Image 
                    source={{uri: 'https://i.pravatar.cc/300'}}
                    style={getStyles(mode).commentAvatar}
                    resizeMode='cover'
                />

                <View style={[tStyles.flex1, { marginLeft: 10 }]}>
                    <Text style={getStyles(mode).commentUsername}>Jacobs</Text>
                    <Text style={getStyles(mode).commentText}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                    </Text>

                    <Text style={getStyles(mode).commentTime}>2 min ago  |  <Text onPress={()=> setReplies((prev) => !prev) }>1 Reply</Text></Text>
                </View>
            </View>
            {
                replies
                &&
                <View style={[getStyles(mode).commentContainer, { width: '85%', marginLeft: '15%', marginTop: 20 }]}>
                    <Image 
                        source={{uri: 'https://i.pravatar.cc/300'}}
                        style={getStyles(mode).replyAvatar}
                        resizeMode='cover'
                    />

                    <View style={[tStyles.flex1, { marginLeft: 10 }]}>
                        <Text style={getStyles(mode).commentUsername}>John Doe</Text>
                        <Text style={getStyles(mode).commentText}>
                            Dummy test reply comment to loreum ipsum
                        </Text>
                    </View>
                </View>
            }
        </>
    )
}


export default Comments;