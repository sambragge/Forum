import * as React from 'react';
import * as FormData from 'form-data';
import { IProfilePageProps, IProfilePageState } from '../../interfaces';
import { Link } from 'react-router-dom';
import { api, helpers } from '../../util';
import Loading from '../loading';
import User from '../user';



const defaultAvatarMale:string = "https://i.imgur.com/Z80mud6.jpg",
    defaultAvatarFemale:string = "https://i.imgur.com/ZzdPYbE.jpg";

export default class ProfilePage extends React.Component<IProfilePageProps, IProfilePageState> {

    constructor(props: IProfilePageProps) {
        super(props);
        this.state = {
            data: null,
        }
        this.getUser = this.getUser.bind(this);
    }

    componentDidMount(): void {
        console.log("Profile Mounted", this)
        this.getUser()
    }


    //===== PRIVATE METHODS ====\\

    private isMyProfile(): boolean {
        return this.state.data._id === this.props.user._id;
    }
    private isFollowed(): boolean {
        return helpers.inArray(this.state.data._id, this.props.user._following);
    }

    private getUser(): void {
        api.getUser(this.props.match.params.id)
            .then(res => {
                if (res.success) {
                    this.setState((state) => ({ data: res.payload }));
                } else {
                    alert(res.payload);
                    this.props.goHome();
                }
            })
    }

    private followUser(): void {
        this.props.followUser({
            user1: this.props.user._id,
            user2: this.state.data._id,
        });

    }

    private unFollowUser(): void {
        this.props.unFollowUser({
            user1: this.props.user._id,
            user2: this.state.data._id,
        });
    }

    //===== VIEWS =====\\

    private info(className:string): JSX.Element {
        const x = this.state.data;
        return (
            <ul className={className}>
                <li>{x.firstName}</li>
                <li>{x.lastName}</li>
                <li>{x.email}</li>
                <li>{x.location.city} {x.location.state} {x.location.zip}</li>
                <li>Following {x.following ? x.following.length : '0'} users.</li>
                <li>{x.followers ? x.followers.length : '0'} users following {x.firstName}.</li>
                {this.props.user && !this.isMyProfile() && this.followButton()}
            </ul>
        );
    }

    private followers(className:string): JSX.Element {
        let users: any;
        if (this.state.data.followers) {
            users = this.state.data.followers.map((user, i) => {
                const props = {
                    data: user,
                    className: "standardUser",
                    goToProfile: this.props.goToProfile,
                }
                return <li key={'follower' + i}><User {...props} /></li>
            });
        }
        return (
            <div className={className}>
                <h3>~Followers~</h3>
                <ul>
                    {users ? users : <li>No Followers...</li>}
                </ul>
            </div>
        );
    }

    private following(className:string): JSX.Element {
        let users: any;
        if (this.state.data.following) {
            users = this.state.data.following.map((user, i) => {
                const props = {
                    data: user,
                    goToProfile: this.props.goToProfile,
                    className: "standardUser",
                }
                return <li key={'following' + i}><User {...props} /></li>;
            });
        }
        return (
            <div className={className}>
                <h3>~Following~</h3>
                <ul>
                    {users ? users : <li>No Following Anyone...</li>}
                </ul>
            </div>
        );
    }

    private edit(): JSX.Element {
        const id = this.state.data._id;
        return <Link to={'/user/'+id+'/edit'} >Edit</Link>;
    }

    private followButton(): JSX.Element {
        return (
            <button 
            onClick={!this.isFollowed() ? this.followUser.bind(this) : this.unFollowUser.bind(this)}
            >{!this.isFollowed() ? "Follow" : "Unfollow"}</button>
        );
    }

    private connections(className:string): JSX.Element {
        return (
            <div className={className}>
                {this.following("six columns connectionBox")}
                {this.followers("six columns connectionBox")}
            </div>
        );
    }

    private avatar(className:string):JSX.Element{
        return(
            <div className={className}>
                <img src={this.state.data.gender === 'male' ? defaultAvatarMale:defaultAvatarFemale} 
                alt={this.state.data.firstName+'s avatar'}/>
            </div>
        );
    }

    private header():JSX.Element{
        return(
            <div className="pageHeader">
                {this.props.user && this.isMyProfile() && this.edit()}
            </div>
        );
    }

    private main(): JSX.Element {

        return (
            <div className="profilePage">

                {this.header()}
                <div className="row">
                    {this.avatar("avatar")}
                    {this.info("info")}
                </div>
                {this.connections("connections row")}
                
            </div>
        );
    }



    public render(): JSX.Element {
        return this.state.data ?
            this.main() : <Loading />
    }
}
