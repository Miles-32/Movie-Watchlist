// All requests to: "http://www.omdbapi.com/?apikey=ad070889&..."
// Poster requests to: "http://img.omdbapi.com/?apikey=ad070889&..."

const searchButton = document.getElementById("search-btn")
const searchInput = document.getElementById("search-input")
const movieFeed = document.getElementById("movie-feed")
const watchlistFeed = document.getElementById("watchlist-feed")
const filmAddModal = document.getElementById("film-add-modal")

let myFilms = createWatchlist()

function createWatchlist(){
    if (localStorage.getItem("films")){
        return JSON.parse(localStorage.getItem("films"))
    }
    else{
        return []
    }
}
   
document.body.addEventListener("click", function(e){
    if (e.target.dataset.watchlistAdd){
        const film = e.target.dataset.watchlistAdd
        
        if (!myFilms.includes(film)){
            myFilms.push(film)
            localStorage.setItem("films", JSON.stringify(myFilms))
            
            document.getElementById("modal-text").innerText = `${film} added to watchlist.`
        }
        else {
            document.getElementById("modal-text").innerText = `${film} is already in your watchlist.`
        }
        filmAddModal.style.display = "block"
        setTimeout(function(){
            filmAddModal.style.display = "none"
        }, 4000)
    }
    else if (e.target.dataset.watchlistRemove){
        const film = e.target.dataset.watchlistRemove
        const index = myFilms.indexOf(film)
        
        if (index > -1){
            myFilms.splice(index, 1)
            localStorage.setItem("films", JSON.stringify(myFilms))
            renderWatchlist()
        }       
    }
})

if (searchButton){    
    searchButton.addEventListener("click", async function(){        
        fetch(`https://www.omdbapi.com/?apikey=ad070889&s=${searchInput.value}&type="movie"`)
            .then(res => res.json())
            .then(data => {
                if (!data.Search){
                    movieFeed.innerHTML = `
                    <div id="placeholder-movie-feed">
                        <h3 class="prompt-text">Unable to find what you’re looking for. Please try another search.</h3>
                    </div>
                    `            
                    return
                }
                let filmList = []               
                for (film of data.Search){
                    let title = film.Title
                    if (!filmList.includes(title)){
                        filmList.push(title)  
                    }  
                }
                render(filmList)
            })
    })
}

async function render(filmArr){
    let newMovieFeed = ""
    for (film of filmArr){
        const res = await fetch(`https://www.omdbapi.com/?apikey=ad070889&t=${film}`)
        const data = await res.json()
        let moviePoster = ""
        if (data.Poster !== "N/A"){
            moviePoster = data.Poster
        }
        else {
            moviePoster = "./images/placeholder.png"
        }
            
        newMovieFeed += `
        <div class="new-movie">
            <div class="poster" style="background-image: url('${moviePoster}')"></div>
            <div class="movie-info">
                <div class="movie-title-container">
                    <h3 class="movie-title">${data.Title}</h3>
                    <img src="./icons/star.svg" class="star icon">
                    <p class="movie-rating">${data.imdbRating}</p>
                </div>
                <div class="movie-specifics">
                    <p class="genre-runtime">${data.Runtime}</p>
                    <p class="genre-runtime">${data.Genre}</p>
                    <div class="watchlist-button">
                        <img src="./icons/add.svg" class="icon inline">
                        <button id="watchlist-btn" data-watchlist-add="${data.Title}">Watchlist</button>
                    </div>
                </div>
                <p class="synopsis">${data.Plot}</p>
            </div>
        </div>`
    }
    movieFeed.innerHTML = newMovieFeed
}

async function renderWatchlist(){
    if (myFilms.length === 0){
        watchlistFeed.innerHTML = `
            <div id="placeholder-watchlist-feed">
                <h3 class="prompt-text">Your watchlist is looking a little empty...</h3>
                <a class="add-movies-prompt" href="index.html">
                    <img class="icon" src="/icons/add.svg">
                    <p id="add-films">Let's add some films!</p>
                </a>
            </div>`
    }
    else {
        let newWatchlist = ""
        for (film of myFilms){
            const res = await fetch(`https://www.omdbapi.com/?apikey=ad070889&t=${film}`)
            const data = await res.json()
            let moviePoster = ""
            if (data.Poster !== "N/A"){
                moviePoster = data.Poster
            }
            else {
                moviePoster = "./images/placeholder.png"
            }
                
            newWatchlist += `
                <div class="new-movie">
                    <div class="poster" style="background-image: url('${moviePoster}')"></div>
                    <div class="movie-info">
                        <div class="movie-title-container">
                            <h3 class="movie-title">${data.Title}</h3>
                            <img src="./icons/star.svg" class="star icon">
                            <p class="movie-rating">${data.imdbRating}</p>
                        </div>
                        <div class="movie-specifics">
                            <p class="genre-runtime">${data.Runtime}</p>
                            <p class="genre-runtime">${data.Genre}</p>
                            <div class="watchlist-button">
                                <img src="./icons/remove.svg" class="icon inline">
                                <button id="watchlist-btn" data-watchlist-remove="${data.Title}">Remove</button>
                            </div>
                        </div>
                        <p class="synopsis">${data.Plot}</p>
                    </div>
                </div>`
        }
        watchlistFeed.innerHTML = newWatchlist
    }
}