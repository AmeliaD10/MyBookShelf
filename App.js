import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { setupDatabase } from './database/Database';
import BottomTabs from './navigation/BottomTabs';

export default function App() {
  useEffect(() => {
    setupDatabase();
  }, []);

  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}
