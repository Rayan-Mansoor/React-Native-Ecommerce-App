import { ActivityIndicator, PermissionsAndroid, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { retreiveAllCategoriesfromFSdatabase, retreivePaginatedProductsfromFSdatabase, retreiveAllSlidersfromFSdatabase, retreiveProductsByIDfromFSdatabase } from '@/firebase/firebaseOperations';
import { FlashList } from '@shopify/flash-list';
import { Product, Category, Slider, FunctionQueue } from '@/constants/Types';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import ProductItem from '@/components/ProductItemView';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import Colors from '@/constants/Colors';
import PagerView from 'react-native-pager-view';
import { SearchBar } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';
import Voice from '@react-native-voice/voice';
import ListeningModal from '@/components/ListeningModal';
import { CategoryImageSkeleton, ProductCardSkeleton, SliderImageSkeleton } from '@/components/Skeletons';
import { RootState, addProducts } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { NetworkError } from '@/constants/Classes';
import { useRouter } from 'expo-router';

SplashScreen.preventAutoHideAsync();

let lastDoc: QueryDocumentSnapshot<DocumentData, DocumentData>;

let Glob: Product[] = []
let cartItems: Product[] = []

const functionQueue: FunctionQueue = [];

let raceFinished : boolean = false

export default function Home() {
  // const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categoryArray, setCategoryArray] = useState<Category[]>([]);
  const [sliderArray, setSliderArray] = useState<Slider[]>([]);
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [islastDocument, setIslastDocument] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [listening, setListening] = useState<boolean>(false)
  const [loadedFirstTime, setLoadedFirstTime] = useState<boolean>(true);
  // const [functionQueue, setFunctionQueue] = useState<FunctionQueue>([]);
  
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-Italic': require('../../assets/fonts/Poppins/Poppins-Italic.ttf'),
  });

  const productsState = useSelector((state: RootState) => state.products)
  const isConnected = useSelector((state: RootState) => state.network.isConnected);
  const cartState = useSelector((state: RootState) => state.cart)

  const cartProductIDs = cartState.itemList.map(item => item.productID);

  const products = productsState.itemList

  const dispatch = useDispatch()

  useEffect(() => {
    fetchCartItems()
    fetchSliders()
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isConnected !== null) {
      if (isConnected) {
        console.log("Internet available");
        while (functionQueue.length) {
          const fn = functionQueue.shift();
          if (fn) fn();
        }
      } else {
        console.log("Internet not available");
      }
    }
  }, [isConnected]);

  
  useEffect(() => {
    debouncedProductSearch(searchQuery)

    return () => {
      debouncedProductSearch.cancel();
    };
  }, [searchQuery]);

  useEffect(() => {
    console.log("filtered products called");
  }, [filteredProducts]);

  useEffect(() => {
    console.log(products);
    Glob = products
  }, [products]);


  Voice.onSpeechStart = () => {
      setListening(true)
      console.log("mic enabled")  }

  Voice.onSpeechEnd = () => {
      setListening(false)
      console.log("mic disabled")
  }

  Voice.onSpeechResults = speechResult => {
      if(speechResult.value){
          setSearchQuery(speechResult.value[0])
      }
  }
  
  const router = useRouter()

  const openDetailsScreen = () => {
    router.push("/product-detail-screen")
};

