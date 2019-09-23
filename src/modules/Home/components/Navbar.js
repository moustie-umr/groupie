import React, { Component } from 'react'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem } from 'reactstrap';
import logo from "../../../../src/logo.png";


export class AppNavbar extends Component {
    state = {
        isOpen: false
    }
    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }
    render() {
        return (
            <div>
                <Navbar color="primary" dark expand="md">
                    <NavbarBrand href="/"><img src={logo} height="75px"/></NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <button type="button" className="btn btn-outline-light" onClick={this.props.onLogout}>Logout</button>
                            </NavItem>
                        </Nav>
                    </Collapse>              
                </Navbar>
            </div>
        )
    }
}









export default AppNavbar
