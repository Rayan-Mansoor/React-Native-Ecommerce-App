export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: Categories,
    stock: number,
    images: ImageData;
}

export type ProductToSave = {
    name: string;
    description: string;
    price: number;
    category: Categories,
    stock: number,
    images: ImageData;
}

export type Category = {
    name: string;
    images: ImageData;
}
  
export type Slider = {
    description?: string;
    images: ImageData;
}
  
export interface Props {
    product : Product,
    item : CartItem
}

export type ImageData = {
    source?: string[];
    placeholder?: string;
}

export type OldProduct = {
    productID: string;
    productName: string;
    productDescription: string;
    productCategory: Categories;
    productPrice: number;
    productStock: number;
    productRating: number;
    productContainsImages: boolean;
    productHasReviews: boolean;
}

export interface Receiver {
    receiverName: string;
    receiverPhoneNo: string;
  }
  
  export interface Coordinates {
    latitude: number;
    longitude: number;
  }
  
  export interface Address {
    general: string;
    city: string;
  }
  
  export interface Location {
    coordinates: Coordinates | null;
    address: Address;
  }
  
  export interface Items {
    itemID: string;
    itemCategory: Categories;
    quantity: number;
  }
  
  export interface Amount {
    itemTotal: number;
    discount: number;
    deliverFee: number;
    grandTotal: number;
  }
  
  export interface Order {
    orderID: string;
    receiver: Receiver;
    cart: Items[];
    deliveryLocation: Location;
    paymentMethod: PaymentMethod;
    amount: Amount;
    timeStamp: number;
    status: DeliveryStatus;
  }
  

export enum Categories {
    APPAREL = "APPAREL",
    FOOTWEAR = "FOOTWEAR",
    EYEWEAR = "EYEWEAR",
    WATCHES = "WATCHES",
    JEWELLERY = "JEWELLERY",
    BAGS = "BAGS"
  }
  

export enum PaymentMethod {
    CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
    CREDIT_DEBIT_CARD = "CREDIT_DEBIT_CARD",
  }
  
export  enum DeliveryStatus {
    PENDING = "PENDING",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
  }

export type CartItem = {
    productID: String;
    quantity: number;
};


export type CartProduct = {
    product: Product;
    quantity: number;
};

export type FunctionQueue = (() => Promise<void>)[];
