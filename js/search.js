document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');

    let lunrIndex;
    let pagesIndex;

    // Fetch the search index
    fetch('/loveforSFF.com/index.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            pagesIndex = data;

            lunrIndex = lunr(function () {
                this.ref('url');
                this.field('title', { boost: 10 });
                this.field('content');

                // Remove the stemmer for better partial matching
                this.pipeline.remove(lunr.stemmer);

                // Add documents to the index
                pagesIndex.forEach(page => {
                    this.add(page);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching search index:', error);
        });

    // Search function with partial matching
    function performSearch(query) {
        if (!lunrIndex) {
            console.error('Search index not loaded yet');
            return [];
        }

        // Add wildcard for partial matching
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
        if (query.length === 0) {
            searchResults.innerHTML = '<li>Start typing to search...</li>';
            return;
        }
        const results = performSearch(query);
        displayResults(results);
    });

    // Live search as the user types
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        if (query.length === 0) {
            searchResults.innerHTML = '<li>Start typing to search...</li>';
            return;
        }
        const results = performSearch(query);
        displayResults(results);
    });
});
