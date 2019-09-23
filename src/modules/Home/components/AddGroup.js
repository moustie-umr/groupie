import React, { PureComponent } from 'react';
import Groups from '../../../providers/groups';

export class AddGroup extends PureComponent {
    constructor(props){
        super(props);

        this.state = {
            name: '',
            description: '',
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
        const {name, description} = this.state;

        try {
            const grp = await Groups.create({
                name,
                description
            });

            this.props.onAdded(grp);

        } catch (error) {
            console.log(error);
            this.toggleLoading();
        }
    }
    
    render() {
        const {name, description} = this.state;
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="groupName">Group Name</label>
                        <input 
                            type="text" 
                            className="form-control"  
                            id="groupName" 
                            placeholder="Enter Group Name"
                            value={name}
                            onChange={(e) => this.setState({name: e.target.value})}
                            />
                    </div>
                    <div className="form-group">
                        <label htmlFor="groupDescription">Description</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="groupDescription" 
                            placeholder="Enter Group Description" 
                            value={description}
                            onChange={(e) => this.setState({description: e.target.value})}
                            />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    }
}

export default AddGroup
