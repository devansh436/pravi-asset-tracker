// scripts/get-test-token.js
const API_KEY = process.env.FIREBASE_API_KEY;

const response = await fetch(
  `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "test@example.com",
      password: "Test123456!",
      returnSecureToken: true,
    }),
  }
);

const data = await response.json();

if (!response.ok) {
  console.error(data);
  process.exit(1);
}

console.log("ID TOKEN:");
console.log(data.idToken);