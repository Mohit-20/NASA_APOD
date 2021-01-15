// Creating Dom
const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader')

// Nasa Api
const count = 10;
const apiKey = 'WfwNfe7GrKVlzcuWZ0sy0xT4DRxe8fF6TMGQDN4d';
const  apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page){
    if(page === 'results'){
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    }
    else{
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    window.scrollTo({top: 0, behavior: 'instant'})
    loader.classList.add('hidden')
}

function createDOMNodes(page){
    let currentArray;
    if(page === 'results'){
        currentArray = resultsArray;
    }
    else{
        currentArray = Object.values(favorites);
    }
    // const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    // console.log('current array', page, currentArray)
    currentArray.forEach((result)=>{
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
    
        // link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = "View Full Image";
        link.target = '_blank'
    
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = "NASA Picture Of the Day";
        image.loading = "lazy";
        image.classList.add('card-img-top');
    
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
    
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
    
        // clickable (save Text)
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'results'){
            saveText.textContent = 'Add to Favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`) ;
        }
        else{
            saveText.textContent = 'Remove Favorite';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`) ;
        }
    
        // class text
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;
    
        // text muted (Footer)
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
    
        // strong (date)
        const date = document.createElement('strong');
        date.textContent = result.date;
    
        // span (copyright)
        // const copyrightResult
        const copyright = document.createElement('span');
        if(result.copyright === undefined){
            copyright.textContent = ' '
        }
        else{
            copyright.textContent = ` ${result.copyright}`;
        }
        
    
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        // console.log(card)
        imagesContainer.appendChild(card)
        });
}
// update DOM
function updateDOM(page){
    // get fav from local storage
    if(localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
        // console.log("fav from LS", favorites)
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}

// Get 10 images from nasa api
async function getNasaPictures(){
    // show the loader
    loader.classList.remove('hidden')
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        // console.log(resultsArray);
        updateDOM('results')
    } catch (error) {
        
    }
}

// add result to favorites
function saveFavorite(itemUrl){
    resultsArray.forEach((item)=>{
        if(item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;
            // console.log(JSON.stringify(favorites))
            // save conformation
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 1500);
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
        }
    })
    // console.log(itemUrl)
}

// Remove Favorites
function removeFavorite(itemUrl){
    if(favorites[itemUrl]){
        delete favorites[itemUrl];
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites')
    }

}

getNasaPictures()
