import React from 'react';
import { View, Text, useColorScheme, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import BackHeader from '../components/BackHeader';
import { getStyles } from '../styles/notifications';
import { tStyles, colors, fonts } from '../common/theme';
import { Feather } from '@expo/vector-icons';
import HeadingSub from '../components/HeadingSub';
import PillBtn from '../components/PillBtn';


const Notifications = () => {
    const mode = useColorScheme();

    const notifications = [
        { 
            id: 1, 
            username: "CNN", 
            type: 'news', 
            time: '', 
            userAvatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/CNN_International_logo.svg/600px-CNN_International_logo.svg.png", 
            news: "Exit poll results of the USA Elections", 
            newsImg: "https://ichef.bbci.co.uk/ace/standard/1024/cpsprodpb/f3ff/live/0d0c6660-50d4-11ef-8f0f-0577398c3339.jpg" 
        },
        { 
            id: 2, 
            username: "John", 
            type: 'follow', 
            time: '', 
            userAvatar: "https://i.pravatar.cc/300?u=john@geeksparks.com",
            following: true
        },
        { 
            id: 3, 
            username: "Jake", 
            type: 'comment', 
            time: '', 
            userAvatar: "https://i.pravatar.cc/300?u=jake@geeksparks.com", 
            post: "Exit poll results of the USA Elections", 
            postImg: "https://ichef.bbci.co.uk/ace/standard/1024/cpsprodpb/f3ff/live/0d0c6660-50d4-11ef-8f0f-0577398c3339.jpg" 
        },
        { 
            id: 4, 
            username: "Jimmy", 
            type: 'commentReply', 
            time: '', 
            userAvatar: "https://i.pravatar.cc/300?u=jimmy@geeksparks.com", 
            comment: "Amazing stuff", 
            postImg: "https://media.cnn.com/api/v1/images/stellar/prod/01j4f1dmdtf8nmw4wn3y8feyc8.jpg?q=w_1110,c_fill/f_webp" 
        },
    ];

    return(
        <SafeAreaView edges={['top', 'right', 'left']} style={getStyles(mode).container}>
            {/* Top Bar */}
            <View style={[tStyles.spacedRow, { paddingHorizontal: 15 }]}>
                <BackHeader />

                {/* <TouchableOpacity>
                    <Feather name='trash' size={ 18 } />
                </TouchableOpacity> */}
            </View>

            <View style={{ paddingHorizontal: 15, marginTop: 10, marginBottom: 10 }}>
                <HeadingSub heading="Notifications" sub="You have 8 notifications today" />
            </View>

            {/* Notifications Listing  */}
            <FlatList 
                bounces={false}
                data={[...notifications, ...notifications, ...notifications]}
                style={[tStyles.flex1, {marginTop: 10}]}
                keyExtractor={(item, index) => index}
                renderItem={({item}) => <NotificationItem item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 30 }}
            /> 
            
        </SafeAreaView>
    )
}


const NotificationItem = ({ item }) => {
    const mode = useColorScheme();

    const swipeRef = React.useRef(null);
    const renderRightActions = (_progress, translation, swipeRef) => (
        <RightAction dragX={translation} swipeRef={swipeRef} />
    );

    const RightAction = ({ dragX, swipeRef }) => {
        return(
            <View style={[{ paddingLeft: 20, paddingTop: 15 }]}>
                <TouchableOpacity onPress={() => swipeRef.current?.close()} style={getStyles(mode).delBtn}>
                    <Feather name='trash' size={ 12 } color={colors.white} />
                </TouchableOpacity>
            </View>
        )
    }

    const NotItem = ({item}) => {
        if(item.type == 'follow'){
            return(<FollowItem item={item} />)
        }
    
        if(item.type == 'news'){
            return(<NewsItem item={item} />)
        }
    
        if(item.type == 'comment'){
            return(<CommentItem item={item} />)
        }
    
        if(item.type == 'commentReply'){
            return(<CommentReplyItem item={item} />)
        }
    }


    return(
        <Swipeable
            ref={swipeRef}
            friction={2}
            enableTrackpadTwoFingerGesture
            rightThreshold={30}
            renderRightActions={(_, progress) =>
                renderRightActions(_, progress, swipeRef)
            }
            leftThreshold={Number.MAX_VALUE}
        >
            <NotItem item={ item } />
        </Swipeable>
    )
}


