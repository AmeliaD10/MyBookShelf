import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { setupDatabase, addBook, getBooks, deleteBook, getCategories } from '../database/Database';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function BooksScreen() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Uncategorized');
  const navigation = useNavigation();

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

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'application/epub+zip'] });
      if (result.canceled) return;

      const selectedFile = result.assets?.[0];
      if (!selectedFile) return;

      await addBook(selectedFile.name, 'Unknown Author', selectedFile.uri, selectedCategory);
      setBooks(await getBooks());
      Alert.alert('Success', `Book "${selectedFile.name}" added to category "${selectedCategory}"!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to pick a document.');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this book?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteBook(id);
            setBooks(await getBooks());
            Alert.alert('Deleted', 'The book has been removed.');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📚 My Book Collection</Text>

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

      <TouchableOpacity style={styles.button} onPress={pickDocument}>
        <Text style={styles.buttonText}>📂 Add Book</Text>
      </TouchableOpacity>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.bookList}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <TouchableOpacity onPress={() => navigation.navigate("Reader", { filePath: item.file_Path })} style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookCategory}>{item.category}</Text>
            </TouchableOpacity>
            
            <View style={styles.deleteContainer}>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <MaterialIcons name="delete-outline" size={22} style={styles.deleteIcon} />
            </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 25, 
    backgroundColor: '#F8F1FF'  // Soft pastel background
  },
  header: { 
    fontSize: 26, 
    fontWeight: '600', 
    textAlign: 'center', 
    marginBottom: 25, 
    color: '#4A4E69' 
  },
  picker: { 
    height: 50, 
    marginBottom: 20, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3
  },
  button: { 
    backgroundColor: '#FCE8E8', // Soft pastel blue gradient
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 20,
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 6, 
    elevation: 3 
  },
  buttonText: { 
    color: '#black', 
    fontSize: 16, 
    fontWeight: '500' 
  },
  bookList: { 
    paddingBottom: 30 
  },
  bookItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 15, 
    paddingHorizontal: 18, 
    backgroundColor: '#FFFFFF', 
    marginBottom: 12, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 5, 
    elevation: 3 
  },
  bookInfo: { 
    flex: 1,  // Ensures text expands properly
  },
  bookTitle: { 
    fontSize: 18, 
    fontWeight: '500', 
    color: '#444' 
  },
  bookCategory: { 
    fontSize: 14, 
    color: '#888', 
    marginTop: 3 
  },
  deleteContainer: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#FCE8E8', // Soft pastel red
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2 
  },
  deleteText: { 
    color: '#E63946', 
    fontSize: 18, 
    textAlign: 'center' 
  }
});
