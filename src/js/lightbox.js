(function() {
    'use strict';
    
    let activedElement;
   
    const getMaxDimensions = () => {
        const width = window.innerWidth - 50;
        const height = window.innerHeight - 100;
        
        return {width, height};
    };
    
    const createLightBox = () => {
        const lightBox = document.createElement('div');
        
        lightBox.classList.add('lightbox');
        lightBox.classList.add('lightbox_none');
        lightBox.classList.add('lightbox_load');
        
        lightBox.innerHTML = '<div class="lightbox__container" role="dialog" aria-labelledby="lb-img" aria-describedby="lb-info" tabindex="-1"><button class="lightbox__close close"><img src="lb-img/close.png" alt="Zamknij okno" class="close__img"></button><img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="" class="lightbox__img" id="lb-img"><p class="lightbox__info" id="lb-info"><span class="visuallyhidden">Otworzono powiększenie zdjęcia. Naciśnij <kbd>ESC</kbd> lub <kbd>TAB</kbd>, aby je zamknąć.</span></p></div>';
        
        return lightBox;
    };

    const getElementsLightBox = () => {
        const lightBox = document.querySelector('.lightbox');
        const containerLightBox = document.querySelector('.lightbox__container');
        const imageLightBox = document.querySelector('.lightbox__img');
        
        return {lightBox, containerLightBox, imageLightBox};
    };
    
    const showLightBox = (src, alt = '') => {
        const {lightBox, containerLightBox, imageLightBox} = getElementsLightBox();
        const {width, height} = getMaxDimensions();
        const newImage = new Image();

        lightBox.classList.remove('lightbox_none');
        
        imageLightBox.style.maxWidth = `${width}px`;
        imageLightBox.style.maxHeight = `${height}px`;
        
        newImage.onload = function() {
            imageLightBox.src = this.src;
            imageLightBox.alt = alt;
            
            lightBox.classList.remove('lightbox_load');

            containerLightBox.classList.add('fadeIn');
            imageLightBox.classList.add('fadeIn');
            
            containerLightBox.focus();
        };
        newImage.src = src;
        
        document.addEventListener('click', clickHandler);
        document.addEventListener('keydown', keyHandler);
    };
    
    const removeEvents = () => {
        document.removeEventListener('click', clickHandler);
        document.removeEventListener('keydown', keyHandler);
    };
    
    const hideLightBox = () => {
        const {lightBox, containerLightBox, imageLightBox} = getElementsLightBox();
        
        lightBox.classList.add('lightbox_none');
        lightBox.classList.add('lightbox_load');
        
        containerLightBox.classList.remove('fadeIn');
        
        imageLightBox.classList.remove('fadeIn');
        imageLightBox.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        imageLightBox.alt = '';
        
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
        
        hideLightBox();
    };
    
    const keyHandler = (e) => {
        const tabKeyCode = 9;
        const escKeyCode = 27;
        if(e.keyCode !== escKeyCode && e.keyCode !== tabKeyCode) {
            return false;
        }
        
        // e.stopPropagation();
        e.preventDefault();
        
        hideLightBox();
    };
    
    const initLightBox = () => {
        const lightBox = createLightBox();
        
        document.body.appendChild(lightBox);
    };
    
    initLightBox();

    const thumbnails = [].slice.call(document.querySelectorAll('[data-lightbox]'));
    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', function(e) {
            const href = this.href;
            if(!href || !/\.(gif|jpg|jpeg|tiff|png|bmp)$/i.test(href)) {
                return false;
            }
             
            e.preventDefault();
            e.stopPropagation();
             
            activedElement = this;
             
            showLightBox(href, this.dataset.alt);
        });
    });
}());