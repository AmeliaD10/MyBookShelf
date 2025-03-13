import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getBooksByFolder } from "../database/Database";

export default function FolderDetailsScreen({ route, navigation }) {
  const { folder } = route.params;
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchFolderBooks = async () => {
      const folderBooks = await getBooksByFolder(folder.id);
      setBooks(folderBooks);
    };
    fetchFolderBooks();
  }, [folder]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => {
        if (!item.file_path) {
          Alert.alert("Error", "This book does not have a file URI.");
          return;
        }
        navigation.navigate("Reader", { fileUri: item.file_path });
      }}
    >
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookCategory}>{item.category}</Text>
        <Text style={styles.bookAuthor}>By: {item.author}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{folder.name}</Text>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate("AddBooks", { folder })}
      >
        <Text style={styles.addButtonText}>Add Books</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 25, 
    backgroundColor: "#F8F1FF" 
  },
  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center", 
    color: "#333" 
  },
  listContainer: {
    paddingBottom: 100,
  },
  bookItem: { 
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10, 
    paddingHorizontal: 18, 
    backgroundColor: "#FFFFFF", 
    marginBottom: 12, 
    borderRadius: 12, 
    shadowColor: "#000", 
    shadowOpacity: 0.08, 
    shadowRadius: 5, 
    elevation: 3 
  },
  bookInfo: { 
    flex: 1 
  },
  bookTitle: { 
    fontSize: 18, 
    fontWeight: "500", 
    color: "#444" 
  },
  bookCategory: { 
    fontSize: 14, 
    color: "#888", 
    marginTop: 3 
  },
  bookAuthor: { 
    fontSize: 14, 
    color: "#666", 
    marginTop: 3, 
    fontStyle: "italic" 
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 25,
    right: 25,
    backgroundColor: "#4A90E2",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
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
