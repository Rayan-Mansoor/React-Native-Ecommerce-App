import { CartProduct } from '@/constants/Types';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateItemQuantity } from '@/store';

export default function CartItemView ({ item }: { item: CartProduct }) {
    const product = item.product

    const [totalPrice, setTotalPrice] = useState<number>(product.price)
    const [quantity, setQuantity] = useState<number>(item.quantity)

    const dispatch = useDispatch()

    useEffect(() => { 
    if (quantity === 0) {
        dispatch(removeFromCart(product.id));
    } else {
        dispatch(updateItemQuantity({ productID: product.id, quantity: quantity }));
    }
        setTotalPrice(product.price * quantity)
     }, [quantity])

    // const toggleCart = () => {
    //     setInCart((prevState) => !prevState);
    //     !inCart ? dispatch(addToCart(product)) : dispatch(removeFromCart(product))
    // };

    return (
    <View style={styles.card}>
        <View style={styles.product}>
            <View style={styles.imageContainer}>
            {product.images.source
            ? (<Image style={styles.image} source={product.images.source!![0]} placeholder={product.images.placeholder}/>)
            : (<MaterialIcons name="shopping-bag" size={80} color="black" />)
            }
            </View>
            <Text style={styles.productName}>{product.name}</Text>
        </View>
        <View style={styles.pricing}>
            <TouchableOpacity style={styles.quantitySetters} onPress={() => {setQuantity((prevState) => Math.max(prevState - 1, 0))}}>
                <AntDesign name="minus" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.priceText}>{quantity}</Text>
            <TouchableOpacity style={styles.quantitySetters} onPress={() => setQuantity((prevState) => ++prevState)}>
                <AntDesign name="plus" size={24} color="black" />
            </TouchableOpacity>

          <Text style={styles.priceText}>{totalPrice}$</Text>

        </View>

    </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 15,
        borderRadius: 10,
        flexDirection: 'row',
        elevation: 5,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
        padding: 5
    },

    product: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },

    pricing: {
        flexDirection: 'row',
        alignItems: 'flex-end',
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

    image: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        elevation: 5,
    },

    productName: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black',
        margin: 5,
        marginLeft: 8
    },

    priceText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black',
        margin: 2
    },

    quantitySetters:{
        backgroundColor: '#FE7C7F',
        margin: 2
    }
});
