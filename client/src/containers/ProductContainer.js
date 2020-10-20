import React, {Component} from 'react';
import {connect} from 'react-redux';
import "../assets/containers/index.css";
import ProductCard from "../components/ProductCard";
import CircleButton from "../components/CircleButton";
import addProductIcon from "../assets/icons/addProduct.svg";
import {createProduct, deleteProduct, fetchProducts, updateProduct} from "../actions/productActions";

const errorsInProduct = product => {
    const failure = {};
    let failed = false;
    if (!product)
        return failure;
    if (!product.nome || !product.nome.trim()) {
        failure.nome = "Nome Iválido";
        failed = true;
    }
    if (!product.codigo || !product.codigo.trim()) {
        failure.codigo = "Código Inválido";
        failed = true;
    }
    if (!product.preco || !product.preco.trim()) {
        failure.codigo = "Preço Inválido";
        failed = true;
    }
    return failed ? failure : false;
}

const mapStateToProps = (state) => {
    return {products: state.products};
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchProducts: () => dispatch(fetchProducts(1)),
        createProduct: product => dispatch(createProduct(product)),
        updateProduct: product => dispatch(updateProduct(product)),
        deleteProduct: id => dispatch(deleteProduct(id))
    };
}

class ProductContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {isAddingProduct: false};
        this.createProduct = this.createProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }

    createProduct(product) {
        const failure = errorsInProduct(product);
        if (!failure) {
            product = {...product};
            product.preco = parseFloat(product.preco);
            this.props.createProduct(product).then(this.setState({isAddingProduct: false}));
        }
    }

    updateProduct(product) {
        const failure = errorsInProduct(product);
        if (!failure) {
            product = {...product};
            product.preco = parseFloat(product.preco);
            this.props.updateProduct(product);
        }
    }

    deleteProduct(id) {
        if (id)
            this.props.deleteProduct(id);
    }

    componentDidMount() {
        this.props.fetchProducts();
    }

    render() {
        const addStyle = {
            width: 40,
            height: 40,
            backgroundColor: "rgb(244, 117, 96)",
            boxShadow: "0 3px 6px rgba(0, 0, 0, .16), 0 1px 2px rgba(0, 0, 0, .23)"
        };
        return (
            <div className="container">
                <div className="container-actions">
                    {!this.state.isAddingProduct &&
                    <CircleButton style={addStyle} imgStyle={{height: 32, width: 32}} icon={addProductIcon}
                                  onClick={() => this.setState({isAddingProduct: true})}/>
                    }
                </div>
                <div className="card-list">
                    {this.state.isAddingProduct &&
                    <ProductCard variant="create" onLeftClick={this.createProduct}
                                 onRightClick={() => this.setState({isAddingProduct: false})}/>
                    }
                    {this.props.products.map(product => <ProductCard key={product.id}
                                                                     nome={product.nome}
                                                                     codigo={product.codigo}
                                                                     preco={product.preco}
                                                                     descricao={product.descricao}
                                                                     id={product.id}
                                                                     onRightClick={() => this.deleteProduct(product.id)}
                                                                     onLeftClick={this.updateProduct}/>)}
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductContainer);