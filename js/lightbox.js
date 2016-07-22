(function (d, w) {
    "use strict";
    var $lightbox = function $lightbox(srcImg, desc) {
        this.srcImg = srcImg;
        this.desc = desc || "";
        this.init();
        this.destroy();
    };
    $lightbox.prototype.destroy = function () {
        var container = d.getElementById("lb-container"),
            background = d.getElementById("lb-background"),
            opacity_bg = +(background.style.opacity || w.getComputedStyle(background).getPropertyValue("opacity")),
            opacity_ct = +(container.style.opacity || w.getComputedStyle(container).getPropertyValue("opacity"));

        background.addEventListener("click", function () {
            container.classList.add("lb-fadeOut");
            this.classList.add("lb-fadeOut");
            setTimeout(() => {
                if ((opacity_bg && opacity_ct) === 0) {
                    this.remove();
                    container.remove();
                }
            }, 500);
        }, false);

        d.getElementById("lb-close").addEventListener("click", function () {
            container.classList.add("lb-fadeOut");
            background.classList.add("lb-fadeOut");
            setTimeout(() => {
                if ((opacity_bg && opacity_ct) === 0) {
                    this.parentNode.remove();
                    background.remove();
                }
            }, 500);
        }, false);
    };
    $lightbox.prototype.init = function () {
        var lb_background = d.createElement("div"),
            lb_container = d.createElement("div"),
            lb_load = d.createElement("div"),
            imgWidth = w.innerWidth - 40,
            imgHeight = w.innerHeight - 100;

        lb_load.classList.add("lb-load");

        lb_background.classList.add("lb-background");
        lb_background.id = "lb-background";
        lb_background.title = "Zamknij okno";

        lb_container.classList.add("lb-container");
        lb_container.id = "lb-container";
        lb_container.innerHTML = `<button id="lb-close" class="lb-close" title="Zamknij okno">
                                        <span class="lb-visuallyhidden">Zamknij okno</span>
                                  </button>
                                  <img src="${this.srcImg}" alt="${this.desc}" style="max-height: ${imgHeight}px; max-width: ${imgWidth}px;" class="lb-img" id="lb-img">
                                  <p class="lb-title">${this.desc}</p>`;

        d.body.appendChild(lb_load);
        d.body.appendChild(lb_container);
        d.body.appendChild(lb_background);

        d.getElementById("lb-img").addEventListener("load", function () {
            lb_load.remove();
            this.classList.add("lb-fadeIn");
            lb_container.classList.add("lb-fadeIn");
        }, false);
    };
    [...d.querySelectorAll("[data-lightbox]")].forEach((thumbClick) =>  {
        thumbClick.addEventListener("click", function (e) {
            e.preventDefault();
            var lb = new $lightbox(this.href, this.title);
        }, false);
    });
})(document, window);