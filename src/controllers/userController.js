import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join",{ pageTitle: "join"});
export const postJoin = async(req, res) => {
    const pageTitle = "join";
    const {name, username, email, location, password, password2} = req.body;
    if(password !== password2) {
        return res.status(400).render("join", {pageTitle, errorMessage: "패스워드가 다릅니다"})
    }
    // User.exists({ username: username}) : db 의 username 과 동일한 req.body 의 username 이 있는지 찾는다. 
    // 값이 있는 경우 입력값이 db 에 이미 존재하기 때문에 신규 가입할수 없고, exists 는 true 가 나옴.
    // 아래 코드는 username 과 email 둘중에 하나라도 true 가 나온다면 둘중 한 값이 이미 가입한 사람의 값이므로 에러메시지 출력해야함 
    const exists = await User.exists({$or: [{ username}, {email}]}); // $or  둘 중 하나만 충족해도 됨
    if(exists) {
        return res.status(400).render("join", { pageTitle, errorMessage: "this username/email is already taken"})
    }
    try {
        await User.create({
            name,
            username,
            email,
            password,
            location
        })
        return res.redirect("/login");
    } catch(error) {
        res.status(400).render("join", {
            pageTitle, 
            errorMessage: error._message,
        })
    }
}
export const getLogin = (req, res) => res.render("login", {pageTitle: "login"});
export const postLogin = async(req, res) => {
    const { username, password} = req.body;
    const pageTitle = "login"
    const user = await User.findOne({username, socialOnly: false})

    if(!user) {
        return res.status(400).render("login", {pageTitle, errorMessage: "유저네임이 없습니다"})
    }

    const ok = await bcrypt.compare(password, user.password);

    if(!ok) {
        return res.status(400).render("login", {pageTitle, errorMessage: "비밀번호가 틀렸습니다"})
    }

    req.session.loggedIn = true; // 세션에 loggedIn 을 만들어서 추가, potato 라고 해도 상관 없음.
    req.session.user = user; // 리퀘스트 세션에 db 의 유저정보를 저장

    res.redirect("/");
}

export const startGithubLogin = (req, res) => {
    const baseUrl = `https://github.com/login/oauth/authorize`;
    const config = {
        client_id : process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email"
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    return res.redirect(finalUrl)
}

export const finishGithubLogin = async(req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (await fetch(finalUrl, {
        methd: "POST",
        headers: {
            Accept: "application/json",
        }
    })).json();

    if("access_token" in tokenRequest) {
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`
            }
        })).json();
        const emailData = await (await fetch(`${apiUrl}/user/emails`, {
            headers:{
                Authorization: `token ${access_token}`
            }
        })).json();

        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );

        if(!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email});

        if(!user) {
            user = await User.create({
                name : userData.name,
                avatarUrl: userData.avatar_url,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                location: userData.location,
            })
        }
        req.session.loggedIn = true; 
        req.session.user = user; 
        return res.redirect("/");
    } else {
        return res.redirect("/login")
    }
}

export const logout = (req, res) => {
    req.session.destroy();

    return res.redirect("/");
}

export const getEdit = (req, res) => {
    return res.render("users/edit-profile", {pageTitle: "Edit profile"})
}

export const postEdit = async(req, res) => {
    const {
        session: {
            user: {_id, avatarUrl}
        },
        body: {
            name, email, username, location
        },
        file,
    } = req;

    const updateUser = await User.findByIdAndUpdate(_id,{
        avatarUrl:  file ? file.path : avatarUrl,
        name,
        email,
        username,
        location,
    }, {new: true})
    req.session.user = updateUser;

    return res.redirect("/");
}

export const getChangePassword = (req, res) => {
    if(req.session.user.socialOnly === true ){
        return res.redirect("/");
    }
    return res.render("users/change-password", {pageTitle: "change password"})
}
export const postChangePassword = async(req, res) => {
    const {
        session: {
            user: {_id, password}
        },
        body: {
            oldPassword, newPassword, newPassowrdConfirmation
        }
    } = req;

    const ok = await bcrypt.compare(oldPassword, password );
    if(!ok) {
        return res.status(400).render("users/change-password", {pageTitle:  "change password", errorMessage: "기존 패스워드가 틀립니다"})
    }
    if(newPassword !== newPassowrdConfirmation ) {
        return res.status(400).render("users/change-password", {pageTitle:  "change password", errorMessage: "패스워드가 일치하지 않습니다"})
    }
    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();
    req.session.user.password = user.password; // 세션에서 정보를 받으면 세션도 업데이트 해줘야한다
    return res.redirect("/users/logout");
}

export const see = async(req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate("videos");
    // 유저의 id 와 같은 onwer 비디오를 찾음
    console.log(user)

    if(!user) {
        return res.status(400).render("404", {pageTitle: "User not found"});
    }

    return res.render("users/profile", {pageTitle: `${user.name} profile`, user})
};