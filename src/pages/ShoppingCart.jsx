import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CartProducsCard from '../components/CartProducsCard';

export default class ShoppingCart extends Component {
  state = {
    storage: [],
  };

  componentDidMount() {
    const { getSavedCartItems } = this.props;
    const save = getSavedCartItems();
    const saved = JSON.parse(save) || [];
    this.setState({
      storage: saved,
    });
  }

  itemsIncrease = (id) => {
    this.setState((prev) => {
      const prevStorage = prev.storage;
      const prevIndex = prevStorage.findIndex((e) => e.id === id);
      const { available_quantity: availableQuantity, cartAmout } = prevStorage[prevIndex];
      if (cartAmout < availableQuantity) {
        prevStorage[prevIndex].cartAmout += 1;
        localStorage.setItem('cartItems', JSON.stringify(prevStorage));
        return ({ storage: prevStorage });
      }
    });
  };

  itemsDecrease = (id) => {
    this.setState((prev) => {
      const prevStorage = prev.storage;
      const prevIndex = prevStorage.findIndex((e) => e.id === id);
      const { cartAmout } = prevStorage[prevIndex];
      if (cartAmout >= 2) {
        prevStorage[prevIndex].cartAmout -= 1;
        localStorage.setItem('cartItems', JSON.stringify(prevStorage));
        return ({ storage: prevStorage });
      }
    });
  };

  removeItem = (id) => {
    const { storage } = this.state;
    const list = storage.filter((e) => e.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(list));
    this.setState({ storage: list });
  };

  render() {
    const { storage } = this.state;
    return (
      <section>
        { storage.length === 0
          ? (
            <h1 data-testid="shopping-cart-empty-message">
              Seu carrinho está vazio
              {' '}
            </h1>)
          : storage.map((e) => (
            <CartProducsCard
              key={ e.id }
              id={ e.id }
              quantity={ e.available_quantity }
              title={ e.title }
              price={ e.price }
              thumbnail={ e.thumbnail }
              amount={ e.cartAmout }
              removeItem={ this.removeItem }
              itemsIncrease={ this.itemsIncrease }
              itemsDecrease={ this.itemsDecrease }
            />))}
        <Link to="/finalizar-compra">
          <button type="button" data-testid="checkout-products">Finalizar Compra</button>
        </Link>
      </section>
    );
  }
}

ShoppingCart.propTypes = {
  storage: PropTypes.array,
}.isREquired;
