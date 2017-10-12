
//=== !APLICATION STATE! ===\\ : high level
export interface IAppState {
    user: IUser,
    users: IUser[],
    forums: IForum[],
}
//==========================\\

// header
export interface IHeaderProps {
    logout: Function,
    user: IUser,
}
export interface IAuthbarProps {
    logout: Function,
    user: IUser,
}

// loginPage
export interface ILoginPageState {
    email: string,
    password: string,
}
export interface ILoginPageProps {
    login: Function,
}

// HomePage
export interface IHomePageProps {
    users: IUser[],
    goToProfile: Function,
}
export interface IHomePageState {
    filter: string,
}

// ProfilePage
export interface IProfilePageState {
    data: IUser,
}
export interface IProfilePageProps {
    user: IUser,
    goHome: Function,
    goToProfile: Function,
    followUser: Function,
    unFollowUser: Function,
    match?: any,
}

// RegisterPage
export interface IRegisterPageState {
    gender: string,
    firstName: string,
    lastName: string,
    email: string,
    state: string,
    city: string,
    zip: string,
    password: string,
    confirmPassword: string,
}
export interface IRegisterPageProps {
    createUser: Function,
}

// ForumsPage
export interface IForumsPageState {
    topic: string,
    description: string,
    filter: string,
}
export interface IForumsPageProps {
    user: IUser,
    createForum: Function,
    forums: IForum[],
    goToForumPage: Function,
}

// ForumPage
export interface IForumPageState {
    data: IForum,
    filter: string,
    title: string,
    content: string,
}
export interface IForumPageProps {
    user: IUser,
    createPost: Function,
    goToPostPage: Function,
    goToForumsPage: Function,
    match?: any,
}

// PostPage
export interface IPostPageState {
    data: IPost,
    comment: string,
}
export interface IPostPageProps {
    user: IUser,
    createComment: Function,
    deleteComment: Function,
    deletePost: Function,
    goToForumsPage: Function,
    match?: any,
}

// UserEditPage
export interface IUserEditPageState {
    data: IUser,
    updateDisabled:boolean,
    firstName: string,
    lastName: string,
    state: string,
    city: string,
    zip: string,
}
export interface IUserEditPageProps {
    match?:any,
    history?:any,
    deleteUser: Function,
    updateUserInfo:Function,
}

// ForumEditPage
export interface IForumEditPageProps {
    match?:any,
    history?:any,
    deleteForum:Function,
}
export interface IForumEditPageState {
    data:IForum,
    updateDisabled:boolean,
    topic:string,
    description:string,
}



// User
export interface IUser {
    _id?: string,
    gender: string,
    firstName: string,
    lastName: string,
    email: string,
    location: ILocation,
    _following?: string[],
    following?: IUser[],
    followers?: IUser[],
    password: string,
    confirmPassword?: string,
    _createdAt?: Date,
    _updatedAt?: Date,
}
export interface IUserProps {
    data: IUser,
    className: string,
    goToProfile: Function,
}

// Forum
export interface IForum {
    _id?: string,
    _creator: string,
    creator?: IUser,
    topic: string,
    description: string,
    posts?: IPost[],
    _createdAt?: Date,
    _updatedAt?: Date,
}
export interface IForumProps {
    data: IForum,
    className: string,
    goToForumPage: Function,
    edit: boolean,
}

// ForumPost
export interface IPost {
    _id?: string,
    title: string,
    _parent: string,
    content: string,
    _creator: string,
    creator?: IUser,
    comments?: IComment[],
    _createdAt?: Date,
    _updatedAt?: Date,
}
export interface IPostProps {
    data: IPost,
    className: string,
    goToForumPostPage: Function,
    edit: boolean,
}

// ForumComment
export interface IComment {
    _id?: string,
    content: string,
    _creator: string,
    creator?: IUser,
    _parent: string,
    _createdAt?: Date,
    _updatedAt?: Date,
}
export interface ICommentProps {
    data: IComment,
    className: string,
    deleteComment: Function,
    edit: boolean,
}

//=== Misc..
export interface IStandardResponse {
    success: boolean,
    payload: any,
}
export interface IFollowRequest {
    user1: string,
    user2: string,
}
export interface ILoginCredentials {
    email: string,
    password: string,
}
export interface ILocation {
    state: string,
    city: string,
    zip: string,
}
export interface IUpdateUserInfoRequest {
    _id:string,
    firstName:string,
    lastName:string,
    location:ILocation
}

