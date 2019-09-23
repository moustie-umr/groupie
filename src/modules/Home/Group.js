import React, { PureComponent } from 'react';
import { Modal, Toast, ToastHeader } from 'reactstrap';
import Groups from '../../providers/groups';
import AddMember from './components/AddMember';

class GroupComponent extends PureComponent {
    constructor(props){
        super(props);
        
        this.state = {
            loading: false,
            showToast: false,
            showModal: false,
        }
    }

    componentDidMount(){
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

    toggleToast = () => {
        this.setState((prevState) => ({
            showToast: !prevState.showToast
        }))
    }

    onMemberAdded = (res) => {
        this.toggleModal();
        this.toggleToast();
    }

    render(){
        const { loading, showModal, showToast } = this.state;
        return (
            <div>
                <div className="text-center mt-5">
                    <button type="button" className="btn btn-outline-success" onClick={this.toggleModal}>
                        Invite member
                    </button>
                </div>

                <Modal isOpen={showModal} toggle={this.toggleModal}>
                    <div className="modal-body">
                        <AddMember onAdded={this.onMemberAdded} />
                    </div>
                </Modal>

                <Toast isOpen={showToast}>
                    <ToastHeader toggle={this.toggleToast}>Toast title</ToastHeader>
                    <div className="toast-body">
                        Successfully in added member
                    </div>
                </Toast>
            </div>
        )
    }
}

export default GroupComponent;