import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { ProductService } from '../service/ProductService';
import { Dropdown } from 'primereact/dropdown';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { log } from './expertchat/utils'
import {startBasicCall, leaveCall} from './expertchat/Agora_RTC';


export const TalkWithExperts = () => {

    const [dataviewValue, setDataviewValue] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [sortKey, setSortKey] = useState(null);

    const [expert, setExpert] = useState('');
    const [chatStarted, setChatStarted] = useState(false);
    const [appid, setAppid] = useState('1f8602c1ee6b4b2aae034969f8b1e16c')

    const [channel, setChannel] = useState('piedpiper')
    const [token, setToken] = useState('0061f8602c1ee6b4b2aae034969f8b1e16cIADIpfcQe7Zs9uluHPY6pIKNScIg9ZgkLGTgvxXqV5uhDgH9ad4AAAAAEACP0G4myKnbYQEAAQDIqdth')
    const [isjoin, setIsJoin] = useState(false)


    const bindInputAppid = (event) => {
        setAppid(event.target.value)
    }

    const bindInputToken = (event) => {
        setToken(event.target.value)
    }

    const bindInputChannel = (event) => {
        setChannel(event.target.value)
    }

    const handleClickJoin = () => {

        let options = {
        appId: appid,
        channel: channel,
        token: token,
        }
        startBasicCall(options);
        log('join channel success');
        setIsJoin(true);
    }

    const handleClickLeave = () => {
        leaveCall();
        log('client leaves channel success');
        setIsJoin(false);
        setChatStarted(false);
    }

    const startChat = (name) => {
        setExpert(name);
        setChatStarted(true);
    }

    useEffect(() => {
        const productService = new ProductService();
        productService.getExperts().then(data => setDataviewValue(data));
    }, []);

    const sortOptions = [
        { label: 'Available', value: '!available' },
        { label: 'Not Available', value: 'available' }
    ];

    const onSortChange = (event) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        }
        else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const dataviewHeader = (
        <div className="grid grid-nogutter">
            <div className="col-6" style={{ textAlign: 'left' }}>
                <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Sort By Availability" onChange={onSortChange} />
            </div>
            <div className="col-6" style={{ textAlign: 'right' }}>
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        </div>
    );

    const dataviewListItem = (data) => {
        return (
            <div className="col-12">
                <div className="product-list-item">
                    <img src={`assets/demo/images/product/${data.image}`} alt={data.name} />
                    <div className="product-list-detail">
                        <div className="product-name">{data.name}</div>
                        <div className="product-description">{data.description}</div>
                        <Rating value={data.rating} readonly cancel={false}></Rating>
                        <i className="pi pi-tag product-category-icon"></i><span className="product-category">{data.category}</span>
                    </div>
                    <div className="product-list-action">
                        <span className="product-price">${data.price}</span>
                        <Button icon="pi pi-shopping-cart" label="Add to Cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'}></Button>
                        <span className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.inventoryStatus}</span>
                    </div>
                </div>
            </div>
        );
    };

    const dataviewGridItem = (data) => {
        return (
            <div className="col-12 md:col-4" onClick={(e) => startChat(data.name)}>
                <div className="card m-3 border-1 surface-border">
                    <div className="flex align-items-center justify-content-between">
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2"/>
                            <span className="font-semibold">{data.category}</span>
                        </div>
                        <span className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.available}</span>
                    </div>
                    <div className="text-center">
                        <img src={`assets/demo/images/expert/${data.image}`} alt={data.name}  className="w-9 shadow-2 my-3 mx-0"/>
                        <div className="text-2xl font-bold">{data.name}</div>
                        <div className="mb-3">{data.description}</div>
                        <Rating value={data.rating} readonly cancel={false}/>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (data, layout) => {
        if (!data) {
            return;
        }

        if (layout === 'list') {
            return dataviewListItem(data);
        }
        else if (layout === 'grid') {
            return dataviewGridItem(data);
        }
    };

    return (
        <div className="grid list-demo">
            

            {
                chatStarted ? (
                    <div className="col-12">
                        <div className="card">
                            <div className='home-box'>
                                <h4>Video Chat with: {expert}</h4>
                                <div className='message-box'>

                                    <div className='click-box'>
                                        <Button
                                            label="Join"
                                            disabled={isjoin}
                                            onClick={handleClickJoin}
                                            className="mr-2 mb-2"
                                        ></Button>
                                        <Button
                                            label="Leave"
                                            disabled={!isjoin}
                                            onClick={handleClickLeave}
                                            className="mr-2 mb-2"
                                        ></Button>
                                    </div>
                                </div>

                                <div className='video-agora-box'>
                                    <div id='video-agora-local'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="col-12">
                        <div className="card">
                            <h4>Talk with Experts</h4>
                            <DataView value={dataviewValue} layout={layout} paginator rows={9} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} header={dataviewHeader}></DataView>
                        </div>
                    </div>
                )
            }
            
        </div >
    )
}
