(function (d, w) {
    "use strict";
    
    class Lightbox {
        constructor (srcImg) {
            this.srcImg = srcImg;
            this.init();
            this.destroy();
        }
        destroy() {
            var container = d.getElementById("lb-container"),
                background = d.getElementById("lb-background"),
                activeEl = d.activeElement,
                fadeOut = () => {
                container.style.opacity = +(container.style.opacity || w.getComputedStyle(container)["opacity"]);
                background.style.opacity = +(background.style.opacity || w.getComputedStyle(background)["opacity"]);
                (function task() {
                    container.style.opacity = +container.style.opacity - .1;
                    background.style.opacity = +background.style.opacity - .1;
                    if ((+container.style.opacity > 0) && (+background.style.opacity > 0)) {
                        (w.requestAnimationFrame && requestAnimationFrame(task)) || setTimeout(task, 16);
                    } else {
                        activeEl.focus();
                        container.remove();
                        background.remove();
                    }
                }());
            };

            background.addEventListener("click", function (e) {
                if (e.target.className === "lb-container__img") {
                    return;
                }
                fadeOut();
            }, false);
            d.getElementById("lb-close").addEventListener("click", fadeOut, false);
            d.addEventListener("keyup", function(e) {
                if (e.keyCode === 27) {
                    fadeOut();
                }
            }, false);
        }
        init() {
            var lb_background = d.createElement("div"),
                lb_load = d.createElement("div"),
                maxImgWidth = w.innerWidth - 50,
                maxImgHeight = w.innerHeight - 100,
                frag = d.createDocumentFragment();

            lb_load.classList.add("lb-load");

            lb_background.classList.add("lb-background");
            lb_background.id = "lb-background";
            lb_background.innerHTML = `<div id="lb-container" class="lb-container" role="dialog" aria-describedby="lb-info" tabindex="-1">
                                            <button id="lb-close" class="lb-container__close" title="Zamknij okno">
                                                <span class="lb-visuallyhidden">Zamknij okno</span>
                                            </button>
                                            <img src="${this.srcImg}" alt="screenshot" style="max-height: ${maxImgHeight}px; max-width: ${maxImgWidth}px;" class="lb-container__img" id="lb-img">
                                        </div>
                                        <p class='lb-background__info' id="lb-info">
                                            <span class="lb-visuallyhidden">Otworzono powiększenie, naciśnij ESC, aby je zamknąć</span>
                                        </p>`;

            frag.appendChild(lb_load);
            frag.appendChild(lb_background);
            d.body.appendChild(frag);
            
            var lb_img = d.getElementById("lb-img"),
                lb_container = d.getElementById("lb-container"),
                fadeIn = () => {
                    lb_container.style.opacity = +(lb_container.style.opacity || w.getComputedStyle(lb_container)["opacity"]);
                    lb_img.style.opacity = +(lb_img.style.opacity || w.getComputedStyle(lb_img)["opacity"]);
                    (function task() {
                        lb_container.style.opacity = +lb_container.style.opacity + .1;
                        lb_img.style.opacity = +lb_img.style.opacity + .1;
                        if ((+lb_container.style.opacity < 1) && (+lb_img.style.opacity < 1)) {
                            (w.requestAnimationFrame && requestAnimationFrame(task)) || setTimeout(task, 16);
                        }
                    }());
                }
            
            lb_img.addEventListener("load", function() {
                lb_load.remove();
                fadeIn();
                lb_container.focus();
            }, false);
        }
    };
    Array.prototype.forEach.call(d.querySelectorAll("[data-lightbox]"), (thumbnail) => {
        thumbnail.addEventListener("click", function(e) {
            e.preventDefault();
            var lb = new Lightbox(this.href);
        }, false);
    });
})(document, window);