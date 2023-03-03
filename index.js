const engines = {
    "Brave": "https://search.brave.com/search?q=%s",
    "DuckDuckGo": "https://duckduckgo.com/?q=%s",
    "Google": "https://www.google.com/search?q=%s",
    "Bing": "https://www.bing.com/search?q=%s",
    "Ecosia": "https://www.ecosia.org/search?q=%s",
    "Duden": "https://www.duden.de/suchen/dudenonline/%s",
    "GitHub": "https://github.com/search?q=%s",
    "Qwant": "https://www.qwant.com/?q=%s",
    "Reddit": "https://www.reddit.com/search/?q=%s",
    "Spotify": "https://open.spotify.com/search/%s",
    "Wikipedia": "https://de.wikipedia.org/w/index.php?go=Go&search=%s",
    "Youtube": "https://www.youtube.com/results?search_query=%s",
    "Openstreetmap": "https://www.openstreetmap.org/search?query=%s",
    "Amazon": "https://www.amazon.de/s?k=%s",
    "Startpage": "https://www.startpage.com/sp/search?query=%s"
}

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const engineButtons = document.getElementsByClassName('engine')
let searchUrl;

configureEngine();

function search() {
    const rawSearchTerm = searchInput.value;
    const urlSearchTerm = rawSearchTerm.replace(/\s+/g, '%20');

    const fullUrl = searchUrl.replace(/%s/g, urlSearchTerm);

    window.open(fullUrl, '_self');
}

function selecetEngine() {
    const selectedButton = document.getElementById();
}

searchInput.addEventListener('input', (event) => {
    event.currentTarget.value = event.currentTarget.value.replace(/\s+/g, ' ');
    let value = event.currentTarget.value;

    searchButton.disabled = (value === '');
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.currentTarget.value !== '') {
        search();
    }
});

searchButton.addEventListener('click', () => {
    search();
});

for (const button of engineButtons) { // here is the button select menu
    button.addEventListener('click', (event) => {
        let clickedButton = event.currentTarget;


        if (clickedButton.className.includes('selected')) {
            clickedButton.classList.add('swiggle')

        } else {
            for (const i of document.getElementsByClassName('selected')) {
                i.classList.remove('selected');
            }
            clickedButton.classList.add('selected');
            configureEngine();
        }
    });
    button.addEventListener('animationend', (event) => {
        event.currentTarget.classList.remove('swiggle')
    });
}

document.addEventListener('keyup', (event) => {
    if ((event.key === 'e') && (document.activeElement.tagName !== 'INPUT')) {
        searchInput.focus();
    }
});

function configureEngine() {
    const button = document.getElementsByClassName('selected')[0];
    const image = button.children[0]; 

    const name = image.alt;
    const imageSrc = image.src;
    const baseUrl = engines[name]

    searchUrl = baseUrl;
    document.getElementById('searchEngineIndicator').src = imageSrc;
    document.getElementById('searchEngineIndicator').alt = name;
    searchInput.placeholder = `Search ${name}`

}
