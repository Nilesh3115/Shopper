import React, { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

// Function to get the default cart structure
const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index <= 300; index++) {
        cart[index] = 0;
    }
    return cart;
};

// Backend URL (switch for production or development)
const BASE_URL = process.env.NODE_ENV === "production" 
    ? "https://shopper-yrl3.onrender.com" 
    : "http://localhost:3000";

const ShopContextProvider = (props) => {
    const [allProducts, setAllProducts] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    // Fetch products and cart on component mount
    useEffect(() => {
        // Fetch all products
        fetch(`${BASE_URL}/allproducts`)
            .then((response) => response.json())
            .then((data) => setAllProducts(data))
            .catch((error) => console.error("Error fetching products:", error));

        // Fetch cart if authenticated
        const authToken = localStorage.getItem("auth-token");
        if (authToken) {
            fetch(`${BASE_URL}/getcart`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": authToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            })
                .then((response) => response.json())
                .then((data) => setCartItems(data))
                .catch((error) => console.error("Error fetching cart:", error));
        }
    }, []);

    // Add item to cart
    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

        const authToken = localStorage.getItem("auth-token");
        if (authToken) {
            fetch(`${BASE_URL}/addtocart`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": authToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.error("Error adding to cart:", error));
        }
    };

    // Remove item from cart
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

        const authToken = localStorage.getItem("auth-token");
        if (authToken) {
            fetch(`${BASE_URL}/removefromcart`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": authToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.error("Error removing from cart:", error));
        }
    };

    // Calculate total cart amount
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = allProducts.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    // Calculate total number of items in the cart
    const getTotalCartItems = () => {
        let totalItems = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItems += cartItems[item];
            }
        }
        return totalItems;
    };

    // Log cart updates for debugging
    useEffect(() => {
        console.log("CartItems updated:", cartItems);
    }, [cartItems]);

    // Context value to share across the application
    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        allProducts: allProducts || [],
        cartItems: cartItems || {},
        addToCart,
        removeFromCart,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 /* import React, { createContext, useState, useEffect } from "react";


export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {

    const [all_product,setAll_Product] = useState([]);
    const [CartItems, setCartItems] = useState(getDefaultCart());

    useEffect(()=>{
        fetch('http://localhost:3000/allproducts')
        .then((response)=>response.json())
        .then((data)=>setAll_Product(data))

        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:3000/getcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:"",
            }).then((response)=>response.json())
            .then((data)=>setCartItems(data));
        }
    },[])
    
    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:3000/addtocart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if(localStorage.getItem('auth-token')){
            if(localStorage.getItem('auth-token')){
                fetch('http://localhost:3000/removefromcart',{
                    method:'POST',
                    headers:{
                        Accept:'application/form-data',
                        'auth-token':`${localStorage.getItem('auth-token')}`,
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({"itemId":itemId}),
                })
                .then((response)=>response.json())
                .then((data)=>console.log(data));
            }
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in CartItems) {
            if (CartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * CartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in CartItems) {
            if (CartItems[item] > 0) {
                totalItem += CartItems[item];
            }
        }
        return totalItem;
    };

    useEffect(() => {
        console.log("CartItems updated:", CartItems);
    }, [CartItems]);

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product: all_product || [],
        CartItems: CartItems || {},
        addToCart,
        removeFromCart,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;*/





















/** import React, { createContext, useState } from "react";
import all_product from "../Components/Assets/all_product";

export const ShopContext = createContext(null);

const getDefaultCart = ()=>{
    let cart ={};
    for (let index = 0; index < all_product.length+1; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const [CartItems,setCartItems] = useState(getDefaultCart());
        const addToCart = (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1})); 
        console.log(CartItems);
    }

    const removeFromCart = (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
    }

      const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in CartItems)
        {
            if(CartItems[item]>0)
            {
                let itemInfo = all_product.find((product)=>product.id===Number(item));
                totalAmount += itemInfo.new_price * CartItems[item];
            }
           return totalAmount;
        }
    }
        const getTotalCartItems = () =>{
            let totalItem = 0;
            for(const item in CartItems)
            {
                if(CartItems[item]>0)
                {
                    totalItem+= CartItems[item];
                }
            }
        return totalItem;
    } 
    const contextValue = {getTotalCartItems,getTotalCartAmount,all_product,CartItems,addToCart,removeFromCart};
    
    return(
    <ShopContext.Provider value={contextValue}>
    {props.children}
    </ShopContext.Provider>
)
}

export default ShopContextProvider;  */