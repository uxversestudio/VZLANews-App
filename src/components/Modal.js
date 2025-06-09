import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Animated, Pressable, KeyboardAvoidingView, View, Platform } from 'react-native';
import { tStyles } from '../common/theme';



const Modal = ({ setStatus, children, height }) => {
    const scale = React.useRef(new Animated.Value(0)).current;
    const paddingBottom = Platform.OS == "ios" ? 50 : 100


    const scaleUp = () => {
        // Will scale up the modal
        Animated.timing(scale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      };
    
      const scaleDown = () => {
        // Will scale down the modal
        Animated.timing(scale, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
            setStatus(false);
        });
      };


      React.useEffect(() => {
        scaleUp()
      })


      const closeModal = () => {
        scaleDown();
      }


    return(
        <Pressable style={[styles.backdrop, {paddingBottom}]}>
            <KeyboardAvoidingView behavior='padding'>
                <Pressable style={{ width: '100%', height, paddingHorizontal: 15 }}>
                    <Animated.View style={[styles.modalBody, { transform: [{ scale }] }]}>
                        <View style={tStyles.endy}>
                            <Pressable onPress={closeModal} style={{ padding: 10}}>
                                <AntDesign name="close" size={20} />
                            </Pressable>
                        </View>
                        { children }
                    </Animated.View>
                </Pressable>
            </KeyboardAvoidingView>
        </Pressable>
        
    )
}


export default Modal;


const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: '100%',
        height: '104%',
        justifyContent: 'flex-end',
    },
    modalBody: {
        width: '100%',
        height: '100%',
        borderRadius: 35,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20
    }
})