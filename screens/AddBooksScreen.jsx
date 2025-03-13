import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getBooks, addBookToFolder } from "../database/Database";
import { useTheme } from "../context/ThemeContext";

export default function AddBooksScreen({ route, navigation }) {
  const { folder } = route.params;
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const { bgColor } = useTheme();

  useEffect(() => {
    const fetchBooks = async () => {
      const books = await getBooks();
      setAllBooks(books);
    };
    fetchBooks();
  }, []);

  const toggleSelection = (book) => {
    if (selectedBooks.some(b => b.id === book.id)) {
      setSelectedBooks(selectedBooks.filter(b => b.id !== book.id));
    } else {
      setSelectedBooks([...selectedBooks, book]);
    }
  };

  const addBooksToFolder = async () => {
    for (const book of selectedBooks) {
      await addBookToFolder(folder.id, book.id);
    }
    navigation.goBack();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.bookItem,
        selectedBooks.some((b) => b.id === item.id) && styles.selected,
      ]}
      onPress={() => toggleSelection(item)}
    >
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookInfo}>Category: {item.category}</Text>
      <Text style={styles.bookInfo}>Author: {item.author}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.title}>Select Books</Text>
      <FlatList
        data={allBooks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.addButton} onPress={addBooksToFolder}>
        <Text style={styles.addButtonText}>Add to Folder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F0F4F7",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 100,
  },
  bookItem: { 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selected: { 
    borderColor: "#4A90E2",
    borderWidth: 2, 
    backgroundColor: "#E8F4FF",
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  bookInfo: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#4A90E2",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "700" 
  },
});
