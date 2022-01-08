import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from "primereact/inputtext";


export const SignUp = () => {

    const [checked, setChecked] = useState(null);

    // useEffect(() => {
    //     const productService = new ProductService();
    //     productService.getProductsSmall().then(data => setProducts(data));
    // }, []);

    
    return (
        <div className="flex align-items-center flex-column pt-6 px-3">
            <div className="surface-card p-6 shadow-2 border-round w-full lg:w-6">
                <div className="text-center mb-5">
                    <img src="images/blocks/logos/hyper.svg" alt="hyper" height="50" className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">Sign Up to Farm Helper</div>
                    <span className="text-600 font-medium line-height-3">Already have an account?</span>
                    <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer" href="#/signin">Sign in here!</a>
                </div>

                <div>
                    <label htmlFor="name1" className="block text-900 font-medium mb-2">Name</label>
                    <InputText id="name1" type="text" className="w-full mb-3" />
                    
                    <label htmlFor="email1" className="block text-900 font-medium mb-2">Email</label>
                    <InputText id="email1" type="text" className="w-full mb-3" />

                    <label htmlFor="password1" className="block text-900 font-medium mb-2">Password</label>
                    <InputText id="password1" type="password" className="w-full mb-3" />

                    <div className="flex align-items-center justify-content-between mb-6">
                        <div className="flex align-items-center">
                            <Checkbox inputId="rememberme1" binary className="mr-2" onChange={e => setChecked(e.checked)} checked={checked} />
                            <label htmlFor="rememberme1">Remember me</label>
                        </div>
                    </div>

                    <Button label="Sign In" icon="pi pi-user" className="w-full" />
                </div>
            </div>
        </div>
        
    );
}
