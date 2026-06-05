document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('movie-search');
    const searchResults = document.getElementById('search-results');
    const allMoviesSection = document.getElementById('all-movies-section');
    const allMoviesGrid = document.getElementById('all-movies-grid');
    const selectedMovieSection = document.getElementById('selected-movie-section');
    const selectedMovieCard = document.getElementById('selected-movie-card');
    const recommendationsSection = document.getElementById('recommendations-section');
    const recommendationsGrid = document.getElementById('recommendations-grid');

    let moviesData = [];

    // Fetch movies JSON
    fetch('movies.json')
        .then(response => response.json())
        .then(data => {
            moviesData = data;
            renderMovies(moviesData, allMoviesGrid);
        })
        .catch(err => console.error("Could not load movies data:", err));

    // Handle Search Input
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 1) {
            searchResults.classList.add('hidden');
            return;
        }

        const matches = moviesData.filter(movie => movie.title.toLowerCase().includes(query));
        renderSearchResults(matches);
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });

    function renderSearchResults(matches) {
        searchResults.innerHTML = '';
        if (matches.length === 0) {
            searchResults.classList.add('hidden');
            return;
        }

        matches.forEach(movie => {
            const li = document.createElement('li');
            const fallback = `https://dummyimage.com/40x60/1a1d24/ff4757.png&text=${encodeURIComponent(movie.title.charAt(0))}`;
            const posterSrc = movie.poster ? movie.poster : fallback;
            
            li.innerHTML = `
                <img src="${posterSrc}" alt="${movie.title} poster" onerror="this.src='${fallback}'">
                <div class="dropdown-info">
                    <h4>${movie.title}</h4>
                    <p>${movie.language ? movie.language + ' • ' : ''}${movie.genres.join(', ')} • ${movie.rating} ⭐</p>
                </div>
            `;
            li.addEventListener('click', () => {
                selectMovie(movie);
                searchInput.value = '';
                searchResults.classList.add('hidden');
            });
            searchResults.appendChild(li);
        });

        searchResults.classList.remove('hidden');
    }

    function createMovieCardHTML(movie, matchScore = null, isShowcase = false) {
        const scoreBadge = matchScore !== null ? `<div class="similarity-score">${Math.round(matchScore * 100)}% Match</div>` : '';
        const fallback = `https://dummyimage.com/400x600/1a1d24/ff4757.png&text=${encodeURIComponent(movie.title)}`;
        const posterSrc = movie.poster ? movie.poster : fallback;
        
        let watchBtn = '';
        if (isShowcase) {
            watchBtn = `
            <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' movie trailer hindi english')}" target="_blank" class="watch-btn">
                ▶ Watch Trailer
            </a>
            `;
        }

        return `
            ${scoreBadge}
            <img src="${posterSrc}" alt="${movie.title} poster" onerror="this.src='${fallback}'">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <div class="movie-meta">
                    <span class="rating">⭐ ${movie.rating}</span>
                </div>
                <div class="genre-tags">
                    ${movie.language ? `<span class="tag lang-tag">${movie.language}</span>` : ''}
                    ${movie.genres.map(g => `<span class="tag">${g}</span>`).join('')}
                </div>
                ${movie.description ? `<p class="desc">${movie.description}</p>` : ''}
                ${watchBtn}
            </div>
        `;
    }

    function renderMovies(movies, container, scoresMap = null) {
        container.innerHTML = '';
        movies.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'movie-card fade-in';
            const score = scoresMap ? scoresMap.get(movie.id) : null;
            card.innerHTML = createMovieCardHTML(movie, score, false);
            // Ignore description for grid view
            const desc = card.querySelector('.desc');
            if(desc && container.id !== 'selected-movie-card') {
                desc.remove();
            }
            card.addEventListener('click', () => {
                selectMovie(movie);
            });
            container.appendChild(card);
        });
    }

    function selectMovie(movie) {
        // Display selected movie
        selectedMovieCard.innerHTML = createMovieCardHTML(movie, null, true);
        selectedMovieSection.classList.remove('hidden');

        // Hide all movies list to clean up UI
        allMoviesSection.classList.add('hidden');

        // Calculate and render recommendations
        recommendMovies(movie);
        recommendationsSection.classList.remove('hidden');

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Recommendation Engine (Content-Based Filtering via Jaccard Similarity on Genres)
    function recommendMovies(selectedMovie) {
        const scores = new Map();

        const recommendations = moviesData
            .filter(m => m.id !== selectedMovie.id) // exclude selected movie
            .map(m => {
                const similarityScore = calculateJaccardSimilarity(selectedMovie.genres, m.genres);
                scores.set(m.id, similarityScore);
                return { ...m, similarityScore };
            })
            // Filter out 0 similarity and sort by highest similarity
            .filter(m => m.similarityScore > 0)
            .sort((a, b) => b.similarityScore - a.similarityScore || b.rating - a.rating)
            .slice(0, 8); // Display Top 8 for the huge dataset!

        // Render recommendations
        renderMovies(recommendations, recommendationsGrid, scores);
    }

    function calculateJaccardSimilarity(list1, list2) {
        const set1 = new Set(list1.map(g => g.toLowerCase()));
        const set2 = new Set(list2.map(g => g.toLowerCase()));
        
        // Intersection size
        const intersection = new Set([...set1].filter(x => set2.has(x))).size;
        
        // Union size
        const union = new Set([...set1, ...set2]).size;

        return intersection / union;
    }
});
