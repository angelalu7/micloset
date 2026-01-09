import { useState, useEffect, useCallback, useRef } from 'react'
import '../styles/HomePage.css'
import AddItemPopup from '../components/dialogs/add-item.popup';
import axios from 'axios';

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('tops');
  const [showAddItemPopup, setShowAddItemPopup] = useState(false);
  const [closetItems, setClosetItems] = useState([]);
  const [avatarImageURL, setAvatarImageURL] = useState(null);
  const [equippedItems, setEquippedItems] = useState({
    tops: null,
    bottoms: null,
    dresses: null,
    jackets: null,
    shoes: null
  });
  const avatarInputRef = useRef(null);

  const fetchAvatar = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:4173/api/avatar');
      if (response.data.imageURL) {
        setAvatarImageURL(response.data.imageURL);
      }
    } catch (err) {
      console.error('Error fetching avatar:', err);
    }
  }, []);

  useEffect(() => {
    fetchAvatar();
  }, [fetchAvatar]);

  const fetchItems = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:4173/api/items?category=${selectedCategory}`);
      setClosetItems(response.data);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await axios.delete(`http://localhost:4173/api/items/${itemId}`);
      console.log('Item deleted:', response.data);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleItemCreated = () => {
    fetchItems();
  };

  const handleItemClick = (item, event) => {
    // Prevent click if delete button was clicked
    if (event.target.classList.contains('delete-item-button')) {
      return;
    }
    
    const category = item.category.toLowerCase();
    const isCurrentlyEquipped = equippedItems[category]?._id === item._id;
    
    // If item is already equipped, remove it. Otherwise, equip it
    setEquippedItems(prev => ({
      ...prev,
      [category]: isCurrentlyEquipped ? null : item
    }));
  };

  const handleRemoveItem = (category, event) => {
    event.stopPropagation();
    setEquippedItems(prev => ({
      ...prev,
      [category]: null
    }));
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5000000) {
        alert('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = async () => {
        const imageDataURL = reader.result;
        setAvatarImageURL(imageDataURL);
        
        // Save to backend
        try {
          await axios.post('http://localhost:4173/api/avatar', {
            imageURL: imageDataURL
          });
        } catch (err) {
          console.error('Error saving avatar:', err);
          alert('Failed to save avatar. Please try again.');
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleRemoveAvatar = async (event) => {
    event.stopPropagation();
    setAvatarImageURL(null);
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
    
    // Delete from backend
    try {
      await axios.delete('http://localhost:4173/api/avatar');
    } catch (err) {
      console.error('Error deleting avatar:', err);
    }
  };

  const getImageSrc = (item) => {
    return item?.imageURL || (item?.image ? `data:image/png;base64,${item.image.toString('base64')}` : '');
  };

  const renderClothingLayer = (item, category, className) => {
    if (!item) return null;
    
    return (
      <img 
        src={getImageSrc(item)}
        alt={item.name}
        className={`avatar-clothing ${className}`}
        onClick={(e) => handleRemoveItem(category, e)}
        title={`Remove ${item.name}`}
      />
    );
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
            {closetItems.map(item => {
              const isEquipped = equippedItems[item.category.toLowerCase()]?._id === item._id;
              return (
                <div 
                  className={`clothing-item ${isEquipped ? 'equipped' : ''}`} 
                  key={item._id}
                  onClick={(e) => handleItemClick(item, e)}
                >
                  <img 
                    src={getImageSrc(item)} 
                    alt={item.name} 
                  />
                  <div className="item-name">{item.name}</div>
                  <button 
                    className="delete-item-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item._id);
                    }}
                    title="Delete item"
                  >
                    ×
                  </button>
                  {isEquipped && (
                    <div className="equipped-indicator" title="Currently equipped">✓</div>
                  )}
                </div>
              );
            })}
            <div className="clothing-item add-item-container">
              <button 
                className="add-item-button"
                onClick={() => {
                  setShowAddItemPopup(true);
                }} 
              >
                + Add Item
              </button>
            </div>
          </div>
          <div id="avatar">
            <input
              type="file"
              ref={avatarInputRef}
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: 'none' }}
            />
            <div className="avatar-container" onClick={handleAvatarClick}>
              {avatarImageURL ? (
                <>
                  <img src={avatarImageURL} alt="Avatar" className="avatar-base" />
                  {renderClothingLayer(equippedItems.shoes, 'shoes', 'clothing-shoes')}
                  {renderClothingLayer(equippedItems.bottoms, 'bottoms', 'clothing-bottoms')}
                  {renderClothingLayer(equippedItems.dresses || equippedItems.tops, equippedItems.dresses ? 'dresses' : 'tops', 'clothing-tops')}
                  {renderClothingLayer(equippedItems.jackets, 'jackets', 'clothing-jackets')}
                  <button 
                    className="remove-avatar-button"
                    onClick={handleRemoveAvatar}
                    title="Remove avatar"
                  >
                    ×
                  </button>
                </>
              ) : (
                <div className="avatar-placeholder">
                  <i className='bx bx-user-circle icon'></i>
                  <p>Click to upload avatar</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer>
    </footer>
    </>
  );
}

export default HomePage
