// src/app.js

import { getUser, login, logout } from "./auth";
import {
  getUserFragments,
  getUserFragment,
  postUserFragments,
  deleteUserFragment,
  updateUserFragments,
} from "./api";

async function init() {
  // Get our UI elements
  const userSection = document.querySelector("#user");
  const loginBtn = document.querySelector("#login");
  const logoutBtn = document.querySelector("#logout");
  const getFragmentsBtn = document.querySelector("#getFragments");
  const getFragmentByIdBtn = document.querySelector("#getFragmentById");
  const fragmentsList = document.querySelector("#fragmentsList");
  const deleteFragment = document.querySelector("#deleteFragmentById");
  const updateFragment = document.querySelector("#updateFragmentById");
  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = login;
  logoutBtn.onclick = logout;

  getFragmentsBtn.onclick = async () => {
    const user = await getUser();
    const fragments = await getUserFragments(user);
    displayFragments(fragments);
  };

  getFragmentByIdBtn.onclick = async () => {
    const user = await getUser();
    const fragmentId = document.getElementById("fragmentId").value;
    const fragment = await getUserFragment(user, fragmentId);
    await displayFragment(fragment);
  };

  deleteFragment.onclick = async () => {
    const user = await getUser();
    const fragmentId = document.getElementById("deleteId").value;
    await deleteUserFragment(user, fragmentId);
    const fragments = await getUserFragments(user);
    displayFragments(fragments);
  };

  updateFragment.onclick = async () => {
    const user = await getUser();
    const fragmentId = document.getElementById("updateId").value;
    const fragmentData = document.getElementById("updateData").value;
    const fragment = await getUserFragment(user, fragmentId);
    await updateUserFragments(user, fragmentData, fragmentId, fragment.type);
    const fragments = await getUserFragments(user);
    displayFragments(fragments);
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

  fragments.forEach(async (fragment) => {
    const li = document.createElement("li");
    li.textContent = `ID: ${fragment.id} Size: ${fragment.size} | Type: ${fragment.type}`;
    fragmentsList.appendChild(li);
  });
}

async function displayFragment(fragment) {
  const fragmentsList = document.querySelector("#fragmentsList");

  fragmentsList.innerHTML = "";

  const li = document.createElement("li");
  li.textContent = `Size: ${fragment.size} | Type: ${
    fragment.type
  } | Body: ${await fragment.text()}`;
  fragmentsList.appendChild(li);
}

const postForm = document.getElementById("postForm");
postForm.addEventListener("submit", submit);

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

document
  .getElementById("getFragmentByIdForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
  });

document
  .getElementById("getFragmentsForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
  });

document
  .getElementById("deleteFragmentByIdForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
  });

document
  .getElementById("updateFragmentByIdForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
  });

// Wait for the DOM to be ready, then start the app
addEventListener("DOMContentLoaded", init);
