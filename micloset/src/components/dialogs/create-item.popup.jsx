import React, { useState } from 'react';
import '../../styles/create-item.popup.css'

const CreateItemPopup = ({ display, onClose, selectedImageURL }) => {
    const [isOptionMenuActive, setOptionMenuActive] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Select your option');
    const options = ['Tops', 'Bottoms', 'Dresses', 'Jackets', 'Shoes'];
  
    const handleSelectClick = () => {
      setOptionMenuActive(!isOptionMenuActive);
    };
  
    const handleOptionClick = (optionText) => {
      setSelectedOption(optionText);
      setOptionMenuActive(false);
    };

    const handleCancelClick = () => {
        setSelectedOption('Select your option');
        setOptionMenuActive(false);
        onClose();
      };

    return display ? (
        <>
            <div className="create-form-popup" id="itemForm">
                <a href="#" className="close-thin" onClick={onClose}></a>
                <div className="creation-container">
                    <h3>Create Clothing Item</h3>
                    <form id="itemCreationForm" onSubmit={(event) => { addItem(); event.preventDefault(); }}>
                    <main className='create-main'>
                        <section className='left-section'>
                            <div className="img-preview" data-img="">
                                <input type="file" id="itemImage" accept="image/*" hidden />
                                <img id="itemPreview" src={selectedImageURL} alt="Item Preview" />
                            </div>
                        </section>
                        <section className='right-section'>
                            <input type="text" id="itemName" placeholder="Item Name" required />
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
                        </section>
                    </main>
                    <div className="button-container">
                       <button className="cancel" onClick={handleCancelClick}>Cancel</button>
                       <button type="submit" className="create-item">Create Item</button>
                    </div>
                    </form>
                </div>
            </div>
        </>
    ) : null;
};

export default CreateItemPopup;
