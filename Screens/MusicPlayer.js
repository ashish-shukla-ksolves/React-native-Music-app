import { View, Text ,StyleSheet,SafeAreaView, TouchableOpacity,Dimensions, Image, FlatList, Animated} from 'react-native'
import React,{useEffect,useState,useRef} from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider';
import songs from '../Modals/Data';
import TrackPlayer, { Capability,Event,RepeatMode,State,usePlaybackState,useProgress,useTrackPlayerEvents } from 'react-native-track-player';

const {width, height} = Dimensions.get('window');
const setUpPlayer=async()=>{
    try{
        await TrackPlayer.setupPlayer();
        await TrackPlayer.add(songs);
        console.log("this is ", await TrackPlayer.add(songs))
    }
    catch(e){
        console.log(e)
    }
}
const togglePlayBack = async playBackState => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    console.log(currentTrack, playBackState, State.Playing);
    if (currentTrack != null) {
         TrackPlayer.play();
        TrackPlayer.pause();
      if (playBackState == State.Paused) {
        await TrackPlayer.play();
        // await TrackPlayer.pause();
      } else {
        await TrackPlayer.pause();
        // await TrackPlayer.play();
      }
    }
  };

const MusicPlayer = () => {
    const [songIndex,setSongIndex]=useState(0)
    const scrollx=useRef(new Animated.Value(0)).current;
    const playBackState=usePlaybackState();
    const [trackTitle,setTrackTitle]=useState()
    const [trackArtwork,setTrackArtwork]=useState()
    const [trackArtist,setTrackArtist]=useState()

    //custo reference
    const progress=useProgress()
    const songSlider=useRef(null); //flatList reference
    //changing the track on complete
    useTrackPlayerEvents([Event.PlaybackTrackChanged],async event=>{
        if(event.type===Event.PlaybackTrackChanged && event.nextTrack!==null){
            const track =await TrackPlayer.getTrack(event.nextTrack);
            const {title,artwork,artist}=track;
            setTrackTitle(title)
            setTrackArtwork(artwork)
            setTrackArtist(artist)
        }
    })
    const skipTo=async trackId=>{
        await TrackPlayer.skip(trackId);
    }
      
    useEffect(()=>{
        async function initializePlayer() {
            await setUpPlayer();
            // await TrackPlayer.play();
            // await TrackPlayer.pause();
        }
    
        initializePlayer();
        scrollx.addListener(({value})=>{
            
            const index=Math.round(value/width)
            //console.log(index)
            setSongIndex(index)  
            skipTo(index)
        });
        // return()=>{
        //     scrollx.removeAllListeners();
        // }
    },[])
    const skipToNext= ()=>{
        songSlider.current.scrollToOffset({
            offset:(songIndex+1)*width,
            
        }
        
        )
        // TrackPlayer.play();
        // TrackPlayer.pause();
    }
    const skipToPrevious=()=>{
        songSlider.current.scrollToOffset({
            offset:(songIndex-1)*width,
        })
        // TrackPlayer.play();
        // TrackPlayer.pause();
    }
    const renderSongs=({item,index})=>{
        return(
            <Animated.View style={styles.mainImageWrapper}>

            
            <View style={[styles.ImageWrapper,styles.elevation]}>
          
            <Image source={trackArtwork} style={[styles.musicImage]} />
            </View>
            </Animated.View>
        )
    }
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.mainContainer}> 
        {/* images */}
       <Animated.FlatList
       ref ={songSlider}
       data={songs}
       renderItem={renderSongs}
       keyExtractor={item=>item.id}
       horizontal
       pagingEnabled
       showsHorizontalScrollIndicator={false}
       scrollEventThrottle={16}
       onScroll={Animated.event([
        {
            nativeEvent:{
                contentOffset:{x:scrollx}
            }
        }
       ],
       {useNativeDriver:true}
       )}
       />
        {/* song content */}
        <View>
            <Text style={[styles.songTitle,styles.songContent]}>
                {trackTitle}
            </Text>
            <Text style={[styles.songArtist,styles.songContent]}>
            {trackArtist}
            </Text>
        </View>
        {/* React Slider */}
        <View>
            <Slider 
            style={styles.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor='#FFD369'
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#fff"
            onSlidingComplete={async value =>{
                await TrackPlayer.seekTo(value);
            }}   
            />
             {/* progress duration */}
            <View style={styles.progressLevelDuration}>
            <Text style={styles.progresslabletext}>
                {new Date(progress.position*1000).toLocaleTimeString().substring(3)}
            </Text>
            <Text style={styles.progresslabletext}>
            {new Date((progress.duration-progress.position)*1000).toLocaleTimeString().substring(3)}
            </Text>
        </View>

        </View>
       
        {/* music Controls */}
        <View style={styles.musicContrlsContainer}>
            <TouchableOpacity onPress={skipToPrevious}>
            <Ionicons name='play-skip-back-outline' size={35}  color="#FFD369" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>togglePlayBack(playBackState)}>
            <Ionicons name={playBackState===State.Playing
                ?'pause-circle-outline'
                :'play-skip-forward-outline'
                } size={75}  color="#FFD369" />
            </TouchableOpacity>
            <TouchableOpacity onPress={skipToNext}>
            <Ionicons name='play-skip-forward-outline' size={35}  color="#FFD369" />
            </TouchableOpacity>
        </View>

        </View>
        
        
        {/*  */}
        <View style={styles.bottomConatiner}>
            <View style={styles.bottomIconWrapper}>

           
            <TouchableOpacity onPress={()=>{}}>

           
            <Ionicons name='heart-outline' size={30}  color="#888888" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{}}>

           
            <Ionicons name='repeat' size={30}  color="#888888" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{}}>

           
            <Ionicons name='share-outline' size={30}  color="#888888" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{}}>

           
            <Ionicons name='ellipsis-horizontal' size={30}  color="#888888" />
            </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
  )
}
const styles=StyleSheet.create({
    container:{
      flex:1,
      backgroundColor:'#222831',
      

  },
mainContainer:{
flex:1,
alignItems:'center',
justifyContent:'center',
},
bottomConatiner:{
width:width,
alignItems:'center',
paddingVertical:15,
borderTopColor:'#393E46',
borderWidth:1,


},
bottomIconWrapper:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'80%',

},
ImageWrapper:{
    width:300,
    height:340,
    marginBottom:20,
    paddingTop:40,
},
musicImage:{
    width:'100%',
    height:'100%',
    borderRadius:15,
    

},
mainImageWrapper:{
    width:width,
    justifyContent:'center',
    alignItems:'center',
    marginTop:''
}
,
elevation:{
    shadowColor:'#ccc',
    shadowOffset:{
        height:5,
        width:5
    },
   
    shadowOpacity:0.5,
    shadowRadius:3.84,
},
songContent:{
    textAlign:'center',
    color:'#EEEEEE'
},
songTitle:
{
    fontSize:18,
    fontWeight:'600',
    
},
songArtist:
{
    fontSize:16,
    fontWeight:'300',
},
progressBar:{
    width:350,
    height:40,
    marginTop:25,
    flexDirection:'row',
},
progressLevelDuration:{
    width:340,
    flexDirection:'row',
    justifyContent:'space-between',

},
progresslabletext:{
    color:"#fff",
    fontWeight:'500',
},
musicContrlsContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    width:'60%',
    marginTop:15
},
}
)
export default MusicPlayer