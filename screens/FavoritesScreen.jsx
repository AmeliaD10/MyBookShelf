import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getBooks, getCategories } from '../database/Database';
import { useTheme } from "../context/ThemeContext";

export default function FavoriteScreen() {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAuthor, setSelectedAuthor] = useState('All');
  const { bgColor } = useTheme();
  const navigation = useNavigation();

  const fetchFavorites = async () => {
    const books = await getBooks();
    const categoryData = await getCategories();
    setCategories([{ id: 'all', name: 'All' }, ...categoryData]);
    setFavoriteBooks(books.filter(book => book.favorite === 1));
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  // Create an authors array from favoriteBooks
  const authors = ['All', ...Array.from(new Set(favoriteBooks.map(book => book.author)))];

  // Filter books by category and author
  const filteredBooks = favoriteBooks.filter(book => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesAuthor = selectedAuthor === 'All' || book.author === selectedAuthor;
    return matchesCategory && matchesAuthor;
  });

  const handleBookPress = (book) => {
    if (!book || !book.file_path) {
      Alert.alert('Invalid Book', 'Invalid book file or path.');
      return;
    }
    const filePath = book.file_path.toLowerCase();
    if (filePath.endsWith('.pdf') || filePath.endsWith('.epub')) {
      navigation.navigate('Reader', { fileUri: book.file_path, title: book.title });
    } else {
      Alert.alert(
        'Unsupported Format',
        'This file format is not supported. Please use EPUB or PDF files.'
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Category Filter */}
      <View style={styles.categorySection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item.name && styles.selectedCategoryChip
              ]}
              onPress={() => setSelectedCategory(item.name)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === item.name && styles.selectedCategoryChipText
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoryFilterContainer}
        />
      </View>

      {/* Author Filter */}
      <View style={styles.authorSection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={authors}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedAuthor === item && styles.selectedCategoryChip
              ]}
              onPress={() => setSelectedAuthor(item)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedAuthor === item && styles.selectedCategoryChipText
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoryFilterContainer}
        />
      </View>

      {/* Books List */}
      <View style={styles.booksSection}>
        {filteredBooks.length === 0 ? (
          <Text style={styles.emptyMessage}>
            No favorite books {selectedCategory !== 'All' ? `in ${selectedCategory}` : ''}{' '}
            {selectedAuthor !== 'All' ? `by ${selectedAuthor}` : ''}
          </Text>
        ) : (
          <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.bookItem} onPress={() => handleBookPress(item)}>
                <View style={styles.bookDetails}>
                  <Text style={styles.bookTitle}>{item.title}</Text>
                  {item.category && (
                    <Text style={styles.bookCategory}>{item.category}</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 30, 
    backgroundColor: '#F8F1FF' 
  },
  categorySection: {
    height: 60,
    marginTop: -10,
    marginBottom: -10
  },
  authorSection: {
    height: 60,
    marginBottom: 5,
  },
  booksSection: {
    flex: 1,
  },
  categoryFilterContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedCategoryChip: {
    backgroundColor: '#4A90E2',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryChipText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyMessage: { 
    fontSize: 16, 
    textAlign: 'center', 
    color: '#888', 
    marginTop: 20,
  },
  listContainer: { 
    paddingBottom: 20,
  },
  bookItem: { 
    backgroundColor: '#fff', 
    padding: 18, 
    borderRadius: 12, 
    marginBottom: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 6, 
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookDetails: { 
    flex: 1,
  },
  bookTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#222', 
    marginBottom: 3,
  },
  bookCategory: { 
    fontSize: 14, 
    color: '#777',
  },
});
