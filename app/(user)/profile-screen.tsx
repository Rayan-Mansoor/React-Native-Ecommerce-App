import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router'

const UserSettingsScreen = () => {
  const router = useRouter()

  const handleLogout = () => { 
    
   }

  const handleOpenEditProfileScreen = () => { 
    
   } 

   const handleOpenOrdersScreen = () => {
    router.push({
      pathname: '/my-orders-screen',
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={{flex: 1}}>
          <Text style={styles.userName}>User Name</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.userButton} onPress={handleOpenEditProfileScreen}>
              <Text style={{fontWeight: 'bold'}}>Edit Profile</Text>
              <MaterialIcons name="edit-note" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.userButton} onPress={handleLogout}>
              <Text style={{fontWeight: 'bold'}}>Logout</Text>
              <Entypo name="log-out" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.imageContainer}>
          <FontAwesome name="user-circle-o" size={60} color="black" />
        </View>

    </View>

      <View style={styles.divider} />

      <Pressable>
        {({ pressed }) => (
          <View style={[styles.mainButton,{opacity: pressed ? 0.5 : 1}]}>
            <MaterialIcons style={{marginRight: 20}} name="admin-panel-settings" size={24} color="black" />
            <Text style={styles.buttonText}>Login as Administrator</Text>
          </View>
        )}
      </Pressable>

      <View style={styles.divider} />

      <Pressable>
        {({ pressed }) => (
          <View style={[styles.mainButton,{opacity: pressed ? 0.5 : 1}]}>
            <Fontisto style={{marginRight: 20}} name="favorite" size={24} color="black" />
            <Text style={styles.buttonText}>My Wishlist</Text>
          </View>
        )}
      </Pressable>

      <View style={styles.divider} />

      <Pressable onPress={handleOpenEditProfileScreen}>
        {({ pressed }) => (
          <View style={[styles.mainButton,{opacity: pressed ? 0.5 : 1}]}>
            <FontAwesome5 style={{marginRight: 20}} name="shopping-basket" size={24} color="black" />
            <Text style={styles.buttonText}>My Orders</Text>
          </View>
        )}
      </Pressable>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  card: {
    borderRadius: 10,
    flexDirection: 'row',
    elevation: 5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    padding: 5
  },
  innerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent', // Adjust the background to match gradient
    padding: 18,
  },
  iconButton: {
    backgroundColor: 'transparent',
    marginEnd: 10,
  },
  userName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: 'black',
  },
  userImage: {
    width: 80,
    height: 100,
  },
  googleLogo: {
    width: 35,
    height: 35,
  },
  divider: {
    marginVertical: 15,
    height: 2,
    backgroundColor: '#d3d3d3',
    borderRadius: 2,
  },
  cardButton: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 15,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  buttonText: {
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginEnd: 10,
  },
  imageContainer: {
    width: 80,
    height: 100,
    alignSelf: 'center',
    backgroundColor: '#FE7C7F',
    borderRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
},
buttonsContainer:{
  flex: 1,
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
},
userButton: {
  flex: 1,
  flexDirection: 'row',
  marginRight: 20,
  backgroundColor: '#FE7C7F',
  alignItems: 'center',
  borderRadius: 10,
  elevation: 5,
  padding: 5,
  justifyContent: 'space-between',
},
mainButton: {
  flexDirection: "row", 
  backgroundColor: "#ffffff",
  borderRadius: 5,
  padding: 10,
  alignItems: 'center',
  justifyContent: 'center'
},

});

export default UserSettingsScreen;
