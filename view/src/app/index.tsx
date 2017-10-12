import * as React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import {
    IAppState,
    IFollowRequest,
    IUser,
    IForum,
    IPost,
    IComment,
    ILoginCredentials,
    IUpdateUserInfoRequest,
} from './interfaces';
import { api, jwt, errors } from './util';

import Header from './components/header';
import Loading from './components/loading';

// Pages
import HomePage from './components/pages/home_page';
import ForumsPage from './components/pages/forums_page';
import ForumPage from './components/pages/forum_page';
import PostPage from './components/pages/post_page';
import BlogPage from './components/pages/blog_page';
import AboutPage from './components/pages/about_page';
import LoginPage from './components/pages/login_page';
import RegisterPage from './components/pages/register_page';
import ProfilePage from './components/pages/profile_page';
import UserEditPage from './components/pages/user_edit_page';
import ForumEditPage from './components/pages/forum_edit_page';


class App extends React.Component<any, IAppState> {

    static initialState:IAppState = {
        user: null,
        users: null,
        forums: null,
    }

    constructor(props: any) {
        super(props)
        this.state = App.initialState;
        this.bindActions();
    }
    //===== Lifecycle Methods =====\\

    componentDidMount() {
        this.authenticate()
            .then(()=>{
                this.getUsers()
                    .then(()=>{
                        this.getForums()
                    })
            })
        console.log("=== App mountes!", this);
    }

    //===== Private Methods =====\\
    private bindActions(): void {
        //auth
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.authenticate = this.authenticate.bind(this);
        // nav
        this.goHome = this.goHome.bind(this);
        this.goToProfile = this.goToProfile.bind(this);
        this.goToForumPage = this.goToForumPage.bind(this);
        this.goBack = this.goBack.bind(this);
        this.goToPostPage = this.goToPostPage.bind(this);
        this.goToForumsPage = this.goToForumsPage.bind(this);
        //user crud
        this.unFollowUser = this.unFollowUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.createUser = this.createUser.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.followUser = this.followUser.bind(this);
        this.updateUserInfo = this.updateUserInfo.bind(this);
        //forum crud
        this.createForum = this.createForum.bind(this);
        this.deleteForum = this.deleteForum.bind(this);
        this.getForums = this.getForums.bind(this);
        this.createComment = this.createComment.bind(this);
        this.createPost = this.createPost.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }

    private authenticate(): Promise<boolean> {
        return new Promise((resolve) => {
            if (jwt.check()) {
                const token = jwt.get()
                console.log("authenticating user with token as: ", token);
                jwt.authenticate(token)
                    .then(res => {
                        res.success ? this.setState(() => ({ user: res.payload })) : errors.handle(res.payload);
                        resolve(true);
                    });
            } else {
                this.setState(() => ({ user: null }));
                resolve(false);
            }

        });
    }
    private getUsers(): Promise<boolean> {
        return new Promise((resolve) => {
            api
                .getUsers()
                .then(res => {
                    res.success ? this.setState(() => ({ users: res.payload })) : errors.handle(res.payload);
                    resolve(res.success);
                });
        });

    }
    private getForums(): Promise<boolean> {
        return new Promise((resolve) => {
            api
                .getForums()
                .then(res => {
                    res.success ? this.setState(() => ({ forums: res.payload })) : errors.handle(res.payload);
                    resolve(res.success);
                })
        });
    }
    //===== Public Methods =====\\

    // === App Navigation Methods
    public goHome(): void {
        this.props.history.push("/");
    }
    public goToProfile(id: string): void {
        this.props.history.push("/profile/" + id);
    }
    public goToForumsPage(): Promise<void> {
        return new Promise((resolve) => {
            this.props.history.push("/forums");
            resolve();
        });
    }
    public goToForumPage(id: string): Promise<void> {
        return new Promise((resolve)=>{
            this.props.history.push("/forum/" + id);
            resolve();
        });
    }
    public goToPostPage(id: string): void {
        this.props.history.push("/forum/post/" + id);
    }
    public goBack(): void {
        this.props.history.pop();
    }

    // Users
    public followUser(followRequest: IFollowRequest): void {
        api.followUser(followRequest)
            .then(res => {
                res.success ?
                    this.setState(() => ({ user: res.payload })) : errors.handle(res.payload);
            });
    }
    public unFollowUser(followRequest: IFollowRequest): void {
        api.unFollowUser(followRequest)
            .then(res => {
                res.success ?
                    this.setState(() => ({ user: res.payload })) : errors.handle(res.payload);
            });
    }

    public updateUserInfo(updateReq:IUpdateUserInfoRequest):Promise<boolean>{
        return new Promise((resolve)=>{
            api.updateUserInfo(updateReq)
                .then((res)=>{
                    res.success ?
                        this.getUsers():
                        errors.handle(res.payload)
                    resolve(res.success);
                })
        });
    }
    