const FollowItem = ({item}) => {
    const mode = useColorScheme();

    return(
        <View style={[tStyles.row, {paddingVertical: 12}]}>
            <TouchableOpacity>
                <Image
                    source={{uri: item.userAvatar}}
                    style={getStyles(mode).userAvatar}
                />
            </TouchableOpacity>
            

            <View style={[tStyles.flex1, tStyles.spacedRow, {marginLeft: 10}]}>
                <View>
                    <Text style={getStyles(mode).detailText}><Text style={fonts.bold}>{ item.username }</Text> followed you</Text>
                    <Text style={getStyles(mode).timeText}>2 min ago</Text>
                </View>
                {
                    (!item.following)
                    ?
                        <PillBtn title="+ Follow" color={ colors.primary } />
                    :
                        <PillBtn title="Followed" color={ colors.gray25 } />
                }
                
            </View>
        </View>
    )
}


const NewsItem = ({item}) => {
    const mode = useColorScheme();

    return(
        <View style={[tStyles.row, tStyles.starty, {paddingVertical: 12}]}>
            <TouchableOpacity>
                <Image
                    source={{uri: item.userAvatar}}
                    style={getStyles(mode).userAvatar}
                />
            </TouchableOpacity>
            

            <View style={[tStyles.flex1, tStyles.spacedRow, tStyles.starty, { marginLeft: 10}]}>
                <View style={{ width: '75%' }}>
                    <Text style={getStyles(mode).detailText}><Text style={fonts.bold}>{ item.username }</Text> has posted new political news "Exit poll results of the USA Elections"</Text>
                    <Text style={getStyles(mode).timeText}>2 min ago</Text>
                </View>

                <Image
                    source={{uri: item.newsImg}}
                    style={getStyles(mode).newsImg}
                />
                
            </View>
        </View>
    )
}


const CommentItem = ({item}) => {
    const mode = useColorScheme();

    return(
        <View style={[tStyles.row, tStyles.starty, {paddingVertical: 12}]}>
            <TouchableOpacity>
                <Image
                    source={{uri: item.userAvatar}}
                    style={getStyles(mode).userAvatar}
                />
            </TouchableOpacity>
            

            <View style={[tStyles.flex1, tStyles.spacedRow, tStyles.starty, { marginLeft: 10}]}>
                <View style={{ width: '75%' }}>
                    <Text style={getStyles(mode).detailText}><Text style={fonts.bold}>{ item.username }</Text> commented on news "{item.post}"</Text>
                    <Text style={getStyles(mode).timeText}>2 min ago</Text>
                </View>

                <Image
                    source={{uri: item.postImg}}
                    style={getStyles(mode).newsImg}
                />
                
            </View>
        </View>
    )
}



const CommentReplyItem = ({item}) => {
    const mode = useColorScheme();

    return(
        <View style={[tStyles.row, tStyles.starty, {paddingVertical: 12}]}>
            <TouchableOpacity style={{ width: 40, height: 40, position: 'relative' }}>
                <Image
                    source={{uri: 'https://i.pravatar.cc/300?u=info@geeksparks.com'}}
                    style={[getStyles(mode).userAvatar, { width: 28, height: 28 }]}
                />
                <Image
                    source={{uri: item.userAvatar}}
                    style={getStyles(mode).userReplyAvatar}
                />
            </TouchableOpacity>
            

            <View style={[tStyles.flex1, tStyles.spacedRow, tStyles.starty, { marginLeft: 10}]}>
                <View style={{ width: '75%' }}>
                    <Text style={getStyles(mode).detailText}><Text style={fonts.bold}>{item.username}</Text> replied to your comment "{item.comment}"</Text>
                    <Text style={getStyles(mode).timeText}>2 min ago</Text>
                </View>

                <Image
                    source={{uri: item.postImg}}
                    style={getStyles(mode).newsImg}
                />
                
            </View>
        </View>
    )
}

export default Notifications;