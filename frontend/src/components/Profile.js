import React, { useState, useContext } from 'react';
import { Button } from 'primereact/button';
import { useGlobalState } from '../state';


export const Profile = (props) => {

    const [userData, setUserData] = useGlobalState("userData");
    console.log(userData);
    const user = userData.user;

    // useEffect(() => {
    //     const productService = new ProductService();
    //     productService.getProductsSmall().then(data => setProducts(data));
    // }, []);

    return (
        <div className="flex align-items-center flex-column pt-6 px-3">
                        
            <div className="surface-section px-4 py-5 md:px-6 lg:px-8">
                
                <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                    <div>
                        <div className="font-medium text-3xl text-900">{user.name}</div>
                        <div className="flex align-items-center text-700 flex-wrap">
                            <div className="mr-5 flex align-items-center mt-3">
                                <i className="pi pi-users mr-2"></i>
                                <span>{user.username}</span>
                            </div>
                            <div className="mr-5 flex align-items-center mt-3">
                                <i className="pi pi-globe mr-2"></i>
                                <span>{user.mobile}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 lg:mt-0">
                        <Button label="Add" className="p-button-outlined mr-2" icon="pi pi-user-plus" />
                        <Button label="Save" icon="pi pi-check" />
                    </div>
                </div>
            </div>


            <div className="surface-ground px-4 py-5 md:px-6 lg:px-8">
                <div className="grid">
                    <div className="col-12 md:col-6 lg:col-4">
                        <div className="surface-card shadow-2 p-3 border-round">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Crops History</span>
                                    <div className="text-900 font-medium text-xl">152</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">24 new </span>
                            <span className="text-500">since last visit</span>
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-4">
                        <div className="surface-card shadow-2 p-3 border-round">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Coins Awarded</span>
                                    <div className="text-900 font-medium text-xl">{user.coins}</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-euro text-orange-500 text-xl"></i>
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">%52+ </span>
                            <span className="text-500">since last week</span>
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-4">
                        <div className="surface-card shadow-2 p-3 border-round">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Active Crops</span>
                                    <div className="text-900 font-medium text-xl">28441</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-inbox text-cyan-500 text-xl"></i>
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">520  </span>
                            <span className="text-500">newly registered</span>
                        </div>
                    </div>
                    {/*<div className="col-12 md:col-6 lg:col-3">
                        <div className="surface-card shadow-2 p-3 border-round">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Comments</span>
                                    <div className="text-900 font-medium text-xl">152 Unread</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-comment text-purple-500 text-xl"></i>
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">85 </span>
                            <span className="text-500">responded</span>
                        </div>
                    </div>*/}
                </div>
            </div>
                
                
        </div>
        
    );
}
