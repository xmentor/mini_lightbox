# Mini Lightbox

[Wersja demonstracyjna](https://xmentor.github.io/mini_lightbox/example)

## Użycie

* Pobierz [pliki](https://github.com/xmentor/mini_lightbox/archive/master.zip)

* Foldery wraz z plikami, które znajdują się w `dest` przenieś do swojego katalogu.

* Style zalinkuj w sekcji head:

    ```html
    <head>
        <!-- Metadane -->
        <link rel="stylesheet" href="css/lightbox.css">
        <!-- Twoje style -->
    </head>
    ```
    
* Skrypt podepnij tuż przed zamknięciem znacznika `body`:

    ```html
    <body>
        <!-- Znaczniki -->
        <!-- Inne skrypty -->
        <script src="js/lightbox.min.js"></script>
    </body>
    ```

* Owrapuj zdjęcie w link, który będzie posiadał atrybut `data-lightbox`(może być nawet pusty) oraz `href` z odnośnikiem do zdjęcia w orginalnym/większym rozmiarze:
    
    ```html
    <a href="img/big-picture-adam.jpg" data-lightbox="">
        <img src="img/small-picture-adam.jpg" alt="Adam">
    </a>
    ```
    
* Tekst alternatywny zdjęcia wyświetlanego w większym rozmiarze można(powinno się) zmienić przez dodanie atrybutu `data-alt` do znacznika `a`.

## Licencja

[Licencja MIT](https://github.com/xmentor/mini_lightbox/blob/master/LICENSE)
