import { redirect } from "express/lib/response";
import Video from "../models/Video";

export const home = async(req, res) => {
    try{
        const videos = await Video.find({});
        return res.render("home", {pageTitle : "Home", videos})
    } catch(error) {
        return res.render("server-error", {error}); 
    }

};
export const watch = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.render("404", {pageTitle: "Video not found"});
    }
    return res.render("watch", {pageTitle :video.title, video});
};
export const getEdit = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);

    if(!video) {
        return res.render("404", {pageTitle: "Video not found"});
    }
    return res.render("edit", {pageTitle: `editing ${video.title}`, video})
};

export const postEdit = async(req, res) => {
    const {id} = req.params;
    const video = await Video.exists({_id: id});
    const {title, description, hashtags} = req.body;

    if(!video) {
        return res.render("404", {pageTitle: "Video not found"});
    }

    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags : Video.formatHashtags(hashtags),
    })
    console.log(hashtags);
    res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "upload video"})
}

export const postUpload = async(req, res) => {
    const {title, description, hashtags} = req.body;
    try {
        await Video.create({
            title,
            description,
            hashtags : Video.formatHashtags(hashtags),
        })
    } catch(error) {
        return res.render("upload", {pageTitle: "upload video", errorMessage: error._message});
    }
    return res.redirect("/");
}


export const deleteVideo = async(req, res) => {
    const {id} = req.params;
    await Video.findByIdAndDelete(id); //findDelete를 사용, remove 는 롤백이 되지 않음
    return res.redirect("/");
};
