## Setup Guide

Now you have to manually setup the local storage or else the app will not work. You can to this by going to the console and typing the following js line:

```JavaScript
localStorage.setItem('favouriteLinks', JSON.stringify([]));
localStorage.setItem('engines', JSON.stringify([]));
```

This will add favourite link to Google *(You can later remove this)*. And then just reload the page.

The next thing that I want to add is that you don't have to this by yourself. I will add a setup page with exact instructions. But for now, you have to do it manually.

## How to use

Now that you have setup the app, you can start using it. The settings icon in the bottom right corner will open a settings menu. In this menu you can add new favourites. To remove a favourite, 
just right click on it and click on the *Löschen* button, which means *Delete* in German. On right click you can also open the link in a new tab by clicking on *In neuen Tab öffnen*, which means *Open in new Tab* in German.
The search bar is pretty self explanatory. You can search with the search engines that are added. To select a search engine, just click on it.
The bar at the of each panel is a resizer. You can use this to resize the panel to your needs.

## TODO

- [ ] add a setup dialog
- [ ] add a language selector
- [ ] add custimizable themes
- [ ] add a option to rearrange the favourites
- [ ] add a option to edit a favourite
- [ ] add a option to do all of that also to the search engines
- [ ] better accessibility
- [ ] an option for reduced motion

## Known Bugs

- When you change  the size of the tab drastically, not as many icons as supposed to be shown are shown. This is reproducable by going in the mobile device mode and than leaving it again.
- When a favourite is added and then right clicked it will not show the custom context menu as excepted. The same happens when you right click on a search engine. As for the search engines, you even need to reload the entire page to use the basic functionality after adding a new one.