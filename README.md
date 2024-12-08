<h1 id="library-management-ui">Library Management System User Interface</h1>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
    <a href="#about">About The Project</a>
    </li>
    <li>
    <a href="#tech-used">Technologies Used</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#features">Features</a></li>
      </ul>
    </li>
    <li><a href="#setup">Setup Instructions</a></li>
    <li><a href="#system-walkthrough">System Walkthrough</a>
        <ul>
        <li><a href="#homepage">Homepage</a></li>
        <li><a href="#register">Register</a></li>
        <li><a href="#login">Login</a></li>
        <li><a href="#authors">Authors</a></li>
        <li><a href="#books">Books</a></li>
        <li><a href="#author-books">Author-Books Association</a></li>
        <li><a href="#manage-account">Manage Account</a></li>
      </ul>
    </li>
    <li><a href="#cookiemanagement">Cookie Management</a></li>
    <li><a href="#collaborators">Collaborators</a></li>
    <li><a href="#project-information">Project Information</a></li>
  </ol>
</details>

<h2 id="about">About the Project</h2>

A user-friendly web interface built using HTML, CSS, Bootstrap 5.3, and JavaScript that interacts with a backend [Library Management System API](https://github.com/JosephNeilG/library_4a) made with the Slim PHP framework. This interface allows users to view, add, and manage books and authors seamlessly.

<p align="right">(<a href="#library-management-ui">back to top</a>)</p>

<h2 id="tech-used">Technologies Used</h2>

### Frontend:
- HTML 
- CSS (for styling and layout)
- Bootstrap 5.3 (for responsive design and UI components)
- JavaScript (for dynamic content and API interaction)

### Backend:
- Slim PHP framework
- MySQL

<p align="right">(<a href="#library-management-ui">back to top</a>)</p>

## Getting Started

### Features

**Users** 
- register
- authenticate
- display
- update
- delete

**Author**
- add
- display
- update
- delete

**Books**
- add
- display
- update
- delete

**Author-Books**
- add 
- display 
- update (not implemented)
- delete 

<p align="right">(<a href="#library-management-ui">back to top</a>)</p>

<h2 id="setup">Setup Instructions</h2>
Follow these steps to set up and run the Library UI and its API on your local machine.

### Clone the Repositories

1. **Clone the Library UI repository:**

   ```bash
   git clone https://github.com/github_username/library-ui.git
   cd library-ui
   ```

2. **Clone the Library API repository in a separate directory:**

    ```bash
    git clone https://github.com/github_username/library-api.git
    cd library-api
    ```

### Set Up the API

1. **Navigate to the API directory and install dependencies using Composer:**

    ```bash
    cd library-api
    composer install
    ```

2. **Configure Database Connection in index.php:**

    ```php
   <?php
   $servername = "localhost";
   $username = "root";
   $password = "password";
   $dbname = "library";
   ?>
   ```

### Set Up the UI

1. **Navigate to the Library UI directory:**

    ```bash
    cd library-ui
    ```

2. **Open every HTML and JavaScript file, and look for lines containing links like this:**

    ```bash
    http://127.0.0.1:8080/library/public/user/register
    ```

    Ensure these URLs match the base URL used by your API server.

3. **Launch the UI:**
Open the `http://127.0.0.1:8080/library-ui/index.html` file in your browser.

<p align="right">(<a href="#library-management-ui">back to top</a>)</p>

## System Walkthrough

<h3 id="homepage">Homepage</h3>

![Homepage](https://github.com/JosephNeilG/library-ui/blob/6a828bc4fdf977cb924ae32771135d0852af049f/img/new%20homepage.png)

- This is the home page. It has a clear navigation bar with choices for Books, Authors, and Author-Books, as well as a login button for users to access.

<h3 id="register">Register</h3>

![Register](https://github.com/JosephNeilG/library-ui/blob/f668f81cad0a97c8b71a2f80cabf821daba99f3a/img/Register.png)

- This is the registration page, allowing users to create an account by providing a username, password, and confirmation password.

<h3 id="login">Login</h3>

![Login](https://github.com/JosephNeilG/library-ui/blob/4590e189ef7c35a845ff7c560589d689900cdc28/img/Authenticate%20or%20Login.png)

- This is the login page, where users can enter their username and password to access their account.

<h3 id="authors">Authors</h3>

![Authors](https://github.com/JosephNeilG/library-ui/blob/2bdbfa7427904e0546d6f88815c311f9f4458e48/img/Authors.png)

- This is the manage authors page, which allows users to add, edit/update, and delete author information.

<h3 id="books">Books</h3>

![Books](https://github.com/JosephNeilG/library-ui/blob/2bdbfa7427904e0546d6f88815c311f9f4458e48/img/Books.png)

- This is the manage books page, which allows users to add, edit/update, and delete book information.

<h3 id="author-books">Author-Books Association</h3>

![Author-Books Association](https://github.com/JosephNeilG/library-ui/blob/8ccd02cfc5ff31b3632d3f96d993bd3d38ec41b1/img/Author-books.png)

- This is the Author-Books Association page, which manages authors, books, and their associations, with options to add, edit, or delete records. It also provides reference lists of authors and books for easy management.

<h3 id="manage-account">Manage Account</h3>

![Manage Account](https://github.com/JosephNeilG/library-ui/blob/8ccd02cfc5ff31b3632d3f96d993bd3d38ec41b1/img/Manage-accounts.png)

- This is the Manage Accounts Page, which manages user accounts, allowing users to update their credentials or delete their accounts. It includes a user list for easy reference and management.

<p align="right">(<a href="#library-management-ui">back to top</a>)</p>

<h2 id="cookiemanagement">Cookie Management</h2>
These utility functions are responsible for managing cookies, specifically for retrieving and setting cookies in the browser. They are essential for handling user session tokens and maintaining state across web application requests.

<h3 id="getcookie">getCookie(name)</h3>

```php
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) return parts.pop().split(';').shift();
    }
```
This function retrieves the value of a specified cookie by its name. It parses the document.cookie string to locate the desired cookie and returns its value. If the cookie does not exist, it returns undefined.

**Parameters:**
- **name (string):** The name of the cookie to retrieve.

<h3 id="setcookie">setCookie(name, value)</h3>

```php
    function setCookie(name, value) {
        document.cookie = `${name}=${value}; path=/; max-age=3600`;
    }
```
This function sets a cookie with the provided name and value. The cookie is configured to expire in 1 hour (max-age=3600) and is available across the entire application path.

**Parameters:**
- **name (string):** The name of the cookie to set.
- **value (string):** The value to store in the cookie.

<p align="right">(<a href="#library-management-ui">back to top</a>)</p>

<h2 id="collaborators">Collaborators</h2>

- [Kyle D. De Jesus](https://github.com/KyleDDJ)
- [Erbin James Derek A. Orodio](https://github.com/ErbinJames)

If you have a suggestion that would make this better, please fork the repo and create a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#library-management-ui">back to top</a>)</p>

## Project Information

This project is developed as part of a final term school requirement for ITPC 115. It is aimed at demonstrating knowledge and skills in building secure web applications by integrating API endpoints with front-end UI, while also managing token-based authentication and cookie handling.

<p align="right">(<a href="#library-management-ui">back to top</a>)</p>
