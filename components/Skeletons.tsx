import React from 'react'
import { StyleSheet, View } from 'react-native';
import { MotiText, MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';


export function SliderImageSkeleton() {
  return (
    <MotiView
    transition={{
      type: 'timing',
      duration: 500,
    }}
    style={{borderRadius: 1}}>
    <Skeleton colorMode='light' radius='square' height={200} width= '100%'/>
  </MotiView>
  )
}


export function CategoryImageSkeleton() {
  return (
    <MotiView
    transition={{
      type: 'timing',
      duration: 500,
    }}
    style={{marginRight:10, borderRadius: 1}}>
    <Skeleton colorMode='light'  height={100} width= {100}/>
  </MotiView>
  )
}

export function ProductCardSkeleton() {
  return (
    <MotiView 
    transition={{
      type: 'timing',
      duration: 500,
    }}
    style={styles.card}>
      <View style={{borderRadius: 5}}>
        <Skeleton colorMode='light' height={100} width= {80}/>
      </View>
      <View style={styles.spacer} />
      <Skeleton colorMode='light' height={20} width= '100%'/>
      <View style={styles.spacer} />
      <Skeleton colorMode='light' height={40} width= '100%'/>
      <View style={styles.buttonsContainer}>
        <Skeleton colorMode='light' width={20} height={20} radius='round' />
        <Skeleton colorMode='light' width={20} height={20} radius='round' />
        <Skeleton colorMode='light' width={20} height={20} radius='round' />
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 110,
    height: 230,
    margin: 10,
    borderRadius: 13,
    padding: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    width: 80,
    height: 100,
    alignSelf: 'center',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    height: 5,
  },

  buttonsContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  iconSkeleton: {
    backgroundColor: '#DDDDDD', // Light gray for skeleton icons
  },
});
