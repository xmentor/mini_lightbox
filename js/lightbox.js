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

            function fadeOut() {
                container.classList.add("lb-fadeOut");
                background.classList.add("lb-fadeOut");
                setTimeout(() => {       
                    container.remove();
                    background.remove();
                }, 500);
            }
            
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

            d.getElementById("lb-img").addEventListener("load", function () {
                lb_load.remove();
                lb_container.classList.add("lb-fadeIn");
                this.classList.add("lb-fadeIn");             
            }, false);  
        }
    };
    [...d.querySelectorAll("[data-lightbox]")].forEach((thumbnail) =>  {
        thumbnail.addEventListener("click", function (e) {
            e.preventDefault();
            var lb = new Lightbox(this.href, this.title);
        }, false);
    });
})(document, window);