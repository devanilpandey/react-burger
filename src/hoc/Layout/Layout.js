import React, { Component } from 'react';
import Aux from '../Auxiliary/Aux';
import classes from './Layout.css';
import ToolBar from '../../Components/Navigation/ToolBar/Toolbar';
import SideDrawer from '../../Components/Navigation/SideDrawer/SideDrawer';


class Layout extends Component {

    state = {
        showSideDrawer: false
    }
    sideDrawerCloseHandler = () => {
        this.setState({ showSideDrawer: false });
    }
    sideDrawerToggerHandler = () => {

        this.setState((prevState) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        });
    }
    render() {
        return (
            <Aux>
                <SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerCloseHandler} />
                <ToolBar drawerToggleClicked={this.sideDrawerToggerHandler} />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );
    }
}
export default Layout;