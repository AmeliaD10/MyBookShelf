import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getBooks, getCategories } from '../database/Database';

export default function FavoriteScreen() {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const filteredBooks = selectedCategory === 'All' 
    ? favoriteBooks 
    : favoriteBooks.filter(book => book.category === selectedCategory);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>❤️ Favorite Books</Text>
      
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

      {/* Books List */}
      <View style={styles.booksSection}>
        {filteredBooks.length === 0 ? (
          <Text style={styles.emptyMessage}>
            No favorite books {selectedCategory !== 'All' ? `in ${selectedCategory}` : ''}
          </Text>
        ) : (
          <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.bookItem}>
                <View style={styles.bookDetails}>
                  <Text style={styles.bookTitle}>{item.title}</Text>
                  {item.category && (
                    <Text style={styles.bookCategory}>{item.category}</Text>
                  )}
                </View>
              </View>
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
  title: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#222', 
    marginBottom: 20 
  },
  categorySection: {
    height: 60,
    marginBottom: 10
  },
  booksSection: {
    flex: 1 // Takes remaining space
  },
  categoryFilterContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5
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
    elevation: 2
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
    fontWeight: '600'
  },
  emptyMessage: { 
    fontSize: 16, 
    textAlign: 'center', 
    color: '#888', 
    marginTop: 20 
  },
  listContainer: { 
    paddingBottom: 20 
  },
  bookItem: { 
    backgroundColor: '#fff', 
    padding: 18, 
    borderRadius: 12, 
    marginBottom: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 6, 
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  bookDetails: { 
    flex: 1 
  },
  bookTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#222', 
    marginBottom: 3 
  },
  bookCategory: { 
    fontSize: 14, 
    color: '#777' 
  },
});