import { View, Text,StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Product } from '@/constants/Types';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { RootState, addToCart, addToFavorites, removeFromCart, removeFromFavorites } from '@/store';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router'
import _ from 'lodash';


SplashScreen.preventAutoHideAsync();

export default function ProductItem({product} : {product: Product}) {
  const isFavourite = useSelector((state: RootState) => {
    return state.favourite.itemIDs.some(item => item === product.id);
  });
  const inCart = useSelector((state: RootState) => {
    return state.cart.itemList.some(item => item.productID === product.id);
  });

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-Italic': require('../assets/fonts/Poppins/Poppins-Italic.ttf'),
  });

  const router = useRouter()

  const dispatch = useDispatch()

  const toggleFavourite = () => {
      // setIsFavourite((prevState) => !prevState);
      !isFavourite ? dispatch(addToFavorites(product.id)) : dispatch(removeFromFavorites(product.id));

    };
    
    const toggleCart = () => {
        // setInCart((prevState) => !prevState);
        !inCart ? dispatch(addToCart(product.id)) : dispatch(removeFromCart(product.id));
    };


    const onLayoutRootView = useCallback(async () => {
      if (fontsLoaded || fontError) {
        await SplashScreen.hideAsync();
      }
    }, [fontsLoaded, fontError]);  

    const openDetailsScreen = () => {
      const encodedProduct = {
        ...product,
        images: {
          source: product.images.source?.map(url => encodeURIComponent(url)),
          placeholder: product.images.placeholder
        }
      };
    
      router.push({
        pathname: '/product-detail-screen',
        params: { stringifyProduct: JSON.stringify(encodedProduct) }
      });
    };
    
    
  
    if (!fontsLoaded && !fontError) {
      return null;
    }

   
  return (
    <Pressable onPress={openDetailsScreen}>
    {({ pressed }) => (
      <View style={[styles.card, {opacity: pressed ? 0.5 : 1}]} onLayout={onLayoutRootView}>
      <View style={[styles.imageContainer, {backgroundColor: pressed ? 'transparent' : '#FE7C7F', opacity: pressed ? 0.5 : 1}]}>

        {product.images.source
        ? (<Image style={styles.image} source={product.images.source!![0]} placeholder={product.images.placeholder}/>)
        : (<MaterialIcons name="shopping-bag" size={80} color="black" />)
      }
      </View>
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.productName}>{product.name}</Text>
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.productDesc}>{product.description}</Text>
      <View style={styles.buttonsContainer}>
        <Text style={styles.productPrice}>${product.price}</Text>
        <TouchableOpacity onPress={toggleFavourite} style={{marginRight: 5}}hitSlop={{ top: 10, left: 10, bottom: 10, right: 5 }}>
          <AntDesign name={isFavourite ? "heart" : "hearto"} size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCart} hitSlop={{ top: 10, left: 5, bottom: 10, right: 10 }}>
          <MaterialIcons name={inCart ? "remove-shopping-cart" : "add-shopping-cart"} size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
    )}
  </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 110,
    height: 230,
    margin: 10,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    elevation: 20,
    padding: 8
  },
  imageContainer: {
    width: 80,
    height: 100,
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    borderRadius: 15,
    elevation: 5,
  },
  productName: {
    marginTop: 5,
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#000000',
  },
  productDesc: {
    fontSize: 11,
    fontFamily: 'Poppins-Italic',
    color: '#000000',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    color: '#000000',
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  }
});
