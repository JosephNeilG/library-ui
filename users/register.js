document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmPasswordError = document.getElementById('confirmPasswordError'); // error message element
    const usernameError = document.getElementById('registerUsername').nextElementSibling; // username error element
    const passwordError = document.getElementById('registerPassword').nextElementSibling; // password error element

    // Clear previous error messages
    confirmPasswordError.textContent = ''; 
    usernameError.textContent = ''; 
    passwordError.textContent = ''; 

    // Remove invalid classes
    document.getElementById('confirmPassword').classList.remove('is-invalid');
    document.getElementById('registerUsername').classList.remove('is-invalid');
    document.getElementById('registerPassword').classList.remove('is-invalid');

    // Validate username and password fields are not empty
    if (!username) {
        usernameError.textContent = 'Please provide a username.';
        document.getElementById('registerUsername').classList.add('is-invalid');
        return;
    }

    if (!password) {
        passwordError.textContent = 'Please provide a password.';
        document.getElementById('registerPassword').classList.add('is-invalid');
        return;
    }

    // Validate password match
    if (password !== confirmPassword) {
        confirmPasswordError.textContent = 'Passwords do not match.';
        confirmPasswordError.style.color = 'red';
        document.getElementById('confirmPassword').classList.add('is-invalid');
        return;
    }

    const data = {
        username: username,
        password: password
    };

    // Send the data to the backend API using fetch
    fetch('http://127.0.0.1:8080/library/public/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Registration successful! You can now log in.');
            window.location.href = 'http://127.0.0.1:8080/library-ui/users/authenticate.html';
        } else {
            if (data.data && data.data.title === 'Username already taken') {
                usernameError.textContent = 'That username is taken. Try another.';
                document.getElementById('registerUsername').classList.add('is-invalid');
            } else {
                alert('Error: ' + data.data.title);
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while registering. Please try again later.');
    });
});