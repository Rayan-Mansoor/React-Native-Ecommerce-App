import { PayloadAction, configureStore, createSelector, createSlice } from "@reduxjs/toolkit";
import { Product, CartItem } from "./constants/Types";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from "redux-persist";
import { createMMKVStorage } from "./key_value_storage/mmkvStorage";

const initialCounterState = {
    count: 0
}

const counterSlice = createSlice({
    name: "counter",
    initialState: initialCounterState,
    reducers: {
        increment: (state) => {
            state.count++
        },
        decrement: (state) => {
            state.count--
        },
        reset: (state) => {
            state.count = 0
        }
    }
})

const initialUserState = {
    currentUserName: ''
}

const userSlice = createSlice({
    name: "user",
    initialState: initialUserState,
    reducers: {
        updateUserName: (state, action) => {
            state.currentUserName = action.payload;
        }
    }
})

type NetworkState = {
    isConnected: boolean | null;
};


const initialNetworkState = {
    isConnected: null
} as NetworkState

const networkSlice = createSlice({
    name: "network",
    initialState: initialNetworkState,
    reducers: {
        setNetworkState(state, action: PayloadAction<boolean | null>) {
          state.isConnected = action.payload;
        },
      },
})

type CartState = {
    itemList: CartItem[];
    totalItems: number;
};


const initialCartState = {
    itemList: [],
    totalItems: 0
} as CartState

const cartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        addToCart: (state: CartState, action: PayloadAction<string>) => {
            return {
              ...state,
              itemList: [...state.itemList, { productID: action.payload, quantity: 1 }],
              totalItems: state.totalItems + 1
            };
          },
        removeFromCart: (state: CartState, action: PayloadAction<string>) => {
            const updatedItemList = state.itemList.filter(item => item.productID !== action.payload);
            return {
              ...state,
              itemList: updatedItemList,
              totalItems: state.totalItems - 1
            };
        },
        updateItemQuantity: (state: CartState, action: PayloadAction<{ productID: string; quantity: number }>) => {
            const { productID, quantity } = action.payload;
            const updatedItemList = state.itemList.map(item => {
                if (item.productID === productID) {
                    return { ...item, quantity: quantity };
                }
                return item;
            });
            return {
                ...state,
                itemList: updatedItemList
            };
        }
    }
})

type FavouriteState = {
    itemIDs: string[];
    totalItems: number;
};


const initialFavouriteState = {
    itemIDs: [],
    totalItems: 0
} as FavouriteState

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: initialFavouriteState,
    reducers: {
      addToFavorites: (state: FavouriteState, action: PayloadAction<string>) => {
        return {
            ...state,
            itemIDs: [...state.itemIDs, action.payload],
            totalItems: state.totalItems + 1
          };
      },
      removeFromFavorites: (state, action) => {
        const updatedItemList = state.itemIDs.filter(item => item !== action.payload);
        return {
          ...state,
          itemIDs: updatedItemList,
          totalItems: state.totalItems - 1
        };
      },
    },
  });
  

type ProductState = {
    itemList: Product[];
};


const initialProductsState = {
    itemList: [],
} as ProductState

const productsSlice = createSlice({
    name: "products",
    initialState: initialProductsState,
    reducers: {
        addProducts: (state: ProductState, action: PayloadAction<Product[]>) => {
            return {
                ...state,
                itemList: state.itemList.concat(action.payload),
            };
          }
    },

})

export const getProductsByIds = createSelector(
  (state: RootState) => state.products.itemList,
  (_, productIds: string[]) => productIds,
  (products, productIds) =>
    products.filter((product: { id: any; }) => productIds.includes(product.id))
);

const cartPersistConfig = {
    key: 'cart',
    storage: createMMKVStorage(),
  };
  
  const favoritesPersistConfig = {
    key: 'favorites',
    storage: createMMKVStorage(),
  };

const persistedCart = persistReducer(cartPersistConfig, cartSlice.reducer);
const persistedFavourites = persistReducer(favoritesPersistConfig, favoritesSlice.reducer);

const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        user: userSlice.reducer,
        products: productsSlice.reducer,
        cart: persistedCart,
        favourite: persistedFavourites,
        network: networkSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
})


export type RootState = ReturnType<typeof store.getState>

export const {increment, decrement, reset} = counterSlice.actions
export const {updateUserName} = userSlice.actions
export const {addProducts} = productsSlice.actions
export const {setNetworkState} = networkSlice.actions
export const {addToCart, removeFromCart, updateItemQuantity} = cartSlice.actions
export const {addToFavorites, removeFromFavorites} = favoritesSlice.actions

export const persistor = persistStore(store);
export default store;
