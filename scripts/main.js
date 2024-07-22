document.addEventListener("DOMContentLoaded", function() {
    // Function to update the bar width based on the text value
    function updateBarWidth(textId, barId) {
        const textElement = document.getElementById(textId);
        const barElement = document.getElementById(barId);
        
        const text = textElement.innerText;
        const [currentValue, maxValue] = text.split('/').map(Number);
        const percentage = (currentValue / maxValue) * 100;
        
        barElement.style.width = `${percentage}%`;
    }

    // Function to update the health text and bar
    function updateHealth(change) {
        const healthText = document.getElementById('health-text');
        let [currentValue, maxValue] = healthText.innerText.split('/').map(Number);
        currentValue = Math.max(0, Math.min(maxValue, currentValue + change));
        healthText.innerText = `${currentValue}/${maxValue}`;
        updateBarWidth("health-text", "health-bar");
    }

        // Function to update the mana text and bar
        function updateMana(change) {
            const manaText = document.getElementById('mana-text');
            let [currentValue, maxValue] = manaText.innerText.split('/').map(Number);
            currentValue = Math.max(0, Math.min(maxValue, currentValue + change));
            manaText.innerText = `${currentValue}/${maxValue}`;
            updateBarWidth("mana-text", "mana-bar");
        }

    // Update the health and mana bars initially
    updateBarWidth("health-text", "health-bar");
    updateBarWidth("mana-text", "mana-bar");

    // Dropdown menu functionality
    const menuIcon = document.getElementById('menu-icon');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const linksItem = document.getElementById('links-item');
    const supportItem = document.getElementById('support-item');
    const socialLinks = document.querySelectorAll('.social-link');

    // Function to reset the menu to its default state
    function resetMenu() {
        linksItem.style.display = 'block';
        supportItem.style.display = 'block';
        socialLinks.forEach(link => link.style.display = 'none');
    }

    // Toggle the dropdown menu when the menu icon is clicked
    menuIcon.addEventListener('click', () => {
        const isMenuVisible = dropdownMenu.style.display === 'block';
        dropdownMenu.style.display = isMenuVisible ? 'none' : 'block';
        if (isMenuVisible) {
            resetMenu(); // Reset menu items when closing
        }
    });

    // Show social media links and hide Links and Support when Links is clicked
    linksItem.addEventListener('click', (e) => {
        e.preventDefault();
        linksItem.style.display = 'none';
        supportItem.style.display = 'none';
        socialLinks.forEach(link => link.style.display = 'block');
    });

    // Open the link, close the menu, and reset it
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            window.open(href, '_blank'); // Open the link in a new tab
            dropdownMenu.style.display = 'none'; // Close the menu
            resetMenu(); // Reset the menu to its default state
        });
    });

    // Close the dropdown menu and reset it when clicking outside
    window.addEventListener('click', function(event) {
        if (!menuIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = 'none';
            resetMenu(); // Reset menu items when closing
        }
    });

    // Popup box functionality
    const popupOverlay = document.getElementById('popup-overlay');
    const closeBtn = document.getElementById('close-btn');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.popup-text');

    // Show popup on page load
    popupOverlay.style.display = 'flex';

    // Close popup
    function closePopup() {
        popupOverlay.style.display = 'none';
    }

    closeBtn.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', function(event) {
        if (event.target === popupOverlay) {
            closePopup();
        }
    });

    // Tab functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to the clicked button and corresponding content
            this.classList.add('active');
            const contentId = this.id.replace('-tab', '-text');
            document.getElementById(contentId).classList.add('active');
        });
    });

    // Scenario functionality
    const introContainer = document.getElementById('intro-container');
    const scenarioContainer = document.getElementById('scenario-container');
    const scenarioText = document.getElementById('scenario-text');
    const scenarioImage = document.getElementById('scenario-image');
    const startButton = document.getElementById('start-button');
    const withdrawButton = document.getElementById('withdraw-button');
    const proceedButton = document.getElementById('proceed-button');
    const restartButton = document.getElementById('restart-button');

    const scenarios = {
        plain: { text: 'There is nothing here.', image: 'images/plain.jpg', healthChange: 0 },
        ant: { text: 'A Wild Ant appeared!', image: 'images/ant.jpg', healthChange: -15 },
        mushroom: { text: 'You found a Wild Mushroom!', image: 'images/mushroom.jpg', healthChange: +10 },
        forest: { text: 'You have reached forest area!', image: 'images/forest.jpg', healthChange: 0 },
        clover: { text: 'This looks like a clover field.', image: 'images/clover.jpg', healthChange: 0 },
        clover2: { text: 'You\'ve reached deeper into the clover fields. It\'s becoming denser and difficult to travel further.', image: 'images/clover2.jpg', healthChange: 0, end: true } // Adding 'end' flag
    };

    let currentScenario = 'plain';

    function showScenario(scenario) {
        // Clear the current typewriter interval if it exists
        if (currentTypewriterInterval) {
            clearTimeout(currentTypewriterInterval);
            currentTypewriterInterval = null;
        }
        
        scenarioImage.src = scenario.image;
        currentTypewriterInterval = typeWriter(scenario.text, scenarioText, 22); // Speed set to 22ms per character for fast effect
        
        if (!collectedCards.includes(scenario.image)) {
            collectedCards.push(scenario.image);
            updateCollectionPage(getCardIndexByImage(scenario.image));
            updateHealth(scenario.healthChange);
        }
        
        introContainer.style.display = 'none';
        scenarioContainer.style.display = 'block';
    
        // Check if the scenario has ended
        if (scenario.end) {
            withdrawButton.style.display = 'none';
            proceedButton.style.display = 'none';
            restartButton.style.display = 'block';
        } else {
            withdrawButton.style.display = 'block';
            proceedButton.style.display = 'block';
            restartButton.style.display = 'none';
        }
    }
    

    startButton.addEventListener('click', function() {
        currentScenario = 'plain';
        showScenario(scenarios.plain);
    });

    withdrawButton.addEventListener('click', function() {
        if (currentScenario === 'plain' || currentScenario === 'mushroom') {
            currentScenario = 'ant';
            showScenario(scenarios.ant);
        } else if (currentScenario === 'ant' || currentScenario === 'clover') {
            currentScenario = 'forest';
            showScenario(scenarios.forest);
        }
    });

    proceedButton.addEventListener('click', function() {
        if (currentScenario === 'plain') {
            currentScenario = 'mushroom';
            showScenario(scenarios.mushroom);
        } else if (currentScenario === 'mushroom' || currentScenario === 'ant') {
            currentScenario = 'clover';
            showScenario(scenarios.clover);
        } else if (currentScenario === 'clover') {
            currentScenario = 'clover2';
            showScenario(scenarios.clover2);
        }
    });

    // Add restart button functionality
    restartButton.addEventListener('click', function() {
        // Reset health and mana
        document.getElementById('health-text').innerText = '50/50';
        document.getElementById('mana-text').innerText = '10/10';
        updateBarWidth("health-text", "health-bar");
        updateBarWidth("mana-text", "mana-bar");

        // Hide scenario container and show intro container
        scenarioContainer.style.display = 'none';
        introContainer.style.display = 'flex';
    });


    const collectionPage = document.getElementById('collection-page');
