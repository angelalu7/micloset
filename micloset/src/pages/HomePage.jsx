import { useState } from 'react'
import '../styles/HomePage.css'
import Avatar from '../assets/avatar.png'
import AddItemPopup from '../components/dialogs/add-item.popup';

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('tops');
  const [showAddItemPopup, setShowAddItemPopup] = useState(false);

  console.log({showAddItemPopup});


  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <>
      <AddItemPopup displayForm={showAddItemPopup} onClose={() => {setShowAddItemPopup(false)}}/>
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
            <div className="clothing-item">
              <div className="add-button"></div>
              <button 
              className="add-item-button"
              onClick={() => {
                setShowAddItemPopup(true);
              }} >
                Add Item
              </button>
            </div>
          </div>
          <div id="avatar">
            <img src={Avatar} alt="Avatar" />
          </div>
        </section>
      </main>
      <footer>
    </footer>
    </>
  );
}

export default HomePage
