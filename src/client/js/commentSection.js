const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const commentBox = document.querySelector('.comments_box');
const deleteBtn = commentBox.querySelector('.comments_btn_delete');

const addComment = (text, newCommentId, commentUser) => {
    const videoComments = document.querySelector(".comments_box ul");
    const newComment = document.createElement("li");
    const commentThumbDiv = document.createElement("div"); 
    const commentThumbImg = document.createElement("img"); 
    const commentName = document.createElement("div"); 
    const commentText = document.createElement("p"); 
    const commentDelete = document.createElement("button");


    newComment.appendChild(commentThumbDiv);
    newComment.dataset.id = newCommentId;
    commentThumbImg.src = `/${commentUser.avatarUrl}`;
    commentThumbImg.style.width = "45px";
    commentThumbImg.style.height = "45px";
    commentThumbDiv.appendChild(commentThumbImg);
    commentName.innerText = `${commentUser.username}`;
    newComment.appendChild(commentName);
    commentText.innerText = `${text}`;
    newComment.appendChild(commentText);
    commentDelete.className = "comments_btn_delete";
    commentDelete.innerText = "✖️";
    commentDelete.addEventListener("click", handleCommentDelete);
    newComment.appendChild(commentDelete);
    videoComments.prepend(newComment);
    console.log("videoComments",videoComments);
}

const handleSubmit = async (e) => {
    e.preventDefault();
    const textarea = form.querySelector("textarea");
    const btn = form.querySelector("button");
    let text = textarea.value;
    const videoId = videoContainer.dataset.videoid;

    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: text,
        }),
    });


    if(response.status === 201) {
        textarea.value = "";
        const {newCommentId, commentUser} = await response.json();
        addComment(text, newCommentId, commentUser);
    }
}

const handleCommentDelete = async(e) => {
    // 해당 li 뷰 화면에서 제거
    const target = e.target.parentElement;
    const targetId = target.dataset.id;
    target.remove();
    // 컨트롤러에서 코멘트 제거하기 -> 비디오 삭제 컨트롤러 참고해서 작업하기

    await fetch(`/api/comments/${targetId}/delete`, {
        method: "DELETE",
    })
}

if(form) {
    form.addEventListener("submit", handleSubmit);
}
if(commentBox)
deleteBtn.addEventListener("click", handleCommentDelete);