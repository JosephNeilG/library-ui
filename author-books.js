document.addEventListener('DOMContentLoaded', function () {
    // Function to get a cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Function to set the authToken cookie
    function setCookie(name, value) {
        document.cookie = `${name}=${value}; path=/; max-age=3600`; // Set for 1 hour
    }

    // Check if user is logged in by looking for authToken cookie
    let authToken = getCookie('authToken');
    const loggedInMenu = document.getElementById('loggedIn');
    const loggedOutMenu = document.getElementById('loggedOut');

    if (authToken) {
        loggedInMenu.classList.remove('d-none');
        loggedOutMenu.classList.add('d-none');
    } else {
        loggedInMenu.classList.add('d-none');
        loggedOutMenu.classList.remove('d-none');
    }

    // Logout functionality
    const logoutButton = document.querySelector('#loggedIn a[href="logout.html"]');
    if (logoutButton) {
        logoutButton.addEventListener('click', function (e) {
            e.preventDefault();
            // Clear the authToken cookie on logout
            document.cookie = 'authToken=; Max-Age=-99999999; path=/';
            window.location.href = 'http://127.0.0.1:8080/library-ui/index.html';
        });
    }

    // Select the table bodies
    const authorsTableBody = document.getElementById('authorsTableBody');
    const booksTableBody = document.getElementById('booksTableBody');
    const authorBookTableBody = document.getElementById('authorBookTableBody');

    async function fetchAllData(authToken) {
        try {
            const response = await fetch('http://127.0.0.1:8080/library/public/dashboard/data', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            const data = await response.json();

            if (data.status === 'success') {
                setCookie('authToken', data.token);
                const { authors, books, bookAuthors } = data.data;

                // authors data and update the table
                authorsTableBody.innerHTML = '';
                authors.forEach(author => {
                    const row = document.createElement('tr');
                    row.setAttribute('data-authorid', author.authorid);
                    row.innerHTML = `<td>${author.authorid}</td><td>${author.name}</td>`;
                    authorsTableBody.appendChild(row);
                });

                // books data and update the table
                booksTableBody.innerHTML = '';
                books.forEach(book => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${book.bookid}</td><td>${book.title}</td>`;
                    booksTableBody.appendChild(row);
                });

                // book-authors relationship and update the table
                authorBookTableBody.innerHTML = '';
                bookAuthors.forEach(entry => {
                    const row = document.createElement('tr');
                    row.setAttribute('data-collectionid', entry.collectionid);
                    row.innerHTML = `
                        <td>${entry.author_name}</td>
                        <td>${entry.book_name}</td>
                        <td>
                            <button class="btn btn-outline-primary">Edit</button>
                            <button class="btn btn-outline-danger">Delete</button>
                        </td>
                    `;
                    authorBookTableBody.appendChild(row);
                });
            } else {
                alert('Failed to fetch data: ' + data.message);
            }
        } catch (error) {
            console.error('Error fetching all data:', error);
        }
    }

    // Add Author button click event
    const addAssociationBtn = document.getElementById('add-author-book-btn');
    addAssociationBtn.addEventListener('click', function () {
        document.getElementById('addAssociationFormContainer').style.display = 'block';
    });

    // Handle Add Author form submission
    const addAssociationForm = document.getElementById('add-author-book-form');
    if (addAssociationForm) {
        addAssociationForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const authorId = document.getElementById('author-id').value;
            const bookId = document.getElementById('book-id').value;

            // Refresh the authToken from the cookie
            let authToken = getCookie('authToken');

            try {
                const response = await fetch('http://127.0.0.1:8080/library/public/books_author/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        authorid: authorId,
                        bookid: bookId
                    }),
                });

                const data = await response.json();

                if (data.status === 'success') {
                    // Save the new token
                    setCookie('authToken', data.token);
                    authToken = data.token;

                    await fetchAllData(authToken);
                    addAssociationForm.reset();
                    alert('Author-book added successfully!');
                } else {
                    alert('Failed to add association: ' + (data.data.title || data.message));
                }

            } catch (error) {
                console.error('Error adding association:', error);
                alert('Error adding association. Please try again later.');
            }
        });
    }
    fetchAllData(authToken);
});