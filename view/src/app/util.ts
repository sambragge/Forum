import axios from 'axios';
import {
    ILoginCredentials,
    IStandardResponse,
    IUser,
    IFollowRequest,
    IForum,
    IPost,
    IComment,
    IUpdateUserInfoRequest,
    IUpdateForumRequest,
    IUpdatePostRequest,
} from './interfaces';

const _users = "/api-users/",
    _forums = "/api-forums/",
    _posts = "/api-posts/",
    _comments = "/api-comments/",
    _auth = "/api-auth/"

export const api = {
    // Users
    login: (creds: ILoginCredentials): Promise<IStandardResponse> => {
        return axios
            .post(_auth, creds)
            .then(res => res.data)
            .catch(err => {
                console.log("=== err in login!", err);
            });
    },
    getUsers: (): Promise<IStandardResponse> => {
        return axios
            .get(_users)
            .then(res => res.data)
            .catch(err => {
                console.log("=== err in getUsers!", err);
            });
    },
    getUser: (id: string): Promise<IStandardResponse> => {
        console.log("Getting user with id of: ", id);
        return axios
            .get(_users + id)
            .then(res => res.data)
            .catch(err => {
                console.log(err);
            });
    },
    createUser: (user: IUser): Promise<IStandardResponse> => {
        return axios.post(_users, user)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) createUser", err)
            });
    },
    updateUserInfo: (updateReq: IUpdateUserInfoRequest): Promise<IStandardResponse> => {
        return axios.post(_users + 'update', updateReq)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) updateUserInfo", err)
            })
    },
    deleteUser: (id: string): Promise<IStandardResponse> => {
        console.log("== In deleteUser ( util )", id);
        return axios.delete(_users + id)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) deleteUser", err);
            });
    },

    followUser: (followRequest: IFollowRequest): Promise<IStandardResponse> => {
        console.log("Getting to followUser in util");
        return axios.post(_users + 'follow', followRequest)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) followUser", err)
            });
    },
    unFollowUser: (followRequest: IFollowRequest): Promise<IStandardResponse> => {
        return axios.post(_users + 'unfollow', followRequest)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) unFollowUser", err)
            });
    },

    // Forums
    getForums: (): Promise<IStandardResponse> => {
        return axios.get(_forums)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) getForums", err);
            });
    },
    getForum: (id: string): Promise<IStandardResponse> => {
        return axios.get(_forums + id)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) getForum", err);
            });
    },
    updateForum: (updateReq: IUpdateForumRequest): Promise<IStandardResponse> => {
        return axios.post(_forums + 'update', updateReq)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) updateForum", err);
            })
    },
    createForum: (forum: IForum): Promise<IStandardResponse> => {
        return axios.post(_forums, forum)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) createForum", err);
            });
    },
    deleteForum: (id: string): Promise<IStandardResponse> => {
        return axios.delete(_forums + id)
            .then(res => res.data)
            .catch(err => {
                console.log("Error deleting Forum", err);

            })
    },

    // Posts
    getPost: (id: string): Promise<IStandardResponse> => {
        return axios.get(_posts + id)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) getPost", err);
            });
    },
    updatePost:(updateReq:IUpdatePostRequest):Promise<IStandardResponse>=>{
        return axios.post(_posts + 'update', updateReq)
        .then(res=>res.data)
        .catch(err=>{
            console.error("=== Error in (util) updatePost", err);
        })
    },
    getPosts: (): Promise<IStandardResponse> => {
        return axios.get(_posts)
            .then(res => res.data)
            .catch(err => {
                console.error(new Error("=== Error in (util) getForumPost: " + err));
            });
    },
    deletePost: (id: string): Promise<IStandardResponse> => {
        return axios.delete(_posts + id)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) deletePost", err);
            })
    },
    createPost: (post: IPost): Promise<IStandardResponse> => {
        return axios.post(_posts, post)
            .then(res => res.data)
            .catch(err => {
                console.error("=== Error in (util) createForumPost", err);
            });
    },

    // Comments
    createComment: (comment: IComment): Promise<IStandardResponse> => {
        return axios.post(_comments, comment)
            .then(res => res.data)
            .catch(err => {
                console.log(" === Error in (util) createForumComment", err);

            });

    },
    deleteComment: (id: string): Promise<IStandardResponse> => {
        return axios.delete(_comments + id)
            .then(res => res.data)
            .catch(err => {
                console.log(" === Error in (util) deleteComment", err);
            });
    },
}

export const jwt = {

    check: (): boolean => {
        const token = localStorage.getItem('token');
        return token ? true : false;
    },

    authenticate: (token: string): Promise<IStandardResponse> => {
        return axios
            .get("/api-auth/" + token)
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
        return new Promise((resolve) => {
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
    capitalize: (data: string): string => {
        const split = data.split(" ");
        for (let i in split) {
            split[i] = capitalizeOne(split[i]);
        }
        return split.join(" ");
    },
}

export const errors = {
    handle: (errors: string[]) => {
        for (let errString of errors) {
            console.error(new Error(errString));
        }
        alert(errors.join("\n"));
    },
}

