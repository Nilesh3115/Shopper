 import React, { createContext, useState, useEffect } from "react";


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
        fetch('https://shopper-yrl3.onrender.com')
        .then((response)=>response.json())
        .then((data)=>setAll_Product(data))

        if(localStorage.getItem('auth-token')){
            fetch('https://shopper-yrl3.onrender.com',{
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
            fetch('https://shopper-yrl3.onrender.com',{
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
                fetch('https://shopper-yrl3.onrender.com',{
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

export default ShopContextProvider;





















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