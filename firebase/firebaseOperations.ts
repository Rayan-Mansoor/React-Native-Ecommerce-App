import { ref as Dref, onValue } from "firebase/database";
import { collection, setDoc, doc, getDocs, limit, orderBy, query, addDoc, startAfter, DocumentData, QueryDocumentSnapshot, where, documentId } from "firebase/firestore"; 
import { ref as Sref, StorageReference, getDownloadURL, listAll  } from 'firebase/storage';
import { fsdb, rtdb, storage } from "./firebaseConfig";
import { Category, OldProduct, Product, ImageData, Slider, ProductToSave, Order } from "../constants/Types";
import _ from 'lodash';
import store from "../store";
import { NetworkError } from "../constants/Classes";

let currentAbortController: AbortController | null = null;

const retreiveProductsfromRTdatabase = () => { 
    const productsRef = Dref(rtdb, 'Products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.entries(data).forEach(async ([key, productData]) => {
          // console.log(productData)

          const imagesStorageRef = Sref(storage, `images/products/${key}`)


          const imagesArray = await getImageDownloadURL(imagesStorageRef)


          const { productName, productDescription, productPrice, productCategory, productStock } = productData as OldProduct;

          console.log(productName)
          const product: ProductToSave = {
            name: productName,
            description: productDescription,
            price: productPrice,
            category: productCategory,
            stock: productStock,
            images: { source: imagesArray } // Placeholder for image data, you can modify this as per your data structure
          };
          saveProductToFirestore(key, product);
        });
        console.log("Finish")
      }
    });
  }

  const retreiveCategoriesfromRTdatabase = () => { 
    const categoriesRef = Dref(rtdb, 'Categories');
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.entries(data).forEach(async ([key, value]) => {
          // console.log(productData)
          const categoryName = value as string
          console.log(categoryName.toLowerCase())


          const imagesStorageRef = Sref(storage, `images/categories/${categoryName.toLowerCase()}`)


          const imagesArray = await getImageDownloadURL(imagesStorageRef)

          const category: Category = {
            name: value as string,
            images: { source: imagesArray } // Placeholder for image data, you can modify this as per your data structure
          };

          saveCategoryToFirestore(category);
        });
        
        console.log("Finish")
      }
    });
  }

  const retreivePromotionalSlidersfromGCS = async () => { 
    const imagesStorageRef = Sref(storage, `images/slider`)

    const imagesArray = await getImageDownloadURL(imagesStorageRef)

    imagesArray.forEach(url => {
      const slider: Slider = {
        images: { source: [url] } // Placeholder for image data, you can modify this as per your data structure
      };
  
      saveSliderToFirestore(slider);
    });
  }
  const saveProductToFirestore = async (key: string, product: ProductToSave) => {
    try {
      await setDoc(doc(fsdb, 'products', key), product);
      console.log(`Product with id:${key} saved to Firestore`);
    } catch (error) {
      console.error('Error saving product to Firestore:', error);
    }
  };

  const saveCategoryToFirestore = async (category: Category) => {
    try {
        const categoriesCollectionRef = collection(fsdb, 'categories');
        const querySnapshot = await addDoc(categoriesCollectionRef, category);
        console.log(querySnapshot);
      } catch (error) {
        console.error('Error saving category to Firestore:', error);
      }
  };

  const saveSliderToFirestore = async (slider: Slider) => {
    try {
      const slidersCollectionRef = collection(fsdb, 'sliders');
      const querySnapshot = await addDoc(slidersCollectionRef, slider);
      console.log(querySnapshot);
    } catch (error) {
      console.error('Error saving slider to Firestore:', error);
    }
  };

  const retreiveProductsByIDfromFSdatabase = async (productIDs : string[]): Promise<Product[]> => { 
    const currentNetworkState = store.getState().network.isConnected

    try {

      if(!currentNetworkState){
        throw new NetworkError("Failed to establish coneection with firebase")
      } 

      const productsCollectionRef = collection(fsdb, 'products');
      const productsQuery = query(productsCollectionRef, where(documentId(), 'in', productIDs))
      const querySnapshot = await getDocs(productsQuery);

      const newProducts: Product[] = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const { id } = doc;
        const data = doc.data() as Product;
        const productImage: ImageData = {
          source: data.images.source,
        };
        const product: Product = {
          id: id,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          stock: data.stock,
          images: productImage
        };
        return product;
      }));
  
      return newProducts;
 
    } catch (error : any){
      console.log(error.message)
      throw error
    }
   }

   const retreivePaginatedProductsfromFSdatabase = async (lastDocument: QueryDocumentSnapshot<DocumentData, DocumentData> | null): Promise<{ newProducts: Product[], lastDocument: QueryDocumentSnapshot<DocumentData, DocumentData> | null }> => {
    const currentNetworkState = store.getState().network.isConnected

    if (currentAbortController) {
      currentAbortController.abort(); // Abort previous request
      console.log('function aborted');

    }
  
    currentAbortController = new AbortController();
    const signal = currentAbortController.signal;
  
    try {

      if(!currentNetworkState){
        throw new NetworkError("Failed to establish coneection with firebase")
      } 

      const productsCollectionRef = collection(fsdb, 'products');
      const productsQuery = lastDocument
        ? query(productsCollectionRef, orderBy('price', 'asc'), limit(18), startAfter(lastDocument))
        : query(productsCollectionRef, orderBy('price', 'asc'), limit(18));
  
      const querySnapshotPromise = getDocs(productsQuery);
  
      const querySnapshot = await Promise.race([
        querySnapshotPromise,
        new Promise<never>((_, reject) => {
          signal.addEventListener('abort', () => {
            reject();
          });
        })
      ]);

      if (signal.aborted) {
        return { newProducts: [], lastDocument };
      }
  
      if (querySnapshot.empty) {
        const newProducts: Product[] = [];
        return { newProducts, lastDocument };
      }
  
      lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
  
      const newProducts: Product[] = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const { id } = doc;
        const data = doc.data() as Product;
        const productImage: ImageData = {
          source: data.images.source,
        };
        const product: Product = {
          id: id,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          stock: data.stock,
          images: productImage
        };
        return product;
      }));
  
      return { newProducts, lastDocument };
    } catch (error) {
      if (signal.aborted) {
        console.log('Previous request was aborted');
      } else {
        console.log('Error fetching products from Operations File:', error);
      }
      throw error;
    } finally {
      currentAbortController = null; // Reset the controller
    }
  };
   
   const retreiveAllCategoriesfromFSdatabase = async (): Promise<Category[]> => { 
    const currentNetworkState = store.getState().network.isConnected

    try {        
      if(!currentNetworkState){
        throw new NetworkError("Failed to establish coneection with firebase")
      } 

      const categoriesCollectionRef = collection(fsdb, 'categories');
      const querySnapshot = await getDocs(categoriesCollectionRef);
      
      const categories: Category[] = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data() as Category;
        const categoryImage: ImageData = {
          source: data.images.source,
        };
        const category: Category = {
          name: data.name,
          images: categoryImage
        };
        return category;
      }));
  
      return categories;
    } catch (error : any){
      console.log(error.message)
      throw error
    }
  };

  const retreiveAllSlidersfromFSdatabase = async (): Promise<Slider[]> => { 
    const currentNetworkState = store.getState().network.isConnected

    try {

      if(!currentNetworkState){
        throw new NetworkError("Failed to establish coneection with firebase")
      } 

      const slidersCollectionRef = collection(fsdb, 'sliders');
      console.log("getDocs for sliders called")

      const querySnapshot = await getDocs(slidersCollectionRef);

      console.log("Docs for sliders recieved")

      
      const sliders: Slider[] = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data() as Slider;
        const sliderImage: ImageData = {
          source: data.images.source,
        };
        const slider: Slider = {
          description: data.description,
          images: sliderImage
        };
        return slider;
      }));
  
      return sliders;
    } catch (error : any){
      console.log(error.message)
      throw error
    }
  };

  const retreiveAllOrdersfromFSdatabase = async (): Promise<Order[]> => { 
    const currentNetworkState = store.getState().network.isConnected

    try {        
      if(!currentNetworkState){
        throw new NetworkError("Failed to establish coneection with firebase")
      } 

      const ordersCollectionRef = collection(fsdb, 'orders');
      const querySnapshot = await getDocs(ordersCollectionRef);
      
      const orders: Order[] = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data() as Order;

        return data;
      }));
  
      return orders;
    } catch (error : any){
      console.log(error.message)
      throw error
    }
  };
  

  const getImageDownloadURL = async (folderRef: StorageReference): Promise<string[]> => {
    const imagesArray: string[] = [];

    try {
        const res = await listAll(folderRef);
        await Promise.all(res.items.map(async (itemRef) => {
          const gsPath = `gs://${itemRef.bucket}/${itemRef.fullPath}`;
          const gsStorageRef = Sref(storage, gsPath);
          const url = await getDownloadURL(gsStorageRef);
          imagesArray.push(url);
        }));
      } catch (error) {
        console.error(error);
      }
  
    return imagesArray;
  };
  

export { retreiveProductsfromRTdatabase, retreiveCategoriesfromRTdatabase, retreiveAllCategoriesfromFSdatabase, retreivePaginatedProductsfromFSdatabase, retreiveAllSlidersfromFSdatabase, retreivePromotionalSlidersfromGCS, retreiveProductsByIDfromFSdatabase, retreiveAllOrdersfromFSdatabase }