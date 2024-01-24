$(document).ready(function () {
    let translations;

    // Load translations from JSON file
    $.getJSON('translations.json', function (data) {
        translations = data;

        // Get the browser's language
        let browserLanguage = navigator.language.substring(0, 2);

        // If translations for the browser language exist, use them; otherwise, fallback to 'en' (English)
        language = translations[browserLanguage] ? browserLanguage : 'en';

        // Call the function to display random numbers when the page is loaded
        displayRandomNumbers();
    }).fail(function () {
        console.error('Failed to load translations. Please check the translations.json file.');
    });

    const $sortableList = $('#sortable-list');
    let gameWon = false;

    // Function to generate a random circle
    function generateRandomCircle() {
        const circle = $('<div class="circle"></div>');
        const size = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
        const x = Math.random() * (window.innerWidth - size);
        const y = Math.random() * (window.innerHeight - size);
        const color = Math.random() < 0.5 ? '#eadcff' : '#ffecdc';

        circle.css({ left: x + 'px', top: y + 'px', width: size + 'px', height: size + 'px', background: color });
        $('body').append(circle);
    }

    // Generate random circles every 2 seconds
    setInterval(generateRandomCircle, 2000);

    // Function to generate an array of random numbers
    function generateRandomNumbers() {
        // Using Array.from to generate an array with 5 random numbers
        return Array.from({ length: 5 }, () => Math.floor(Math.random() * 100) + 1);
    }

    // Function to display random numbers on the page
    function displayRandomNumbers() {
        // Remove existing circles
        $('.circle').remove();

        const numbers = generateRandomNumbers();
        $sortableList.empty().append(numbers.map(value => `<li>${value}</li>`));

        // Make list items draggable only if the game is not won
        if (!gameWon) {
            makeListItemsDraggable();
        }

        // Update messages based on the selected language
        updateMessages();

        // Check order and display messages
        checkOrder();
    }

    // Function to make list items draggable
    function makeListItemsDraggable() {
        $sortableList.find('li').draggable({
            revert: 'invalid', cursor: 'grab', zIndex: 100, helper: 'original',
            start: function () { $(this).addClass('grabbed'); },
            stop: function () { $(this).removeClass('grabbed'); }
        }).droppable({
            accept: 'li', tolerance: 'pointer',
            over: function () { $(this).addClass('over'); },
            out: function () { $(this).removeClass('over'); },
            drop: handleDrop
        });
    }

    // Function to handle drop events
    function handleDrop(event, ui) {
        const dropped = ui.helper;
        const dropIndex = $(this).index();

        dropIndex === $sortableList.find('li').length - 1
            ? dropped.insertAfter($sortableList.find('li').eq(dropIndex))
            : dropped.insertBefore($sortableList.find('li').eq(dropIndex));

        dropped.removeAttr('style');
        checkOrder();

        if (correctlyOrdered()) {
            destroyDragAndDrop();
        }

        $(this).removeClass('over');
    }

    // Function to update messages based on language
    function updateMessages() {
        $('#message').text(translations[language].message);
        $('#restartBtn').text(translations[language].restartBtn);
        $('h1').text(translations[language].dragToSort);
        $('h2').text(translations[language].smallToLarge);
        document.title = translations[language].pageTitle;
    }

    // Function to check if the numbers are in the correct order
    function checkOrder() {
        const orderedNumbers = $sortableList.find('li').map(function () {
            return parseInt($(this).text(), 10);
        }).get();

        const correctlyOrdered = orderedNumbers.slice().sort((a, b) => a - b).toString() === orderedNumbers.toString();

        // Display the corresponding message
        if (correctlyOrdered) {
            $('#message').text(translations[language].message).show();
            $('#restartBtn').show();
        } else {
            $('#message, #restartBtn').hide();
        }
    }

    // Function to check if the numbers are correctly ordered
    function correctlyOrdered() {
        const orderedNumbers = $sortableList.find('li').map(function () {
            return parseInt($(this).text(), 10);
        }).get();

        // Check if each number is greater than or equal to the previous one
        return orderedNumbers.every((num, i, arr) => i === 0 || num >= arr[i - 1]);
    }

    // Function to destroy draggable and droppable properties
    function destroyDragAndDrop() {
        $sortableList.find('li').draggable('destroy');
        $sortableList.find('li').droppable('destroy');
    }

    // Event handler to reset the game state
    $('#restartBtn').on('click', function () {
        gameWon = false;
        generateRandomCircle();
        displayRandomNumbers();
        $('#message, #restartBtn').hide();
    });

});
