import React, { PureComponent } from 'react';
import Groups from '../../../providers/groups';

export class AddMember extends PureComponent {
    constructor(props){
        super(props);

        this.state = {
            email: '',
            loading: false
        }
    }

    toggleLoading = () => {
        this.setState((prevState) => ({
            loading: !prevState.loading
        }))
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        this.toggleLoading();
        const {email} = this.state;

        try {
            const res = await Groups.member({email});
            this.props.onAdded(res);

        } catch (error) {
            console.log(error);
            this.toggleLoading();
        }
    }
    
    render() {
        const {email} = this.state;
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Member Email</label>
                        <input 
                            type="email" 
                            className="form-control"  
                            id="email" 
                            placeholder="Enter Member Email"
                            value={email}
                            onChange={(e) => this.setState({email: e.target.value})}
                            />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    }
}

export default AddMember
