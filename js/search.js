document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    const searchContainer = document.querySelector(".search-container");
    const searchResultsContainer = document.getElementById('search-results-container');
    // Only initialize search if elements exist
    if (searchInput && searchButton && searchResults) {
        let lunrIndex;
        let pagesIndex;

        // Initialize search
        fetch('/loveforSFF.com/index.json')
            .then(response => response.json())
            .then(data => {
                pagesIndex = data;
                lunrIndex = lunr(function() {
                    this.ref('url');
                    this.field('title', { boost: 10 });
                    this.field('content');
                    pagesIndex.forEach(page => this.add(page));
                });
            });

        // Search function
        function performSearch(query) {
            const wildcardQuery = query.split(' ').map(term => `${term}*`).join(' ');
            return lunrIndex.search(wildcardQuery).map(result => {
                return pagesIndex.find(page => page.url === result.ref);
            });
        }

        // Display results
        function displayResults(results) {
            const MAX_RESULTS = 5;
            searchResults.innerHTML = '';

            results.slice(0, MAX_RESULTS).forEach(result => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = result.url;
                link.textContent = result.title;
                li.appendChild(link);
                searchResults.appendChild(li);
            });

            if (results.length > MAX_RESULTS) {
                const li = document.createElement('li');
                li.innerHTML = `<a href="/search/?q=${encodeURIComponent(query)}">See all ${results.length} results →</a>`;
                searchResults.appendChild(li);
            } else if (results.length === 0){
                const li = document.createElement('li');
                li.innerHTML = "No Results.";
                searchResults.appendChild(li);
            }
        }

        // Event listeners
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query.length > 0) {
                const results = performSearch(query);
                displayResults(results);
            }
        });

        searchInput.addEventListener('input', () => {
            if (!lunrIndex) return; // Prevent searching if index is not ready
            const query = searchInput.value.trim();
            if (query.length > 0) {
                const results = performSearch(query); // Perform search
                displayResults(results); // Display results
                searchResultsContainer.style.display = 'block'; // Show results
            } else {
                searchResults.innerHTML = '';
                searchResultsContainer.style.display = 'none';
            }
        });
                // Show results container when typing
        searchInput.addEventListener('focus', () => {
            if (!lunrIndex) return; // Prevent searching if index is not ready
            const query = searchInput.value.trim();
            if (query.length > 0) {
                const results = performSearch(query); // Perform search
                displayResults(results); // Display results
                searchResultsContainer.style.display = 'block'; // Show results
            }
        });
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                searchResultsContainer.style.display = 'none';
            }
        });


        // Hide results when clicking outside


    }
});