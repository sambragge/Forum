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
import ForumPage from './components/pages/forum_page';
import PostPage from './components/pages/post_page';
import BlogPage from './components/pages/blog_page';
import AboutPage from './components/pages/about_page';
import LoginPage from './components/pages/login_page';
import RegisterPage from './components/pages/register_page';
import ProfilePage from './components/pages/profile_page';
import UserEditPage from './components/pages/user_edit_page';
import ForumEditPage from './components/pages/forum_edit_page';
import ForumCreatePage from './components/pages/forum_create_page';

class App extends React.Component<any, IAppState> {

    static initialState: IAppState = {
        user: null,
        forums: null,
        loading: true,
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
                    .then(() => {
                        this.setState(() => ({ loading: false }));
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
        //forum
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
                    this.props.history.push("/").then(() => {
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
                                    this.props.history.push("/profile/"+this.state.user._id);
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
                    this.props.history.push("/");
                    this.setState(() => ({ user: null }));
                    resolve();
                })
        });

    }
    private main(): JSX.Element {
        const headerProps = {
            logout: this.logout,
            forums: this.state.forums,
            user: this.state.user,
        }
        const loginPageProps = {
            login: this.login,
        }
        const homePageProps = {
            user: this.state.user,
        }
        const profilePageProps = {
            user: this.state.user,

        }
        const forumPageProps = {
            user: this.state.user,
        }
        const postPageProps = {
            user: this.state.user,

        }
        return (
            <div className="app">
                <Header {...headerProps} />
                <Switch>
                    <Route
                        exact path="/"
                        component={(props) => <HomePage {...props}  {...homePageProps} />} />
                    <Route
                        exact path="/user/:id/edit"
                        component={(props) => <UserEditPage {...props} />} />
                    <Route
                        exact path="/forum/:id/edit"
                        component={(props) => <ForumEditPage {...props} />} />
                    <Route
                        exact path="/forum/:id"
                        component={(props) => <ForumPage {...props} {...forumPageProps} />} />
                    <Route
                        exact path="/forums/create"
                        component={(props) => <ForumCreatePage {...props}  />} />
                    <Route
                        exact path="/post/:id"
                        component={(props) => <PostPage {...props} {...postPageProps} />} />
                    <Route
                        exact path="/blog"
                        component={BlogPage} />
                    <Route
                        exact path="/about"
                        component={AboutPage} />
                    <Route
                        exact path="/login"
                        component={(props) => <LoginPage {...props} {...loginPageProps} />} />
                    <Route
                        exact path="/register"
                        component={(props) => <RegisterPage {...props} />} />
                    <Route
                        exact path="/profile/:id"
                        component={(props) => <ProfilePage {...props} {...profilePageProps} />} />

                </Switch>
            </div>
        );
    }

    // Views
    public render(): JSX.Element {
        return !this.state.loading ? this.main() : <Loading />
    }
}


export default withRouter(App);