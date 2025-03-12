import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { setupDatabase } from './database/Database';
import BottomTabs from './navigation/BottomTabs';
import ReaderScreen from "./screens/ReaderScreen";
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from "./context/ThemeContext";
import BooksScreen from './screens/BooksScreen';
import EditBookScreen from "./screens/EditBookScreen";
import EpubScreen from './screens/EpubScreen';


const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    setupDatabase();
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="BottomTabs" component={BottomTabs} />
          <Stack.Screen name="Books" component={BooksScreen} />
          <Stack.Screen name="Reader" component={ReaderScreen} />
          <Stack.Screen name="EditBook" component={EditBookScreen} options={{ title: "Edit Book" }} />
          <Stack.Screen name="EpubScreen" component={EpubScreen} options={{ title: 'EPUB Reader' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
