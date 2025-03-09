import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
// import ReactNativePdf from 'react-native-pdf';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';  // Import expo-media-library

export default function PDFReaderScreen() {
  const route = useRoute();
  const { book } = route.params;
  const [loading, setLoading] = useState(true);

  // Function to check if the file exists
  const checkIfFileExists = async (fileUri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      return fileInfo.exists;
    } catch (error) {
      console.error("Error checking file:", error);
      return false;
    }
  };

  // Request media library permission
  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();  // Request permission using expo-media-library
    if (status !== 'granted') {
      alert('Permission to access media library is required');
    }
  };

  // Call the requestPermissions function when the screen is loaded
  useEffect(() => {
    requestPermissions(); // Request permission
    const fetchData = async () => {
      if (book && book.file_path) {
        const fileUri = book.file_path;

        const fileExists = await checkIfFileExists(fileUri);

        if (!fileExists) {
          alert('File not found');
          setLoading(false);
        } else {
          setLoading(false);
        }
      } else {
        alert('No file path provided');
        setLoading(false);
      }
    };

    fetchData();
  }, [book]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ReactNativePdf
          source={{uri: book.file_path, cache: true}}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`loaded a pdf with ${numberOfPages} pages`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`current page is ${page}`);
          }}
          onError={(error) => {
            console.error('Error loading PDF:', error);
          }}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
