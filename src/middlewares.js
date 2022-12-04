import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey:  process.env.AWS_SECRET
    }
})

const multerUploader = multerS3({
    s3: s3,
    bucket: "youtube-clone-reloaded",
    acl: "public-read",
})


export const localsMiddleware = (req, res,next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn); // res.local 에 변수를 생성시 전역적으로 사용이 가능하다
    res.locals.siteName = "youtube clone";
    res.locals.loggedInUser = req.session.user; // postLogin 에서 저장한 req 정보를 res.local 에 전역변수로 저장하여 사용

    next();
}

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn) {
        next();
    }else {
        req.flash("error", "Not authorized");
        return res.redirect("/login");
    }
}

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn) {
        return next();
    } else {
        req.flash("error", "Not authorized");
        return res.redirect("/");
    }
}


export const avatarUpload = multer({
    dest: "uploads/avatars/",
    limits: {
        fileSize: 3000000,
    },
    storage: multerUploader
})

export const videoUpload = multer({
    dest: "uploads/videos/",
    limits: {
        fileSize: 10000000,
    },
    storage: multerUploader
})