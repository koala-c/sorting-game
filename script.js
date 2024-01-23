$(document).ready(function () {
    let language = 'en'; // Default language
    let translations;

    // Load translations from JSON file
    $.ajax({
        url: 'translations.json',
        async: false,
        dataType: 'json',
        success: function (data) {
            translations = data;
        }
    });

    let $sortableList = $('#sortable-list');
    let gameWon = false;

    // Function to generate a random circle
    function generateRandomCircle() {
        let circle = $('<div class="circle"></div>');
        let size = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
        let x = Math.random() * (window.innerWidth - size);
        let y = Math.random() * (window.innerHeight - size);
        let color = Math.random() < 0.5 ? '#eadcff' : '#ffecdc';

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
        let numbers = generateRandomNumbers();
        $sortableList.empty().append(numbers.map(value => `<li>${value}</li>`));

        // Make list items draggable only if the game is not won
        if (!gameWon) {
            $sortableList.find('li').draggable({
                revert: 'invalid', cursor: 'grab', zIndex: 100, helper: 'original',
                start: function () { $(this).addClass('grabbed'); },
                stop: function () { $(this).removeClass('grabbed'); }
            }).droppable({
                accept: 'li', tolerance: 'pointer',
                over: function () { $(this).addClass('over'); },
                out: function () { $(this).removeClass('over'); },
                drop: function (event, ui) {
                    let dropped = ui.helper, dropIndex = $(this).index();
                    dropIndex === $sortableList.find('li').length - 1
                        ? dropped.insertAfter($sortableList.find('li').eq(dropIndex))
                        : dropped.insertBefore($sortableList.find('li').eq(dropIndex));
                    dropped.removeAttr('style');
                    checkOrder();
                    correctlyOrdered() && $sortableList.find('li').draggable('destroy').droppable('destroy');
                    $(this).removeClass('over');
                }
            });
        }

        // Get the browser's language
        let browserLanguage = navigator.language.substring(0, 2);

        // If translations for the browser language exist, use them; otherwise, fallback to 'en' (English)
        language = translations[browserLanguage] ? browserLanguage : 'en';

        // Update messages based on the selected language
        $('#message').text(translations[language].message);
        $('#restartBtn').text(translations[language].restartBtn);
        $('h1').text(translations[language].dragToSort);
        $('h2').text(translations[language].smallToLarge);
        document.title = translations[language].pageTitle;
    }

    // Function to check if the numbers are in the correct order
    function checkOrder() {
        let orderedNumbers = $sortableList.find('li').map(function () {
            return parseInt($(this).text(), 10);
        }).get();

        let correctlyOrdered = orderedNumbers.slice().sort((a, b) => a - b).toString() === orderedNumbers.toString();

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
        let orderedNumbers = $sortableList.find('li').map(function () {
            return parseInt($(this).text(), 10);
        }).get();

        // Check if each number is greater than or equal to the previous one
        return orderedNumbers.every((num, i, arr) => i === 0 || num >= arr[i - 1]);
    }

    // Call the function to display random numbers when the page is loaded
    displayRandomNumbers();

    // Event handler to reset the game state
    $('#restartBtn').on('click', function () {
        gameWon = false;
        generateRandomCircle();
        displayRandomNumbers();
        $('#message, #restartBtn').hide();
    });
});
