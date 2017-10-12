import axios from 'axios';
import {
    ILoginCredentials,
    IStandardResponse,
    IUser,
    IFollowRequest,
    IForum,
    IPost,
    IComment,
    IUpdateUserInfoRequest
} from './interfaces';


export const api = {
    // Users
    login: (creds: ILoginCredentials): Promise<IStandardResponse> => {
        return axios
            .post("/api-auth", creds)
            .then(res => res.data)
            .catch(err => {
                console.log("=== err in login!", err);
            });
    },
    getUsers: (): Promise<IStandardResponse> => {
        return axios
            .get("/api-users")
            .then(res => res.data)
            .catch(err => {
                console.log("=== err in getUsers!", err);
            });
    },
    getUser: (id: string): Promise<IStandardResponse> => {
        console.log("Getting user with id of: ", id);
        return axios
            .get("/api-users/" + id)
            .then(res => res.data)
            .catch(err => {
                console.log(err);
            });
    },
    createUser: (user: IUser): Promise<IStandardResponse> => {
        return axios.post("/api-users", user)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) createUser", err)
            });
    },
    updateUserInfo:(updateReq:IUpdateUserInfoRequest):Promise<IStandardResponse>=>{
        return axios.put("/api-users", updateReq)
        .then(res=>res.data)
        .catch(err=>{
            console.error("=== Error in (util) updateUserInfo", err)
        })
    },
    deleteUser:(id:string):Promise<IStandardResponse>=>{
        console.log("== In deleteUser ( util )", id);
        return axios.delete("/api-users/"+id)
        .then(res=>res.data)
        .catch(err=>{
            console.error("=== Error in (util) deleteUser", err);
        });
    },

    followUser: (followRequest: IFollowRequest): Promise<IStandardResponse> => {
        console.log("Getting to followUser in util");
        return axios.post("/api-users/follow", followRequest)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) followUser", err)
            });
    },
    unFollowUser: (followRequest: IFollowRequest): Promise<IStandardResponse> => {
        return axios.post("/api-users/unfollow", followRequest)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) unFollowUser", err)
            });
    },

    // Forums
    getForums: (): Promise<IStandardResponse> => {
        return axios.get("/api-forums")
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) getForums", err);
            });
    },
    getForum: (id: string): Promise<IStandardResponse> => { 
        return axios.get("/api-forums/"+id)
        .then(res=>res.data)
        .catch(err=>{
            console.error("=== Error in (util) getForum", err);
        });
    },
    createForum: (forum: IForum): Promise<IStandardResponse> => {
        return axios.post("/api-forums", forum)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) createForum", err);
            });
    },
    deleteForum:(id:string):Promise<IStandardResponse>=>{
        return axios.delete("/api-forums/"+id)
        .then(res=>res.data)
        .catch(err=>{
            console.log("Error deleting Forum", err);
            
        })
    },
    // Posts
    getPost:(id:string):Promise<IStandardResponse>=>{
        return axios.get("/api-posts/"+id)
        .then(res=>res.data)
        .catch(err=>{
            console.error("=== Error in (util) getForumPost", err);
        });
    },
    getPosts:():Promise<IStandardResponse>=>{
        return axios.get("/api-posts")
        .then(res=>res.data)
        .catch(err=>{
            console.error(new Error("=== Error in (util) getForumPost: "+err));
        });
    },
    deletePost:(id:string):Promise<IStandardResponse>=>{
        return axios.delete("/api-forums/posts/"+id)
        .then(res=>res.data)
        .catch(err=>{
            console.error("=== Error in (util) deletePost", err);
        })
    },
    createPost: (post: IPost): Promise<IStandardResponse> => {
        return axios.post("/api-forums/posts", post)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) createForumPost", err);
            });
    },

    // Comments
    createComment:(comment:IComment):Promise<IStandardResponse>=>{
        return axios.post("/api-forums/comments", comment)
        .then(res => res.data)
        .catch(err=>{
            console.log(" === Error in (util) createForumComment", err);
            
        });

    },
    deleteComment:(id:string):Promise<IStandardResponse>=>{
        return axios.delete("/api-forums/comments/"+id)
        .then(res=>res.data)
        .catch(err=>{
            console.log(" === Error in (util) deleteComment", err);
        });
    },
}

export const jwt = {

    check: (): boolean => {
        const token = localStorage.getItem('token');
        return token ? true:false;
    },

    authenticate: (token: string): Promise<IStandardResponse> => {
        console.log("authenticating token: ", { token: token });
        return axios
            .get("/api-auth/"+token)
            .then(res => res.data)
            .catch(err => {
                console.error("=== err getting user id from token!", err);
                return
            });
    },
    set: (token: string): void => {
        localStorage.setItem('token', token);
        return
    },
    get: (): any => {
        const token = localStorage.getItem('token');
        return token;
    },
    remove: (): Promise<void> => {
        return new Promise((resolve)=>{
            localStorage.removeItem('token');
            resolve();
        });
    },
}

function capitalizeOne(data: string) {
    return data.charAt(0).toUpperCase() + data.slice(1).toLowerCase();
}

export const helpers = {
    inArray: (str: string, arr: Array<string>): boolean => {
        for (let i = 0; i < arr.length; i++) {
            if (str === arr[i]) {
                return true;
            }
        }
        return false;
    },
    capitalize:(data: string): string => {
        const split = data.split(" ");
        for (let i in split) {
            split[i] = capitalizeOne(split[i]);
        }
        return split.join(" ");
    },
}

export const errors = {
    handle:(errors:string[])=>{
        for(let errString of errors){
            console.error(new Error(errString));
        }
        alert(errors.join("\n"));
    },
}

