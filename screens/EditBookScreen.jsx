import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { updateBook, getCategories } from '../database/Database';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../context/ThemeContext';

export default function EditBookScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { book } = route.params; // book object passed from BooksScreen
  const { bgColor } = useTheme();

  // Local state with current book details
  const [editTitle, setEditTitle] = useState(book.title);
  const [editAuthor, setEditAuthor] = useState(book.author);
  const [editCategory, setEditCategory] = useState(book.category);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  const handleSave = async () => {
    // Ensure your updateBook function is updated to handle title updates:
    // e.g., UPDATE books SET title = ?, author = ?, category = ? WHERE id = ?
    await updateBook(book.id, editTitle, editAuthor, editCategory);
    Alert.alert('Updated', 'Book details updated successfully!');
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.header}>Edit Book</Text>
      <TextInput
        style={styles.input}
        value={editTitle}
        onChangeText={setEditTitle}
        placeholder="Book Title"
      />
      <TextInput
        style={styles.input}
        value={editAuthor}
        onChangeText={setEditAuthor}
        placeholder="Author"
      />
      <Picker
        selectedValue={editCategory}
        onValueChange={(itemValue) => setEditCategory(itemValue)}
        style={styles.picker}
      >
        {categories.map((cat) => (
          <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
        ))}
      </Picker>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    justifyContent: 'center'
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center'
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  picker: {
    height: 50,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#A3E4D7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#D32F2F',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
