document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');

    let lunrIndex;
    let pagesIndex;

    // Fetch the search index
    fetch('/index.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            pagesIndex = data;

            // Initialize Lunr.js with partial matching
            lunrIndex = lunr(function () {
                this.ref('url');
                this.field('title', { boost: 10 });
                this.field('content');

                // Add documents to the index
                pagesIndex.forEach(page => {
                    this.add(page);
                });

                // Enable partial matching
                this.pipeline.remove(lunr.stemmer); // Optional: Remove stemmer for better partial matching
                this.searchPipeline.remove(lunr.stemmer); // Optional: Remove stemmer from search pipeline
            });
        })
        .catch(error => {
            console.error('Error fetching search index:', error);
        });

    // Search function with partial matching
    function performSearch(query) {
        // Add a wildcard to the query for partial matching
        const wildcardQuery = query.split(' ').map(term => `${term}*`).join(' ');
        return lunrIndex.search(wildcardQuery).map(result => {
            return pagesIndex.find(page => page.url === result.ref);
        });
    }

    // Display search results
    function displayResults(results) {
        searchResults.innerHTML = '';
        if (results.length === 0) {
            searchResults.innerHTML = '<li>No results found.</li>';
        } else {
            results.forEach(result => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = result.url;
                link.textContent = result.title;
                li.appendChild(link);
                searchResults.appendChild(li);
            });
        }
    }

    // Event listener for the search button
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            const results = performSearch(query);
            displayResults(results);
        } else {
            searchResults.innerHTML = '';
        }
    });

    // Optional: Add live search as the user types
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            const results = performSearch(query);
            displayResults(results);
        } else {
            searchResults.innerHTML = '';
        }
    });
});