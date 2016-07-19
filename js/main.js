(function (d, w) {
    'use strict';
    var $lightbox = function (srcImg, desc) {
        this.srcImg = srcImg;
        this.desc = desc || "";
        this.init();
        this.destroy();
    };
    $lightbox.prototype.destroy = function () {
        d.querySelector(".lb-background").addEventListener("click", function () {
            this.remove();
            d.querySelector(".lb-container").remove();
        }, false);
        d.querySelector(".lb-close").addEventListener("click", function () {
            this.parentNode.remove();
            d.querySelector(".lb-background").remove();
        }, false);
    };
    $lightbox.prototype.init = function () {
        var lb_background = d.createElement("div"),
            lb_container = d.createElement("div"),
            imgWidth = w.innerWidth - 40,
            imgHeight = w.innerHeight - 100;
        
        lb_background.classList.add("lb-background");
        lb_background.title = "Zamknij okno";
    
        lb_container.classList.add("lb-container");
        lb_container.innerHTML = `<button class='lb-close' title='Zamknij okno'>
                                        <img src='lb-img/cancel.png' alt='Close ikon' width="35" height="35">
                                        <!--<span class='lb-visuallyhidden'>Zamknij okno</span>-->
                                  </button>
                                  <img src='${this.srcImg}' alt='${this.desc}' style='max-height: ${imgHeight}px; max-width: ${imgWidth}px;' class='lb-img'>
                                  <p class='lb-title'>${this.desc}</p>`;
    
        d.body.appendChild(lb_container); d.body.insertBefore(lb_container, d.body.firstChild);
        d.body.appendChild(lb_background); d.body.insertBefore(lb_background, d.body.firstChild);
        d.querySelector(".lb-img").addEventListener("load", () => {
            lb_container.style.display = "block";
        }, false);
    };
    [...d.querySelectorAll("[data-lightbox]")].forEach((thumbClick) => {
        thumbClick.addEventListener("click", function (e) {
            e.preventDefault();
            var lb = new $lightbox(this.href, this.title);
        }, false);
    });
    
}(document, window));