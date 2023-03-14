const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const engineButtons = document.getElementsByClassName('engine')
let searchUrl;


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

configureEngine();
generateFavouriteLinks(JSON.parse(localStorage.getItem('favouriteLinks')), document.getElementById('linkList'))

function search() {
    const rawSearchTerm = searchInput.value;
    const urlSearchTerm = rawSearchTerm.replace(/\s+/g, '%20');

    const fullUrl = searchUrl.replace(/%s/g, urlSearchTerm);

    window.open(fullUrl, '_self');
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

document.getElementById('searchField').addEventListener('click', (event) => {
    searchInput.focus();
});

for (let i of document.getElementsByClassName('resizer')) {
    i.addEventListener('mousedown', (event) => {
        let scrollElement = event.currentTarget.parentElement.getElementsByClassName('resizeable')[0];

        const startHeight = parseInt(window.getComputedStyle(scrollElement).height);
        const startMouseY = event.clientY;


        function resize(mouseMoveEvent) {
            scrollElement.style.height = (startHeight + mouseMoveEvent.clientY - startMouseY) + 'px';

            hideElements(scrollElement);

            localStorage.setItem(scrollElement.id, scrollElement.style.height)

        }

        i.parentElement.addEventListener('mousemove', resize);
        ['mouseup', 'mouseleave'].forEach(eventName => {
            i.parentElement.addEventListener(eventName, () => {
                i.parentElement.removeEventListener('mousemove', resize);
            }, { once: true });
        });
    });
}


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

for (const element of document.getElementsByClassName('resizeable')) {
    element.style.height = localStorage.getItem(element.id) // this code (and also the code in line 120) is very unsecure, due to the prominence of an id
    hideElements(element);
}

window.addEventListener('resize', () => {
    for (const element of document.getElementsByClassName('resizeable')) {
        element.style.height = localStorage.getItem(element.id) // this code (and also the code in line 120) is very unsecure, due to the prominence of an id
        hideElements(element);
    }
});

document.getElementById('linkCreationButton').addEventListener('click', () => {
    const name = document.getElementById('linkCreationName').value;
    const url = document.getElementById('linkCreationUrl').value;
    const imgUrl = document.getElementById('linkCreationImageUrl').value;

    if (name && url && imgUrl) {
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

document.getElementById('settingsIcon').addEventListener('click', () => {
    const oldStyle = document.getElementById('menus').style.display;

    document.getElementById('menus').style.display = (oldStyle == 'none') ? 'flex' : 'none';
});


for (const input of document.getElementsByClassName('optionsInput')) {
    input.addEventListener('input', () => {
        document.getElementById('linkCreationButton').disabled = Boolean(Array.from(document.getElementsByClassName('optionsInput')).filter(inputField => !inputField.value).length);
    });
}

for (const button of document.querySelectorAll('a.favourite')) {
    button.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        let contextMenu = document.getElementById('contextmenu');
        contextMenu.style.top = event.pageY + 'px';
        contextMenu.style.left = event.pageX + 'px';
        contextMenu.style.display = 'flex';
        contextMenu.innerHTML = '';


        let item = document.createElement('div'); // hier die struktur neu schreiben für eine lsite aus objekten mit innerText und funktion; auch eine öffnen in neuen tab option hinzufügen (<a> hat ein attribu das in neuem tab macht)
        item.innerText = 'Löschen';
        item.classList.add('contextmenuEntry')

        contextMenu.appendChild(item)

        item.addEventListener('click', () => {
            button.remove(); // muss noch im locale storage gespeichert werden
        }, { once: true });

        document.addEventListener('click', () => {
            contextMenu.style.display = 'none';
            let linkList = [];
            for (const link of document.querySelectorAll('a.favourite')) {
                linkList.push({
                    'service': link.innerText,
                    'url': link.href,
                    'imgUrl': link.children[0].src
                });
            }
            localStorage.setItem('favouriteLinks', JSON.stringify(linkList));
        }, { once: true });
    });
}