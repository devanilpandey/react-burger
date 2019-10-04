import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Aux';
import Burger from '../../Components/Burger/Burger';
import BuildControls from '../../Components/Burger/BuildControls/BuildControls';
import Modal from '../../Components/UI/Modal/Modal';
import OrderSummary from '../../Components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHander';
import Spinner from '../../Components/UI/Spinner/Spinner'
const INGREDIENT_PRICES = {
    salad: 5,
    cheese: 4,
    meat: 13,
    bacon: 7
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 40,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }


    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    updatePurchaseState(updatedIngrdients) {
        const sum = Object.keys(updatedIngrdients)
            .map(igKey => {
                return updatedIngrdients[igKey]
            }).reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({ purchaseable: sum > 0 });
    }
    puchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHanlder = () => {
        this.setState({ loading: true });
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Anil',
                address: {
                    street: 'Test Street',
                    zipCode: '201204',
                    country: 'India'
                },
                email: 'test@test.com'
            },
            delieveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false, purchasing: false });
            }
            )
            .catch(error => {
                this.setState({ loading: false, purchasing: false });
            });

    }
    addIngredientHandler = (type) => {

        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngrdients = {
            ...this.state.ingredients
        };

        updatedIngrdients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({ totalPrice: newPrice, ingredients: updatedIngrdients });

        this.updatePurchaseState(updatedIngrdients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount > 0) {
            const updatedCount = oldCount - 1;
            const updatedIngrdients = {
                ...this.state.ingredients
            };
            updatedIngrdients[type] = updatedCount;
            const priceDeduction = INGREDIENT_PRICES[type];
            const oldPrice = this.state.totalPrice;
            const newPrice = oldPrice - priceDeduction;
            this.setState({ totalPrice: newPrice, ingredients: updatedIngrdients });

            this.updatePurchaseState(updatedIngrdients);
        }
    }
    componentDidMount() {

        axios.get('/ingredients.json')
            .then(response => {
                this.setState({ ingredients: response.data })
            }
            )
            .catch(error => {
                this.setState({ error: true });
            });

    }
    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };

        for (var key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Burger content can't be loaded. </p> : <Spinner />

        if (this.state.ingredients) {

            burger = <Aux>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchaseable={this.state.purchaseable}
                    purchased={this.purchaseHandler}
                />
            </Aux>
            orderSummary = <OrderSummary
                totalPrice={this.state.totalPrice}
                purchaseCancel={this.puchaseCancelHandler}
                purchaseContinue={this.purchaseContinueHanlder}
                ingredients={this.state.ingredients} />
        }

        if (this.state.loading) {
            orderSummary = <Spinner />;
        }
        return (
            <Aux>

                <Modal modalClosed={this.puchaseCancelHandler} show={this.state.purchasing}>
                    {orderSummary}
                </Modal>

                {burger}
            </Aux>
        );
    }
}
export default withErrorHandler(BurgerBuilder, axios);