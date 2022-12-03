import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    avatarUrl: {type: String},
    socialOnly: {type: Boolean, default: false },
    username: { type: String, required: true, unique: true},
    password: { type: String},
    name: {type: String, required: true},
    location: String,
    comments: [{type: mongoose.Schema.Types.ObjectId,ref: "Comment"}],
    videos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Video'}],
})

userSchema.pre("save", async function(){
    if(this.isModified("password")){ // 비밀번호가 변경될때만 해시되도록
        this.password = await bcrypt.hash(this.password, 5);
    } 
})

const User = mongoose.model("User", userSchema);

export default User;