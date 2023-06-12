// src/app.js

import { Auth, getUser } from "./auth";
import { getUserFragments, getUserFragment, postUserFragments } from "./api";

async function init() {
  // Get our UI elements
  const userSection = document.querySelector("#user");
  const loginBtn = document.querySelector("#login");
  const logoutBtn = document.querySelector("#logout");
  const getFragmentsBtn = document.querySelector("#getFragments");
  const getFragmentByIdBtn = document.querySelector("#getFragmentById");
  const fragmentsList = document.querySelector("#fragmentsList");
  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  getFragmentsBtn.onclick = async () => {
    const user = await getUser();
    const fragments = await getUserFragments(user);
    displayFragments(fragments);
  };

  getFragmentByIdBtn.onclick = async () => {
    const user = await getUser();
    const fragmentId = document.getElementById("fragmentId").value;
    const fragment = await getUserFragment(user, fragmentId);
    displayFragments([fragment]);
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector(".username").innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;
  getUserFragments(user);
}

function displayFragments(fragments) {
  const fragmentsList = document.querySelector("#fragmentsList");

  fragmentsList.innerHTML = "";

  fragments.forEach((fragment) => {
    const li = document.createElement("li");
    li.textContent = `ID: ${fragment.id} | Size: ${fragment.size} | Type: ${fragment.type}`;
    fragmentsList.appendChild(li);
  });
}

const form = document.getElementById("postForm");
form.addEventListener("submit", submit);

async function submit(event) {
  event.preventDefault();
  let newFragment;
  const user = await getUser();

  const type = document.getElementById("type").value;
  const content = document.getElementById("content").value;

  if (content.length !== 0) {
    newFragment = content;
  }

  postUserFragments(user, newFragment, type);
}

// Wait for the DOM to be ready, then start the app
addEventListener("DOMContentLoaded", init);
