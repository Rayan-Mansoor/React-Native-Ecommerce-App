import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { RootState, getProductsByIds } from '@/store';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import { Product, CartItem, CartProduct } from '@/constants/Types';
import CartItemView from '@/components/CartItemView';
import { useRouter } from 'expo-router';

export default function Cart() {
  const cartState = useSelector((state: RootState) => state.cart)
  const cartItems= cartState.itemList

  const cartProductIDs = cartState.itemList.map(item => item.productID);
  

  const cartProducts = useSelector((state: RootState) => getProductsByIds(state, cartProductIDs));

  const combineProductsAndQuantities = (products: Product[], cartItems: CartItem[]): CartProduct[] => {
    return products.map(product => {
        const cartItem = cartItems.find(item => item.productID === product.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        return { product, quantity };
    });

  };

  const cartData = combineProductsAndQuantities(cartProducts, cartItems)

  const router = useRouter()

  const openCheckoutScreen = () => {
    router.push({
      pathname: '/checkout-screen',
    });
  };

  const renderProduct = ({item}: { item: CartProduct }) => <CartItemView item={item}/>

  return (
    <View style={styles.container}>
      <FlashList
      data={cartData}
      renderItem={renderProduct}
      keyExtractor={(item, index) => `product_${item.product.id}_${index}`}
      estimatedItemSize={100}
      />
      <View style={styles.subTotalSection}>
        <Text style={styles.text}>SubTotal</Text>

        <View style={styles.subTotalRightSection}>
          <Text style={styles.text}>
          {cartData.map(item => {
          const itemTotalPrice = item.product.price * item.quantity;
          return itemTotalPrice;
          }).reduce((total, price) => total + price, 0)}$
          </Text>
          <TouchableOpacity style={styles.button} onPress={openCheckoutScreen}>
            <Text style={{    fontWeight: 'bold', color: '#FFFFFF'}} >Checkout</Text>
          </TouchableOpacity>
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1  
  },

  subTotalSection: {
    margin: 5,
    padding: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,
    backgroundColor: '#FFFFFF',
  },
  subTotalRightSection:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  button: {
    backgroundColor: '#FE7C7F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
    margin: 5,
    marginLeft: 8
  },
});
