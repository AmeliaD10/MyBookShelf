import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  Alert 
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getFolders, addFolder as dbAddFolder, updateFolder, deleteFolder } from "../database/Database";
import { useTheme } from "../context/ThemeContext";

export default function FoldersScreen({ navigation }) {
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState(null);
  const [editedFolderName, setEditedFolderName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
const { bgColor } = useTheme();

  // Function to fetch folders from the DB
  const fetchFolders = async () => {
    const fetchedFolders = await getFolders();
    setFolders(fetchedFolders);
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const addFolder = async () => {
    if (folderName.trim()) {
      await dbAddFolder(folderName);
      setFolderName("");
      fetchFolders();
    }
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
    setEditedFolderName(folder.name);
    setModalVisible(true);
  };

  const saveFolderEdit = async () => {
    if (editedFolderName.trim()) {
      await updateFolder(editingFolder.id, editedFolderName);
      setModalVisible(false);
      setEditingFolder(null);
      fetchFolders();
    } else {
      Alert.alert("Error", "Folder name cannot be empty.");
    }
  };

  const handleDeleteFolder = (folderId) => {
    Alert.alert(
      "Delete Folder",
      "Are you sure you want to delete this folder?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            await deleteFolder(folderId);
            fetchFolders();
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.folderContainer}>
      <TouchableOpacity 
        style={styles.folder} 
        onPress={() => navigation.navigate("FolderDetails", { folder: item })}
      >
        <MaterialIcons 
          name="folder" 
          size={28} 
          color="#FBC02D" 
          style={styles.folderIcon} 
        />
        <Text style={styles.folderText}>{item.name}</Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEditFolder(item)} style={styles.iconButton}>
          <MaterialIcons name="edit" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteFolder(item.id)} style={styles.iconButton}>
          <MaterialIcons name="delete" size={24} color="#D32F2F" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.title}>Your Folders</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter folder name"
          value={folderName}
          onChangeText={setFolderName}
        />
        <Button title="Add" onPress={addFolder} />
      </View>

      <FlatList
        data={folders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Edit Folder Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEditingFolder(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Folder Name</Text>
            <TextInput
              style={styles.modalInput}
              value={editedFolderName}
              onChangeText={setEditedFolderName}
              placeholder="New folder name"
            />
            <View style={styles.modalButtons}>
              <Button 
                title="Cancel" 
                onPress={() => {
                  setModalVisible(false);
                  setEditingFolder(null);
                }} 
              />
              <Button title="Save" onPress={saveFolderEdit} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#F5F5F5" 
  },
  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center",
    color: "#333"
  },
  inputContainer: { 
    flexDirection: "row", 
    marginBottom: 20 
  },
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: "#ccc", 
    padding: 10, 
    borderRadius: 8, 
    marginRight: 10,
    backgroundColor: "#fff"
  },
  listContainer: {
    paddingBottom: 20,
  },
  folderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  folder: {
    flexDirection: "row",
    alignItems: "center",
  },
  folderIcon: {
    marginRight: 10,
  },
  folderText: { 
    fontSize: 20, 
    fontWeight: "600",
    color: "#555"
  },
  actions: { 
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
