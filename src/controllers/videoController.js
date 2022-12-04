import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async(req, res) => {
    try{
        const videos = await Video.find({}).sort({createdAt: "desc"});
        return res.render("home", {pageTitle : "Home", videos})
    } catch(error) {
        return res.status(404).render("server-error", {error}); 
    }

};
export const watch = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");

    if(!video) {
        return res.render("404", {pageTitle: "Video not found"});
    }
    return res.render("videos/watch", {pageTitle :video.title, video});
};

export const getEdit = async(req, res) => {
    const {id} = req.params;
    const {user: {_id}} =req.session;
    const video = await Video.findById(id);

    if(!video) {
        return res.render("404", {pageTitle: "Video not found"});
    }

    if(String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    return res.render("videos/edit", {pageTitle: `editing ${video.title}`, video})
};

export const postEdit = async(req, res) => {
    const {id} = req.params;
    const {user: {_id}} =req.session;
    const video = await Video.exists({_id: id});
    const {title, description, hashtags} = req.body;

    if(!video) {
        return res.render("404", {pageTitle: "Video not found"});
    }

    if(String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }

    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags : Video.formatHashtags(hashtags),
    })
    req.flash("success", "changes saved")
    res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("videos/upload", {pageTitle: "upload video"})
}

export const postUpload = async(req, res) => {
    const {user: {
        _id
    } } = req.session;
    const {video, thumb} = req.files;
    const {title, description, hashtags} = req.body;
    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl:video[0].location,
            thumbUrl: thumb[0].location,
            owner: _id,
            hashtags : Video.formatHashtags(hashtags),
        })
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    } catch(error) {
        return res.status(404).render("upload", {pageTitle: "upload video", errorMessage: error._message});
    }

}


export const deleteVideo = async(req, res) => {
    const {id} = req.params;
    const { user: {_id}} = req.session;
    const video = await Video.findById(_id);
    if(!video) {
        return res.status(400).render("404", {pageTitle:"Video not found"});
    }
    
    if(String(video.owner) !== String(_id)) {
        req.flash("error", "Not authorized");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id); //findDelete를 사용, remove 는 롤백이 되지 않음

    return res.redirect("/");
};

export const search = async(req, res) => {
    const {keyword} = req.query;
    let videos = [];
    if(keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i")
            },
        })
    } 
    return res.render("videos/search", {pageTitle: "search", videos});
}

export const registerView = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);

    if(!video) {
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200)
}

export const createComment = async(req, res) => {
    const {
        session: {user},
        body: {text},
        params: {id}
    } = req;

    const video = await Video.findById(id);

    if(!video) {
        return res.sendStatus(404);
    }

    const comment = await Comment.create({
        text,
        owner: user._id,
        video: id,
    });
    video.comments.push(comment._id);
    video.save();
    return res.status(201).json({ commentUser: user, newCommentId: comment._id}); // 201 created
}

export const deleteComment = async(req, res) => {
    const {
        session: {
            user: {_id},
        }, 
        params: {id},
    } = req;

    const comment = await Comment.findById(id).populate("owner");
    const commentVideo = comment.video;

    if(String(_id) !== String(comment.owner._id)) {
        return res.sendStatus(404);
    }

    const video = await Video.findById(commentVideo);
    if(!video) {
        return res.sendStatus(404);
    }
    video.comments.splice(video.comments.indexOf(id), 1);
    await video.save();
    await Comment.findByIdAndDelete(id);

    return res.sendStatus(200);
}