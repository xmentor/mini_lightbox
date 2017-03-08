(function() {
    'use strict';
    
    let activedElement;
   
    const getWindowDimensions = () => {
        const width = window.innerWidth - 50;
        const height = window.innerHeight - 100;
        
        return {width, height};
    };
    
    const createLightBox = (src, alt, maxWidth, maxHeight) => {
        const lightBox = document.createElement('div');
        
        lightBox.classList.add('lightbox');
        
        lightBox.innerHTML = `<div class='lightbox__container' role='dialog' aria-labelledby='lb-img' aria-describedby='lb-info' tabindex='-1'>
                                <button class='lightbox__close close'>
                                    <img src='lb-img/close.png' alt='Zamknij okno' class='close__img'>
                                </button>
                                <img src='${src}' alt='${alt}' style='max-width: ${maxWidth}px; max-height: ${maxHeight}px;' class='lightbox__img' id='lb-img'>
                                <p class='lightbox__info' id='lb-info'>
                                    <span class='visuallyhidden'>Otworzono powiększenie zdjęcia. Naciśnij <kbd>ESC</kbd> lub <kbd>TAB</kbd>, aby zamknąć powiększenie.</span>
                                </p>
                              </div>`;
        
        return lightBox;
    };
    
    const showLightBox = () => {
        const lightBox = document.querySelector('.lightbox');
        const containerLightBox = document.querySelector('.lightbox__container');
        const imageLightBox = document.querySelector('.lightbox__img');
        const showBox = () => {
            lightBox.classList.add('fadeIn');
            setTimeout(() => {
                containerLightBox.classList.add('fadeIn');
                containerLightBox.focus();
                imageLightBox.classList.add('fadeIn');
            }, 200);
        };
        
        if(imageLightBox.complete) {
            showBox();
        } else {
            imageLightBox.addEventListener('load', showBox);
        }
        document.addEventListener('click', clickHandler);
        document.addEventListener('keydown', keyHandler);
    };
    
    const removeEvents = () => {
        document.removeEventListener('click', clickHandler);
        document.removeEventListener('keydown', keyHandler);
    };
    
    const removeLightBox = () => {
        const lightBox = document.querySelector('.lightbox');
        
        lightBox.classList.remove('fadeIn');
        setTimeout(() => {
            lightBox.parentNode.removeChild(lightBox);
        }, 200);
        activedElement.focus();
        removeEvents();
    };
    
    const clickHandler = (e) => {
        const target = e.target;
        if(target.classList.contains('lightbox__img')) {
            return false;
        }
        
        // e.stopPropagation();
        e.preventDefault();
        
        removeLightBox();
    };
    
    const keyHandler = (e) => {
        const tabKeyCode = 9;
        const escKeyCode = 27;
        if(e.keyCode !== escKeyCode && e.keyCode !== tabKeyCode) {
            return false;
        }
        
        // e.stopPropagation();
        e.preventDefault();
        
        removeLightBox();
    };
    
    const appendToBody = (element) => {
        document.body.appendChild(element);
        showLightBox();
    };
    
    const newLightBox = (srcImg, dataAlt = 'Screenshoot') => {
        const {width, height} = getWindowDimensions();
        const lightBox = createLightBox(srcImg, dataAlt, width, height);
        
        appendToBody(lightBox);
    };

    for(let thumbnails = document.querySelectorAll('[data-lightbox]'), thumbnailsLen = thumbnails.length, i = 0; i < thumbnailsLen; i++) {
        thumbnails[i].addEventListener('click', function(e) {
            const href = this.href;
            if(!href || !/\.(gif|jpg|jpeg|tiff|png|bmp)$/i.test(href)) {
                return false;
            }
             
            e.preventDefault();
            e.stopPropagation();
             
            activedElement = this;
             
            newLightBox(href, this.dataset.alt);
        });
    }
}());