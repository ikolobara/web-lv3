let allMovies = [];
let cart = [];

document.addEventListener("DOMContentLoaded", () => {

    // LOAD CSV
    fetch("movies.csv")
        .then(res => res.text())
        .then(csv => {
            const rezultat = Papa.parse(csv, {
                header: true,
                skipEmptyLines: true
            });

            allMovies = rezultat.data.map(row => ({
                title: row.Naslov,
                genre: row.Zanr,
                year: parseInt(row.Godina),
                duration: row.Trajanje_min,
                rating: parseFloat(row.Ocjena),
                director: row.Rezisery,
                country: row.Zemlja_porijekla
            }));

            populateGenres();
            renderTable(allMovies);
        });

    // SLIDER DISPLAY
    const slider = document.getElementById("ratingFilter");
    const output = document.getElementById("ratingValue");

    if (slider && output) {
        slider.addEventListener("input", () => {
            output.textContent = slider.value;
        });
    }

    // FILTER BUTTON
    const filterBtn = document.getElementById("filterBtn");
    if (filterBtn) {
        filterBtn.addEventListener("click", applyFilters);
    }

    // CONFIRM CART
    const confirmBtn = document.getElementById("confirmBtn");
    if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
            const n = cart.length;

            let msg;

            if (n === 0){
                alert("Košarica je prazna!")
                return;
            } else if (n === 1) {
                msg = `Uspješno ste posudili 1 film!`;
            } else if (n >= 2 && n <= 4) {
                msg = `Uspješno ste posudili ${n} filma!`;
            } else {
                msg = `Uspješno ste posudili ${n} filmova!`;
            }

            alert(msg);

            cart = [];
            renderCart();
        });
    }
});


// POPULATE GENRES
function populateGenres() {
    const select = document.getElementById("genreFilter");
    if (!select) return;

    const genres = new Set();

    allMovies.forEach(m => {
        m.genre.split(",").forEach(g => genres.add(g.trim()));
    });

    genres.forEach(g => {
        const option = document.createElement("option");
        option.value = g;
        option.textContent = g;
        select.appendChild(option);
    });
}


// RENDER TABLE
function renderTable(movies) {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    movies.forEach(movie => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${movie.title}</td>
            <td>${movie.year}</td>
            <td>${movie.duration}</td>
            <td>${movie.genre}</td>
            <td>${movie.rating}</td>
            <td><button class="add-btn">Dodaj u košaricu</button></td>
        `;

        tr.querySelector(".add-btn").addEventListener("click", () => {
            addToCart(movie);
        });

        tbody.appendChild(tr);
    });
}


// FILTERS
function applyFilters() {

    const genre = document.getElementById("genreFilter")?.value || "";
    const year = parseInt(document.getElementById("yearFilter")?.value);
    const country = document.getElementById("countryFilter")?.value.toLowerCase() || "";
    const rating = parseFloat(document.getElementById("ratingFilter")?.value || 0);

    const filtered = allMovies.filter(m => {

        const genreMatch = !genre || m.genre.includes(genre);
        const yearMatch = !year || m.year >= year;
        const countryMatch = !country || m.country.toLowerCase().includes(country);
        const ratingMatch = m.rating >= rating;

        return genreMatch && yearMatch && countryMatch && ratingMatch;
    });

    renderTable(filtered);
}


// CART ADD
function addToCart(movie) {
    if (!movie) return;

    const exists = cart.some(m => m.title === movie.title);

    if (exists) {
        alert("Film je već u košarici!");
        return;
    }

    cart.push(movie);
    renderCart();
}


// CART REMOVE
function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}


// CART RENDER
function renderCart() {
    const cartDiv = document.getElementById("cartItems");
    if (!cartDiv) return;

    cartDiv.innerHTML = "";

    cart.forEach((movie, index) => {

        if (!movie) return;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <strong>${movie.title}</strong><br>
            ${movie.year} - ${movie.genre}
            <button onclick="removeFromCart(${index})">Ukloni</button>
            `;

        cartDiv.appendChild(div);
    });
}