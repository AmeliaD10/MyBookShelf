import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { updateBook, getCategories } from "../database/Database";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

export default function EditBookScreen() {
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { book } = route.params; 
  const { bgColor } = useTheme();

  useEffect(() => {
    setEditAuthor(book.author);
    setEditCategory(book.category);
    
    const loadCategories = async () => {
      setCategories(await getCategories());
    };

    loadCategories();
  }, [book]);

  const handleSave = async () => {
    await updateBook(book.id, editAuthor, editCategory);
    Alert.alert("Updated", "Book details updated successfully!");
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.form}>
        <Text style={styles.title}>{book.title}</Text>

        <Text style={styles.label}>Edit Category:</Text>
        <Picker
          selectedValue={editCategory}
          onValueChange={(itemValue) => setEditCategory(itemValue)}
          style={styles.picker}
        >
          {categories.map((category) => (
            <Picker.Item key={category.id} label={category.name} value={category.name} />
          ))}
        </Picker>

        <Text style={styles.label}>Edit Author:</Text>
        <TextInput
          style={styles.input}
          value={editAuthor}
          onChangeText={setEditAuthor}
          placeholder="Enter Author Name"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>💾 Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>❌ Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  picker: {
    width: "100%",
    height: 50,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#A3E4D7",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "48%",
  },
  cancelButton: {
    backgroundColor: "#F5B7B1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "48%",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
