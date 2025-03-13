import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { getBooks } from '../database/Database';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function CategoryBooksScreen() {
  const { bgColor } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params || {}; // Category passed from CategoriesScreen
  const [books, setBooks] = useState([]);

  const loadBooks = async () => {
    try {
      const allBooks = await getBooks();
      // Filter books by the given category
      const filtered = allBooks.filter(book => book.category === category);
      setBooks(filtered);
    } catch (error) {
      console.error("Error loading books for category:", error);
      Alert.alert("Error", "Failed to load books for this category.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [category])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookItem} 
      onPress={() => navigation.navigate('Reader', { fileUri: item.file_path, title: item.title })}
    >
      <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.bookAuthor}>By: {item.author}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Category: {category}</Text>
      </View>
      {books.length === 0 ? (
        <Text style={styles.noBooks}>No books in this category.</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    backgroundColor: '#FCE8E8',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 25,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
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
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    // Subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  noBooks: {
    fontSize: 18,
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
});
