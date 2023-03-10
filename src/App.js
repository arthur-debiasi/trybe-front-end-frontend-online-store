import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SearchProducts from './components/SearchProducts'; //
import CheckoutProducts from './pages/CheckoutProducts';
import ShoppingCart from './pages/ShoppingCart';
import CategoriesBar from './components/CategoriesBar';
import {
  getCategories,
  getProductsFromCategoryAndQuery,
  getProductById,
} from './services/api';
import ProductDetails from './pages/ProductDetails';

export default class App extends Component {
  state = {
    categories: [],
    queryInput: '',
    queryResults: [],
    notFound: false,
    cartProducts: [],
    cartProductsAmount: 0,
  };

  componentDidMount() {
    this.getAllCategories();
    const lastCartProducts = this.getSavedCartItems();
    const lcp = JSON.parse(lastCartProducts) || [];
    const amount = lcp.reduce(((a, e) => e.cartAmout + a), 0);
    console.log(`retorno esperado ${amount}`);
    this.setState({ cartProducts: lcp, cartProductsAmount: amount });
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  handleClick = async () => {
    const { queryInput } = this.state;
    const data = await getProductsFromCategoryAndQuery('', queryInput);
    this.setState({ queryResults: data.results }, () => {
      this.setState({ notFound: data.results.length === 0 });
    });
  };

  handleRadioClick = async ({ target: { id } }) => {
    const data = await getProductById(id, '');
    this.setState({ queryResults: data.results });
  };

  getAllCategories = async () => {
    const categories = await getCategories();
    this.setState({
      categories,
    });
  };

  handleCartButton = (id) => {
    const { queryResults, cartProducts } = this.state;
    const selectProduct = queryResults.find((e) => e.id === id);
    this.setState((prevState) => {
      const prevList = prevState.cartProducts;
      const prevItem = prevList.find((e) => e.id === selectProduct.id);
      if (prevItem) {
        prevItem.cartAmout += 1;
      } else {
        selectProduct.cartAmout = 1;
        prevState.cartProducts.push(selectProduct);
      }
      // prevState.cartProducts.push(selectProduct);
    }, () => this.saveLocalStorage(cartProducts));
  };

  saveLocalStorage = (list) => {
    const amount = list.reduce(((a, e) => e.cartAmout + a), 0);
    this.setState({ cartProductsAmount: amount });
    localStorage.setItem('cartItems', JSON.stringify(list));
  };

  getSavedCartItems = () => localStorage.getItem('cartItems');

  render() {
    const { categories, queryInput, queryResults,
      notFound, cartProductsAmount } = this.state;
    return (
      <BrowserRouter>
        <Switch>
          <Route
            path="/produto/:id"
            render={ (props) => (
              <ProductDetails
                { ...props }
                handleCartButton={ this.handleCartButton }
                cartProductsAmount={ cartProductsAmount }
              />) }
          />
          <Route path="/carrinho">
            <ShoppingCart
              // cartProducts={ cartProducts }
              getSavedCartItems={ this.getSavedCartItems }
            />
          </Route>
          <Route path="/finalizar-compra"><CheckoutProducts /></Route>
          <Route path="/">

            <aside>
              <p>Categorias:</p>
              <ul>
                { categories.map((e) => (
                  <CategoriesBar
                    key={ e.id }
                    name={ e.name }
                    id={ e.id }
                    getAllCategories={ this.getAllCategories }
                    handleRadioClick={ this.handleRadioClick }
                  />
                ))}
              </ul>
            </aside>

            <SearchProducts
              queryInput={ queryInput }
              queryResults={ queryResults }
              notFound={ notFound }
              handleChange={ this.handleChange }
              handleClick={ this.handleClick }
              handleCartButton={ this.handleCartButton }
              cartProductsAmount={ cartProductsAmount }
            />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}
