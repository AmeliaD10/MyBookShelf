import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { useRoute } from '@react-navigation/native';

export default function EpubScreen() {
  const route = useRoute();
  const { fileUri, title } = route.params || {};
  const [epubData, setEpubData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEpub = async () => {
      try {
        if (!fileUri) {
          throw new Error("File URI not provided");
        }
        // Verify that the file exists.
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
          throw new Error("File not found at stored location. Please re-import the book.");
        }
        // Read the file as a base64 string.
        const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
        const dataUrl = `data:application/epub+zip;base64,${base64}`;
        setEpubData(dataUrl);
      } catch (error) {
        Alert.alert('Error', 'Failed to load EPUB: ' + error.message);
        console.error("EpubScreen Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEpub();
  }, [fileUri]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!epubData) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // Remove the prefix to get the pure base64 string.
  const pureBase64 = epubData.replace("data:application/epub+zip;base64,", "");

  // Build HTML that loads epub.js from a CDN and renders the EPUB.
  // Additional console logs are added to help debug.
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>EPUB Viewer</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/epub.js/0.3.88/epub.min.js"></script>
        <style>
          html, body { margin: 0; padding: 0; height: 100%; }
          #viewer { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="viewer"></div>
        <script>
          (function() {
            try {
              // Safely inject the pure base64 string.
              const base64String = ${JSON.stringify(pureBase64)};
              function base64ToUint8Array(base64) {
                const binaryString = atob(base64);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                return bytes;
              }
              const epubArray = base64ToUint8Array(base64String);
              const blob = new Blob([epubArray], { type: 'application/epub+zip' });
              const epubUrl = URL.createObjectURL(blob);
              console.log("EPUB URL:", epubUrl);
              const book = ePub(epubUrl);
              book.ready.then(() => {
                console.log("Book is ready.");
              }).catch(err => {
                console.log("Book ready error:", err);
              });
              const rendition = book.renderTo("viewer", {
                width: "100%",
                height: "100%"
              });
              rendition.on("rendered", (section) => {
                console.log("Section rendered:", section.href);
              });
              rendition.display().catch(err => {
                console.log("Rendition display error:", err);
              });
            } catch(e) {
              document.body.innerHTML = '<p>Error: ' + e + '</p>';
              console.log("Error in injected script:", e);
            }
          })();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView originWhitelist={['*']} source={{ html }} style={styles.webview} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  webview: { 
    flex: 1,
  },
  loader: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});
