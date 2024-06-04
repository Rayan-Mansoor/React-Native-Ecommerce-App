import { useFonts } from "expo-font";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Pressable,
} from "react-native";
import {
  Card,
} from "react-native-paper";
import { Image } from 'expo-image';
import { Rating } from "react-native-ratings";
import * as SplashScreen from "expo-splash-screen";
import { MaterialIcons } from "@expo/vector-icons"; 
import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import { Product } from "@/constants/Types";
import PagerView from "react-native-pager-view";
import { useDispatch, useSelector } from "react-redux";
import { RootState, addToCart } from "@/store";

SplashScreen.preventAutoHideAsync();

const ProductDetailScreen = () => {
  const { stringifyProduct } = useLocalSearchParams();
  const product: Product = JSON.parse(stringifyProduct as string);

  const inCart = useSelector((state: RootState) => {
    return state.cart.itemList.some(item => item.productID === product.id);
  });

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const sizes = ["S", "M", "L", "XL"];
  const colors = ["red", "blue", "green"];

  const colorScheme = useColorScheme();
  const dispatch = useDispatch()

  const handleAddToCart = () => {
   dispatch(addToCart(product.id))
};

  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-Italic": require("../assets/fonts/Poppins/Poppins-Italic.ttf"),
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
    <ScrollView contentContainerStyle={styles.container} onLayout={onLayoutRootView}>
      <View style={{elevation: 20, backgroundColor: '#ffffff', borderRadius: 15}}>
      <PagerView style={styles.imageSlider} initialPage={0}>
      {product.images.source!!.map((url, index) => {
          return (
              <Image
                  style={styles.sliderImage}
                  key={index}
                  source={{ uri: url }}
                  onError={(error) => console.log('Error loading image:', error)}
              />
          );
      })}
      </PagerView>
      </View>

      <View style={styles.divider} />

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.productName}>{product.name}</Text>

        <Rating
          type="star"
          ratingCount={5}
          imageSize={25}
          readonly
          startingValue={4}
          tintColor={colorScheme === 'dark'? '#000000' : '#f1f3f2'}
          style={styles.rating}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
      <Text style={colorScheme === 'dark'? [styles.productDescription, { color: '#f1f3f2' }] : styles.productDescription}>{product.description}</Text>
      <Text style={colorScheme === 'dark'? [styles.price, { color: '#f1f3f2' }] : styles.price}>{product.price} $</Text>

      </View>

      <View style={styles.divider} />

      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1, marginRight: 10}}>
          <Text style={styles.sectionTitle}>Sizes</Text>
          <View style={styles.scrollViewWrapper}>
            <ScrollView horizontal contentContainerStyle={styles.sizeContainer}>
              {sizes.map((size, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.sizeCircle,
                    selectedSize === size && styles.selectedSizeCircle,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={styles.sizeText}>{size}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>Colors</Text>
          <View style={styles.scrollViewWrapper}>
            <ScrollView horizontal contentContainerStyle={styles.sizeContainer}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color, borderColor: color },
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <MaterialIcons name="check" size={20} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      <Pressable onPress={handleAddToCart} disabled={inCart}>
        {({ pressed }) => (
          <View style={[styles.cartbutton,{ opacity: inCart ? 0.5 : (pressed ? 0.5 : 1) }]}>
            <FontAwesome5 name="shopping-cart" size={20} color="black" />
            <Text style={styles.buttonText}>Add to Cart</Text>
          </View>
        )}
      </Pressable>

      <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between' }}>
      <Text style={styles.sectionTitle}>Reviews</Text>
      <Pressable>
        {({ pressed }) => (
          <View style={[styles.reviewbutton,{opacity: pressed ? 0.5 : 1}]}>
            <MaterialIcons name="reviews" size={24} color="black" />
            <Text style={styles.buttonText}>Give Review</Text>
          </View>
        )}
      </Pressable>
        </View> 
      <Card style={styles.card}>
        <View style={styles.reviewContainer}>
          {/* Example reviews list */}
          <Text style={styles.reviewText}>Review 1</Text>
          <Text style={styles.reviewText}>Review 2</Text>
          <Text style={styles.reviewText}>Review 3</Text>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },

  card: {
    borderRadius: 15,
    elevation: 10,
  },
  image: {
    height: 220,
  },
  divider: {
    marginVertical: 10,
    height: 2,
    backgroundColor: '#d3d3d3',
    borderRadius: 2,
  },
  selectedText: {
    color: "#fff",
  },
  productName: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#fe7c7f",
  },
  productDescription: {
    flex: 1,
    flexShrink: 1,
    fontSize: 15,
    marginTop: 10,
  },
  rating: {
    alignSelf: "flex-start",
    marginTop: 5,
  },
  selectedCircle: {
    backgroundColor: "#fe7c7f",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fe7c7f",
    marginTop: 15,
  },
  horizontalScrollView: {
    marginTop: 5,
  },
  colorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginLeft: 8,
    color: 'black',
    fontWeight: 'bold',
  },
  price: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    marginTop: 10,
    marginLeft: 10,
  },
  cartbutton: {
    flex: 1, 
    flexDirection: "row", 
    marginTop: 10,
    backgroundColor: "#fe7c7f",
    borderRadius: 5,
    padding: 10,
    alignSelf: 'center'
  },
  reviewbutton: {
    flex: 1, 
    flexDirection: "row", 
    marginTop: 10, 
    backgroundColor: "#fe7c7f",
    borderRadius: 5,
    padding: 10,
    alignSelf: 'center'
  },
  reviewContainer: {
    padding: 8,
  },
  reviewText: {
    marginBottom: 10,
  },

  scrollViewWrapper: {
    marginVertical: 5,
    borderWidth: 3,
    borderColor: "#fe7c7f",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sizeCircle: {
    width: 30,
    height: 30,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "grey",
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  selectedSizeCircle: {
    borderColor: "#fe7c7f",
    borderWidth: 3,
    backgroundColor: "#fe7c7f",
  },

  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "grey",
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  selectedColorCircle: {
    borderColor: "#fe7c7f",
    borderWidth: 3,
    backgroundColor: "#fe7c7f",
  },
  sizeText: {
    fontSize: 16,
    color: "white",
  },
  sliderView:{
    elevation: 20
  },
  imageSlider: {
    width: '100%',
    height: 200,
  },
  sliderImage:{
    borderRadius: 15,
   },
});

export default ProductDetailScreen;
