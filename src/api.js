// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || "http://localhost:8080";

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log("Requesting user fragments data...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user fragments data", { data });
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

export async function getUserFragment(user, id) {
  console.log("Requesting user fragment data...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return await res.blob();
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

export async function postUserFragments(user, fragment, type) {
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      headers: {
        "Content-Type": type,
        Authorization: `Bearer ${user.idToken}`,
      },
      body: type == "application/json" ? JSON.stringify(fragment) : fragment,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    await res.json();
  } catch (err) {
    console.error("Unable to call POST /v1/fragment", { err });
  }
}
