$(document).ready(function () {
    let $sortableList = $('#sortable-list');
    // Variables globals per seguir l'estat del joc
    let gameWon = false;

    // Funció per generar cercles aleatoris
    function generarCercleAleatori() {
        // Crear un nou element div (cercle)
        let cercle = $('<div class="circle"></div>');

        // Generar mida aleatòria entre 20 i 100 píxels (ajusta segons les teves preferències)
        let mida = Math.floor(Math.random() * (100 - 20 + 1)) + 20;

        // Generar coordenades x i y aleatòries dins del viewport
        let x = Math.random() * (window.innerWidth - mida);
        let y = Math.random() * (window.innerHeight - mida);

        // Agafar color aleatori #eadcff o #ffecdc
        let color = generarColorAleatori();

        // Assignar les coordenades, mida, color i afegir el cercle al body
        cercle.css({
            left: x + 'px',
            top: y + 'px',
            width: mida + 'px',
            height: mida + 'px',
            background: color,
        });

        // Afegir el cercle al body
        $('body').append(cercle);
    }

    // Funció per generar un color aleatori entre dos colors
    function generarColorAleatori() {
        // Colors límit
        let color1 = '#eadcff'; // Lila clar
        let color2 = '#ffecdc'; // Groc clar

        // Escollir aleatòriament entre els dos colors
        let color = Math.random() < 0.5 ? color1 : color2;

        return color;
    }

    // Generar cercles aleatoris cada 2 segons (pots ajustar aquest interval segons les teves preferències)
    setInterval(generarCercleAleatori, 2000);

    // Funció per generar números aleatoris i guardar-los en un JSON
    function generarNumerosAleatoris() {
        let numeros = [];
        for (let i = 1; i <= 5; i++) {
            numeros.push(Math.floor(Math.random() * 100) + 1);
        }
        return numeros;
    }

    // Funció per mostrar els números aleatoris a la pàgina
    function mostrarNumerosAleatoris() {
        let numeros = generarNumerosAleatoris();
        $sortableList.empty();

        // Afegir els números a la llista
        $.each(numeros, function (index, value) {
            $sortableList.append('<li>' + value + '</li>');
        });

        // Inicialitzar els elements com a draggable només si el joc no està guanyat
        if (!gameWon) {
            $sortableList.find('li').draggable({
                revert: 'invalid',  // L'element tornarà a la seva posició original si no es deixa anar al lloc correcte
                cursor: 'grab',     // Canvia el cursor quan es fa l'arrossegament
                zIndex: 100,        // Configurar l'índex Z per assegurar que l'element arrossegat estigui per sobre
                helper: 'original',
                start: function (event, ui) {
                    $(this).addClass('grabbed');
                },
                stop: function (event, ui) {
                    $(this).removeClass('grabbed');
                }
            });
        }

         // Tots els elements de la llista són ara droppables només si el joc no està guanyat
         if (!gameWon) {
            $sortableList.find('li').droppable({
                accept: 'li',
                tolerance: 'pointer',
                over: function (event, ui) {
                    $(this).addClass('over'); // Afegir classe quan es passa sobre un element
                },
                out: function (event, ui) {
                    $(this).removeClass('over'); // Eliminar classe quan es surt de sobre un element
                },
                drop: function (event, ui) {
                    let dropped = ui.helper;
                    // Obtenir els índex de l'element arrossegat i l'element de destí
                    // let draggedIndex = dropped.index();
                    let dropIndex = $(this).index();

                    // Verificar si és l'últim element
                    if (dropIndex === $sortableList.find('li').length - 1) {
                        // Insertar després de l'últim element
                        dropped.insertAfter($sortableList.find('li').eq(dropIndex));
                    } else {
                        // Intercanviar les posicions dels elements a la llista
                        dropped.insertBefore($sortableList.find('li').eq(dropIndex));
                    }

                    // Eliminar estils afegits pel drag
                    dropped.removeAttr('style');

                    comprovarOrdre();

                    // Comprovar si l'ordre és correcte després del drop
                    if (ordenatsCorrectament()) {
                        // Destrueix les propietats draggable i droppable
                        $sortableList.find('li').draggable('destroy');
                        $sortableList.find('li').droppable('destroy');
                    }

                    $(this).removeClass('over');
                }
            })
        }

        $('#message').text(''); // Reiniciar el missatge
        $('#restartBtn').hide(); // Amagar el botó de reiniciar
    }

    // Funció per comprovar si els números estan ordenats correctament
    function comprovarOrdre() {
        let numerosOrdenats = $('#sortable-list li').map(function () {
            return parseInt($(this).text(), 10);
        }).get();

        let ordenatsCorrectament = numerosOrdenats.slice().sort(function (a, b) {
            return a - b;
        }).toString() === numerosOrdenats.toString();

        // Mostrar el missatge corresponent
        if (ordenatsCorrectament) {
            $('#message').text('Els números estan correctament ordenats!');
            $('#restartBtn').show(); // Mostrar el botó de reiniciar només si estan correctament ordenats
        } else {
            $('#message').text('');
            $('#restartBtn').hide();
        }
    }

    // Funció per comprovar si els números estan ordenats correctament
    function ordenatsCorrectament() {
        let numerosOrdenats = $('#sortable-list li').map(function () {
            return parseInt($(this).text(), 10);
        }).get();

        for (let i = 1; i < numerosOrdenats.length; i++) {
            if (numerosOrdenats[i - 1] > numerosOrdenats[i]) {
                return false;
            }
        }

        return true;
    }

    // Cridar la funció per mostrar els números quan la pàgina està carregada
    mostrarNumerosAleatoris();

    // Funció per reiniciar l'estat del joc
    function reiniciarJoc() {
        // Marcar el joc com a no guanyat
        gameWon = false;

        // Generar nous cercles aleatoris
        generarCercleAleatori();

        // Mostrar els números aleatoris a la pàgina
        mostrarNumerosAleatoris();

        // Restablir el missatge i amagar el botó de reiniciar
        $('#message').text('');
        $('#restartBtn').hide();
    }

    // Afegir un esdeveniment al botó de reiniciar
    $('#restartBtn').on('click', function () {
        reiniciarJoc();
    });
});
