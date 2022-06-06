import { async } from "regenerator-runtime";

const videoContainer = document.querySelector(".video__box");
const commentForm = document.querySelector(".comments__form");
const deleteCommentBtn = document.querySelectorAll(".video__comment__delete");
const commentCount = document.querySelector(".comments__count");

const handelDeleteBttn = async (evnet) => {
  const targetComment = evnet.target.parentElement;
  const { id } = targetComment.dataset;
  const response = await fetch(`/api/comment/${id}/delete`, {
    method: "DELETE",
  });

  if (response.status === 200) {
    const { commentNumber } = await response.json();
    commentCount.innerText =
      commentNumber < 2
        ? commentNumber + " comment"
        : commentNumber + " comments";
    targetComment.remove();
  }
};

const commentIcon = (url) => {
  if (url === "") {
    const icon = document.createElement("div");
    icon.className = "comment__avatar";
    const userIcon = document.createElement("i");
    userIcon.className = "fas fa-user";
    icon.appendChild(userIcon);
    return icon;
  } else {
    const icon = document.createElement("img");
    icon.src = "/" + url;
    return icon;
  }
};

const addComment = (text, id, url) => {
  const commentList = document.querySelector(".video__comments ul");
  const li = document.createElement("li");
  li.className = "video__comment";
  li.dataset.id = id;
  const a = document.createElement("a");
  const icon = commentIcon(url);
  const span = document.createElement("span");
  span.innerText = text;
  const deleteBtn = document.createElement("span");
  deleteBtn.innerText = "❌";
  deleteBtn.addEventListener("click", handelDeleteBttn);
  a.appendChild(icon);
  li.appendChild(a);
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
    const data = await response.json();
    const commentNumber = data[0].commentNumber;
    commentCount.innerText =
      commentNumber < 2
        ? commentNumber + " comment"
        : commentNumber + " comments";
    addComment(text, data[0].newCommentId, data[0].avatarUrl);
  }
};

commentForm.addEventListener("submit", handleFormSubmit);
deleteCommentBtn.forEach((btn) =>
  btn.addEventListener("click", handelDeleteBttn)
);
