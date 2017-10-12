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

    static initialState: IAppState = {
        user: null,
        forums: null,
        loading:true,
    }

    constructor(props: any) {
        super(props)
        this.state = App.initialState;
        this.bindActions();
    }
    //===== Lifecycle Methods =====\\

    componentDidMount() {
        this.authenticate()
            .then(() => {
                this.getForums()
                    .then(()=>{
                        this.setState(()=>({loading:false}));
                    })
            })
        console.log("=== App mounted!", this);
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
        //forum crud
        this.createForum = this.createForum.bind(this);
        this.deleteForum = this.deleteForum.bind(this);
        this.getForums = this.getForums.bind(this);

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
        return new Promise((resolve) => {
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
                        .then(() => {
                            this.getForums()
                        }) :
                    errors.handle(res.payload);
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
    private main():JSX.Element{
        const headerProps = {
            logout: this.logout,
            forums:this.state.forums,
            user: this.state.user,
        }
        const loginPageProps = {
            login: this.login,
        }
        const registerPageProps = {
           
        }
        const homePageProps = {
            user:this.state.user,
            goToPostPage: this.goToPostPage,
        }
        const profilePageProps = {
            user: this.state.user,
            goHome: this.goHome,
            goToProfile: this.goToProfile,

        }
        const forumsPageProps = {
            user: this.state.user,
            createForum: this.createForum,
            forums: this.state.forums,
            goToForumPage: this.goToForumPage,
        }
        const forumPageProps = {
            user: this.state.user,
            goHome: this.goHome,
            goToPostPage: this.goToPostPage,
        }
        const postPageProps = {
            user: this.state.user,
            goHome: this.goHome,
       
        }
        const userEditPageProps = {
            goHome:this.goHome,
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
                        component={(props) => <UserEditPage {...props} {...userEditPageProps} />} />
                    <Route
                        path="/forum/:id/edit"
                        component={(props) => <ForumEditPage {...props} {...forumEditPageProps} />} />
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

    // Views
    public render():JSX.Element {
        return !this.state.loading ? this.main():<Loading/>
    }
}


export default withRouter(App);