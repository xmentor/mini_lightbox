import debounce from 'lodash.debounce';

class Lightbox {
    constructor(options) {
        this.body = document.body;

        this.options = this.mergeOptions(options);
        this.selector = this.options.selector;
        this.extensions = this.options.extensions;
        this.info = this.options.info;

        this.thumbnails = [...document.querySelectorAll(this.selector)];
        this.activedElement = null;
        this.defaultSrc = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

        this.maxDimensions = this.getMaxDimensions();

        this.escKeyCode = 27;

        this.clickHandler = this.clickHandler.bind(this);
        this.keyHandler = this.keyHandler.bind(this);
        this.thumbnailClickHandler = this.thumbnailClickHandler.bind(this);
        this.resiezHandler = debounce(this.resiezHandler.bind(this), 150);

        this.init();
        this.bind();
    }

    mergeOptions(options) {
        const defaultOptions = {
            selector: '[data-lightbox]',
            extensions: /\.(gif|jpg|jpeg|tiff|png|bmp|svg)$/i,
            info: 'Otworzono powiększenie zdjęcia.'
        };

        return {
            ...defaultOptions,
            ...options
        };
    }

    getMaxDimensions() {
        const maxWidth = window.innerWidth - 50;
        const maxHeight = window.innerHeight - 150;
        
        return { 
            maxWidth, 
            maxHeight 
        };
    }

    createLightbox() {
        const lightbox = document.createElement('div');
        
        lightbox.classList.add('lightbox');
        lightbox.classList.add('lightbox--hidden');
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('tabindex', -1);
        lightbox.setAttribute('aria-describedby', 'lb-info');

        lightbox.innerHTML = `
            <div class="lightbox-container">
                <img src="${this.defaultSrc}" alt="" class="lightbox-img" id="lb-img">
                <p class="lightbox-info visuallyhidden" id="lb-info">${this.info} Naciśnij <kbd>ESC</kbd>, aby zamknąć okno.</p>
                <button class="lightbox-close">
                    <span class="visuallyhidden">Zamknij okno</span>
                </button>
            </div>`;
        
        return lightbox;
    }

    getElements() {
        const lightbox = document.querySelector('.lightbox');
        const lightboxContainer = lightbox.querySelector('.lightbox-container');
        const lightboxImage = lightbox.querySelector('.lightbox-img');
        
        return {
            lightbox, 
            lightboxContainer, 
            lightboxImage
        };
    }

    fetchImage(url) {
        return new Promise((resolve, reject) => {
            const image = new Image();

            image.addEventListener('load', resolve);
            image.addEventListener('error', reject);
            image.src = url;
        });
    }

    setMaxDimensions(dimensions) {
        const { maxWidth, maxHeight } = dimensions;

        this.lightboxImage.style.maxWidth = `${maxWidth}px`;
        this.lightboxImage.style.maxHeight = `${maxHeight}px`;
    }

    show(src, alt = '') {
        this.lightbox.classList.remove('lightbox--hidden');
        this.lightbox.classList.add('lightbox--loading');

        this.setMaxDimensions(this.maxDimensions);

        this.fetchImage(src).then(() => {
            this.lightbox.classList.remove('lightbox--loading');

            this.lightboxImage.src = src;
            this.lightboxImage.alt = alt;
            
            this.lightbox.focus();
        }).catch((error) => {
            this.lightbox.classList.add('lightbox--hidden');
            this.lightbox.classList.remove('lightbox--loading');
            throw new Error(error);
        });
    }

    hide() {
        this.lightbox.classList.add('lightbox--hidden');

        this.lightboxImage.src = this.defaultSrc;
        this.lightboxImage.alt = '';
        
        this.activedElement.focus();
    }

    IsVisible() {
        return !this.lightbox.classList.contains('lightbox--hidden');
    }

    clickHandler(e) {
        const { target } = e;

        if(target.classList.contains('lightbox-img') || !this.IsVisible()) {
            return false;
        }
        
        e.preventDefault();
        this.hide();
    }

    keyHandler(e) {
        const { keyCode } = e;

        if(keyCode !== this.escKeyCode || !this.IsVisible()) {
            return false;
        }

        e.preventDefault();
        this.hide();
    }

    resiezHandler(e) {
        this.maxDimensions = this.getMaxDimensions();

        this.setMaxDimensions(this.maxDimensions);
    }
    
    init() {
        const lightbox = this.createLightbox();
        
        document.body.appendChild(lightbox);

        this.lightboxElements = this.getElements();
        this.lightbox = this.lightboxElements.lightbox;
        this.lightboxContainer = this.lightboxElements.lightboxContainer;
        this.lightboxImage = this.lightboxElements.lightboxImage;
    }

    thumbnailClickHandler(e) { 
        const { currentTarget } = e;
        const { href } = currentTarget;

        if(!href || !this.extensions.test(href)) {
           return false;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        this.activedElement = currentTarget;
        
        this.show(href, currentTarget.dataset.alt);
    }

    bind() {
        if(this.thumbnails.length > 0) {
            this.thumbnails.forEach((thumbnail) => {
                thumbnail.classList.add('lb-initialized');
                thumbnail.addEventListener('click', this.thumbnailClickHandler);
            });
        }

        document.addEventListener('click', this.clickHandler);
        document.addEventListener('keydown', this.keyHandler);
        window.addEventListener('resize', this.resiezHandler);
    }

    destroy(removeElement = false) {
        if(this.lightbox !== null && removeElement) {
            this.lightbox.parentNode.removeChild(this.lightbox);
        }

        if(this.thumbnails.length > 0) {
            this.thumbnails.forEach((thumbnail) => {
                thumbnail.classList.remove('lb-initialized');
                thumbnail.removeEventListener('click', this.thumbnailClickHandler);
            });
        }

        document.removeEventListener('click', this.clickHandler);
        document.removeEventListener('keydown', this.keyHandler);
        window.removeEventListener('resize', this.resiezHandler);
    }
}

export default Lightbox;