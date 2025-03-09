import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import BooksScreen from "../screens/BooksScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import ReaderScreen from "../screens/ReaderScreen";
import PDFReaderScreen from "../screens/PDFReaderScreen";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack navigator for books (includes ReaderScreen)
function BooksStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BooksMain" component={BooksScreen} options={{ title: "Books" }} />
      <Stack.Screen 
        name="Reader" 
        component={ReaderScreen} 
        options={({ route }) => ({ 
          title: route.params?.title || "EPUB Reader",
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
        })} 
      />
      <Stack.Screen 
        name="PDFReader" 
        component={PDFReaderScreen} 
        options={({ route }) => ({ 
          title: route.params?.title || "PDF Reader",
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
        })} 
      />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator (NO NavigationContainer here)
// ... existing code ...
export default function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoriesScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="folder" size={size} color={color} /> }}
      />
      <Tab.Screen 
        name="Books" 
        component={BooksStack}  
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} /> }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="star" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}