import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import BooksScreen from "../screens/BooksScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import SettingsScreen from "../screens/SettingsScreen"; // Import Settings screen
import ReaderScreen from "../screens/ReaderScreen";
import PDFReaderScreen from "../screens/PDFReaderScreen";
import { Ionicons } from "@expo/vector-icons";
import FoldersScreen from "../screens/FoldersScreen";
import FolderDetailsScreen from "../screens/FolderDetailsScreen";
import AddBooksScreen from "../screens/AddBooksScreen";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack navigator for Home
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: "Home" }} />
    </Stack.Navigator>
  );
}

// Stack navigator for Categories
function CategoriesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CategoriesMain" component={CategoriesScreen} options={{ title: "Categories" }} />
    </Stack.Navigator>
  );
}

// Stack navigator for Books (includes Reader & PDFReader)
function BooksStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BooksMain" component={BooksScreen} options={{ title: "Books" }} />
      <Stack.Screen 
        name="Reader" 
        component={ReaderScreen} 
        options={({ route }) => ({ 
          title: route.params?.title || "Reader",
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#000",
        })} 
      />
      <Stack.Screen 
        name="PDFReader" 
        component={PDFReaderScreen} 
        options={({ route }) => ({ 
          title: route.params?.title || "PDF Reader",
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#000",
        })} 
      />
    </Stack.Navigator>
  );
}

// Stack navigator for Favorites
function FavoritesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FavoritesMain" component={FavoritesScreen} options={{ title: "Favorites" }} />
    </Stack.Navigator>
  );
}

// Stack navigator for Settings
function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} options={{ title: "Settings" }} />
    </Stack.Navigator>
  );
}
function FoldersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FoldersMain" component={FoldersScreen} options={{ title: "Folders" }} />
      <Stack.Screen name="FolderDetails" component={FolderDetailsScreen} options={{ title: "Folder Details" }} />
      <Stack.Screen name="AddBooks" component={AddBooksScreen} options={{ title: "Add Books" }} />
    </Stack.Navigator>
  );
}


// Bottom Tab Navigator
export default function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoriesStack} 
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="folder" size={size} color={color} /> }}
      />
      <Tab.Screen 
        name="Books" 
        component={BooksStack}  
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} /> }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesStack} 
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="star" size={size} color={color} /> }}
      />
      <Tab.Screen 
  name="Folders" 
  component={FoldersStack} 
  options={{ tabBarIcon: ({ color, size }) => <Ionicons name="folder-open" size={size} color={color} /> }}
/>
      <Tab.Screen 
        name="Settings" 
        component={SettingsStack} 
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} /> }}
      />


    </Tab.Navigator>
  );
}
