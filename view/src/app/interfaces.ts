
//=== !APLICATION STATE! ===\\ : high level
export interface IAppState {
    user: IUser,
    forums: IForum[],
    loading:boolean
}
//==========================\\

// header
export interface IHeaderProps {
    logout: Function,
    forums:IForum[],
    user: IUser,
}
export interface IAuthbarProps {
    logout: Function,
    user: IUser,
}
export interface INavbarProps {
    forums:IForum[],
    user:IUser,
}

// LoginPage
export interface ILoginPageState {
    email: string,
    password: string,
}
export interface ILoginPageProps {
    login: Function,
}

// HomePage
export interface IHomePageProps {
    user:IUser,
}
export interface IHomePageState {
    filter: string,
    posts:IPost[],
}

// ProfilePage
export interface IProfilePageState {
    data: IUser,
}
export interface IProfilePageProps {
    user: IUser,
    match?: any,
    history?:any,
}

// RegisterPage
export interface IRegisterPageState {
    gender: string,
    username:string,
    email: string,
    state: string,
    city: string,
    password: string,
    confirmPassword: string,
}
export interface IRegisterPageProps {
    history?:any,
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
}

// ForumPage
export interface IForumPageState {
    data: IForum,
    filter: string,
}
export interface IForumPageProps {
    user: IUser,
    match?: any,
    history?:any,
}

// PostPage
export interface IPostPageState {
    data: IPost,
    comment: string,
}
export interface IPostPageProps {
    user: IUser,
    match?: any,
    history?:any,
}

// UserEditPage
export interface IUserEditPageState {
    data: IUser,
    updateDisabled:boolean,
    username:string,
    state: string,
    city: string,
}
export interface IUserEditPageProps {
    match?:any,
    history?:any,
}

// ForumEditPage
export interface IForumEditPageProps {
    match?:any,
    history?:any,
}
export interface IForumEditPageState {
    data:IForum,
    updateDisabled:boolean,
    topic:string,
    description:string,
}

export interface IForumCreatePageProps {
    history?:any,
    user:IUser,
    createForum:Function,
}
export interface IForumCreatePageState {
    topic:string,
    description:string,
}



// User
export interface IUser {
    _id?: string,
    gender: string,
    username:string,
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
    history?:any,
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
    edit: boolean,
    history?:any,
}

// Post
export interface IPost {
    _id?: string,
    title: string,
    _parent: string,
    parent?:IForum,
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
    editable: boolean,
    history?:any,
}

// Comment
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
    editable: boolean,
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
}
export interface IUpdateUserInfoRequest {
    _id:string,
    username:string,
    location:ILocation
}

