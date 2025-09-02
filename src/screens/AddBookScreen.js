import React, { useState ,useEffect,useCallback} from 'react';
import { View, Text, TextInput, TouchableOpacity,Button, StyleSheet, Alert, Image,Modal,TouchableWithoutFeedback, ScrollView,KeyboardAvoidingView,Platform,NativeModules } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
// import { addCustomBook } from '../Redux/Book/BookSlice';
import { addLocalBook ,updateLocalBook,updateApiBook} from '../Redux/Book/BookSlice';
import { useNavigation } from '@react-navigation/native';
import CategoryModal from '../components/CategoryModal';
// const { ToastModule } = NativeModules;
import { useToast } from '../context/ToastContext';
import {useContext} from 'react'
import { ThemeContext } from '../context/ThemeContext'; 
import { StatusBar ,Animated} from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import * as Notifications from 'expo-notifications'

const AddBookScreen = ({route} ) => {
  const bookToEdit= route?.params?.bookToEdit
  const { showToast } = useToast()
   const { theme,isDarkTheme} = useContext(ThemeContext);
  //  console.log("hello book for edit ",bookToEdit);
   
  const dispatch = useDispatch(); 
  const navigation=useNavigation();
  const [title, setTitle] = useState(bookToEdit?.volumeInfo?.title || '');
  // console.log("hi",title);
const [price, setPrice] = useState(() => {
  if (!bookToEdit) return ""; // brand new book → empty input

  if (bookToEdit?.saleInfo?.saleability === "NOT_FOR_SALE") {
    return "Not for sale";
  }
  const apiPrice = bookToEdit?.saleInfo?.listPrice?.amount 
                ?? bookToEdit?.volumeInfo?.price;
  if (apiPrice === undefined || apiPrice === null) {
    return "Not for sale"; 
  }
  if (apiPrice === 0) return "Free";
  return apiPrice.toString();
})
  const [author,setAuthor]=useState(bookToEdit?.volumeInfo?.authors?.[0] || '')
  const [description, setDescription] = useState(bookToEdit?.volumeInfo?.description || '');
  const [etag,setetag] = useState(bookToEdit?.etag || '')
  const [kind,setKind] = useState(bookToEdit?.kind || '')
  const [publisher,setPublisher]= useState(bookToEdit?.volumeInfo?.publisher || '')
  const [publishedDate,setPublishedData]=useState(bookToEdit?.volumeInfo?.publishedDate || '')
  const [pageCount,setPageCount]=useState(bookToEdit?.volumeInfo?.pageCount?.toString() || '')
  const [printType,setPrintType]=useState(bookToEdit?.volumeInfo?.printType || '')
  const [selectedCategory,setSelectedCategory]=useState(bookToEdit?.volumeInfo?.categories?.[0] || '')
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(bookToEdit?.volumeInfo?.imageLinks?.thumbnail  || '');
  const [link,setLink]=useState(bookToEdit?.volumeInfo?.infoLink || bookToEdit?.volumeInfo?.link|| '')
  const isOnlyLetters = (text) => /^[A-Za-z\s]+$/.test(text)
  const categories=['Businesss','Economics','Computers']



  const handleAuthorChange = (text) => { if (text === '' || isOnlyLetters(text)) {
    setAuthor(text);
  }
}
 const handleTitleChange = (text) => { if (text === '' || isOnlyLetters(text)) {
    setTitle(text);
  }
}
 const handlePublisherChange = (text) => { if (text === '' || isOnlyLetters(text)) {
    setPublisher(text);
  }
}
  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Image picker error:', error);
      Alert.alert('Error');
    }
  };
  const triggerLocalNotification = async (bookTitle) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Book Added!",
      body: `Your book "${bookTitle}" was added successfully.`,
      sound: true,
    },
    trigger: null, // null = show immediately
  });
};

  const handleSubmit = async() => {
    const trimmedTitle = title.trim();
  const trimmedAuthor = author.trim();
  const trimmedDescription = description.trim();
  const trimmedPrice = price.trim();
  const trimmedKind =kind.trim().toLowerCase();
  const trimmedEtag=etag.trim();
  const trimmedPublisher=publisher.trim();
  const trimmedPublishedDate=publishedDate.trim();
  const trimmedPageCount=pageCount.trim();
  const trimmedPrintType=printType.trim();
  const trimmedSelectedCategory=selectedCategory.trim()
  const trimmedLink=link.trim()

    if (!trimmedTitle || !trimmedPrice || !trimmedAuthor || !trimmedDescription || !trimmedKind || !trimmedKind || !trimmedEtag || !trimmedPublisher ||
      !trimmedPublishedDate || !trimmedPageCount || !trimmedPrintType || !trimmedSelectedCategory || !image || !link) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }
 if (trimmedTitle.length < 3) {
    Alert.alert('Validation Error', 'Title must be at least 3 characters.');
    return;
  }
  if (trimmedAuthor.length < 3) {
    Alert.alert('Validation Error', 'Author must be at least 3 characters.');
    return;
  }
  if (trimmedDescription.length < 10) {
    Alert.alert('Validation Error', 'Description must be at least 10 characters.');
    return;
  }
 
  const numericPrice = parseFloat(trimmedPrice);
