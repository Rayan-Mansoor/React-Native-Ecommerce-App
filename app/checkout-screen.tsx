import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useCallback, useState } from 'react'
import { ScrollView } from 'moti'
import { FontAwesome5 } from '@expo/vector-icons';
import { DefaultTheme, PaperProvider, TextInput } from 'react-native-paper';
import { useFonts } from 'expo-font';
import { SplashScreen, router } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const checkout = () => {
    const [receiverName, setReceiverName] = useState('')
    const [receiverPhoneNo, setPhoneNo] = useState('')
    const [receiverEmail, setReceiverEmail] = useState('')
    const [promoCode, setPromoCode] = useState('')

    const colorScheme = useColorScheme();

    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
        'Poppins-Italic': require('../assets/fonts/Poppins/Poppins-Italic.ttf'),
      });

    const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
        await SplashScreen.hideAsync();
    }
    }, [fontsLoaded, fontError]);  


    if (!fontsLoaded && !fontError) {
        return null;
    }

  return (
    <KeyboardAvoidingView style={styles.container} onLayout={onLayoutRootView}>
        <ScrollView>
            <Text style={styles.textHeading}>Deliver To</Text>
            <View style={{paddingStart:15, paddingEnd:15}}>
                <TextInput
                style={colorScheme === 'dark'? styles.darkInputContainer : styles.lightInputContainer}
                outlineStyle={{borderRadius: 8 }}
                outlineColor='#fe7c7f'
                activeOutlineColor='#fe7c7f'
                cursorColor='#fe7c7f'
                selectionColor='#fe7c7f'
                mode='outlined'
                label="Receiver's Name"
                value={receiverName}
                onChangeText={text => setReceiverName(text)}
            />            
            <TextInput
                style={colorScheme === 'dark'? styles.darkInputContainer : styles.lightInputContainer}
                outlineStyle={{borderRadius: 8}}
                outlineColor='#fe7c7f'
                activeOutlineColor='#fe7c7f'
                cursorColor='#fe7c7f'
                mode='outlined'
                label="Receiver's Phone No."
                keyboardType="numeric"
                value={receiverPhoneNo}
                onChangeText={text => setPhoneNo(text)}
            />
            <View style={styles.addressContainer}>
            <TextInput 
                style={colorScheme === 'dark'? [{flex: 1},styles.darkInputContainer] : [{flex: 1},styles.lightInputContainer]}
                outlineStyle={{borderRadius: 8}}
                outlineColor='#fe7c7f'
                activeOutlineColor='#fe7c7f'
                cursorColor='#fe7c7f'
                mode='outlined'
                label="Receiver's Address"
                value={receiverEmail}
                onChangeText={text => setReceiverEmail(text)}
            />
            <TouchableOpacity style={styles.marker}>
                <FontAwesome5 name="map-marker-alt" size={24} color="red" />
            </TouchableOpacity>
            </View>
            
            </View>

            
            
            {/* Vouchers Section */}
            <Text style={styles.textHeading}>Vouchers</Text>
            
            <TextInput 
                style={colorScheme === 'dark'? [{width: 100},styles.darkInputContainer] : [{width: 100},styles.lightInputContainer]}
                outlineStyle={{borderRadius: 8}}
                outlineColor='#fe7c7f'
                activeOutlineColor='#fe7c7f'
                cursorColor='#fe7c7f'
                mode='outlined'
                label="Enter Promo Code"
                value={promoCode}
                onChangeText={text => setPromoCode(text)}
            />

            {/* Order Details Section */}
            <Text style={styles.textHeading}>Order Details</Text>
            {/* Your order details components */}

            {/* Select Payment Method Section */}
            <Text style={styles.textHeading}>Select Payment Method</Text>
            {/* Your payment method components */}

            {/* Amount Section */}
            <Text style={styles.textHeading}>Amount</Text>
            {/* Your amount components */}

            {/* Place Order Button */}
            <TouchableOpacity style={styles.placeOrderButton}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Place Order</Text>
            </TouchableOpacity>
            
            {/* Progress Bar */}
            {/* Your progress bar component */}
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default checkout

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding: 10
    },
    textHeading: {
        elevation: 5,
        fontFamily: 'Poppins-Bold',
        color: '#fe7c7f',
        fontSize: 18,
    },
    lightInputContainer: {
        fontSize: 13,
        height:40
      },
      darkInputContainer: {
        backgroundColor: '#383838',
        fontSize: 13,
        height:40
      },
      addressContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems:'center'
      },
      marker: {
        margin: 10
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFA500',
        marginTop: 20,
      },
      placeOrderButton: {
        backgroundColor: '#fe7c7f',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        marginTop: 5,
      },
})
