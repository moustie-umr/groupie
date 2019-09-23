import React, { PureComponent } from 'react';
import { Modal } from 'reactstrap';
import Groups from '../../providers/groups';
import AddGroup from './components/AddGroup';
import { Container, ListGroup, ListGroupItem, Row, Col } from 'reactstrap';

class GroupComponent extends PureComponent {
    constructor(props){
        super(props);
        
        this.state = {
            loading: true,
            showModal: false,
            groups: [],
        }
    }

    async componentDidMount(){
        const groups = await Groups.all();
        this.setState({ groups})
    }

    toggleLoading = () => {
        this.setState((prevState) => ({
            loading: !prevState.loading
        }))
    }

    toggleModal = () => {
        this.setState((prevState) => ({
            showModal: !prevState.showModal
        }))
    }

    onGroupAdded = (group) => {
        this.toggleModal();
        const groups = this.state.groups.slice();
        groups.push(group);
        this.setState({groups});
        this.props.history.push(`home/${group.id}`); 
    }

    render(){
        const { groups, showModal } = this.state;
        return (
            <Container>
                <div>
                    {groups.length < 1 && <h1 className="font-weight-light text-center"> no groups</h1>}
                    <Row>
                        <Col xs="4"></Col>
                        <Col xs="4" className="text-center pt-5 pb-4">
                            <h3>Groups </h3>
                            {groups.map((item, index) => (                               
                                <div key={index}>
                                    <ListGroup className="pt-1">
                                        <ListGroupItem  tag="a" href="#" action>{item.name}</ListGroupItem>
                                    </ListGroup>
                                </div>                        
                            ))} 
                            <button type="button" className="mt-3 btn btn-outline-success" onClick={this.toggleModal}>+ Create New Group</button>
                        </Col>
                        <Col xs="4"></Col>
                      </Row>
                </div>                            
                
                <Modal isOpen={showModal} toggle={this.toggleModal}>
                    <div className="modal-body">
                        <AddGroup onAdded={this.onGroupAdded} />
                    </div>
                </Modal>
            </Container>
        )
    }
}

export default GroupComponent;