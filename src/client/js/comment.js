import { async } from "regenerator-runtime";

const videoContainer = document.querySelector(".video__box");
const commentForm = document.querySelector(".comments__form");
const editCommentBtn = document.querySelectorAll(".video__comment__edit");
const deleteCommentBtn = document.querySelectorAll(".video__comment__delete");
const commentCount = document.querySelector(".comments__count");
const commentThumb = document.querySelectorAll(".comment__thumb");

const handleThumbBtn = async (event) => {
  const comment = event.target.parentElement;
  const id = comment.dataset.id;
  const thumbCount = comment.querySelector(".thumb__count");
  const response = await fetch(`/api/comment/${id}/thumb`, {
    method: "POST",
  });

  const { count } = await response.json();

  event.target.classList.toggle("comment__thumb--clicked");
  thumbCount.innerText = count;
};

const hadleCancelBtn = (event) => {
  const form = event.target.parentElement;
  form.classList.add("hidden");
};

const handleEditSubmit = async (event) => {
  event.preventDefault();
  const comment = event.target.parentElement;
  const commentText = comment.querySelector(".video__comment__text");
  const text = event.target.elements[0].value;
  const id = event.target.parentElement.dataset.id;

  if (text === "") {
    return;
  }

  await fetch(`/api/comment/${id}/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  commentText.innerText = text;
  event.target.classList.add("hidden");
};

const handelEditBttn = (event) => {
  const targetComment = event.target.parentElement;
  const editForm = targetComment.querySelector(".comment__eidt-form");
  const cancelBtn = editForm.querySelector(".comment__cancelBtn");
  editForm.classList.remove("hidden");
  editForm.addEventListener("submit", handleEditSubmit);
  cancelBtn.addEventListener("click", hadleCancelBtn);
};

const handelDeleteBttn = async (event) => {
  const targetComment = event.target.parentElement;
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
  span.className = "video__comment__text";

  const editBtn = document.createElement("span");
  editBtn.innerText = "Edit";
  editBtn.className = "video__comment__edit";

  const deleteBtn = document.createElement("span");
  deleteBtn.innerText = "Delete";
  deleteBtn.className = "video__comment__delete";
  deleteBtn.addEventListener("click", handelDeleteBttn);

  a.appendChild(icon);
  li.appendChild(a);
  li.appendChild(span);
  li.appendChild(editBtn);
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

editCommentBtn.forEach((btn) => btn.addEventListener("click", handelEditBttn));

deleteCommentBtn.forEach((btn) =>
  btn.addEventListener("click", handelDeleteBttn)
);

commentThumb.forEach((btn) => btn.addEventListener("click", handleThumbBtn));
