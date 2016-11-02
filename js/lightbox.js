(function(d, w) {
    'use strict';
    class Lightbox {
        constructor(srcImg) {
            this.srcImg = srcImg;
            this.init();
            this.destroy();
        }
        destroy() {
            const container = d.getElementById('lb-container'),
                background = d.getElementById('lb-background'),
                activeEl = d.activeElement,
                fadeOut = () => {
                    background.style.opacity = Number(background.style.opacity || w.getComputedStyle(background)[ 'opacity' ]);
                    (function task() {
                        background.style.opacity = Number(background.style.opacity) - .1;
                        if (Number(background.style.opacity) > 0) {
                            (w.requestAnimationFrame && requestAnimationFrame(task)) || setTimeout(task, 16);
                        } else {
                            background.parentNode.removeChild(background);
                            d.removeEventListener('click', clickHandler);
                            d.removeEventListener('keydown', keyHandler);
                            activeEl.focus();
                        }
                    }());
                },
                keyHandler = (e) => {
                    if (e.keyCode === 27) {
                        fadeOut();
                    }
                    return false;
                },
                clickHandler = (e) => {
                    if (e.target.classList.contains("lb-background") || e.target.classList.contains("lb-container__close")) {
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
                maxImgWidth = w.innerWidth - 50,
                maxImgHeight = w.innerHeight - 100,
                frag = d.createDocumentFragment();

            lbLoad.classList.add('lb-load');

            lbBackground.classList.add('lb-background');
            lbBackground.id = 'lb-background';
            lbBackground.innerHTML = `<div id='lb-container' class='lb-container' role='dialog' aria-describedby='lb-info' tabindex='-1'>
                                            <button id='lb-close' class='lb-container__close' title='Zamknij okno'>
                                                <span class='lb-visuallyhidden'>Zamknij okno</span>
                                            </button>
                                            <img src='${this.srcImg}' alt='screenshot' style='max-height: ${maxImgHeight}px; max-width: ${maxImgWidth}px;' class='lb-container__img' id='lb-img'>
                                        </div>
                                        <p class='lb-background__info' id='lb-info'>
                                            <span class='lb-visuallyhidden'>Naciśnij ESC, aby zamknać powiększenie</span>
                                        </p>`;

            frag.appendChild(lbLoad);
            frag.appendChild(lbBackground);
            d.body.appendChild(frag);

            const lbImg = d.getElementById('lb-img'),
                lbContainer = d.getElementById('lb-container'),
                fadeIn = () => {
                    lbLoad.parentNode.removeChild(lbLoad);
                    lbContainer.style.opacity = Number(lbContainer.style.opacity || w.getComputedStyle(lbContainer)[ 'opacity' ]);
                    lbImg.style.opacity = Number(lbImg.style.opacity || w.getComputedStyle(lbImg)[ 'opacity' ]);
                    (function task() {
                        lbContainer.style.opacity = Number(lbContainer.style.opacity) + .1;
                        lbImg.style.opacity = Number(lbImg.style.opacity) + .1;
                        if ((Number(lbContainer.style.opacity) < 1) && (Number(lbImg.style.opacity) < 1)) {
                            (w.requestAnimationFrame && requestAnimationFrame(task)) || setTimeout(task, 16);
                        } else {
                            lbContainer.focus();
                        }
                    }());
                };

            lbImg.addEventListener('load', fadeIn);
        }
    }
    for (let thumbnails = d.querySelectorAll('[data-lightbox]'), i = 0, len = thumbnails.length; i < len; ++i){
        thumbnails[i].addEventListener('click', function(e) {;
            if (!this.href) {
                return false;
            }
            e.preventDefault();
            new Lightbox(this.href); 
        });
    }
}(document, window));