(function(d) {
    'use strict';
    class Lightbox {
        constructor(srcImg) {
            this.srcImg = srcImg;
            this.init();
        }
        destroy(beforeActive) {
            var background = d.getElementById('lb-background'),
                fadeOut = () => {
                    background.style.opacity = Number(background.style.opacity || 
                                                      window.getComputedStyle(background)['opacity']);
                    const task = () => {
                        background.style.opacity = Number(background.style.opacity) - .1;
                        if (Number(background.style.opacity) > 0) {
                            (window.requestAnimationFrame && requestAnimationFrame(task)) || setTimeout(task, 16);
                        } else {
                            background.parentNode.removeChild(background);
                            d.removeEventListener('click', clickHandler);
                            d.removeEventListener('keydown', keyHandler);
                            beforeActive.focus();
                        }
                    };
                    task();
                },
                keyHandler = (e) => {
                    if ((e.keyCode === 27) || (e.keyCode === 9)) {
                        fadeOut();
                    }
                    return false;
                },
                clickHandler = (e) => {
                    if (!e.target.classList.contains('lb-container__img')) {
                        fadeOut();
                    }
                    return false;
                };
            d.addEventListener('click', clickHandler);
            d.addEventListener('keydown', keyHandler);
        }
        init() {
            const lbBackground = d.createElement('div'),
                lbLoad = d.createElement('div'),
                maxImgWidth = window.innerWidth - 50,
                maxImgHeight = window.innerHeight - 100,
                frag = d.createDocumentFragment(),
                activeElement = d.activeElement;

            lbLoad.classList.add('lb-load');

            lbBackground.classList.add('lb-background');
            lbBackground.id = 'lb-background';
            lbBackground.innerHTML = `<div id='lb-container' class='lb-container' role='dialog' aria-describedby='lb-info' tabindex='-1'>
                                            <button id='lb-close' class='lb-container__close' aria-label='Zamknij okno'>
                                                <span aria-hidden='true'>&times;</span>
                                            </button>
                                            <img src='${this.srcImg}' alt='screenshot' style='max-height: ${maxImgHeight}px; max-width: ${maxImgWidth}px;' class='lb-container__img' id='lb-img'>
                                            <p class='lb-background__info' id='lb-info'>
                                                <span class='lb-visuallyhidden'>Naciśnij ESC, aby zamknać powiększenie</span>
                                            </p>
                                        </div>`;

            frag.appendChild(lbLoad);
            frag.appendChild(lbBackground);
            d.body.appendChild(frag);

            const lbImg = d.getElementById('lb-img'),
                lbContainer = d.getElementById('lb-container'),
                fadeIn = () => {
                    lbLoad.parentNode.removeChild(lbLoad);
                    lbContainer.style.opacity = Number(lbContainer.style.opacity || 
                                                       window.getComputedStyle(lbContainer)['opacity']);
                    lbImg.style.opacity = Number(lbImg.style.opacity || window.getComputedStyle(lbImg)['opacity']);
                    const task = () => {
                        lbContainer.style.opacity = Number(lbContainer.style.opacity) + .1;
                        lbImg.style.opacity = Number(lbImg.style.opacity) + .1;
                        if ((Number(lbContainer.style.opacity) < 1) && (Number(lbImg.style.opacity) < 1)) {
                            (window.requestAnimationFrame && requestAnimationFrame(task)) || setTimeout(task, 16);
                        } else {
                            lbContainer.focus();
                            this.destroy(activeElement);
                        }
                    };
                    task();
                };

            lbImg.addEventListener('load', fadeIn);
        }
    }
    for(let thumbnails = d.querySelectorAll('[data-lightbox]'), i = 0, len = thumbnails.length; i < len; ++i) {
        thumbnails[i].addEventListener('click', function(e) {
            if (!this.href) {
                return false;
            }
            e.preventDefault();
            new Lightbox(this.href);
        });
    }
}(document));