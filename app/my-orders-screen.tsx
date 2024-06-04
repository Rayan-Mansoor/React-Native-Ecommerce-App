import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { FunctionQueue, Order } from '@/constants/Types';
import { retreiveAllOrdersfromFSdatabase } from '@/firebase/firebaseOperations';


const functionQueue: FunctionQueue = [];

const myOrders = () => {
    const isConnected = useSelector((state: RootState) => state.network.isConnected);
    const [myOrdersArray, setMyOrdersArray] = useState<Order[]>([])


  useEffect(() => {
    fetchOrders();
  },[]);

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

  const fetchOrders = async () => {
    try {
      const sliders = await retreiveAllOrdersfromFSdatabase();
      setMyOrdersArray(sliders);
    } catch (error) {
      console.log("Error fetching orders:", error);
      functionQueue.push(fetchOrders);
    }
  };

  return (
    <View>
      <Text>my-orders-screen</Text>
    </View>
  );
};

export default myOrders;

const styles = StyleSheet.create({});
