export interface User {
  id: number;
  email: string;
  role: string;
  credits: number;
}

export interface Activity {
  id: number;
  user_id: number;
  activity: string;
  timestamp: string;
  user: {
    email: string;
  };
}

const AUTH_API_URL = "https://optimaizer-api.onrender.com/graphql/auth";
const ACTIVITY_API_URL = "https://optimaizer-api.onrender.com/graphql/activity";

// Generic fetch function for auth
async function graphqlAuthRequest<T>(
  query: string,
  variables?: Record<string, any>,
  token?: string
): Promise<T> {
  const response = await fetch(AUTH_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  if (!response.ok)
    throw new Error(result?.errors?.[0]?.message || "Network error");
  if (result.errors) throw new Error(result.errors[0].message);
  return result.data as T;
}

// Generic fetch function for activity
async function graphqlActivityRequest<T>(
  query: string,
  variables?: Record<string, any>,
  token?: string
): Promise<T> {
  const response = await fetch(ACTIVITY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  if (!response.ok)
    throw new Error(result?.errors?.[0]?.message || "Network error");
  if (result.errors) throw new Error(result.errors[0].message);
  return result.data as T;
}

// AUTH FUNCTIONS
export async function login(email: string, password: string): Promise<string> {
  const query = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password)
    }
  `;
  const data = await graphqlAuthRequest<{ login: string }>(query, {
    email,
    password,
  });
  if (!data.login) throw new Error("Login failed: No token returned");
  return data.login;
}

export async function register(email: string, password: string): Promise<User> {
  const query = `
    mutation Register($email: String!, $password: String!) {
      register(email: $email, password: $password) {
        id
        email
        role
        credits
      }
    }
  `;
  const data = await graphqlAuthRequest<{ register: User }>(query, {
    email,
    password,
  });
  if (!data.register)
    throw new Error("Registration failed: No user data returned");
  return data.register;
}

export async function getMe(token: string): Promise<User> {
  const query = `
    query {
      me {
        id
        email
        role
        credits
      }
    }
  `;
  const data = await graphqlAuthRequest<{ me: User }>(query, undefined, token);
  if (!data.me) throw new Error("Failed to fetch user data");
  return data.me;
}

// ACTIVITY FUNCTIONS
export async function getActivities(token: string): Promise<Activity[]> {
  const query = `
    query {
      activities {
        id
        user_id
        activity
        timestamp
        user {
          email
        }
      }
    }
  `;
  const data = await graphqlActivityRequest<{ activities: Activity[] }>(
    query,
    undefined,
    token
  );
  if (!data.activities) return [];
  return data.activities;
}

export async function createActivity(
  token: string,
  activity: string
): Promise<Activity> {
  const query = `
    mutation CreateActivity($activity: String!) {
      create_activity(activity: $activity) {
        id
        user_id
        activity
        timestamp
        user {
          email
        }
      }
    }
  `;
  const data = await graphqlActivityRequest<{ create_activity: Activity }>(
    query,
    { activity },
    token
  );
  if (!data.create_activity) throw new Error("Failed to create activity");
  return data.create_activity;
}

export async function updateActivity(
  token: string,
  id: number,
  activity: string
): Promise<Activity> {
  const query = `
    mutation UpdateActivity($id: Int!, $activity: String!) {
      update_activity(id: $id, activity: $activity) {
        id
        user_id
        activity
        timestamp
        user {
          email
        }
      }
    }
  `;
  const data = await graphqlActivityRequest<{ update_activity: Activity }>(
    query,
    { id, activity },
    token
  );
  if (!data.update_activity) throw new Error("Failed to update activity");
  return data.update_activity;
}

export async function deleteActivity(token: string, id: number): Promise<void> {
  const query = `
    mutation DeleteActivity($id: Int!) {
      delete_activity(id: $id) {
        success
      }
    }
  `;
  const data = await graphqlActivityRequest<{
    delete_activity: { success: boolean };
  }>(query, { id }, token);
  if (!data.delete_activity?.success)
    throw new Error("Failed to delete activity");
}
