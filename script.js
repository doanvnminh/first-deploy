const API_URL = 'https://my-first-login-api.onrender.com';

function getInfo() {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;
    return { username, password };
}

const reg_btn = document.getElementById('registerBtn');
if (reg_btn) {
    reg_btn.addEventListener('click', async () => {
        const { username, password } = getInfo();

        if (!username || !password) return alert("Please fill in");

        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        alert(data.message);
    });
}


const log_btn = document.getElementById('loginBtn');
if (log_btn) {
    log_btn.addEventListener('click', async () => {
        const { username, password } = getInfo();

        console.log("Username is:", username);
        console.log("Password is:", password);

        if (!username || !password) return alert("Please fill in");

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Login Successful! Welcome" + data.username);
        } else {
            alert("Login Failed: " + data.message);
        }
    });
}

