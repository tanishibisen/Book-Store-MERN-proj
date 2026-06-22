const baseUrl = 'http://localhost:5000/api';

async function runTests() {
  try {
    console.log("1. Registering user...");
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: 'testuser123', 
        email: 'test@example.com', 
        password: 'password123', 
        location: { type: 'Point', coordinates: [-73.935242, 40.730610] } 
      })
    });
    let authData = await regRes.json();
    console.log("Register Response:", authData);
    
    if (authData.message === "User already exists") {
        console.log("User already exists, logging in instead...");
        const loginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
        });
        authData = await loginRes.json();
        console.log("Login Response:", authData);
    }
    console.log("Token received:", authData.token ? "Yes" : "No");
    const token = authData.token;

    console.log("\n2. Adding a book...");
    const bookRes = await fetch(`${baseUrl}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ 
        title: 'The Great Gatsby', 
        author: 'F. Scott Fitzgerald', 
        condition: 'Good', 
        description: 'A classic novel.' 
      })
    });
    const bookData = await bookRes.json();
    console.log("Book added:", bookData._id ? "Success" : bookData);

    console.log("\n3. Fetching books (Geolocation matching)...");
    const fetchRes = await fetch(`${baseUrl}/books?lng=-73.935242&lat=40.730610&radius=10`);
    const fetchBooksData = await fetchRes.json();
    console.log("Books found nearby:", fetchBooksData.length);

    console.log("\nAll tests completed!");
  } catch (err) {
    console.error("Test failed:", err);
  }
}

runTests();
