import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useEffect } from 'react';

export const BookContext = createContext();

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);

  // Load books from AsyncStorage when app starts
  useEffect(() => {
    loadBooks();
  }, []);

  // Save books to AsyncStorage
  const saveBooks = async (booksList) => {
    try {
      await AsyncStorage.setItem('books', JSON.stringify(booksList));
      setBooks(booksList);
    } catch (error) {
      console.error('Error saving books:', error);
    }
  };

  // Load books from AsyncStorage
  const loadBooks = async () => {
    try {
      const storedBooks = await AsyncStorage.getItem('books');
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
      }
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  // Add a new book
  const addBook = (title, author) => {
    const newBook = { id: Date.now().toString(), title, author };
    const updatedBooks = [...books, newBook];
    saveBooks(updatedBooks);
  };

  return (
    <BookContext.Provider value={{ books, addBook }}>
      {children}
    </BookContext.Provider>
  );
}