const cardGrid = document.getElementById('card-grid');
const cardSlots = [];
const totalSlots = 15; // Adjust this value based on the number of slots you need

// Collection of card descriptions and meta descriptions
const collectionDescription = [
    {
        image: 'images/plain.jpg',
        cardDescriptionText: 'This vast plain has nothing but small grass.',
        metaDescriptionText: 'Location: Plain<br>Level: 1<br>Monsters: PomPom and Daisy'
    },
    {
        image: 'images/forest.jpg',
        cardDescriptionText: 'The dense forest is full of ancient trees and hidden dangers.',
        metaDescriptionText: 'Location: Forest, Level: 2, Monsters: Goblin and Sprite'
    },
    {
        image: 'images/ant.jpg',
        cardDescriptionText: 'You happened to find an ant while exploring. It\'s weak yet can damage 15 health.',
        metaDescriptionText: 'Encounter: Ant, Effect: -15 Health'
    },
    {
        image: 'images/breeze.jpg',
        cardDescriptionText: 'A nice breeze. You need to take a moment to enjoy it. Part of the loading.',
        metaDescriptionText: 'Moment: Breeze, Effect: None'
    },
    {
        image: 'images/clover.jpg',
        cardDescriptionText: 'You come across a clover area. It\'s not too lush.',
        metaDescriptionText: 'Location: Clover Area, Effect: None'
    },
    {
        image: 'images/clover2.jpg',
        cardDescriptionText: 'This is a denser clover area.',
        metaDescriptionText: 'Location: Dense Clover Area, Effect: None'
    },
    {
        image: 'images/rest.jpg',
        cardDescriptionText: 'Taking a break is important. Part of the loading.',
        metaDescriptionText: 'Moment: Rest, Effect: None'
    },
    {
        image: 'images/view.jpg',
        cardDescriptionText: 'You take a moment to look around. Part of the loading.',
        metaDescriptionText: 'Moment: View, Effect: None'
    },
    {
        image: 'images/mushroom.jpg',
        cardDescriptionText: 'You find a mushroom. It gives 10 health, but it\'s probably not a good idea to eat a wild mushroom.',
        metaDescriptionText: 'Item: Mushroom, Effect: +10 Health'
    },
    {
        image: 'images/animals/butterfly.jpg',
        cardDescriptionText: 'You see a yellow and big butterfly. It looks pretty.',
        metaDescriptionText: 'Encounter: Butterfly, Effect: None'
    },
    {
        image: 'images/animals/frog.jpg',
        cardDescriptionText: 'A frog jumps out of nowhere. You wonder where it\'ll go.',
        metaDescriptionText: 'Encounter: Frog, Effect: None'
    },
    {
        image: 'images/animals/rabbit.jpg',
        cardDescriptionText: 'You spot a curious-looking rabbit.',
        metaDescriptionText: 'Encounter: Rabbit, Effect: None'
    },
    {
        image: 'images/animals/turtle.jpg',
        cardDescriptionText: 'You find a slow-moving turtle.',
        metaDescriptionText: 'Encounter: Turtle, Effect: None'
    }
];


