import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { setupDatabase, addBook, getBooks, deleteBook, updateBook, getCategories } from '../database/Database';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from "../context/ThemeContext";

export default function BooksScreen() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Uncategorized');
  const [author, setAuthor] = useState('');
  const [editingBook, setEditingBook] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [editAuthor, setEditAuthor] = useState('');

  const navigation = useNavigation();
  const { bgColor } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        await setupDatabase();
        setBooks(await getBooks());
        setCategories(await getCategories());
      };
      loadData();
    }, [])
  );

  // Copy the file to a permanent location
  const copyFileToPermanentLocation = async (uri, name) => {
    try {
      const dest = FileSystem.documentDirectory + name;
      await FileSystem.copyAsync({
        from: uri,
        to: dest,
      });
      return dest;
    } catch (error) {
      throw new Error("Failed to copy file to permanent location: " + error.message);
    }
  };

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'application/epub+zip'] });
      if (result.canceled) return;

      const selectedFile = result.assets?.[0];
      if (!selectedFile) return;

      const bookAuthor = author.trim() || "Unknown Author";
      // Copy the file and get the new permanent URI
      const permanentUri = await copyFileToPermanentLocation(selectedFile.uri, selectedFile.name);
      // Store the book with permanentUri under file_path
      await addBook(selectedFile.name, bookAuthor, permanentUri, selectedCategory);
      setBooks(await getBooks());
      Alert.alert('Success', `Book "${selectedFile.name}" by "${bookAuthor}" added to category "${selectedCategory}"!`);
      setAuthor('');
    } catch (error) {
      Alert.alert('Error', 'Failed to pick a document: ' + error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Uncategorized" value="Uncategorized" />
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={category.name} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Enter Author Name"
        placeholderTextColor="#999"
        value={author}
        onChangeText={setAuthor}
      />

      <TouchableOpacity style={styles.button} onPress={pickDocument}>
        <Text style={styles.buttonText}>📂 Add Book</Text>
      </TouchableOpacity>

      <Text style={styles.bookCount}>Total Books: {books.length}</Text>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.bookList}
        renderItem={({ item }) =>
          <View style={styles.bookItem}>
            <TouchableOpacity 
              onPress={() => {
                if (!item.file_path) {
                  Alert.alert("Error", "This book does not have a file URI.");
                  return;
                }
                navigation.navigate("Reader", { fileUri: item.file_path });
              }} 
              style={styles.bookInfo}
            >
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookCategory}>{item.category}</Text>
              <Text style={styles.bookAuthor}>By: {item.author}</Text>
            </TouchableOpacity>
            <View style={styles.actionContainer}>
              <TouchableOpacity onPress={() => navigation.navigate("EditBook", { book: item })} style={styles.editContainer}>
                <MaterialIcons name="edit" size={22} style={styles.editIcon} />
              </TouchableOpacity>
              <View style={styles.deleteContainer}>
                <TouchableOpacity onPress={() => {
                  Alert.alert(
                    'Confirm Delete',
                    'Are you sure you want to delete this book?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                          await deleteBook(item.id);
                          setBooks(await getBooks());
                          Alert.alert('Deleted', 'The book has been removed.');
                        }
                      }
                    ]
                  );
                }}>
                  <MaterialIcons name="delete-outline" size={22} style={styles.deleteIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#F8F1FF' },
  picker: { height: 50, marginBottom: 10, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 5, elevation: 3 },
  input: { height: 55, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 12, marginBottom: 15, backgroundColor: '#fff', fontSize: 16 },
  button: { backgroundColor: '#FCE8E8', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  buttonText: { color: '#000', fontSize: 16, fontWeight: '500' },
  bookCount: { textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#444', backgroundColor: '#FCE8E8', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, marginBottom: 15, alignSelf: 'center', marginTop: 20 },
  bookList: { paddingBottom: 30 },
  bookItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 18, backgroundColor: '#FFFFFF', marginBottom: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 5, elevation: 3 },
  bookInfo: { flex: 1 },
  bookTitle: { fontSize: 18, fontWeight: '500', color: '#444' },
  bookCategory: { fontSize: 14, color: '#888', marginTop: 3 },
  bookAuthor: { fontSize: 14, color: '#666', marginTop: 3, fontStyle: 'italic' },
  actionContainer: { flexDirection: 'row', alignItems: 'center' },
  editContainer: { marginRight: 15 },
  deleteContainer: { justifyContent: 'center', alignItems: 'center', width: 40, height: 40, borderRadius: 20, backgroundColor: '#FCE8E8', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  editIcon: { color: '#009688' },
  deleteIcon: { color: '#D32F2F' },
});
