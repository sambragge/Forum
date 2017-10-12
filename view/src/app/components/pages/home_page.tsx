import * as React from 'react';
import { IHomePageState, IHomePageProps, IUser } from '../../interfaces';
import User from '../user';
import Loading from '../loading';

export default class HomePage extends React.Component<IHomePageProps, IHomePageState> {

    constructor(props:IHomePageProps){
        super(props);
        this.state = {
            filter:null,
        }
    }

    componentDidMount():void{

        console.log("Homepage mounted ", this);
    }


    private handleChange(e:any):void{
        const newState:any = this.state;
        newState[e.target.name] = e.target.value;
        this.setState(()=>newState);
    }

    private filterMethod(user:IUser):boolean{
        if(this.state.filter){
            return user.firstName.toLowerCase().startsWith(this.state.filter.toLowerCase()) || 
            user.lastName.toLowerCase().startsWith(this.state.filter.toLowerCase())
        }else{
            return true;
        }
    }

    private header():JSX.Element{
        return(
            <div className="pageHeader row">
                <input onChange={this.handleChange.bind(this)} type="text" name="filter" placeholder="Search..."/>
            </div>
        );
    }

    private userList():JSX.Element{
        const users:JSX.Element[] = this.props.users.filter(this.filterMethod.bind(this)).map((user, i)=>{
            const props = {
                data:user,
                className:"standardUser",
                goToProfile:this.props.goToProfile,
            }
            return <li key={'user'+i}><User {...props} /></li>
        });
        return(
            <ul>
                {users.length > 0 ? users:<li>No users here...</li>}
            </ul>
        );
    }
    public render(){
        return(
            <div className="homePage">
                {this.header()}
                {this.props.users ? this.userList():<Loading/>}
            </div>
        );
    }
}