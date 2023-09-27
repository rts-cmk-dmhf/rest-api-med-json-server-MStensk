const API_URL = new URL('http://localhost:3000/movies')

const resultsContainer = document.querySelector('.results-container')
const deleteLinks = document.querySelector('.delete-movie');
const addMovieForm = document.getElementById('addMovieForm');
const titleInput = document.getElementById('titleInput');
const yearInput = document.getElementById('yearInput');
const editMovieForm = document.getElementById('editMovieForm');
const descriptionInput = document.getElementById('descriptionInput');
const editTitleInput = document.getElementById('editTitleInput');
const editYearInput = document.getElementById('editYearInput');
const editDescriptionInput = document.getElementById('editDescriptionInput');
const editMovieIdInput = document.getElementById('editMovieId');
const addNewMovieButton = document.querySelector('.add-new-movie');
let selectedMovieId = null;


const fetchMovies = async () => {
    const response = await fetch(API_URL)
    const data = await response.json()

    renderMovies(data)
}

const renderMovies = movies => {
    const moviesHTML = movies.map(movie => {
        return `
            <div class="results-container__movie" data-id="${movie.id}">
                <h3>${movie.title}</h3>
                <div class="movie-container">
                <img width="150" src="${movie.img}"></img>
                <div class="movie-info">
                <p>${movie.year}</p>
                <p class="movie-desc">${movie.description}</p>
                </div>
                </div>
                <button class="delete-movie">delete</button>
                <button class="edit-movie">edit</button>
            </div>`
    }).join('')

    resultsContainer.innerHTML = moviesHTML;

    const deleteButtons = document.querySelectorAll('.delete-movie');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDeleteMovie);
    });

    const editButtons = document.querySelectorAll('.edit-movie');
    editButtons.forEach(button => {
        button.addEventListener('click', handleEditMovie);
    });
}

// handle delete movie
const handleDeleteMovie = async event => {
    event.preventDefault();
    
    const movieDiv = event.target.closest('.results-container__movie');
    const movieId = movieDiv.getAttribute('data-id');
    
    try {
        const response = await fetch(`${API_URL}/${movieId}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            // Remove the movie from the DOM
            movieDiv.remove();
        } else {
            console.error('Failed to delete the movie');
        }
    } catch (error) {
        console.error('Error deleting the movie:', error);
    }
}

// handle addmovie
addMovieForm.addEventListener('submit', async event => {
    event.preventDefault();
    
    // Collect data from form fields
    const newMovie = {
        title: titleInput.value,
        year: parseInt(yearInput.value),
        description: descriptionInput.value,
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMovie),
        });
        
        if (response.ok) {
            titleInput.value = '';
            yearInput.value = '';
            descriptionInput.value = '';
            
            fetchMovies();
        } else {
            console.error('Failed to create the movie');
        }
    } catch (error) {
        console.error('Error creating the movie:', error);
    }
});


// handle edit movie
const handleEditMovie = async event => {
    event.preventDefault();
    
    // Get the movie's ID
    const movieDiv = event.target.closest('.results-container__movie');
    const movieId = movieDiv.getAttribute('data-id');
    
    // retrieves movie based on movie id
    try {
        const response = await fetch(`${API_URL}/${movieId}`);
        console.log(response)
        if (response.ok) {
            const movie = await response.json();
            // sets input values to be equal to respondant movie values
            editMovieIdInput.value = movie.id;
            editTitleInput.value = movie.title;
            editYearInput.value = movie.year;
            editDescriptionInput.value = movie.description;
            
           
            editMovieForm.style.display = 'block';
            
            
            selectedMovieId = movie.id;
        }
    }
    catch (error) {
        console.error('Error fetching movie data:', error);
    }
}
// update the selected movie with the values user typed into input fields
editMovieForm.addEventListener('submit', async event => {
    event.preventDefault();
    
    const updatedMovie = {
        title: editTitleInput.value,
        year: parseInt(editYearInput.value),
        description: editDescriptionInput.value,
    };
    
    try {
        const response = await fetch(`${API_URL}/${selectedMovieId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMovie),
        });
        
        if (response.ok) {

            editMovieForm.style.display = 'none';
            
            editTitleInput.value = '';
            editYearInput.value = '';
            editDescriptionInput.value = '';
            
            fetchMovies();
        } else {
            console.error('Failed to update the movie');
        }
    } catch (error) {
        console.error('Error updating the movie:', error);
    }
});

//toggle add new movie form show
addNewMovieButton.addEventListener('click', ()=> {
  
if (addMovieForm.style.display === 'block') {
            addMovieForm.style.display = 'none';
    } else {
            addMovieForm.style.display = 'block';
    }
})



fetchMovies();