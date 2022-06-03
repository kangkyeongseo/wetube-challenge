import { async } from "regenerator-runtime";

const videoContainer = document.querySelector(".video__box");
const commentForm = document.querySelector(".comments__form");

const addComment = (text) => {
  const commentList = document.querySelector(".video__comments ul");
  const li = document.createElement("li");
  li.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = text;
  const deleteBtn = document.createElement("span");
  deleteBtn.innerText = "❌";
  li.appendChild(icon);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  commentList.appendChild(li);
};

const handleFormSubmit = async (event) => {
  event.preventDefault();
  const textarea = commentForm.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  await fetch(`/api/video/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  addComment(text);
};

commentForm.addEventListener("submit", handleFormSubmit);
