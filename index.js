const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
let searchUrl;

localStorage.favouriteLinks  ||= JSON.stringify([])
if (!(localStorage.engines)) {
    alert('No search engines found. Please add one. This will later be replaced by a settings menu.')
    let name = prompt('Name of the search engine');
    let url = prompt('Url of the search engine. Use %s as placeholder for the search term');
    let imgUrl = prompt('Url of the search engine icon');

    while (!(name && url && imgUrl)) {
        name = prompt('Name of the search engine');
        url = prompt('Url of the search engine. Use %s as placeholder for the search term');
        imgUrl = prompt('Url of the search engine icon');
    }

    localStorage.engines = JSON.stringify([{
        name: name,
        url: url,
        imgUrl: imgUrl
    }]);
}

function hideElements(scrollElement) {
    let gridRows = parseInt(window.getComputedStyle(scrollElement).gridTemplateRows.split(' ')[0]);
    let gridGap = parseInt(window.getComputedStyle(scrollElement).gap);
    let maxRows = Math.floor((parseInt(scrollElement.style.height) + gridGap) / (gridGap + gridRows));

    let gridColumnElements = window.getComputedStyle(scrollElement).gridTemplateColumns.split(' ').length;
    let gridChildsVisible = (maxRows * gridColumnElements);

    for (let i = 0; i < scrollElement.children.length;) {
        let visible = i < gridChildsVisible;

        scrollElement.children[i].style.opacity = visible ? 1 : 0;
        scrollElement.children[i].style.pointerEvents = visible ? "auto" : "none";
        scrollElement.children[i].setAttribute('tabindex', visible ? '0' : '-1');
        i++;
    }
}

function generateFavouriteLinks(links, parentElement) {
    parentElement.innerHTML = '';
    for (const service of links) {
        let aTag = document.createElement('a');
        let imgTag = document.createElement('img');

        imgTag.setAttribute('src', service.imgUrl);
        imgTag.setAttribute('alt', service.service);

        aTag.setAttribute('href', service.url);
        aTag.classList.add('favourite');

        aTag.appendChild(imgTag);

        parentElement.appendChild(aTag);
    }
}

function search() {
    const rawSearchTerm = searchInput.value;
    const urlSearchTerm = rawSearchTerm.replace(/\s+/g, '%20');

    const fullUrl = searchUrl.replace(/%s/g, urlSearchTerm);

    window.open(fullUrl, '_self');
}

function configureEngine() {
    const button = document.getElementsByClassName('selected')[0];
    if (button === undefined) {
        return;
    }
    const image = button.children[0];

    const name = image.alt;
    const imageSrc = image.src;

    JSON.parse(localStorage.getItem('engines')).forEach(obj => {
        if (obj.name === name) {
            searchUrl = obj.url;
        }
    });
    document.getElementById('searchEngineIndicator').src = imageSrc;
    document.getElementById('searchEngineIndicator').alt = name;
    searchInput.placeholder = `Search ${name}`;
}

function resize(scrollElement, startHeight, startMouseY, currectMouseY) {
    scrollElement.style.height = (startHeight + currectMouseY - startMouseY) + 'px';

    hideElements(scrollElement);
    localStorage.setItem(scrollElement.id, scrollElement.style.height);
}

function generateSearchEngines() {
    let engineWrapper = document.getElementById('searchEngines');
    engineWrapper.innerHTML = '';
    selected = false;
    for (const engine of JSON.parse(localStorage.getItem('engines'))) {
        let engineButton = document.createElement('button');
        // give the class 'selected' to the first engine
        if (!selected) {
            engineButton.classList.add('selected');
        }
        engineButton.classList.add('favourite', 'engine');

        let engineImage = document.createElement('img');
        engineImage.src = engine.imgUrl;
        engineImage.alt = engine.name;

        engineButton.appendChild(engineImage);

        engineWrapper.appendChild(engineButton);
        selected = true;
    }
    configureEngine();
}


generateSearchEngines();
generateFavouriteLinks(JSON.parse(localStorage.getItem('favouriteLinks')), document.getElementById('linkList'))



searchInput.addEventListener('input', (event) => { // disable search button if search input is empty and remove multiple spaces
    event.currentTarget.value = event.currentTarget.value.replace(/\s+/g, ' ');
    let value = event.currentTarget.value;

    searchButton.disabled = (value === '');
});

searchInput.addEventListener('keydown', (event) => { // search on enter
    if (event.key === 'Enter' && event.currentTarget.value !== '') {
        search();
    }
});

searchButton.addEventListener('click', () => { // search on button click
    search();
});