if (
  trimmedPrice.toLowerCase() !== "not for sale" &&
  trimmedPrice.toLowerCase() !== "free" && 
  trimmedPrice.toLowerCase() !== "NaN"
) {

  if (isNaN(numericPrice) || numericPrice <= 0) {
    Alert.alert(
      "Validation Error",
      "Price must be a number greater than 0, or 'Free', or 'Not for sale'."
    );
    return;
  }
}
  if (!trimmedKind.includes(trimmedKind)) {
    Alert.alert('Validation Error', 'please enter valid kind');
    return;
  }
  // const etagPattern = /^[a-zA-Z0-9]+$/;
  if (!trimmedEtag.includes(trimmedEtag)) {
    Alert.alert('Validation Error', 'Etag must be alphanumeric only.');
    return;
  }
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(trimmedPublishedDate)) {
    Alert.alert('Validation Error', 'Published date must be in YYYY-MM-DD format.');
    return;
  }
  const intPageCount = parseInt(trimmedPageCount);
  if (isNaN(intPageCount) || intPageCount <= 0) {
    Alert.alert('Validation Error', 'Page count must be a positive number.');
    return;
  }
  // const validPrintTypes = ['Book', 'Magazine','NewsPaper'];
  if (!trimmedPrintType.includes(trimmedPrintType)) {
    Alert.alert('Validation Error', 'Please enter a valid PrintTYpe".');
    return;
  }
  if (!image) {
    Alert.alert('Validation Error', 'Please select an image.');
    return;
  }
  if (!link) {
    Alert.alert('Validation Error', 'Please fill the link field.');
    return;
  }

let finalPrice = "Not for sale"; // default
const lowered = trimmedPrice.toLowerCase();

if (lowered === "not for sale") {
  finalPrice = "Not for sale";
} else if (lowered === "free" || parseFloat(trimmedPrice) === 0) {
  finalPrice = "Free";
} else {
  const numericPrice = parseFloat(trimmedPrice);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    Alert.alert("Validation Error", "Price must be a number > 0, or 'Free', or 'Not for sale'.");
    return;
  }
  finalPrice = numericPrice.toString();
}
    const newBook = {
      //  id:  bookToEdit ? bookToEdit.id : Date.now().toString(),
      etag:trimmedEtag,
      //  id: bookToEdit?.id || Date.now().toString() || bookToEdit?.etag , // do NOT use Date.now() for API edits
      id: bookToEdit?.id || (bookToEdit?.isApiBook ? bookToEdit?.etag : Date.now().toString()),
  isApiBook: bookToEdit?.isApiBook || false,
       kind:trimmedKind,
      volumeInfo: {
      title: trimmedTitle,
      authors: [trimmedAuthor],
      categories:[trimmedSelectedCategory],
      publisher:trimmedPublisher,
      publishedDate:trimmedPublishedDate,
      pageCount:intPageCount,
      printType:trimmedPrintType,
      price: finalPrice,
      description: trimmedDescription,
      link:trimmedLink,
      imageLinks: {
        thumbnail: image,
      },
    }
    };
