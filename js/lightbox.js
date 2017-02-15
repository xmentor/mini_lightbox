(function(d) {
    'use strict';
    function fadeIn(element, animationStart = () => {}, animationEnd = () => {}) {
        return () => {
            animationStart();
            element.style.opacity = Number(element.style.opacity || window.getComputedStyle(element)['opacity']);
            const taskAnimation = () => {
                element.style.opacity = Number(element.style.opacity) + .1;
                if(Number(element.style.opacity) < 1) {
                    (window.requestAnimationFrame && requestAnimationFrame(taskAnimation)) || setTimeout(taskAnimation, 16);
                } else {
                    animationEnd();
                }
            };
            taskAnimation();
        }
    }
    function fadeOut(element, animationStart = () => {}, animationEnd = () => {}) {
        return () => {
            animationStart();
            element.style.opacity = Number(element.style.opacity || window.getComputedStyle(element)['opacity']);
            const taskAnimation = () => {
                element.style.opacity = Number(element.style.opacity) - .1;
                if(Number(element.style.opacity) > 0) {
                    (window.requestAnimationFrame && requestAnimationFrame(taskAnimation)) || setTimeout(taskAnimation, 16);
                } else {
                    animationEnd();
                }
            };
            taskAnimation();
        }
    }
    class Lightbox {
        constructor(srcImg, alt = "Screenshot") {
            this.init(srcImg, alt);
            this.activeElement = d.activeElement;
            this.keyHandler = this.keyHandler.bind(this);
            this.clickHandler = this.clickHandler.bind(this);
        }
        init(src, alt) {
            const maxImgDimensions = this.getWindowDimensions();
            
            this.createLightBox(src, alt, maxImgDimensions[0], maxImgDimensions[1]);
        }
        removeEvents() {
            d.removeEventListener('click', this.clickHandler);
            d.removeEventListener('keydown', this.keyHandler);
        }
        removeLightBox(element) {
            element.parentNode.removeChild(element);
            this.removeEvents();
        }
        hideLightBox() {
            const lightBox = d.getElementById('lb-background')
            ,fadeOutLightBox = fadeOut(lightBox, () => {
                this.activeElement.focus();
            }, () => {
                this.removeLightBox(lightBox);
            });
            
            fadeOutLightBox();
        }
        keyHandler(e) {
            const tabKeyCode = 9
            ,escKeyCode = 27;
            if(e.keyCode !== escKeyCode && e.keyCode !== tabKeyCode) {
                return false;
            }
            e.preventDefault();
            this.hideLightBox();
        }
        clickHandler(e) {
            if(e.target.classList.contains('lb-container__img')) {
                return false;
            }
            this.hideLightBox();
        }
        createLightBox(src, alt, width, height) {
            const lightBox = d.createElement('div');
            
            lightBox.classList.add('lb-background');
            lightBox.id = 'lb-background';
            
            lightBox.innerHTML = `<div id='lb-container' class='lb-container' role='dialog' aria-describedby='lb-img' tabindex='-1'>
                                            <div id='lb-load' class='lb-load'></div>
                                            <button id='lb-close' class='lb-container__close' aria-label='Zamknij okno'>
                                                <span aria-hidden='true'>&times;</span>
                                                <span class='lb-visuallyhidden'>Zamknij okno</span>
                                            </button>
                                            <img src='${src}' alt='${alt}' style='max-width: ${width}px; max-height: ${height}px;' class='lb-container__img' id='lb-img'>
                                            <p class='lb-background__info'>
                                                <span class='lb-visuallyhidden'>Naciśnij ESC, aby zamknąć powiększenie</span>
                                            </p>
                                        </div>`;
            
            this.appendToBody(lightBox);
        }
        removeElementLoadingImg() {
            const elementLoadingImg = d.getElementById('lb-load');
            elementLoadingImg.parentNode.removeChild(elementLoadingImg);
        }
        showImage(elementImage) {
            const fadeInImage = fadeIn(elementImage);
            fadeInImage();
        }
        addEvents() {
            d.addEventListener('click', this.clickHandler);
            d.addEventListener('keydown', this.keyHandler);
        }
        showLightBox() {
            const lightBox = d.getElementById('lb-background')
            ,containerLightBox = d.getElementById('lb-container')
            ,imageLightBox = d.getElementById('lb-img')
            ,fadeInLightBox = fadeIn(lightBox, () => {
                containerLightBox.focus();
            }, () => {
                this.removeElementLoadingImg();
                this.showImage(imageLightBox);
                this.addEvents();
            });
            imageLightBox.addEventListener('load', fadeInLightBox);
        }
        appendToBody(el) {
            d.body.appendChild(el);
            this.showLightBox();
        }
        getWindowDimensions() {
            const maxImgWidth = window.innerWidth - 50
            ,maxImgHeight = window.innerHeight - 100;
            
            return [maxImgWidth, maxImgHeight];
        }
    }
    d.addEventListener('DOMContentLoaded', () => {
        for(let thumbnails = d.querySelectorAll('[data-lightbox]'), i = 0, len = thumbnails.length; i < len; ++i) {
            thumbnails[i].addEventListener('click', function(e) {
                const href = this.href;
                if (!href || !/\.(gif|jpg|jpeg|tiff|png|bmp)$/i.test(href)) {
                    return false;
                }
                new Lightbox(href, this.dataset.alt);
                e.preventDefault();
            });
        }    
    });
}(document));