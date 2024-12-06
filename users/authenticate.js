document.getElementById('signInForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('signInUsername').value;
    const password = document.getElementById('signInPassword').value;
    const signInUsernameError = document.getElementById('signInUsername').nextElementSibling;
    const signInPasswordError = document.getElementById('signInPassword').nextElementSibling;

    // Clear previous error messages
    signInUsernameError.textContent = '';
    signInPasswordError.textContent = '';
    
    // Remove invalid class
    document.getElementById('signInUsername').classList.remove('is-invalid');
    document.getElementById('signInPassword').classList.remove('is-invalid');

    // Validate username and password
    if (!username) {
        signInUsernameError.textContent = 'Please provide a username.';
        document.getElementById('signInUsername').classList.add('is-invalid');
        return;
    }
    if (!password) {
        signInPasswordError.textContent = 'Please provide a password.';
        document.getElementById('signInPassword').classList.add('is-invalid');
        return;
    }

    const data = {
        username: username,
        password: password
    };

    // Send the data to the backend API using fetch
    fetch('http://127.0.0.1:8080/library/public/user/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Login successful!');
            
            // Store token in cookies with a 1-hour expiration
            document.cookie = `authToken=${data.token}; path=/; max-age=3600; secure; samesite=strict`;
            
            window.location.href = 'http://127.0.0.1:8080/library-ui/index.html'; 
        } else {
            alert('Error: ' + data.data.title);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while logging in. Please try again later.');
    });
});