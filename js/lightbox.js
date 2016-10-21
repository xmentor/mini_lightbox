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
                    container.style.opacity = Number(container.style.opacity || w.getComputedStyle(container)[ 'opacity' ]);
                    background.style.opacity = Number(background.style.opacity || w.getComputedStyle(background)[ 'opacity' ]);
                    (function task() {
                        container.style.opacity = Number(container.style.opacity) - .1;
                        background.style.opacity = Number(background.style.opacity) - .1;
                        if ((Number(container.style.opacity) > 0) && (Number(background.style.opacity) > 0)) {
                            (w.requestAnimationFrame && requestAnimationFrame(task)) || setTimeout(task, 16);
                        } else {
                            activeEl.focus();
                            container.remove();
                            background.remove();
                        }
                    }());
                };

            background.addEventListener('click', (e) => {
                if (e.target.className !== 'lb-container__img') {
                    fadeOut();
                }
            }, false);
            d.getElementById('lb-close').addEventListener('click', fadeOut, false);
            d.addEventListener('keyup', (e) => {
                if (e.keyCode === 27) {
                    fadeOut();
                }
            }, false);
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
                                            <span class='lb-visuallyhidden'>Otworzono powiększenie, naciśnij ESC, aby je zamknąć</span>
                                        </p>`;

            frag.appendChild(lbLoad);
            frag.appendChild(lbBackground);
            d.body.appendChild(frag);

            const lbImg = d.getElementById('lb-img'),
                lbContainer = d.getElementById('lb-container'),
                fadeIn = () => {
                    lbContainer.style.opacity = Number(lbContainer.style.opacity || w.getComputedStyle(lbContainer)[ 'opacity' ]);
                    lbImg.style.opacity = Number(lbImg.style.opacity || w.getComputedStyle(lbImg)[ 'opacity' ]);
                    (function task() {
                        lbContainer.style.opacity = Number(lbContainer.style.opacity) + .1;
                        lbImg.style.opacity = Number(lbImg.style.opacity) + .1;
                        if ((Number(lbContainer.style.opacity) < 1) && (Number(lbImg.style.opacity) < 1)) {
                            (w.requestAnimationFrame && requestAnimationFrame(task)) || setTimeout(task, 16);
                        }
                    }());
                };

            lbImg.addEventListener('load', () => {
                lbLoad.remove();
                fadeIn();
                lbContainer.focus();
            }, false);
        }
    }
    Array.from(d.querySelectorAll('[data-lightbox]')).forEach((thumbnail) => {
        thumbnail.addEventListener('click', (e) => {
            e.preventDefault();
            new Lightbox(e.target.parentNode.href);
        }, false);
    });
}(document, window));