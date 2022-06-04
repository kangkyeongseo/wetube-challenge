import { async } from "regenerator-runtime";

const videoContainer = document.querySelector(".video__box");
const commentForm = document.querySelector(".comments__form");
const deleteCommentBtn = document.querySelectorAll(".video__comment__delete");

const handelDeleteBttn = async (evnet) => {
  const targetComment = evnet.target.parentElement;
  const { id } = targetComment.dataset;
  await fetch(`/api/comment/${id}/delete`, {
    method: "DELETE",
  });
  targetComment.remove();
};

const addComment = (text, id) => {
  const commentList = document.querySelector(".video__comments ul");
  const li = document.createElement("li");
  li.className = "video__comment";
  li.dataset.id = id;
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = text;
  const deleteBtn = document.createElement("span");
  deleteBtn.innerText = "❌";
  li.appendChild(icon);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  commentList.prepend(li);
};

const handleFormSubmit = async (event) => {
  event.preventDefault();
  const textarea = commentForm.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/video/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";

  if (response.status === 201) {
    const { newCommentId } = response.json();
    addComment(text, newCommentId);
  }
};

commentForm.addEventListener("submit", handleFormSubmit);
deleteCommentBtn.forEach((btn) =>
  btn.addEventListener("click", handelDeleteBttn)
);
