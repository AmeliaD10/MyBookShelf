import { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal } from 'react-native';
import { setupDatabase, addCategory, getCategories, deleteCategory, editCategory } from '../database/Database';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from "../context/ThemeContext";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState('');
  const { bgColor } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      await setupDatabase();
      setCategories(await getCategories());
    };
    loadData();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert('Error', 'Category name cannot be empty.');
      return;
    }
    await addCategory(newCategory);
    setCategories(await getCategories());
    setNewCategory('');
    Alert.alert('Success', `Category "${newCategory}" added!`);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditedName(category.name);
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editedName.trim()) {
      Alert.alert('Error', 'Category name cannot be empty.');
      return;
    }
    try {
      await editCategory(editingCategory.id, editedName);
      setCategories(await getCategories());
      Alert.alert('Success', 'Category updated successfully!');
      setIsEditModalVisible(false);
      setEditingCategory(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update category.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteCategory(categoryId);
            setCategories(await getCategories());
            Alert.alert('Deleted', 'Category has been removed.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: bgColor }]}>
    
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter new category"
          value={newCategory}
          onChangeText={setNewCategory}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Text style={styles.addButtonText}>➕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Available Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Text style={styles.categoryText}>{item.name}</Text>

            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.editContainer}
                onPress={() => handleEditCategory(item)}
              >
                <MaterialIcons name="edit" size={22} style={styles.editIcon} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.deleteContainer}
                onPress={() => handleDeleteCategory(item.id)}
              >
                <MaterialIcons name="delete-outline" size={22} style={styles.deleteIcon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        scrollEnabled={false}
      />

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Category</Text>
            <TextInput
              style={styles.modalInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter new category name"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({


  container: { 
    flexGrow: 1, 
    paddingHorizontal: 30, 
    paddingVertical: 35, 
 backgroundColor: '#F8F1FF'
  },
  title: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 25 
  },
  subtitle: { 
    fontSize: 22, 
    fontWeight: '600', 
    marginVertical: 20 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3, 
    marginBottom: 20 
  },
  input: { 
    flex: 1, 
    fontSize: 17, 
    padding: 10 
  },
  addButton: { 
    backgroundColor: '#FCE8E8',
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderRadius: 8, 
    marginLeft: 12 
  },
  addButtonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 17 
  },
  categoryItem: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14, 
    paddingHorizontal: 18, 
    backgroundColor: '#ffffff', 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3, 
    marginBottom: 12 
  },
  categoryText: { 
    fontSize: 19, 
    fontWeight: '500' 
  },
  deleteButton: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 17
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FC',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  deleteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCE8E8',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  editIcon: {
    color: '#4A90E2'
  },
  deleteIcon: {
    color: '#E25C5C'
  }
});