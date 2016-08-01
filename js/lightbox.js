(function (d, w) {
    "use strict";
    var Lightbox = function (srcImg, altImg) {
        this.srcImg = srcImg;
        this.altImg = altImg || "";
        this.init();
        this.destroy();
    };
    Lightbox.prototype = {
        destroy () {
            var container = d.getElementById("lb-container"),
                background = d.getElementById("lb-background");
            /*    
            var fadeOut = () => {
                container.classList.add("lb-fadeOut");
                background.classList.add("lb-fadeOut");
                setTimeout(() => {       
                    container.remove();
                    background.remove();
                }, 500);
            }
            */
            var fadeOut = () => {
                container.style.opacity = +(container.style.opacity || w.getComputedStyle(container).getPropertyValue("opacity"));
                background.style.opacity = +(background.style.opacity || w.getComputedStyle(background).getPropertyValue("opacity"));
                (function task() {
                    container.style.opacity = +container.style.opacity - 1 / 20;
                    background.style.opacity = +background.style.opacity - 1 / 20;
                    if ((+container.style.opacity > 0) && (+background.style.opacity > 0)) {
                        (w.requestAnimationFrame && requestAnimationFrame(task)) || setTimeout(task, 1000 / 60);
                    } else {
                        container.remove();
                        background.remove();
                    }
                }());
            };
            
            background.addEventListener("click", fadeOut, false);
            d.getElementById("lb-close").addEventListener("click", fadeOut, false);  
        },
        init () {
            var lb_background = d.createElement("div"),
                lb_container = d.createElement("div"),
                lb_load = d.createElement("div"),
                maximgWidth = w.innerWidth - 50,
                maximgHeight = w.innerHeight - 100;

            lb_load.classList.add("lb-load");

            lb_background.classList.add("lb-background");
            lb_background.id = "lb-background";
            lb_background.title = "Zamknij okno";

            lb_container.classList.add("lb-container");
            lb_container.id = "lb-container";
            lb_container.innerHTML = `<button id="lb-close" class="lb-close" title="Zamknij okno">
                                            <span class="lb-visuallyhidden">Zamknij okno</span>
                                      </button>
                                      <img src="${this.srcImg}" alt="${this.altImg}" style="max-height: ${maximgHeight}px; max-width: ${maximgWidth}px;" class="lb-img" id="lb-img">
                                      <p class="lb-title">${this.altImg}</p>`;

            d.body.appendChild(lb_load);
            d.body.appendChild(lb_container);
            d.body.appendChild(lb_background);
                
            var lb_img = d.getElementById("lb-img");
            var fadeIn = () => {
                lb_container.style.opacity = +(lb_container.style.opacity || w.getComputedStyle(lb_container).getPropertyValue("opacity"));
                lb_img.style.opacity = +(lb_img.style.opacity || w.getComputedStyle(lb_img).getPropertyValue("opacity"));
                (function task () {
                    lb_container.style.opacity = +lb_container.style.opacity + 1/20;
                    lb_img.style.opacity = +lb_img.style.opacity + 1/20;
                    if((+lb_container.style.opacity < 1) && (+lb_img.style.opacity < 1)) {
                        (w.requestAnimationFrame && requestAnimationFrame(task)) || setTimeout(task, 1000/60);
                    }
                }());
            }
            
            lb_img.addEventListener("load", function () {
                lb_load.remove();
                fadeIn();          
            }, false);  
        }
    };
    Array.prototype.forEach.call(d.querySelectorAll("[data-lightbox]"), (thumbnail) => {
        thumbnail.addEventListener("click", function (e) {
            e.preventDefault();
            var lb = new Lightbox(this.href, this.title);
        }, false);
    });
})(document, window);