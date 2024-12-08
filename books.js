document.addEventListener('DOMContentLoaded', function () {
    // Function to get a cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Function to set the authToken cookie
    function setCookie(name, value) {
        document.cookie = `${name}=${value}; path=/; max-age=3600`;
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

    // Fetch books from the backend
    const booksTableBody = document.getElementById('books-list');

    async function fetchBooks() {
        try {
            // Refresh the authToken from the cookie
            authToken = getCookie('authToken');
            const response = await fetch('http://127.0.0.1:8080/library/public/book/display', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            authToken = getCookie('authToken');

            const data = await response.json();

            if (data.status === 'success') {
                setCookie('authToken', data.token);
                // Populate books
                const books = data.data;
                booksTableBody.innerHTML = '';

                books.forEach(book => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${book.title}</td>
                        <td>
                            <button class="btn btn-outline-primary" onclick="editBook(${book.bookid})">Edit</button>
                            <button class="btn btn-outline-danger" onclick="deleteBook(${book.bookid}, '${book.title}')">Delete</button>

                        </td>
                    `;
                    booksTableBody.appendChild(row);
                });               
            } else {
                alert('Failed to fetch books: ' + data.data.title);
                window.location.href = 'http://127.0.0.1:8080/library-ui/users/authenticate.html';
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    fetchBooks();

    // Add Book button click event
    const addBookBtn = document.getElementById('add-book-btn');
    addBookBtn.addEventListener('click', function () {
        document.getElementById('addFormContainer').style.display = 'block';
        document.getElementById('updateFormContainer').style.display = 'none';
    });

    // Handle Add book form submission
    const addBookForm = document.getElementById('add-book-form');
    if (addBookForm) {
        addBookForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const title = document.getElementById('book-title').value;
        
            // Check if title is not empty
            if (!title) {
                alert('Book title is required!');
                return;
            }
        
            authToken = getCookie('authToken');
        
            try {
                const response = await fetch('http://127.0.0.1:8080/library/public/book/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        title: title,
                    }),
                });
        
                const data = await response.json();
        
                if (data.status === 'success') {
                    setCookie('authToken', data.token);
                    authToken = data.token;
                    
                    // Update table
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${title}</td>
                        <td>
                            <button class="btn btn-outline-primary" onclick="editBook(${data.newBookid})">Edit</button>
                            <button class="btn btn-outline-danger" onclick="deleteBook(${data.newBookid}, '${title}')">Delete</button>
                        </td>
                    `;
                    booksTableBody.appendChild(newRow);
                    addBookForm.reset();
                    alert('Book added successfully!');
                } else {
                    const errorMessage = data.data?.title || 'An unknown error occurred';
                    alert(`Failed to add author: ${errorMessage}`);
                }
                
            } catch (error) {
                console.error('Error adding book:', error);
                alert('Error adding book. Please try again later.');
            }
        });
        
    }

    // Global variable to store the current book being edited
let currentBookId = null;

// Function to show update form and populate with current book data
window.editBook = function(bookId) {
    currentBookId = bookId;
    
    const bookRow = document.querySelector(`tr:has(button[onclick="editBook(${bookId})"])`);
    const bookTitle = bookRow.cells[0].textContent;
    
    // Show update form and hide add form
    document.getElementById('updateFormContainer').style.display = 'block';
    document.getElementById('addFormContainer').style.display = 'none';
    
    // Populate the update form with current book name
    document.getElementById('update-book-title').value = bookTitle;
};

// Handle update form submission
const updateBookForm = document.getElementById('update-book-form');
if (updateBookForm) {
    updateBookForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const newTitle = document.getElementById('update-book-title').value;
        
        // Validate input
        if (!newTitle) {
            alert('Book title is required!');
            return;
        }
        
        // Get fresh auth token
        const authToken = getCookie('authToken');
        
        try {
            const response = await fetch('http://127.0.0.1:8080/library/public/book/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    bookid: currentBookId,
                    title: newTitle
                }),
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                setCookie('authToken', data.token);
                
                // Update the row in the table
                const bookRow = document.querySelector(`tr:has(button[onclick="editBook(${currentBookId})"])`);
                bookRow.innerHTML = `
                    <td>${newTitle}</td>
                    <td>
                        <button class="btn btn-outline-primary" onclick="editBook(${currentBookId})">Edit</button>
                        <button class="btn btn-outline-danger" onclick="deleteBook(${currentBookId}, '${newTitle}')">Delete</button>
                    </td>
                `;
                
                // Hide the update form
                document.getElementById('updateFormContainer').style.display = 'none';
                
                // Reset the form and clear the current Book ID
                updateBookForm.reset();
                currentBookId = null;
                
                alert('Book updated successfully!');
            } else {
                const errorMessage = data.data?.title || 'An unknown error occurred';
                    alert(`Failed to add author: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error updating Book:', error);
            alert('Error updating Book. Please try again later.');
        }
    });
}

    // Delete book function with confirmation
    window.deleteBook = async function(bookId, bookTitle) {
        const confirmation = confirm(`Are you sure you want to delete the book "${bookTitle}"?`);
        
        authToken = getCookie('authToken');

        if (confirmation) {
            try {
                const response = await fetch('http://127.0.0.1:8080/library/public/book/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        bookid: bookId,
                    }),
                });

                const data = await response.json();

                if (data.status === 'success') {
                    setCookie('authToken', data.token);

                    // Remove the book row from the table
                    const row = document.querySelector(`#books-list tr[data-bookid="${bookId}"]`);
                    if (row) {
                        row.remove();
                    }
                    alert('Book deleted successfully!');
                    fetchBooks();
                } else {
                    alert('Failed to delete book: ' + data.data.title);
                }

            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Error deleting book. Please try again later.');
            }
        }
    };
});