import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system';
import { useRoute } from '@react-navigation/native';

export default function PDFReaderScreen() {
  const route = useRoute();
  const book = route.params?.book;

  React.useEffect(() => {
    const openPDF = async () => {
      try {
        if (book?.file_path) {
          // Get file info
          const fileInfo = await FileSystem.getInfoAsync(book.file_path);
          if (!fileInfo.exists) {
            throw new Error('File does not exist');
          }

          // Open PDF using the system viewer
          await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: book.file_path,
            flags: 1,
            type: 'application/pdf',
          });
        }
      } catch (error) {
        console.error('Error opening PDF:', error);
        Alert.alert('Error', 'Could not open the PDF file');
      }
    };

    openPDF();
  }, [book]);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});