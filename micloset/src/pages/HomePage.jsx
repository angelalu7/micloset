import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/HomePage.css'
import Avatar from '../assets/avatar_clothed.png'
import AddItemPopup from '../components/dialogs/add-item.popup';

const API_BASE_URL = 'http://localhost:4173/api';

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('tops');
  const [showAddItemPopup, setShowAddItemPopup] = useState(false);
  const [items, setItems] = useState([]);
  const [appliedItems, setAppliedItems] = useState({}); // { category: itemId }
  const [loading, setLoading] = useState(false);

  // Fetch items when category changes
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/items`, {
        params: { category: selectedCategory }
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleItemClick = (item) => {
    // Apply item to avatar (only one item per category)
    setAppliedItems(prev => ({
      ...prev,
      [item.category.toLowerCase()]: item
    }));
  };

  const handleRemoveItem = (category) => {
    setAppliedItems(prev => {
      const newApplied = { ...prev };
      delete newApplied[category];
      return newApplied;
    });
  };

  const handleItemCreated = () => {
    // Refresh items after creating a new one
    fetchItems();
  };

  const handleDeleteItem = async (itemId, e) => {
    e.stopPropagation(); // Prevent applying item when clicking delete
    try {
      await axios.delete(`${API_BASE_URL}/items/${itemId}`);
      // Remove from applied items if it's currently applied
      const itemToRemove = items.find(item => item._id === itemId);
      if (itemToRemove && appliedItems[itemToRemove.category.toLowerCase()]?._id === itemId) {
        handleRemoveItem(itemToRemove.category.toLowerCase());
      }
      // Refresh items list
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  return (
    <>
      <AddItemPopup 
        displayForm={showAddItemPopup} 
        onClose={() => {setShowAddItemPopup(false)}}
        onItemCreated={handleItemCreated}
      />
      <header>
        <section id="heading">
          <button className="my-closet" id="closet-button">My Outfits</button>
          <h1 id="header-title">MiCloset</h1>
          <button className="help-button">?</button>
        </section>
      </header>
      <main>
        <section id="clothing-nav">
          <div className="clothing-categories">
            <input
              id="tops"
              name="clothing-category"
              type="radio"
              value="tops"
              checked={selectedCategory === 'tops'}
              onChange={handleCategoryChange}
            />
            <label htmlFor="tops">Tops</label>
            <input
              id="bottoms"
              name="clothing-category"
              type="radio"
              value="bottoms"
              checked={selectedCategory === 'bottoms'}
              onChange={handleCategoryChange}
            />
            <label htmlFor="bottoms">Bottoms</label>
            <input
              id="dresses"
              name="clothing-category"
              type="radio"
              value="dresses"
              checked={selectedCategory === 'dresses'}
              onChange={handleCategoryChange}
            />
            <label htmlFor="dresses">Dresses</label>
            <input
              id="jackets"
              name="clothing-category"
              type="radio"
              value="jackets"
              checked={selectedCategory === 'jackets'}
              onChange={handleCategoryChange}
            />
            <label htmlFor="jackets">Jackets</label>
            <input
              id="shoes"
              name="clothing-category"
              type="radio"
              value="shoes"
              checked={selectedCategory === 'shoes'}
              onChange={handleCategoryChange}
            />
            <label htmlFor="shoes">Shoes</label>
          </div>
        </section>
        <section id="virtual-dress-up">
          <div id="clothing-items">
            {loading ? (
              <div className="clothing-item">Loading...</div>
            ) : (
              <>
                {items.map((item) => (
                  <div 
                    key={item._id} 
                    className={`clothing-item ${appliedItems[item.category.toLowerCase()]?._id === item._id ? 'applied' : ''}`}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.imageURL && (
                      <img src={item.imageURL} alt={item.name} className="item-thumbnail" />
                    )}
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>{item.category}</p>
                    </div>
                    <button 
                      className="delete-item-button"
                      onClick={(e) => handleDeleteItem(item._id, e)}
                      title="Delete item"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="clothing-item add-item-card">
                  <button 
                    className="add-item-button"
                    onClick={() => {
                      setShowAddItemPopup(true);
                    }}
                  >
                    + Add Item
                  </button>
                </div>
              </>
            )}
          </div>
          <div id="avatar">
            <img src={Avatar} alt="Avatar" className="avatar-base" />
            {Object.values(appliedItems).map((item) => (
              item.imageURL && (
                <img 
                  key={item._id} 
                  src={item.imageURL} 
                  alt={item.name} 
                  className={`avatar-overlay avatar-${item.category.toLowerCase()}`}
                />
              )
            ))}
            {Object.keys(appliedItems).length > 0 && (
              <button 
                className="clear-avatar-button"
                onClick={() => setAppliedItems({})}
                title="Remove all items"
              >
                Clear All
              </button>
            )}
          </div>
        </section>
      </main>
      <footer>
    </footer>
    </>
  );
}

export default HomePage

