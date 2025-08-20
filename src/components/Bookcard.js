import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Dimensions } from 'react-native';


const Bookcard = ({ book, id,navigation,onPress, isGridView }) => {
    // if(!book || !book.volumeInfo) return null
    const title = book?.volumeInfo?.title
    const publisher=book?.volumeInfo?.publisher
     const authors = book?.volumeInfo?.authors
    const thumbnail = book?.volumeInfo?.imageLinks?.thumbnail
    //  console.log(thumbnail);
    const screenWidth = Dimensions.get('window').width
    //    const numColumns = screenWidth >= 720 ? 3 : 2
    //  console.log("hi",isGridView);
    // const containerStyle = isGridView ? styles.gridCard : styles.listCard
    return (
        // <View style={containerStyle}>
        <View style={[isGridView ? styles.gridCard : styles.listCard]}>

            <TouchableOpacity style={[isGridView ? styles.gridTouchable : styles.listTouchable]} 
            onPress={() => navigation.navigate('BookDetails', { book, id })}>
                <View style={[styles.imageWrap, !isGridView && styles.listImageWrap]}>
                    <Image
                        source={{ uri: thumbnail }} style={[styles.imageBook, !isGridView && styles.listImageBook]} resizeMode='cover' />
                </View>
                            {!isGridView && (
                <View style={styles.textContainer}>
                <Text numberOfLines={1} style={styles.text2}>
                {title?.length > 20 ? title.slice(0, 20) + "..." : title}
                </Text>
                   {Array.isArray(authors) && authors.length>0 ?(
                            <Text style={styles.text4}>{authors[0]}</Text>
                          )
                         : (
                          <Text style={styles.text4}>..</Text>
                        )}
                </View>
            )}

            {isGridView && (
                <View style={styles.textConatiner1}>
                <Text numberOfLines={1} style={styles.text1}>
                    {title?.length > 20 ? title.slice(0, 20) + "..." : title}
                </Text>
                {Array.isArray(authors) && authors.length>0 ?(
                            <Text style={styles.text3}>{authors[0]}</Text>
                          )
                         : (
                          <Text style={styles.text3}>..</Text>
                        )}
                </View>
            )}
             

            </TouchableOpacity>

        </View>
        // </View>
    )
}
export default React.memo(Bookcard)

const styles = StyleSheet.create({
    gridCard: {
        flex: 1,
        overflow: 'hidden',
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        margin: 10,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        // borderBottomEndRadius:50,
        // aspectRatio: 1,
        //    flexDirection:'row',
        backgroundColor: '#f5be84ff',
    },
    gridTouchable:{
        width:'100%'
    },
    imageWrap: {
        flex: 1,
        overflow: 'hidden',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        //  height:'90%',
        //  width:'100%',
        //  resizeMode:'cover',
        aspectRatio: 0.8,
        // backgroundColor:"red"
        // borderWidth:10
    },
    imageBook: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        // aspectRatio:1
        //   flex: 1
    },
    textConatiner1:{
    alignItems:'center'
    },
    text1: {
        fontSize: 14,
        marginTop: 10,
        fontWeight:'500'
    },
    text3:{
        fontSize:13,
    },
    listCard: {
         flex: 1,
  borderWidth: 1,
//   paddingVertical: 10,
//   paddingHorizontal:10,
//   padding:10,
  margin: 10,
  borderRadius: 15,
//   width:'50%'
    },

    listTouchable:{
         flexDirection: 'row',
  alignItems: 'center',
//   justifyContent:'space-between',
//   justifyContent: 'center',
paddingVertical:10,
  width: '100%',
//   gap: 10,
  
//   borderWidth:1,
  
    },
    listImageWrap: {
        flex:1,
       width: '90%',
       height:'30%',
//   height: 200,
  borderRadius: 10,
  overflow: 'hidden',
  aspectRatio:1.2,
//   justifyContent: 'center',
//   alignItems: 'center',
//   borderWidth:1,
//   flexWrap:'nowrap'
    },
    listImageBook: {
        width: '70%',
        height: '100%',
        borderRadius:10,
        // marginLeft:15
    },
    textContainer:{
       flex: 1,
  justifyContent: 'center',
//   alignItems:'center',

  paddingHorizontal: 10,
//   marginLeft:10
    },
    text2:{
        fontSize:18,
        fontWeight:'500'
        // flexShrink:1
    },
    text4:{
        paddingTop:10,
        fontSize:15
    },
})
