import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/create-item.popup.css'

const CreateItemPopup = ({ display, onClose, selectedImageURL }) => {
    const [isOptionMenuActive, setOptionMenuActive] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Select category');
    const [itemName, setItemName] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const options = ['Tops', 'Bottoms', 'Dresses', 'Jackets', 'Shoes'];

    useEffect(() => {
        setIsFormValid(itemName.trim() !== '' && selectedOption !== 'Select category');
    }, [itemName, selectedOption]);
  
    const handleSelectClick = () => {
      setOptionMenuActive(!isOptionMenuActive);
    };
  
    const handleOptionClick = (optionText) => {
      setSelectedOption(optionText);
      setOptionMenuActive(false);
    };

    const handleCancelClick = () => {
        setSelectedOption('Select category');
        setOptionMenuActive(false);
        onClose();
      };

    const handleCreateItem = async (e) => {
        e.preventDefault();
        console.log({selectedImageURL});

        const itemData = {
            name: itemName,
            category: selectedOption,
            image: selectedImageURL,
            imageURL: selectedImageURL
        };

        try {
            console.log('test2');
            console.log(itemData);
            const response = await axios.post('http://localhost:4173/api/items', itemData);
            console.log('Item created:', response.data);
            handleCancelClick();
        } catch(err) {
            console.error('Error creating item:', err);
        }
    };

    return display ? (
            <div className="create-form-popup" id="itemForm">
                <a href="#" className="close-thin" onClick={handleCancelClick}></a>
                <div className="creation-container">
                    <h3>Create Clothing Item</h3>
                    <form id="itemCreationForm" onSubmit={handleCreateItem}>
                    <div className='create-main'>
                        <div className='left-section'>
                            <div className="img-preview" data-img="">
                                <input type="file" id="itemImage" accept="image/*" hidden />
                                <img id="itemPreview" src={selectedImageURL} alt="Item Preview" />
                            </div>
                        </div>
                        <div className='right-section'>
                            <input type="text" id="itemName" placeholder="Item Name" onChange={(e) => setItemName(e.target.value)} required />
                            <div className={`select-menu ${isOptionMenuActive ? 'active' : ''}`}>
                                <div className="select-btn" onClick={handleSelectClick}>
                                    <span className="sBtn-text">{selectedOption}</span>
                                    <i className="bx bx-chevron-down"></i>
                                </div>

                                {isOptionMenuActive && (
                                <ul className="options">
                                    {options.map((option, index) => (
                                    <li className="option" key={index} onClick={() => handleOptionClick(option)}>
                                        <span className="option-text">{option}</span>
                                    </li>
                                    ))}
                                </ul>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="button-container">
                       <button className="cancel" onClick={handleCancelClick}>Cancel</button>
                       <button type="submit" className="create-item" disabled={!isFormValid}>Create Item</button>
                    </div>
                    </form>
                </div>
            </div>
    ) : null;
};

export default CreateItemPopup;
