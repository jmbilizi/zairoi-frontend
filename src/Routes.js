import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./App";
import Signup from "./auth/Signup";
import Signin from "./auth/Signin";
import Activate from "./auth/Activate";
import Private from "./core/Private";
import PrivateRoute from "./auth/PrivateRoute";
import Forgot from "./auth/Forgot";
import Reset from "./auth/Reset";
import Profile from "./user/Profile";
import EditProfile from "./user/EditProfile";
import NewPost from "./post/NewPost";
import SinglePost from "./post/SinglePost";
import EditPost from "./post/EditPost";
import Users from "./user/Users";
import FindPeople from "./user/FindPeople";
import Admin from "./admin/Admin";

//seller
import SellerDashboard from "./user/SellerDashboard";
import SellerRoute from "./auth/SellerRoute";
import AddCategory from "./seller/AddCategory";
import AddProduct from "./seller/AddProduct";
import Orders from "./seller/Orders";
import ManageProducts from "./seller/ManageProducts";
import UpdateProduct from "./seller/UpdateProduct";
import UpdateCategory from "./seller/updateCategory";
//shop
import Shop from "./shop/Shop";
import Cart from "./shop/Cart";
import Product from "./shop/Product";
import MarketPlace from "./shop/MarketPlace";

//Massaging
import Messaging from "./chat/Chat";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
        <PrivateRoute path="/admin" exact component={Admin} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/auth/activate/:token" exact component={Activate} />
        <Route path="/users" exact component={Users} />
        <PrivateRoute path="/findpeople" exact component={FindPeople} />
        <PrivateRoute path="/messaging" exact component={Messaging} />
        <PrivateRoute path="/user/:userId" exact component={Profile} />
        <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
        <PrivateRoute exact path="/post/create" component={NewPost} />
        <Route exact path="/post/:postId" component={SinglePost} />
        <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
        <Route path="/auth/password/forgot" exact component={Forgot} />
        <Route path="/auth/password/reset/:token" exact component={Reset} />

        <SellerRoute
          path="/admin/dashboard"
          exact
          component={SellerDashboard}
        />
        <SellerRoute path="/create/category" exact component={AddCategory} />
        <SellerRoute path="/create/product" exact component={AddProduct} />
        <SellerRoute path="/admin/orders" exact component={Orders} />
        <SellerRoute
          path="/admin/product/update/:productId"
          exact
          component={UpdateProduct}
        />
        <SellerRoute
          path="/admin/category/update/:categoryId"
          exact
          component={UpdateCategory}
        />
        <SellerRoute path="/admin/products" exact component={ManageProducts} />
        <Route path="/shop" exact component={Shop} />
        <Route path="/cart" exact component={Cart} />
        <Route path="/product/:productId" exact component={Product} />
        <Route path="/marketplace" exact component={MarketPlace} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
