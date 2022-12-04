import "../scss/style.scss";

const profileLink = document.querySelector(".profile_link_set");
const topBtn = document.querySelector(".f_btn_top");

const handleNav = (e) => {
    e.preventDefault();
    const navAttr =  profileLink.ariaPressed;

    if(navAttr === "false") {
        profileLink.ariaPressed = "true";
    } else {
        profileLink.ariaPressed = "false";
    }
}

const handleTopScroll = (e) => {
    e.preventDefault();
    document.body.scrollIntoView();
}

profileLink.addEventListener("click", handleNav);
topBtn.addEventListener("click", handleTopScroll);