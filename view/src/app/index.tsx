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
    IUpdateForumRequest
} from './interfaces';
import { api, jwt, errors } from './util';

import Header from './components/header';
import Loading from './components/loading';

// Pages
import HomePage from './components/pages/home_page';
import ForumPage from './components/pages/forum_page';
import PostPage from './components/pages/post_page';
import LoginPage from './components/pages/login_page';
import RegisterPage from './components/pages/register_page';
import ProfilePage from './components/pages/profile_page';
import UserEditPage from './components/pages/user_edit_page';
import ForumEditPage from './components/pages/forum_edit_page';
import ForumCreatePage from './components/pages/forum_create_page';
import PostEditPage from './components/pages/post_edit_page';
import CommentEditPage from './components/pages/comment_edit_page';

class App extends React.Component<any, IAppState> {

    static initialState: IAppState = {
        user: null,
        forums: null,
        loading: true,
    }

    private controller: any = {
        setUser: (data: IUser): Promise<void> => {
            return new Promise((resolve) => {
                this.setState(() => ({ user: data }));
                resolve()
            });
        },
        setForums: (data: IForum[]): Promise<void> => {
            return new Promise((resolve) => {
                this.setState(() => ({ forums: data }));
                resolve()
            });
        },
        addForum: (data: IForum): Promise<void> => {
            return new Promise((resolve) => {
                this.setState((state) => ({ forums: [...state.forums, data] }));
                resolve();
            });
        },
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
        this.updateForum = this.updateForum.bind(this);
        // nav
        this.goHome = this.goHome.bind(this);

        for (let i in this.controller) {
            this.controller[i] = this.controller[i].bind(this);
        }

    }

    private authenticate(): Promise<boolean> {
        return new Promise((resolve) => {
            if (jwt.check()) {
                const token = jwt.get()
                jwt.authenticate(token)
                    .then(res => {
                        res.success ? this.controller.setUser(res.payload) : errors.handle(res.payload);
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
                    res.success ? this.controller.setForums(res.payload) : errors.handle(res.payload);
                    resolve(res.success);
                })
        });
    }
    private goHome():Promise<void>{
        return new Promise((resolve)=>{
            this.props.history.push("/")
            resolve();
        });
    }
    //===== Public Methods =====\\

    // Forums
    public createForum(forum: IForum): void {
        console.log("creating forum");
        api.createForum(forum)
            .then(res => {
                res.success ?
                    this.controller.addForum(res.payload).then(() => {
                        this.goHome();
                    }) : errors.handle(res.payload);
            })
    };
    public deleteForum(id: string): void {
        console.log("Deleting forum");
        api.deleteForum(id)
            .then(res => {
                if(res.success){
                    this.goHome();
                    this.getForums();
                    
                }else{
                    errors.handle(res.payload);
                }
            });
    }
    public updateForum(updateReq:IUpdateForumRequest):void{
        api.updateForum(updateReq)
        .then(res=>{
            if(res.success){
                this.props.history.push("/forum/"+res.payload);
                this.getForums();
            }else{
                errors.handle(res.payload)
            }
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
                                    this.props.history.push("/profile/" + this.state.user._id);
                                resolve();
                            });
                    } else {
                        errors.handle(res.payload)
                        resolve();
                    }
                })
        });

    }
    public logout(mode?: number): Promise<void> {
        return new Promise((resolve) => {
            jwt.remove()
                .then(() => {
                    this.goHome().then(()=>{
                        this.controller.setUser(null).then(()=>{
                            mode === 1 && this.getForums();
                            resolve();
                        })
                    })
                })
        });

    }

    // Views
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
        const registerPageProps = {
            login:this.login,
        }
        const userEditPageProps = {
            logout: this.logout,
        }
        const forumPageProps = {
            user: this.state.user,
        }
        const postPageProps = {
            user: this.state.user,

        }
        const createForumPageProps = {
            user: this.state.user,
            createForum: this.createForum,
        }
        const ForumEditPageProps = {
            deleteForum: this.deleteForum,
            updateForum:this.updateForum,
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
                        component={(props) => <UserEditPage {...props} {...userEditPageProps} />} />
                    <Route
                        exact path="/forum/:id/edit"
                        component={(props) => <ForumEditPage {...props} {...ForumEditPageProps} />} />
                    <Route
                        exact path="/post/:id/edit"
                        component={(props) => <PostEditPage {...props} />} />
                    <Route
                        path="/comment/:id/edit"
                        component={(props) => <CommentEditPage {...props} />} />
                    <Route
                        exact path="/forum/:topic"
                        component={(props) => <ForumPage {...props} {...forumPageProps} />} />
                    <Route
                        exact path="/forums/create"
                        component={(props) => <ForumCreatePage {...props} {...createForumPageProps} />} />
                    <Route
                        exact path="/post/:id"
                        component={(props) => <PostPage {...props} {...postPageProps} />} />
                    <Route
                        exact path="/login"
                        component={(props) => <LoginPage {...props} {...loginPageProps} />} />
                    <Route
                        exact path="/register"
                        component={(props) => <RegisterPage {...props} {...registerPageProps} />} />
                    <Route
                        exact path="/profile/:id"
                        component={(props) => <ProfilePage {...props} {...profilePageProps} />} />

                </Switch>
            </div>
        );
    }
    public render(): JSX.Element {
        return !this.state.loading ? this.main() : <Loading />
    }
}


export default withRouter(App);