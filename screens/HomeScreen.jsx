import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getBooks, getCategories, toggleFavoriteStatus } from '../database/Database';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from "../context/ThemeContext";

export default function HomeScreen() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAuthor, setSelectedAuthor] = useState('All'); // New state for author dropdown
  const [favorites, setFavorites] = useState(new Set());
  const navigation = useNavigation();
  const { bgColor } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const bookData = await getBooks();
          const favoriteBooks = new Set(bookData.filter(book => book.favorite === 1).map(book => book.id));
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

  // Filter books by search query, category, and selected author
  const filteredBooks = books.filter((book) => {
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
    }else {
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
      <Text style={styles.title}>MyBookShelf</Text>
      <Text style={styles.subtitle}>Add, Read, and Enjoy.</Text>

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
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={category.name} />
        ))}
      </Picker>
      
      {/* New Author Dropdown */}
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
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.bookItem} 
            onPress={() => handleBookPress(item)}
          >
            <View style={styles.bookInfo}>
              <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookCategory}>{item.category}</Text>
                <Text style={styles.bookFormat}>
                  {item.file_path?.toLowerCase().endsWith('.pdf') ? '📄 PDF' : '📱 EPUB'}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.favoriteButton} 
                onPress={() => toggleFavorite(item.id)}
              >
                <Text style={styles.favoriteIcon}>
                  {favorites.has(item.id) ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: '#F8F1FF' },
  title: { fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: '#222' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 25, color: '#555' },
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
  listContainer: { paddingBottom: 20 },
  bookInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#222', 
    marginBottom: 3 
  },
  bookCategory: { 
    fontSize: 14, 
    color: '#777',
    marginBottom: 2
  },
  bookFormat: {
    fontSize: 12,
    color: '#999',
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: { 
    fontSize: 22,
  },
  bookItem: { 
    backgroundColor: '#fff', 
    padding: 10, 
    borderRadius: 10, 
    marginBottom: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 6, 
    elevation: 4,
  },
});
