import React, { useState } from 'react';
import '../../styles/add-item.popup.css'
import CreateItemPopup from './create-item.popup';

/**
 * Displays the select image popup to pick an image from the files
 * @param {Boolean} displayForm - Boolean value to show or hide select image popup
 * @param {Function} onClose - A function to close the popup
 * @param {Function} onItemCreated - A function to call when an item is created
 *
 */

const AddItemPopup = ({ displayForm, onClose, onItemCreated }) => {
  const [showCreateItemPopup, setShowCreateItemPopup] = useState(false);
  const [selectedImageURL, setSelectedImageURL] = useState(null);
  const [isImageSelected, setIsImageSelected] = useState(false);


  const clearInfo = (event) => {
    const imgInput = document.querySelector('input[type="file"]');
    imgInput.value = '';
    const imgArea = document.querySelector('.img-area');
    const closeImageButton = document.querySelector('.clear-img-thin');
    imgArea.classList.remove('active');
    closeImageButton.style.display = "none";
    const selectImage = document.querySelector('.select-image');
    selectImage.textContent = "Select Image";
    setIsImageSelected(false);
    event.preventDefault();
  };

  const selectImageClick = () => {
    const selectImage = document.querySelector('.select-image');
    const inputFile = document.querySelector('#file');
    if (selectImage.textContent === "Select Image") {
      inputFile.click();
    } else if (selectImage.textContent === "Create Item") {
      setShowCreateItemPopup(true);
      onClose();
      clearInfo();
    }
  };

  const inputFileChange = (event) => {
    const image = event.target.files[0];
    if (image.size < 2000000) {
      setIsImageSelected(true);
      const reader = new FileReader();
      reader.onload = () => {
        const imgArea = document.querySelector('.img-area');
        const closeImageButton = document.querySelector('.clear-img-thin');
        const allImg = imgArea.querySelectorAll('img');
        allImg.forEach(item => item.remove());
        const imgUrl = reader.result;
        const imgPreview = document.createElement('img');
        imgPreview.src = imgUrl;
        imgPreview.id = "itemPreview";
        imgArea.appendChild(imgPreview);
        imgArea.classList.add('active');
        imgArea.dataset.img = image.name;
        closeImageButton.style.display = "block";
        setSelectedImageURL(imgUrl);
        const selectImage = document.querySelector('.select-image');
        if (imgArea.querySelector('img')) {
          selectImage.textContent = "Create Item";
        }
      };
      reader.readAsDataURL(image);
    } else {
      alert("Image size more than 2MB");
    }
  };

  const clearImage = (event) => {
    setIsImageSelected(false);
    const imgInput = document.querySelector('input[type="file"]');
    imgInput.value = '';
    const imgArea = document.querySelector('.img-area');
    const closeImageButton = document.querySelector('.clear-img-thin');
    const selectImage = document.querySelector('.select-image');
    imgArea.classList.remove('active');
    const allImg = imgArea.querySelectorAll('img');
    allImg.forEach(item => item.remove());
    closeImageButton.style.display = "none";
    selectImage.textContent = "Select Image";
    event.preventDefault();
  };

  console.log({showCreateItemPopup});

  return (
    <>
      <CreateItemPopup 
        display={showCreateItemPopup} 
        onClose={() => { setShowCreateItemPopup(false); }} 
        selectedImageURL={selectedImageURL}
        onItemCreated={onItemCreated}
      />
      {displayForm ? (
        <div className="form-popup">
          <button className="close-thin" onClick={() => { onClose(); clearInfo(); }}></button>
          <div className="container">
            <input type="file" id="file" accept="image/*" hidden onChange={inputFileChange} />
            <div className="img-area" data-img="">
              <button className="clear-img-thin" onClick={clearImage}></button>
              {isImageSelected ? null : (
                <>
                  <i className='bx bxs-cloud-upload icon'></i>
                  <h3>Upload Image</h3>
                  <p>Image size must be less than <span>2MB</span></p>
                </>
              )}
            </div>
            <button className="select-image" onClick={selectImageClick}>Select Image</button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AddItemPopup;

