import "../scss/styles.scss";

const headerAvatar = document.querySelector(".header__avatar");
const headerMenu = document.querySelector(".avatar__menu");
const menuExitBtn = document.querySelector(".avatar__menu ul .list__exit");

const handelAvatarMenuClose = () => {
  headerMenu.style.transform = "translateX(200px)";
  headerAvatar.removeEventListener("click", handelAvatarMenuClose);
  headerAvatar.addEventListener("click", handelAvatarMenuOpen);
};

const handelAvatarMenuOpen = () => {
  headerMenu.style.transform = "translateX(0px)";
  headerAvatar.removeEventListener("click", handelAvatarMenuOpen);
  headerAvatar.addEventListener("click", handelAvatarMenuClose);
};

if (headerAvatar) {
  headerAvatar.addEventListener("click", handelAvatarMenuOpen);
}

if (menuExitBtn) {
  menuExitBtn.addEventListener("click", handelAvatarMenuClose);
}