    public createUser(user: IUser): void {
        api.createUser(user)
            .then(res => {
                if (res.success) {
                    this.setState((state) => ({ users: [...state.users, res.payload] }));
                    this.goHome();
                } else {
                    errors.handle(res.payload);
                }
            })
    }
    public deleteUser(id: string): void {
        console.log("== In deleteUser ( app )", id);
        api.deleteUser(id)
            .then(res => {
                res.success ?
                    this.logout()
                        .then(() => {
                            this.getUsers()
                                .then(() => {
                                    this.getForums();
                                })
                        }) : errors.handle(res.payload);
            });
    }

    // Forums
    public createForum(forum: IForum): void {
        api.createForum(forum)
            .then(res => {
                res.success ?
                    this.setState((state) => ({ forums: [...state.forums, res.payload] })) :
                    errors.handle(res.payload);
            })
    };
    public deleteForum(id: string): void {
        api.deleteForum(id)
            .then(res => {
                res.success ?
                    this.goToForumsPage()
                        .then(()=>{
                            this.getForums()
                        }):
                    errors.handle(res.payload);
            });
    }

    public createPost(post: IPost): void {
        api.createPost(post)
            .then(res => {
                res.success ?
                    this.getForums() :
                    errors.handle(res.payload);
            });
    }

    public deletePost(id: string): void {
        api.deletePost(id)
            .then(res => {
                res.success ?
                    this.goToForumsPage()
                        .then(() => {
                            this.getForums()
                        }) : errors.handle(res.payload)

            });
    }

    public createComment(comment: IComment): void {
        api.createComment(comment)
            .then(res => {
                res.success ?
                    this.getForums() :
                    errors.handle(res.payload);
            });
    }
    public deleteComment(id: string): void {
        api.deleteComment(id)
            .then(res => {
                res.success ? this.getForums() : errors.handle(res.payload);
            });
    }

    // Auth
    public login(creds: ILoginCredentials): Promise<void> {
        return new Promise((resolve) => {
            api
                .login(creds)
                .then(res => {
                    if (res.success) {
                        jwt.set(res.payload);
                        this.authenticate()
                            .then((authenticated) => {
                                authenticated &&
                                    this.goToProfile(this.state.user._id);
                                resolve();
                            });
                    } else {
                        errors.handle(res.payload)
                        resolve();
                    }
                })
        });

    }
    public logout(): Promise<void> {
        return new Promise((resolve) => {
            jwt.remove()
                .then(() => {
                    this.goHome();
                    this.setState(() => ({ user: null }));
                    resolve();
                })
        });

    }

    // Views
    public render() {

        const headerProps = {
            logout: this.logout,
            user: this.state.user,
        }
        const loginPageProps = {
            login: this.login,
        }
        const registerPageProps = {
            createUser: this.createUser,
        }
        const homePageProps = {
            users: this.state.users,
            goToProfile: this.goToProfile,
        }
        const profilePageProps = {
            user: this.state.user,
            goHome: this.goHome,
            goToProfile: this.goToProfile,
            followUser: this.followUser,
            unFollowUser: this.unFollowUser,
        }
        const forumsPageProps = {
            user: this.state.user,
            createForum: this.createForum,
            forums: this.state.forums,
            goToForumPage: this.goToForumPage,
        }
        const forumPageProps = {
            user: this.state.user,
            goToForumsPage:this.goToForumsPage,
            createPost: this.createPost,
            goToPostPage: this.goToPostPage,
        }
        const postPageProps = {
            user: this.state.user,
            createComment: this.createComment,
            deletePost:this.deletePost,
            goToForumsPage:this.goToForumsPage,
            deleteComment: this.deleteComment,
        }
        const userEditPageProps = {
            deleteUser: this.deleteUser,
            updateUserInfo:this.updateUserInfo,
        }
        const forumEditPageProps = {
            deleteForum: this.deleteForum,
        }
        return (
            <div className="app">
                <Header {...headerProps} />
                <Switch>
                    <Route
                        exact path="/"
                        component={(props) => <HomePage {...props}  {...homePageProps} />} />
                    <Route
                        path="/user/:id/edit"
                        component={(props) => <UserEditPage {...props} {...userEditPageProps}  />} />
                    <Route
                        path="/forum/:id/edit"
                        component={(props) => <ForumEditPage {...props} {...forumEditPageProps}  />} />
                    <Route
                        path="/forums"
                        component={(props) => <ForumsPage {...props} {...forumsPageProps} />} />
                    <Route
                        exact path="/forum/:id"
                        component={(props) => <ForumPage {...props} {...forumPageProps} />} />
                    <Route
                        path="/forum/post/:id"
                        component={(props) => <PostPage {...props} {...postPageProps} />} />
                    <Route
                        path="/blog"
                        component={BlogPage} />
                    <Route
                        path="/about"
                        component={AboutPage} />
                    <Route
                        path="/login"
                        component={(props) => <LoginPage {...props} {...loginPageProps} />} />
                    <Route
                        path="/register"
                        component={(props) => <RegisterPage {...props} {...registerPageProps} />} />
                    <Route
                        path="/profile/:id"
                        component={(props) => <ProfilePage {...props} {...profilePageProps} />} />

                </Switch>
            </div>
        );
    }
}


export default withRouter(App);