const openCheckoutScreen = () => {
  router.push("/checkout-screen")
};

  const resetHomeScreen = () => {
  };
  

   const renderProduct = ({item}: { item: Product }) => <ProductItem product={item}/>

   const renderHeader = () => { 
    return(
      <View style={{ padding:5 }}>
        {/* <Button title={'go to checkout'} onPress={openCheckoutScreen}></Button>
        <Button title={'go to detail'} onPress={openDetailsScreen}></Button> */}
        <View style={{flex:1, flexDirection: 'row', alignItems:'center'}}>
          <SearchBar
            placeholder="Search Products..."
            onChangeText={handleTextSearch}
            value={searchQuery}
            containerStyle={styles.searchContainer}
            inputContainerStyle={colorScheme === 'dark'? styles.searchInputContainer : styles.searchInputLightContainer}
            selectTextOnFocus
          />
          <TouchableOpacity style={{marginRight: 10}} onPress={handleVoiceSearch} hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
            {
              <ListeningModal visible={listening}/>
            }
            <FontAwesome name="microphone" size={24} color={colorScheme === 'dark'? 'white' : 'black'}/>
          </TouchableOpacity>
        </View>

        {searchQuery
        ? null 
        : <View>
            {sliderArray.length==0
            ? <SliderImageSkeleton/>
            : <View style={{elevation: 20, backgroundColor: '#ffffff', borderRadius: 15}}>

              <PagerView style={styles.imageSlider} initialPage={0}>
                {sliderArray && sliderArray.map((slider, index) => {
                  console.log(slider.images.source!![0])
                  return(
                    <Image
                      style={styles.sliderImage}
                      key={index}
                      source={{ uri: slider.images.source!![0] }} 
                    />
                  )
                })}
              </PagerView>
            </View> 
            }

            <Text style={styles.TextHeading}>Categories</Text>

            <ScrollView horizontal style={{ height: 120, padding: 10 }}>
            {categoryArray.length === 0 ? (
              Array(6).fill(null).map((_, index) => (
                <CategoryImageSkeleton key={index} />
            ))) 
            : (
              categoryArray.map((category, index) => (
                <TouchableOpacity key={index} style={{alignItems: 'center', justifyContent: 'center', width: 100, height: 100, marginRight:10}} onPress={()=>handleCategoryTouch(category.name)}>
                  <Image
                    source={{ uri: category.images.source!![0] }}
                    style={[styles.categoryImage, selectedCategory == category.name ? { width: 80, height: 80, } : { width: 100, height: 100 }]}
                  />
                </TouchableOpacity>
              ))
            )}
            </ScrollView>

            <Text style={styles.TextHeading}>All Products</Text>
          </View>

          }

      </View>
    )
  }

   const renderFooter = () => {
     console.log(`renderFooter called:${isloading}`)
     return (isloading? (loadedFirstTime? renderProductSkeleton() :<ActivityIndicator size="large" color="#FE7C7F" animating />): null);
   };

    const renderProductSkeleton = () => {
      setLoadedFirstTime(false)
      return (
        <View style={styles.skeletonContainer}>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </View>
      );
    };
 
   const handleTextSearch = (search: string) => {
    console.log('handleTextSearch')
    setSearchQuery(search);
  }

  const debouncedProductSearch = useMemo(() => _.debounce((query) => {
    console.log('debouncedProductSearch called for ', query);
    if (query !== '') {
      setFilteredProducts(products.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      ));
    } else {
      setFilteredProducts([]);
    }
  }, 300), [products]);

  const handleCategoryTouch = (search: string) => {
    if(selectedCategory == search){
      setSelectedCategory('')
      setFilteredProducts([])

    }else{
      setSelectedCategory(search)

      const filtered = Glob!!.filter(item => item.category.toString() === search);

      setFilteredProducts(filtered)
    }
  };

  const checkMicrophonePermission = async () : Promise<boolean> => {
    if(Platform.OS === 'android'){
        return await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)   
    }
    else {
        return false
    }
}

const requestMicrophonePermission = async () => {
    if(Platform.OS === 'android'){
        const voicePermissionReq = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)
        if (voicePermissionReq === PermissionsAndroid.RESULTS.GRANTED){
            handleVoiceSearch()
        }
    }
}

