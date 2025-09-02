import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Dimensions } from 'react-native';
import { useContext} from 'react';
import { ThemeContext } from "../context/ThemeContext";

const Bookcard = React.memo(({ book,id,navigation, isGridView }) => {
    const title = book?.volumeInfo?.title
    const publisher=book?.volumeInfo?.publisher
     const authors = book?.volumeInfo?.authors
    const thumbnail = book?.volumeInfo?.imageLinks?.thumbnail
     const { theme, toggleTheme, isDarkTheme } = useContext(ThemeContext);
    const screenWidth = Dimensions.get('window').width
    
    return (
        <View style={[isGridView ? [styles.gridCard, { backgroundColor: theme.background,borderColor:theme.borderColor }] : [styles.listCard, { backgroundColor: theme.background ,borderColor:theme.borderColor}]]}>

            <TouchableOpacity style={[isGridView ? styles.gridTouchable : styles.listTouchable]} 
            onPress={() => navigation.navigate('BookDetails', { book, id })}>
                <View style={[styles.imageWrap, !isGridView && styles.listImageWrap]}>
                    <Image
                        source={{ uri: thumbnail }} style={[styles.imageBook, !isGridView && styles.listImageBook]} resizeMode='cover' />
                </View>
                            {!isGridView && (
                <View style={styles.textContainer}>
                <Text numberOfLines={1} style={[styles.text4, { color: theme.text }]}>
                {title?.length > 20 ? title.slice(0, 20) + "..." : title}
                </Text>
                   {Array.isArray(authors) && authors.length>0 ?(
                            <Text style={[styles.text4, { color: theme.text }]}>{authors[0]}</Text>
                          )
                         : (
                          <Text style={[styles.text4, { color: theme.text }]}>..</Text>
                        )}
                </View>
            )}

            {isGridView && (
                <View style={styles.textConatiner1}>
                <Text numberOfLines={1} style={[styles.text1, { color: theme.text }]}>
                    {title?.length > 20 ? title.slice(0, 20) + "..." : title}
                </Text>
                {Array.isArray(authors) && authors.length>0 ?(
                            <Text style={[styles.text3, { color: theme.text }]}>{authors[0]}</Text>
                          )
                         : (
                          <Text style={[styles.text3, { color: theme.text }]}>..</Text>
                        )}
                </View>
            )}
            </TouchableOpacity>
        </View>
    )
}
)
export default Bookcard

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
        aspectRatio: 0.8,
    },
    imageBook: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
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
  margin: 10,
  borderRadius: 15,
backgroundColor: '#f5be84ff',
    },
    listTouchable:{
         flexDirection: 'row',
  alignItems: 'center',
paddingVertical:10,
  width: '100%',
    },
    listImageWrap: {
        flex:1,
       width: '90%',
       height:'30%',
  borderRadius: 10,
  overflow: 'hidden',
  aspectRatio:1.2,
    },
    listImageBook: {
        width: '70%',
        height: '100%',
        borderRadius:10,
    },
    textContainer:{
       flex: 1,
  justifyContent: 'center',
  paddingHorizontal: 10,
    },
    text2:{
        fontSize:18,
        fontWeight:'500'
    },
    text4:{
        paddingTop:10,
        fontSize:15
    },
})
