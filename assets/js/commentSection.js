/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/js/commentSection.js":
/*!*****************************************!*\
  !*** ./src/client/js/commentSection.js ***!
  \*****************************************/
/***/ (() => {

eval("const videoContainer = document.getElementById(\"videoContainer\");\nconst form = document.getElementById(\"commentForm\");\nconst commentBox = document.querySelector('.comments_box');\nconst deleteBtn = commentBox.querySelector('.comments_btn_delete');\nconst addComment = (text, newCommentId, commentUser) => {\n  const videoComments = document.querySelector(\".comments_box ul\");\n  const newComment = document.createElement(\"li\");\n  const commentThumbDiv = document.createElement(\"div\");\n  const commentThumbImg = document.createElement(\"img\");\n  const commentName = document.createElement(\"div\");\n  const commentText = document.createElement(\"p\");\n  const commentDelete = document.createElement(\"button\");\n  newComment.appendChild(commentThumbDiv);\n  newComment.dataset.id = newCommentId;\n  commentThumbImg.src = `${commentUser.avatarUrl}`;\n  commentThumbImg.style.width = \"45px\";\n  commentThumbImg.style.height = \"45px\";\n  commentThumbDiv.appendChild(commentThumbImg);\n  commentName.innerText = `${commentUser.username}`;\n  newComment.appendChild(commentName);\n  commentText.innerText = `${text}`;\n  newComment.appendChild(commentText);\n  commentDelete.className = \"comments_btn_delete\";\n  commentDelete.innerText = \"✖️\";\n  commentDelete.addEventListener(\"click\", handleCommentDelete);\n  newComment.appendChild(commentDelete);\n  videoComments.prepend(newComment);\n};\nconst handleSubmit = async e => {\n  e.preventDefault();\n  const textarea = form.querySelector(\"textarea\");\n  const btn = form.querySelector(\"button\");\n  let text = textarea.value;\n  const videoId = videoContainer.dataset.videoid;\n  const response = await fetch(`/api/videos/${videoId}/comment`, {\n    method: \"POST\",\n    headers: {\n      \"Content-Type\": \"application/json\"\n    },\n    body: JSON.stringify({\n      text: text\n    })\n  });\n  if (response.status === 201) {\n    textarea.value = \"\";\n    const {\n      newCommentId,\n      commentUser\n    } = await response.json();\n    addComment(text, newCommentId, commentUser);\n  }\n};\nconst handleCommentDelete = async e => {\n  // 해당 li 뷰 화면에서 제거\n  const target = e.target.parentElement;\n  const targetId = target.dataset.id;\n  target.remove();\n  // 컨트롤러에서 코멘트 제거하기 -> 비디오 삭제 컨트롤러 참고해서 작업하기\n\n  await fetch(`/api/comments/${targetId}/delete`, {\n    method: \"DELETE\"\n  });\n};\nif (form) {\n  form.addEventListener(\"submit\", handleSubmit);\n}\nif (commentBox) deleteBtn.addEventListener(\"click\", handleCommentDelete);\n\n//# sourceURL=webpack://youtube_clone/./src/client/js/commentSection.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/commentSection.js"]();
/******/ 	
/******/ })()
;