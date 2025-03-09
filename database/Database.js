import * as SQLite from 'expo-sqlite';

// Open the database asynchronously
let dbPromise = SQLite.openDatabaseAsync("books.db");

export const setupDatabase = async () => {
  const db = await dbPromise;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      author TEXT,
      file_path TEXT,
      category TEXT,
      favorite INTEGER DEFAULT 0
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    );
  `);

  await addFavoriteColumn(); // Ensure the favorite column exists
  console.log('✅ Books and Categories tables checked/created.');
};


// Add a book
export const addBook = async (title, author, filePath, category) => {
  const db = await dbPromise;
  try {
    console.log(`ℹ️ Attempting to insert: ${title}, ${filePath}`);
    await db.runAsync(
      `INSERT INTO books (title, author, file_path, category) VALUES (?, ?, ?, ?);`,
      [title, author, filePath, category]
    );
    console.log(`✅ Successfully inserted: ${title}`);
  } catch (error) {
    console.error('❌ Error inserting book:', error);
  }
};

// Fetch books
export const getBooks = async () => {
  const db = await dbPromise;
  try {
    const result = await db.getAllAsync(`SELECT * FROM books;`);
    console.log('📚 Retrieved books:', result);
    return result;
  } catch (error) {
    console.error('❌ Error retrieving books:', error);
    return [];
  }
};

// Delete a book
export const deleteBook = async (id) => {
  const db = await dbPromise;
  await db.runAsync(`DELETE FROM books WHERE id = ?;`, [id]);
};

// Add a category
export const addCategory = async (name) => {
  const db = await dbPromise;
  try {
    await db.runAsync(`INSERT INTO categories (name) VALUES (?);`, [name]);
    console.log(`✅ Category added: ${name}`);
  } catch (error) {
    console.error('❌ Error adding category:', error);
  }
};

// Fetch categories
export const getCategories = async () => {
  const db = await dbPromise;
  try {
    const result = await db.getAllAsync(`SELECT * FROM categories;`);
    console.log('📂 Retrieved categories:', result);
    return result;
  } catch (error) {
    console.error('❌ Error retrieving categories:', error);
    return [];
  }
};

// Assign a category to a book
export const assignCategoryToBook = async (bookId, categoryName) => {
  const db = await dbPromise;
  try {
    await db.runAsync(`UPDATE books SET category = ? WHERE id = ?;`, [categoryName, bookId]);
    console.log(`✅ Category "${categoryName}" assigned to book ID: ${bookId}`);
  } catch (error) {
    console.error('❌ Error assigning category:', error);
  }
};
// Delete a category
export const deleteCategory = async (id) => {
  const db = await dbPromise;
  try {
    // Remove category from books
    await db.runAsync(`UPDATE books SET category = NULL WHERE category = (SELECT name FROM categories WHERE id = ?);`, [id]);
    
    // Delete the category
    await db.runAsync(`DELETE FROM categories WHERE id = ?;`, [id]);

    console.log(`✅ Category with ID ${id} deleted.`);
  } catch (error) {
    console.error('❌ Error deleting category:', error);
  }
};
export const toggleFavoriteStatus = async (bookId, isFavorite) => {
  const db = await dbPromise;
  try {
    await db.runAsync(`UPDATE books SET favorite = ? WHERE id = ?;`, [isFavorite ? 1 : 0, bookId]);
    console.log(`✅ Favorite status updated for book ID ${bookId}: ${isFavorite}`);
  } catch (error) {
    console.error('❌ Error updating favorite status:', error);
  }
};
export const addFavoriteColumn = async () => {
  const db = await dbPromise;
  try {
    await db.runAsync(`ALTER TABLE books ADD COLUMN favorite INTEGER DEFAULT 0;`);
    console.log('✅ Favorite column added to books table.');
  } catch (error) {
    if (error.message.includes("duplicate column name")) {
      console.log('ℹ️ Favorite column already exists.');
    } else {
      console.error('❌ Error adding favorite column:', error);
    }
  }
};
// Edit a category
export const editCategory = async (id, newName) => {
  const db = await dbPromise;
  try {
    // Update category name
    await db.runAsync(`UPDATE categories SET name = ? WHERE id = ?;`, [newName, id]);
    
    // Update category name in books table
    await db.runAsync(
      `UPDATE books SET category = ? WHERE category = (SELECT name FROM categories WHERE id = ?);`,
      [newName, id]
    );
    
    console.log(`✅ Category with ID ${id} updated to "${newName}"`);
  } catch (error) {
    console.error('❌ Error updating category:', error);
    throw error; // Propagate error to handle it in the UI
  }
};




