import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  ScrollView, 
  TextInput, 
  Alert 
} from 'react-native';
import { useTheme } from "../context/ThemeContext";
import { getBooks } from "../database/Database";
import { useFocusEffect } from '@react-navigation/native';

export default function SettingsScreen() {
  const { bgColor, setBgColor, darkMode, toggleDarkMode, resetSettings } = useTheme();
  const colors = ["#F7E7CE", "#FFD1DC", "#C1E7C1", "#B5EAD7", "#A7C7E7", "#E2C2E9", "#F8F1FF"];

  // Profile state
  const [profileName, setProfileName] = useState('');
  const [profileAge, setProfileAge] = useState('');
  const [totalBooks, setTotalBooks] = useState(0);
  const [favoriteBooksCount, setFavoriteBooksCount] = useState(0);

  // Fetch book stats every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchBookStats = async () => {
        try {
          const books = await getBooks();
          setTotalBooks(books.length);
          const favCount = books.filter(book => book.favorite === 1).length;
          setFavoriteBooksCount(favCount);
        } catch (error) {
          console.error("Error fetching book stats:", error);
        }
      };
      fetchBookStats();
    }, [])
  );

  // (Optionally, you could add a saveProfile function to persist profile info in your database)

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: bgColor }]}>
      
      <View style={styles.statsSection}>
        <Text style={styles.statsText}>Total Books: {totalBooks}</Text>
        <Text style={styles.statsText}>Favorite Books: {favoriteBooksCount}</Text>
      </View>

      {/* Background Color Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Background Color:</Text>
        <View style={styles.colorOptions}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[styles.colorButton, { backgroundColor: color }]}
              onPress={() => setBgColor(color)}
            />
          ))}
        </View>
      </View>

      {/* Dark Mode Toggle */}
      <View style={styles.section}>
        <View style={styles.settingRow}>
          <Text style={styles.sectionTitle}>Dark Mode:</Text>
          <Switch value={darkMode} onValueChange={toggleDarkMode} />
        </View>
      </View>

      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
        <Text style={styles.resetText}>Reset to Default</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  profileSection: {
    width: "100%",
    marginBottom: 20,
  },
  profileInput: {
    height: 45,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  statsSection: {
    width: "100%",
    marginBottom: 20,
  },
  statsText: {
    fontSize: 20,
    color: "#333",
    marginBottom: 5,
    textAlign: 'center',
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    padding: 10,
  },
  section: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  colorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  colorButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 5,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
  },
  resetButton: {
    width: "85%",
    padding: 12,
    backgroundColor: "#ff5757",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  resetText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