// Dynamically generate card slots
for (let i = 1; i <= totalSlots; i++) {
    const cardSlot = document.createElement('div');
    cardSlot.className = 'card-slot';
    cardSlot.id = `card-slot-${i}`;

    const cardImage = document.createElement('img');
    cardImage.className = 'card-image';
    cardImage.id = `cardback-${i}`;
    cardImage.src = 'images/cardback.png';
    cardImage.alt = 'Card Back';

    cardSlot.appendChild(cardImage);
    cardGrid.appendChild(cardSlot);
    cardSlots.push(cardSlot);
}

// Function to update the collection page with new card images
function updateCollectionPage(cardIndex) {
    const cardData = collectionDescription[cardIndex];
    const emptySlot = cardSlots.find(slot => !slot.classList.contains('filled'));
    if (emptySlot) {
        const cardImage = emptySlot.querySelector('.card-image');
        cardImage.src = cardData.image;
        cardImage.setAttribute('data-card-index', cardIndex); // Set data attribute
        emptySlot.classList.add('filled');
    }
}

const cardPopupOverlay = document.getElementById('card-popup-overlay');
const cardPopupImage = document.getElementById('card-popup-image');
const cardPopupBackImage = document.getElementById('card-popup-back-image');
const cardDescription = document.getElementById('card-description');
const metaDescription = document.getElementById('meta-description');
const cardPopupBox = document.querySelector('.card-popup-box');
const cardPopupInner = document.querySelector('.card-popup-inner');

// Function to show the card popup
function showCardPopup(imageSrc, description, metaDesc) {
    cardPopupImage.src = imageSrc;
    cardPopupBackImage.src = imageSrc;
    cardDescription.innerHTML = description;
    metaDescription.innerHTML = metaDesc;
    cardPopupOverlay.style.display = 'flex';
}

// Function to flip the card
function flipCard() {
    cardPopupBox.classList.toggle('flipped');
}

// Close the card popup
function closeCardPopup() {
    cardPopupOverlay.style.display = 'none';
    cardPopupBox.classList.remove('flipped');
}

// Event listener for closing the card popup
cardPopupOverlay.addEventListener('click', function(event) {
    if (event.target === cardPopupOverlay) {
        closeCardPopup();
    }
});

// Event listener for card click
cardGrid.addEventListener('click', function(event) {
    if (event.target.classList.contains('card-image') && !event.target.src.includes('cardback.png')) {
        const cardIndex = event.target.getAttribute('data-card-index');
        const cardData = collectionDescription[cardIndex];
        showCardPopup(cardData.image, cardData.cardDescriptionText, cardData.metaDescriptionText);
    }
});

// Event listener for flipping the card on click
cardPopupBox.addEventListener('click', flipCard);

function showRandomCard() {
    if (mapPage.style.display === 'flex') {
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        mapCardImage.src = randomCard.image;
        mapText.innerText = randomCard.text; // Update the map text
        loadingText.style.display = 'none';
        loadingImage.style.display = 'none';
        mapText.style.display = 'block';
        mapCard.style.display = 'block';
        continueButton.style.display = 'block';

        // Add the new card to the collection
        if (!collectedCards.includes(randomCard.image)) {
            collectedCards.push(randomCard.image);
            updateCollectionPage(getCardIndexByImage(randomCard.image));
        }

        isLoading = false;  // Reset the isLoading flag once the loading process is done
    }
}