if (bookToEdit) {
    if (bookToEdit?.isApiBook) {
      dispatch(updateApiBook(newBook));   
      showToast("Book Edited ");
      // await triggerLocalNotification(trimmedTitle); // ✅ works now
    } else {
      dispatch(updateLocalBook(newBook));
      showToast("Book Edited ");
      // await triggerLocalNotification(trimmedTitle); // ✅ works now
    }
  } else {
    dispatch(addLocalBook(newBook));  
    showToast("Book Added ");
    await triggerLocalNotification(trimmedTitle); // ✅ works now
  }
      navigation.navigate('Home') 
  };

  useFocusEffect(
    useCallback(() => {
      NavigationBar.setButtonStyleAsync("dark");
    }, [])
  );
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"          // dark icons for light bg
          backgroundColor="#f4d9bbff"      // match header bg or a slightly darker shade
          translucent={false}
        />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={80} >
        <ScrollView  keyboardShouldPersistTaps="handled">
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.label, { color: theme.text }]}>Book Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              placeholder="Title"
              onChangeText={handleTitleChange}
            />

            <Text style={[styles.label, { color: theme.text }]}>Price</Text>
           <TextInput
            style={styles.input}
            value={price}
            placeholder='Enter price or type "Not for sale"'
            onChangeText={setPrice}
            keyboardType={/^\d+$/.test(price) ? "numeric" : "default"} // ✅ safe check
          />
            <Text style={[styles.label, { color: theme.text }]}>Description</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              value={description}
              placeholder="Description"
              onChangeText={setDescription}
              numberOfLines={3}
              multiline
            />
            <Text style={[styles.label, { color: theme.text }]}>Author</Text>
            <TextInput
              style={styles.input}
              value={author}
              placeholder="Author"
              onChangeText={handleAuthorChange}
            />
            <Text style={[styles.label, { color: theme.text }]}>Kind</Text>
            <TextInput
              style={styles.input}
              value={kind}
              placeholder="Kind "
              onChangeText={setKind}
            />
            <Text style={[styles.label, { color: theme.text }]}>Etag</Text>
            <TextInput
              style={styles.input}
              value={etag}
              placeholder="Etag"
              onChangeText={setetag}
            />
            <Text style={[styles.label, { color: theme.text }]}>Publisher</Text>
            <TextInput
              style={styles.input}
              value={publisher}
              placeholder="Publisher"
              onChangeText={handlePublisherChange}
            />
            <Text style={[styles.label, { color: theme.text }]}>PublishedDate</Text>
            <TextInput
              style={styles.input}
              value={publishedDate}
              placeholder="PublishedDate in YYYY-DD-MM Format"
              onChangeText={setPublishedData}
            />
            <Text style={[styles.label, { color: theme.text }]}>PageCount</Text>
            <TextInput
              style={styles.input}
              value={pageCount}
              placeholder="PageCount"
              onChangeText={setPageCount}
               keyboardType="numeric"
            />
            <Text style={[styles.label, { color: theme.text }]}>PrintType</Text>
            <TextInput
              style={styles.input}
              value={printType}
              placeholder="PrintType"
              onChangeText={setPrintType}
            />
            <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8,color:theme.text }}>
            Selected Category
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: selectedCategory ? '#64f59eff' : '#eee',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 10,
              borderWidth:1,
              // marginLeft:0
              color:theme.text,
              justifyContent:'center',
              alignItems:'center'
            }}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ fontSize: 20,paddingLeft:10 }}>
              {selectedCategory || 'Choose a category'}
            </Text>
          </TouchableOpacity>

             <CategoryModal
            visible={modalVisible}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={(cat) => setSelectedCategory(cat)}
            onClose={() => setModalVisible(false)}
           />
           </View>
            

             <Text style={[styles.label, { color: theme.text }]}>Link</Text>
            <TextInput
              style={styles.input}
              value={link}
              placeholder="Link"
              onChangeText={setLink}
            />
            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
              <Text style={styles.imagePickerText}>{image ? 'Change Image' : 'Pick Image'}</Text>
            </TouchableOpacity>


            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Add Book</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AddBookScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    fontSize:18,
    backgroundColor:'white'
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize:15,
    fontWeight:'bold',
    textAlign: 'center',
  },
  imagePicker: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#64f59eff',
    borderRadius: 10,
    borderWidth:0.8
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  imagePickerText: {
    fontSize: 20,
  },

  selectedType:{
    backgroundColor: '#f5be84',
     paddingVertical: 5, 
     paddingHorizontal: 12, 
     borderRadius: 15 
  }
});
