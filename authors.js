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

    // Fetch authors
    const authorsTableBody = document.getElementById('authors-list');

    async function fetchAuthors() {
        try {
            // Refresh the authToken from the cookie
            authToken = getCookie('authToken');

            const response = await fetch('http://127.0.0.1:8080/library/public/author/display', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            authToken = getCookie('authToken');

            const data = await response.json();

            if (data.status === 'success') {
                setCookie('authToken', data.token);
                // Populate authors in the table
                const authors = data.data;
                authorsTableBody.innerHTML = '';

                authors.forEach(author => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${author.name}</td>
                        <td>
                            <button class="btn btn-outline-primary" onclick="editAuthor(${author.authorid})">Edit</button>
                            <button class="btn btn-outline-danger" onclick="deleteAuthor(${author.authorid}, '${author.name}')">Delete</button>
                        </td>
                    `;
                    authorsTableBody.appendChild(row);
                });

            } else {
                alert('Failed to fetch authors: ' + data.data.title);
                window.location.href = 'http://127.0.0.1:8080/library-ui/users/authenticate.html';
            }
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    }

    fetchAuthors();

    // Add Author button click event
    const addAuthorBtn = document.getElementById('add-author-btn');
    addAuthorBtn.addEventListener('click', function () {
        document.getElementById('addFormContainer').style.display = 'block';
        document.getElementById('updateFormContainer').style.display = 'none';
    });

    // Handle Add Author form submission
    const addAuthorForm = document.getElementById('add-author-form');
    if (addAuthorForm) {
        addAuthorForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const name = document.getElementById('author-name').value;
        
            // Check if name is not empty
            if (!name) {
                alert('Author name is required!');
                return;
            }
        
            authToken = getCookie('authToken');
        
            try {
                const response = await fetch('http://127.0.0.1:8080/library/public/author/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        name: name,
                    }),
                });
        
                const data = await response.json();
        
                if (data.status === 'success') {
                    setCookie('authToken', data.token);
                    authToken = data.token;
                    
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${name}</td>
                        <td>
                            <button class="btn btn-outline-primary" onclick="editAuthor(${data.authorid})">Edit</button>
                            <button class="btn btn-outline-danger" onclick="deleteAuthor(${data.authorid}, '${name}')">Delete</button>
                        </td>
                    `;
                    authorsTableBody.appendChild(newRow);
                    addAuthorForm.reset(); 
                    alert('Author added successfully!');
                } else {
                    alert('Failed to add author: ' + data.message);
                }
                
            } catch (error) {
                console.error('Error adding author:', error);
                alert('Error adding author. Please try again later.');
            }
        });
        
    }

// Global variable to store the current author being edited
let currentAuthorId = null;

// Function to show update form and populate with current author data
window.editAuthor = function(authorId) {
    currentAuthorId = authorId;
    
    const authorRow = document.querySelector(`tr:has(button[onclick="editAuthor(${authorId})"])`);
    const authorName = authorRow.cells[0].textContent;
    
    // Show update form and hide add form
    document.getElementById('updateFormContainer').style.display = 'block';
    document.getElementById('addFormContainer').style.display = 'none';
    
    // Populate the update form with current author name
    document.getElementById('update-author-name').value = authorName;
};

// Handle update form submission
const updateAuthorForm = document.getElementById('update-author-form');
if (updateAuthorForm) {
    updateAuthorForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const newName = document.getElementById('update-author-name').value;
        
        // Validate input
        if (!newName) {
            alert('Author name is required!');
            return;
        }
        
        // Get fresh auth token
        const authToken = getCookie('authToken');
        
        try {
            const response = await fetch('http://127.0.0.1:8080/library/public/author/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    authorid: currentAuthorId,
                    name: newName
                }),
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                // Update the token
                setCookie('authToken', data.token);
                
                // Update the row in the table
                const authorRow = document.querySelector(`tr:has(button[onclick="editAuthor(${currentAuthorId})"])`);
                authorRow.innerHTML = `
                    <td>${newName}</td>
                    <td>
                        <button class="btn btn-outline-primary" onclick="editAuthor(${currentAuthorId})">Edit</button>
                        <button class="btn btn-outline-danger" onclick="deleteAuthor(${currentAuthorId}, '${newName}')">Delete</button>
                    </td>
                `;
                
                // Hide the update form
                document.getElementById('updateFormContainer').style.display = 'none';
                
                // Reset the form and clear the current author ID
                updateAuthorForm.reset();
                currentAuthorId = null;
                
                alert('Author updated successfully!');
            } else {
                alert('Failed to update author: ' + (data.data?.title || data.message));
            }
        } catch (error) {
            console.error('Error updating author:', error);
            alert('Error updating author. Please try again later.');
        }
    });
}

    // Delete book function with confirmation
    window.deleteAuthor = async function(authorId, authorName) {
        const confirmation = confirm(`Are you sure you want to delete the author "${authorName}"?`);
        
        authToken = getCookie('authToken');

        if (confirmation) {
            try {
                const response = await fetch('http://127.0.0.1:8080/library/public/author/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        authorid: authorId,
                    }),
                });

                const data = await response.json();

                if (data.status === 'success') {
                    setCookie('authToken', data.token);

                    // Remove the book row from the table
                    const row = document.querySelector(`#authors-list tr[data-authorid="${authorId}"]`);
                    if (row) {
                        row.remove();
                    }
                    alert('Author deleted successfully!');
                    fetchAuthors();
                } else {
                    alert('Failed to delete author: ' + data.data.title);
                }

            } catch (error) {
                console.error('Error deleting author:', error);
                alert('Error deleting author. Please try again later.');
            }
        }
    };
});