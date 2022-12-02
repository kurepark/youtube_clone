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

/***/ "./src/client/js/videoPlayer.js":
/*!**************************************!*\
  !*** ./src/client/js/videoPlayer.js ***!
  \**************************************/
/***/ (() => {

eval("const video = document.querySelector(\"video\");\nconst playBtn = document.getElementById(\"play\");\nconst muteBtn = document.getElementById(\"mute\");\nconst time = document.getElementById(\"time\");\nconst currentTime = document.getElementById(\"currentTime\");\nconst totalTime = document.getElementById(\"totalTime\");\nconst timeline = document.getElementById(\"timeline\");\nconst volumnRange = document.getElementById(\"volumn\");\nconst fullScreenBtn = document.getElementById(\"fullScreen\");\nconst videoContainer = document.getElementById(\"videoContainer\");\nconst videoControls = document.getElementById(\"videoControls\");\nlet volumnValue = 0.5;\nlet controlsTimeout = null;\nlet controlsMovementTimeout = null;\nvideo.volume = volumnValue;\nconst formatTime = seconds => new Date(seconds * 1000).toISOString().substring(11, 19);\nconst handlePlayClick = e => {\n  if (video.paused) {\n    playBtn.innerText = \"Pause\";\n    video.play();\n  } else {\n    playBtn.innerText = \"Play\";\n    video.pause();\n  }\n  playBtn.innerText = video.paused ? \"Play\" : \"Pause\";\n};\nconst handleMuteClick = e => {\n  if (video.muted) {\n    video.muted = false;\n  } else {\n    video.muted = true;\n  }\n  muteBtn.innerText = video.muted ? \"Unmute\" : \"Mute\";\n  volumnRange.value = video.muted ? 0 : volumnValue;\n};\nconst handleVolumnChange = e => {\n  const {\n    target: {\n      value\n    }\n  } = e;\n  if (video.muted) {\n    video.muted = false;\n    muteBtn.innerText = \"Mute\";\n  }\n  volumnValue = value;\n  video.volume = value;\n};\nconst handleLoadedMetadata = e => {\n  totalTime.innerText = formatTime(Math.floor(video.duration));\n  timeline.max = Math.floor(video.duration);\n};\nconst handleTimeUpdate = e => {\n  currentTime.innerText = formatTime(Math.floor(video.currentTime));\n  timeline.value = Math.floor(video.currentTime);\n};\nconst handleTimelineChange = e => {\n  const {\n    target: {\n      value\n    }\n  } = e;\n  video.currentTime = value;\n};\nconst handleFullScreen = e => {\n  const fullscreen = document.fullscreenElement;\n  if (fullscreen) {\n    document.exitFullscreen();\n    fullScreenBtn.innerText = \"Enter Full Screen\";\n  } else {\n    videoContainer.requestFullscreen();\n    fullScreenBtn.innerText = \"Exit Full Screen\";\n  }\n};\nconst hideControls = () => {\n  videoControls.classList.remove(\"showing\");\n};\nconst handleMouseMove = e => {\n  if (controlsTimeout) {\n    clearTimeout(controlsTimeout);\n    controlsTimeout = null;\n  }\n  if (controlsMovementTimeout) {\n    clearTimeout(controlsMovementTimeout);\n    controlsMovementTimeout = null;\n  }\n  videoControls.classList.add(\"showing\");\n  controlsMovementTimeout = setTimeout(hideControls, 3000);\n};\nconst handleMouseLeave = e => {\n  controlsTimeout = setTimeout(hideControls, 3000);\n};\nconst handleEnded = e => {\n  const {\n    videoid\n  } = videoContainer.dataset;\n  fetch(`/api/videos/${videoid}/view`, {\n    method: \"POST\"\n  });\n};\nplayBtn.addEventListener(\"click\", handlePlayClick);\nmuteBtn.addEventListener(\"click\", handleMuteClick);\nvolumnRange.addEventListener(\"input\", handleVolumnChange);\nvideo.addEventListener(\"loadedmetadata\", handleLoadedMetadata);\nvideo.addEventListener(\"timeupdate\", handleTimeUpdate);\ntimeline.addEventListener(\"input\", handleTimelineChange);\nfullScreenBtn.addEventListener(\"click\", handleFullScreen);\nvideo.addEventListener(\"mousemove\", handleMouseMove);\nvideo.addEventListener(\"mouseleave\", handleMouseLeave);\nvideo.addEventListener(\"ended\", handleEnded);\n\n//# sourceURL=webpack://youtube_clone/./src/client/js/videoPlayer.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/videoPlayer.js"]();
/******/ 	
/******/ })()
;