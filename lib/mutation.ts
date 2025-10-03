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

// Single GraphQL endpoint
const GRAPHQL_API_URL = "https://optimaizer-api.onrender.com/graphql";

// Generic fetch function
async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, any>,
  token?: string
): Promise<T> {
  const response = await fetch(GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return data;
}

// AUTH FUNCTIONS
export async function login(email: string, password: string): Promise<string> {
  const query = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password)
    }
  `;
  const data = await graphqlRequest<{ login: string }>(query, {
    email,
    password,
  });
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
  const data = await graphqlRequest<{ register: User }>(query, {
    email,
    password,
  });
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
  const data = await graphqlRequest<{ me: User }>(query, undefined, token);
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
  const data = await graphqlRequest<{ activities: Activity[] }>(
    query,
    undefined,
    token
  );
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
  const data = await graphqlRequest<{ create_activity: Activity }>(
    query,
    { activity },
    token
  );
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
  const data = await graphqlRequest<{ update_activity: Activity }>(
    query,
    { id, activity },
    token
  );
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
  const data = await graphqlRequest<{ delete_activity: { success: boolean } }>(
    query,
    { id },
    token
  );
  if (!data.delete_activity.success)
    throw new Error("Failed to delete activity");
}
