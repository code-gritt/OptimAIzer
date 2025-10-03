const API_URL = "https://optimaizer-api.onrender.com/graphql";

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

export async function getActivities(token: string): Promise<Activity[]> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
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
      `,
    }),
  });
  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return data.activities;
}

export async function createActivity(
  token: string,
  activity: string
): Promise<Activity> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
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
      `,
      variables: { activity },
    }),
  });
  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return data.create_activity;
}

export async function updateActivity(
  token: string,
  id: number,
  activity: string
): Promise<Activity> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
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
      `,
      variables: { id, activity },
    }),
  });
  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return data.update_activity;
}

export async function deleteActivity(token: string, id: number): Promise<void> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        mutation DeleteActivity($id: Int!) {
          delete_activity(id: $id) {
            success
          }
        }
      `,
      variables: { id },
    }),
  });
  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  if (!data.delete_activity.success)
    throw new Error("Failed to delete activity");
}
