import React, { useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
// import RNFS from 'react-native-fs';

export default function EPUBReaderScreen({ route }) {
  const { book } = route.params;
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const loadEpub = async () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <script src="https://futurepress.github.io/epub.js/dist/epub.js"></script>
        <style>
          body { margin: 0; }
          #viewer { width: 100vw; height: 100vh; }
        </style>
      </head>
      <body>
        <div id="viewer"></div>
        <script>
          var book = ePub("${book.filePath}");
          var rendition = book.renderTo("viewer", { width: "100%", height: "100%" });
          rendition.display();
        </script>
      </body>
      </html>
    `;
    const filePath = `${RNFS.DocumentDirectoryPath}/index.html`;
    await RNFS.writeFile(filePath, htmlContent, 'utf8');
    return `file://${filePath}`;
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      <WebView
        ref={webViewRef}
        source={{ uri: book.filePath }}
        onLoad={() => setLoading(false)}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1 },
  loader: { position: 'absolute', top: '50%', left: '50%', marginLeft: -25, marginTop: -25 },
});
