import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from "react-native";
import { useTheme } from "../context/ThemeContext"; // Import Theme Context

export default function SettingsScreen() {
  const { bgColor, setBgColor, fontFamily, setFontFamily, darkMode, toggleDarkMode, resetSettings } = useTheme();

  const colors = ["#F7E7CE", "#FFD1DC", "#C1E1C1", "#B5EAD7", "#A7C7E7", "#E2C2E9", "#F8F1FF"];
  const fonts = ["System", "serif", "monospace", "sans-serif"];

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.title, { fontFamily }]}>Settings ⚙️</Text>

      {/* Background Color Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontFamily }]}>Choose Background Color:</Text>
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

      {/* Font Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontFamily }]}>Choose Font Style:</Text>
        <View style={styles.fontOptions}>
          {fonts.map((font) => (
            <TouchableOpacity
              key={font}
              style={styles.fontButton}
              onPress={() => setFontFamily(font)}
            >
              <Text style={{ fontFamily: font }}>{font}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Dark Mode Toggle */}
      <View style={styles.section}>
        <View style={styles.settingRow}>
          <Text style={[styles.sectionTitle, { fontFamily }]}>Dark Mode:</Text>
          <Switch value={darkMode} onValueChange={toggleDarkMode} />
        </View>
      </View>

      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
        <Text style={[styles.resetText, { fontFamily }]}>Reset to Default</Text>
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  section: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  colorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  colorButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  fontOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  fontButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
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
  },
});
