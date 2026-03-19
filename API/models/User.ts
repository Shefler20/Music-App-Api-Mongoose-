import mongoose, {HydratedDocument, Model} from "mongoose";
import bcrypt from "bcrypt";
import {UserFields} from "../types";
import {randomUUID} from "crypto";

const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

interface UserMethods {
    checkPassword: (password: string) => Promise<boolean>;
    generateAuthToken: () => void;
}

type userModal = Model<UserFields, {} , UserMethods>;

const UserSchema = new Schema<
    HydratedDocument<UserFields>,
    userModal,
    UserMethods,
    {}>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    }
});

UserSchema.methods.generateAuthToken = function () {
    this.token = randomUUID();
};

UserSchema.methods.checkPassword = function (password: string) {
    return bcrypt.compare(password, this.password);
};

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.set("toJSON", {
    transform: (_doc, ret, _options) => {
        const {password, ...rest} = ret;
        return rest;
    }
});

const User = mongoose.model("User", UserSchema);
export default User;