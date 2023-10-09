import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MusicPlayer from './Screens/MusicPlayer'
import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
const App = () => {
  return (
   
    <MusicPlayer />
   
  )
}
const styles=StyleSheet.create({
  container:{
   // flex:1,
    alignItems:'center',
      justifyContent:'center',
}})

export default App