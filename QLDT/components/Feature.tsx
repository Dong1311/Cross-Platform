import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';

const Feature = ({iconName, featureName, feature}) => {
  
  const handlePress = (feature) => {
    router.push({  
      pathname: feature,
    });  
  }

  return (
      <TouchableOpacity onPress={() => handlePress(feature)} style={styles.container}>
        <Ionicons  name={iconName} size={46} color="#d32f2f" />
        <Text style={styles.text}>{featureName}</Text>
      </TouchableOpacity>
  )
}

export default Feature

const styles = StyleSheet.create({
  container: {
    minWidth: '46%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: '#d32f2f',
    paddingTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  }
})