for (const button of document.getElementsByClassName('engine')) { // here is the button select menu
    button.addEventListener('click', (event) => { // swiggle animation if button is already selected
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

    button.addEventListener('animationend', (event) => { // remove swiggle animation
        event.currentTarget.classList.remove('swiggle')
    }, { once: true });
}

document.addEventListener('keyup', (event) => { // focus search input on key 'e'
    if ((event.key === 'e') && (document.activeElement.tagName !== 'INPUT')) {
        searchInput.focus();
    }
});


for (let i of document.getElementsByClassName('resizer')) {
    ['mousedown', 'touchstart'].forEach(eventName => { // resize elements
        i.addEventListener(eventName, (event) => {
            event.preventDefault();
            let scrollElement = event.currentTarget.parentElement.getElementsByClassName('resizeable')[0];

            const startHeight = parseInt(window.getComputedStyle(scrollElement).height);
            const startMouseY = parseInt(event.clientY || event.touches[0].clientY);
            const resizeFunction = (event) => resize(scrollElement, startHeight, startMouseY, parseInt(event.clientY || event.touches[0].clientY));

            ['mousemove', 'touchmove'].forEach(eventName => {
                // add event listener to resize the right element
                i.parentElement.addEventListener(eventName, resizeFunction);
            });
            ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(eventName => {
                i.parentElement.addEventListener(eventName, () => {
                    ['mousemove', 'touchmove'].forEach(eventName => {
                        i.parentElement.removeEventListener(eventName, resizeFunction);
                    });
                }, { once: true });
            });
        });
    });
}


for (const element of document.getElementsByClassName('resizeable')) { // set the local storage height to the resizeable elements
    element.style.height = localStorage.getItem(element.id) // this code  is very unsecure, due to the prominence of an id
    hideElements(element);
}

document.getElementById('linkCreationButton').addEventListener('click', () => { // create new link
    const name = document.getElementById('linkCreationName').value;
    const url = document.getElementById('linkCreationUrl').value;
    const imgUrl = document.getElementById('linkCreationImageUrl').value;

    if (name && url && imgUrl) { // check if all fields are filled
        const newLinkObject = {
            'service': name,
            'url': url,
            'imgUrl': imgUrl
        };
        let linkList = JSON.parse(localStorage.getItem('favouriteLinks'));
        linkList[linkList.length] = newLinkObject;

        localStorage.setItem('favouriteLinks', JSON.stringify(linkList));

        generateFavouriteLinks(linkList, document.getElementById('linkList'));

        document.getElementById('linkCreationName').value = '';
        document.getElementById('linkCreationUrl').value = '';
        document.getElementById('linkCreationImageUrl').value = '';
    }
});

document.getElementById('settingsIcon').addEventListener('click', () => { // show settings menu
    const oldStyle = document.getElementById('menus').style.display;

    document.getElementById('menus').style.display = (oldStyle === 'none') ? 'flex' : 'none';
});


for (const input of document.getElementsByClassName('optionsInput')) { // disable link creation button if at least one input field is empty
    input.addEventListener('input', () => {
        document.getElementById('linkCreationButton').disabled = Boolean(Array.from(document.getElementsByClassName('optionsInput')).filter(inputField => !inputField.value).length);
    });
}

for (const button of document.querySelectorAll('a.favourite')) { // generate context menu for favourite links to remove them
    button.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        let contextMenu = document.getElementById('contextmenu');
        contextMenu.style.top = event.pageY + 'px';
        contextMenu.style.left = event.pageX + 'px';
        contextMenu.style.display = 'flex';
        contextMenu.innerHTML = '';


        let items = {
            'Löschen': (button) => {
                button.remove();
                let linkList = [];
                for (const link of document.querySelectorAll('a.favourite')) {
                    linkList.push({
                        'service': link.innerText,
                        'url': link.href,
                        'imgUrl': link.children[0].src
                    });
                }
                localStorage.setItem('favouriteLinks', JSON.stringify(linkList));
            },
            'In neuen Tab öffnen': (button) => { window.open(button.href, '_blank') },
            'Link kopieren': (button) => { navigator.clipboard.writeText(button.href) },
            'Danach suchen': (button) => {
                searchInput.value = button.children[0].alt;
                searchInput.focus();
            },
            'hr': () => { }, // horizontal rule
            'Abbrechen': () => { }, // do nothing, just close the context menu,
        };

        for (const [key, value] of Object.entries(items)) {
            if (key === 'hr') {
                let hr = document.createElement('hr');
                hr.classList.add('contextmenuEntry');
                contextMenu.appendChild(hr);
                continue;
            }
            let menuItem = document.createElement('div');
            menuItem.innerText = key;
            menuItem.classList.add('contextmenuEntry');
            menuItem.addEventListener('click', () => {
                value(button);
            }, { once: true });
            contextMenu.appendChild(menuItem);
        }

        document.addEventListener('click', () => { // hide context menu on click
            contextMenu.style.display = 'none';
        }, { once: true });
    });
}
