const API_URL = "https://optimaizer-api.onrender.com/graphql";

export interface User {
  id: number;
  email: string;
  role: string;
  credits: number;
}

export async function register(email: string, password: string): Promise<User> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation {
          register(email: "${email}", password: "${password}") {
            id
            email
            role
            credits
          }
        }
      `,
    }),
  });

  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return data.register; // directly the UserType
}

export async function login(
  email: string,
  password: string
): Promise<{ token: string }> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation {
          login(email: "${email}", password: "${password}")
        }
      `,
    }),
  });

  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return { token: data.login }; // login returns token string only
}

export async function getMe(token: string): Promise<User> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        query {
          me {
            id
            email
            role
            credits
          }
        }
      `,
    }),
  });

  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return data.me;
}