function showRandomLoadingImage() {
    const randomLoadingCard = loadingcards[Math.floor(Math.random() * loadingcards.length)];
    loadingImage.src = randomLoadingCard.image;
    loadingText.innerText = randomLoadingCard.text;
    loadingText.style.display = 'block';
    loadingImage.style.display = 'block';
    continueButton.style.display = 'none';
    mapText.style.display = 'none';
    mapCard.style.display = 'none';

    // Add the new loading card to the collection
    if (!collectedCards.includes(randomLoadingCard.image)) {
        collectedCards.push(randomLoadingCard.image);
        updateCollectionPage(getCardIndexByImage(randomLoadingCard.image));
    }

    isLoading = true;
}

// Utility function to get card index by image source
function getCardIndexByImage(imageSrc) {
    return collectionDescription.findIndex(card => card.image === imageSrc);
}

   


    // Function to display text with typewriter effect

    let currentTypewriterInterval = null;

    function typeWriter(text, element, speed = 50) {
        let i = 0;
        element.innerHTML = "";
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                currentTypewriterInterval = setTimeout(type, speed);
            }
        }
        type();
    }


   

    // Navigation to Collection page
    const homePage = document.getElementById('home-page');
    const indexIcon = document.getElementById('index-icon');

    indexIcon.addEventListener('click', (event) => {
        event.preventDefault();
        homePage.style.display = 'none';
        collectionPage.style.display = 'flex'; // Use flex to maintain layout
        mapPage.style.display = 'none';
        isLoading = false;
        isCardShowing = false;  // Reset the flag
    });
    

    // Navigation back to Home page
    const homeIcon = document.getElementById('home-icon');
    homeIcon.addEventListener('click', () => {
        homePage.style.display = 'flex';
        collectionPage.style.display = 'none';
        mapPage.style.display = 'none';
        isLoading = false;
        isCardShowing = false;  // Reset the flag
    });
     

    let isLoading = false;  // Add this line to declare the isLoading flag
const collectedCards = [];
let isCardShowing = false;


// Navigation to Map page
const mapPage = document.getElementById('map-page');
const mapIcon = document.getElementById('map-icon');
const mapText = document.getElementById('map-text');  // New element for displaying map text
const continueButton = document.getElementById('continue-button');
const mapCard = document.getElementById('map-card');
const mapCardImage = document.getElementById('map-card-image');
const loadingImage = document.getElementById('loading-image'); // Fix the reference
const loadingText = document.getElementById('loading-text'); // Fix the reference

// Load images and texts for new cards
const cards = [
    { image: 'images/animals/butterfly.jpg', text: 'You found a beautiful butterfly. It is bright yellow and quite big!' },
    { image: 'images/animals/frog.jpg', text: 'A frog jumps out from nowhere! I wonder where it will go?' },
    { image: 'images/animals/rabbit.jpg', text: 'A wild rabbit appears, twitching its nose. The rabbit seems to looking for something.' },
    { image: 'images/animals/turtle.jpg', text: 'You encounter a slow-moving turtle. It takes forever to move an inch!' }
];

const loadingcards = [
    { image: 'images/rest.jpg', text: 'This is a nice place to rest...' },
    { image: 'images/breeze.jpg', text: 'Breeze here feels nice...' },
    { image: 'images/view.jpg', text: 'What a nice scenery...' },
]



mapIcon.addEventListener('click', (event) => {
    event.preventDefault();
    if (isLoading || isCardShowing) return;  // Prevent further actions if loading or card showing

    isLoading = true;  // Set the isLoading flag
    isCardShowing = true;  // Set the isCardShowing flag

    homePage.style.display = 'none';
    collectionPage.style.display = 'none';
    mapText.style.display = 'none';
    mapCard.style.display = 'none';
    continueButton.style.display = 'none';
    mapPage.style.display = 'flex';

    // Show a random loading image
    showRandomLoadingImage();

    // Simulate loading process
    setTimeout(() => {
        showRandomCard();
    }, 2000); // Simulate a 2-second loading time
});


// Continue button functionality
continueButton.addEventListener('click', () => {
    if (!isCardShowing) return;  // Prevent actions if not showing a card

    mapCard.style.display = 'none'; // Hide the current card
    mapText.style.display = 'none';
    continueButton.style.display = 'none'; // Hide the continue button

    // Show loading animation again
    showRandomLoadingImage();

    // Simulate loading process
    setTimeout(() => {
        showRandomCard();
    }, 2000); // Simulate a 2-second loading time
});





});
