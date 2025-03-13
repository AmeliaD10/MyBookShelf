import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getBooks, getCategories, toggleFavoriteStatus } from '../database/Database';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from "../context/ThemeContext";
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAuthor, setSelectedAuthor] = useState('All');
  const [favorites, setFavorites] = useState(new Set());
  const navigation = useNavigation();
  const { bgColor } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const bookData = await getBooks();
          const favoriteBooks = new Set(
            bookData.filter(book => book.favorite === 1).map(book => book.id)
          );
          const categoryData = await getCategories();
          setBooks(bookData);
          setFavorites(favoriteBooks);
          setCategories(categoryData);
        } catch (error) {
          console.error('Error fetching data:', error);
          Alert.alert('Error', 'There was an error fetching the data.');
        }
      };
      fetchData();
    }, [])
  );

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesAuthor = selectedAuthor === 'All' || book.author === selectedAuthor;
    return matchesSearch && matchesCategory && matchesAuthor;
  });

  const handleBookPress = (book) => {
    if (!book || !book.file_path) {
      Alert.alert('Invalid Book', 'Invalid book file or path.');
      return;
    }
    const filePath = book.file_path.toLowerCase();
    if (filePath.endsWith('.pdf')) {
      navigation.navigate('Reader', { fileUri: book.file_path, title: book.title });
    } else if (filePath.endsWith('.epub')) {
      navigation.navigate('Reader', { fileUri: book.file_path, title: book.title });
    } else {
      Alert.alert(
        'Unsupported Format', 
        'This file format is not supported. Please use EPUB or PDF files.'
      );
    }
  };

  const toggleFavorite = async (bookId) => {
    const isCurrentlyFavorite = favorites.has(bookId);
    await toggleFavoriteStatus(bookId, !isCurrentlyFavorite);
    setFavorites(prevFavorites => {
      const updatedFavorites = new Set(prevFavorites);
      if (isCurrentlyFavorite) {
        updatedFavorites.delete(bookId);
      } else {
        updatedFavorites.add(bookId);
      }
      return updatedFavorites;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header Logo */}
      <Image 
        source={require('../assets/logo.png')} 
        style={styles.logo} 
        resizeMode="contain" 
      />

      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Search books..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Picker
        selectedValue={selectedCategory}
        onValueChange={setSelectedCategory}
        style={styles.picker}
      >
        <Picker.Item label="All Categories" value="All" />
        {categories.map(category => (
          <Picker.Item key={category.id} label={category.name} value={category.name} />
        ))}
      </Picker>

      <Picker
        selectedValue={selectedAuthor}
        onValueChange={setSelectedAuthor}
        style={styles.picker}
      >
        <Picker.Item label="All Authors" value="All" />
        {Array.from(new Set(books.map(book => book.author))).map((author, index) => (
          <Picker.Item key={index} label={author} value={author} />
        ))}
      </Picker>

      <FlatList
        data={filteredBooks}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.bookItem} 
            onPress={() => handleBookPress(item)}
          >
            <View style={styles.bookContent}>
              <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.bookCategory}>{item.category}</Text>
              <Text style={styles.bookAuthor}>By: {item.author}</Text>
            </View>
            <View style={styles.bookmarkContainer}>
              <MaterialIcons name="bookmark" size={24} color="#ff5757" />
            </View>
            <TouchableOpacity 
              style={styles.favoriteButton} 
              onPress={() => toggleFavorite(item.id)}
            >
              <Text style={styles.favoriteIcon}>
                {favorites.has(item.id) ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 30, 
    backgroundColor: '#F8F1FF' 
  },
  logo: {
    width: '110%',
    height: 200,
    marginBottom: -50,
    marginTop: -60,
  },
  searchBar: { 
    height: 45, 
    borderColor: '#ddd', 
    borderWidth: 1, 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 15
  },
  picker: {
    height: 50,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  listContainer: { 
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  bookItem: { 
    flex: 1,
    backgroundColor: '#fff', 
    padding: 10, 
    borderRadius: 10, 
    marginHorizontal: 5,
    marginBottom: 15,
    position: 'relative',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    // Elevation for Android
    elevation: 4,
  },
  bookContent: {
    paddingBottom: 30, // leave space for bookmark icon
  },
  bookTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#222', 
    marginBottom: 3, 
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 3,
    borderRadius: 5,
  },
  bookCategory: { 
    fontSize: 12, 
    color: '#777', 
    marginBottom: 2,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 2,
    borderRadius: 5,
  },
  bookAuthor: { 
    fontSize: 12, 
    color: '#666', 
    fontStyle: 'italic',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 2,
    borderRadius: 5,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
  },
  favoriteIcon: { 
    fontSize: 20,
  },
  bookmarkContainer: {
    position: 'absolute',
    top: -2,
    right: 10,
  },
});