const handleVoiceSearch = async () => {
    if(await checkMicrophonePermission()){
        Voice.start('en-US');
    }else{
        requestMicrophonePermission()
    }
}


   const fetchCategories = async () => {
    try {
      const categories =  await retreiveAllCategoriesfromFSdatabase();
      setCategoryArray(categories);
    } catch (error) {
      console.log('Error fetching categories:', error);
      functionQueue.push(fetchCategories);

    }
  };

  const fetchSliders = async () => {
    try {
      const sliders = await retreiveAllSlidersfromFSdatabase();
      setSliderArray(sliders);
    } catch (error) {
      console.log('Error fetching sliders:', error);
      functionQueue.push(fetchSliders);

    }
  };

  const fetchCartItems = async () => {
    try {
      cartItems = await retreiveProductsByIDfromFSdatabase(cartProductIDs as string[]);
      console.log("The cart items are: ", cartItems)
      if(!raceFinished){
        raceFinished = !raceFinished
        if(cartItems.length !== 0){
          dispatch(addProducts(cartItems))
        }
      }else{
        const filteredCart = cartItems.filter(item => !products.some(product => product.id === item.id));
        if(filteredCart.length !== 0){
          dispatch(addProducts(filteredCart))
        }
      }
    } catch (error) {
      console.log('Error fetching cart Items:', error);
      functionQueue.push(fetchCartItems);
    }
  };

  const fetchProducts = async () => {
    console.log("fetchProducts called with lastDoc: ", lastDoc)

    try {

      if(islastDocument){
        return
      }
  
      setIsLoading(true)

      const {newProducts, lastDocument} = await retreivePaginatedProductsfromFSdatabase(lastDoc);

      if(!raceFinished){
        raceFinished = !raceFinished
        if(newProducts.length != 0){
          dispatch(addProducts(newProducts))
          }
      }else{
        console.log("cartItems for fetchProducts: ",cartItems)
        const filteredItems = newProducts.filter(item => !cartItems.some(product => product.id === item.id));
        if(filteredItems.length !== 0){
          console.log("filteredItems for fetchProducts: ",filteredItems)

          dispatch(addProducts(filteredItems))
        }
      }

      // if(newProducts.length != 0){
      //   dispatch(addProducts(newProducts))

      //   // setProducts(prevProducts => [...prevProducts, ...newProducts])
      // }
      
      if(lastDocument != lastDoc){
        lastDoc = lastDocument!!

      }else{
        setIslastDocument(true)
      }
      
      setIsLoading(false);

    } catch (error) {
      console.log('Error fetching products from Home screen:', error);

      if(error instanceof NetworkError){
        functionQueue.push(fetchProducts);
      }
    }
  };
   
   const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const memoizedHeader = useMemo(renderHeader, [searchQuery, sliderArray, categoryArray, selectedCategory, colorScheme, listening])
  const memoizedFooter = useMemo(renderFooter, [isloading])

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <FlashList
    onLayout={onLayoutRootView}
    data={searchQuery || selectedCategory ? filteredProducts: products}
    renderItem={renderProduct}
    keyExtractor={(item, index) => `product_${item.name}_${index}`}
    numColumns={3}
    estimatedItemSize={230}
    onEndReached={fetchProducts}
    onEndReachedThreshold={0.1}
    contentContainerStyle={{
      'paddingLeft': 5
    }}
    ListFooterComponent={memoizedFooter}
    ListHeaderComponent={memoizedHeader}
  />
  );
}

const styles = StyleSheet.create({
  imageSlider: {
    width: '100%',
    height: 200,
  },
  TextHeading: {
    justifyContent: 'flex-start',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    elevation: 5,
    color: Colors.lightOrange,
    shadowColor: Colors.lightOrange,
    shadowOffset: { width: 1, height: 1 },
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  searchContainer: { 
    flex:1,
    marginRight: 15,
    padding: 0, 
    margin: 0, 
    marginBottom: 10,
    borderWidth: 0,
    borderColor: 'transparent', 
    backgroundColor: 'transparent', 
    borderRadius: 15
   },
   searchInputContainer: {
    borderRadius: 15
   },
   searchInputLightContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15
   },
   skeletonContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
   },
   sliderImage:{
    borderRadius: 5,
   },
   categoryImage:{ 
    marginRight: 10, 
    borderRadius: 3,
   }

});
