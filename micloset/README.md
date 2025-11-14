# MiCloset

A virtual closet application that allows you to save clothing items and dress up your avatar! Create, organize, and visualize your wardrobe digitally.

## Features

- **Save Clothing Items**: Upload images and save clothing items with names and categories
- **Category Organization**: Organize items by category (Tops, Bottoms, Dresses, Jackets, Shoes)
- **Virtual Dress-Up**: Apply clothing items to your avatar by clicking on them
- **Item Management**: Delete items from your closet
- **Visual Feedback**: See which items are currently applied to your avatar
- **Clear Avatar**: Remove all applied items with one click

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS** - Custom styling

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database (via Mongoose)
- **Multer** - File upload handling (available but not currently used)

## Project Structure

```
micloset/
├── backend/
│   └── src/
│       └── server.js          # Express server and API endpoints
├── src/
│   ├── components/
│   │   └── dialogs/
│   │       ├── add-item.popup.jsx      # Image selection popup
│   │       └── create-item.popup.jsx   # Item creation form
│   ├── pages/
│   │   ├── HomePage.jsx       # Main application page
│   │   └── main.jsx          # React entry point
│   ├── styles/
│   │   ├── HomePage.css
│   │   ├── add-item.popup.css
│   │   └── create-item.popup.css
│   └── assets/
│       └── avatar_clothed.png  # Base avatar image
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd micloset
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/micloset
   ```
   Or use MongoDB Atlas:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/micloset
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:4173`

6. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The frontend will typically run on `http://localhost:5173` (or another port if 5173 is taken)

## API Endpoints

### Items

- **GET `/api/items`** - Get all items (optionally filtered by category)
  - Query params: `category` (optional) - Filter by category (e.g., `?category=tops`)
  - Returns: Array of items (without image buffers)

- **GET `/api/items/:id`** - Get a single item by ID
  - Returns: Item object

- **POST `/api/items`** - Create a new clothing item
  - Body:
    ```json
    {
      "name": "Item Name",
      "category": "Tops",
      "image": "data:image/png;base64,...",
      "imageURL": "data:image/png;base64,..."
    }
    ```
  - Returns: Created item object

- **DELETE `/api/items/:id`** - Delete an item by ID
  - Returns: Success message

## Usage

1. **Adding Items**:
   - Click the "+ Add Item" button
   - Select an image file (max 2MB)
   - Enter the item name
   - Select a category
   - Click "Create Item"

2. **Applying Items to Avatar**:
   - Browse items by category using the category selector
   - Click on any item card to apply it to your avatar
   - Only one item per category can be applied at a time
   - Applied items are highlighted with a pink border

3. **Removing Items**:
   - Click the "×" button on any item card to delete it permanently
   - Click "Clear All" below the avatar to remove all applied items

4. **Switching Categories**:
   - Use the category radio buttons at the top to filter items
   - Items are automatically filtered and displayed

## Development

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Scripts
- `npm run dev` - Start development server with nodemon (auto-restart on changes)

## Database Schema

### Item Schema
```javascript
{
  name: String,        // Item name
  category: String,    // Category (Tops, Bottoms, Dresses, Jackets, Shoes)
  image: Buffer,       // Image stored as binary data
  imageURL: String     // Base64 data URL for display
}
```

## Notes

- Images are stored as base64 data URLs in the database
- Image buffers are excluded from GET responses for performance
- The avatar overlay system allows multiple clothing items to be displayed simultaneously
- Items are filtered client-side based on the selected category

## Future Enhancements

Potential features to add:
- User authentication and personal closets
- Outfit saving and management
- Image optimization and compression
- Drag and drop item organization
- Item search functionality
- Social sharing of outfits
