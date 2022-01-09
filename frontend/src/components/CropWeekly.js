import React, { useEffect, useState } from 'react';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { WeeklyService } from '../service/WeeklyService';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { CropService } from '../service/CropService';
import { useGlobalState } from '../state';
// import { useGlobalState } from '../state';

export const CropWeekly = () => {

    const [products, setProducts] = useState([]);
    const [weekSelected, setWeekSelected] = useState(0);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [dropdownValue, setDropdownValue] = useState(null);

    const [userCropHeights, setUserCropHeights] = useState([]);

    const [userData, setUserData] = useGlobalState("userData");
    const cropService = new CropService();
    
    const dropdownValues = [
        { name: 'Corn', code: 'NY' },
        { name: 'Rice', code: 'RM' },
        { name: 'Wheat', code: 'LDN' },
        { name: 'Maize', code: 'IST' },
        { name: 'Other', code: 'PRS' }
    ];
  
    const carouselResponsiveOptions = [
        {
            breakpoint: "1024px",
            numVisible: 3,
            numScroll: 3,
        },
        {
            breakpoint: "768px",
            numVisible: 2,
            numScroll: 2,
        },
        {
            breakpoint: "560px",
            numVisible: 1,
            numScroll: 1,
        },
    ];

    useEffect(() => {
        const productService = new WeeklyService();
        productService.getWeekly().then((products) => setProducts(products));

        cropService.getWeeklyCrop({username: userData.user.username}).then(res => {
            console.log(res.heights);
            setUserCropHeights(res.heights);
        }).catch(err => console.log(err));

    }, []);

    const myUploader = (event) => {
        //event.files == files to upload
        let cImgUrl;

        var formData = new FormData();
        
        formData.append("imageFile", event.files[0]);
        
        const url = "https://api.cloudinary.com/v1_1/dflkduc49/image/upload";

        const cFormData = new FormData();

            let file = event.files[0];
            cFormData.append("file", file);
            cFormData.append("upload_preset", "tyzp2w7e");

            fetch(url, {
            method: "POST",
            body: cFormData
            })
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                cImgUrl = JSON.parse(data);


                axios.post('http://localhost:3001/weeklyheight', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    console.log(res.data);
                    const accHeight = Math.round(res.data.height * 100) / 100;
                    let points = 0;

                    switch(weekSelected) {
                        case 1:
                            if(accHeight > 0) {
                                points = 5;
                            }
                            break;
                        case 2:
                            if(accHeight >= 5.08) {
                                points = 10;
                            }
                            break;
                        case 3:
                            if(accHeight >= 10.16) {
                                points = 10;
                            }
                            break;
                        case 4:
                            if(accHeight >= 15.24) {
                                points = 10;
                            }
                            break;
                        case 5:
                            if(accHeight >= 20.32) {
                                points = 10;
                            }
                            break;
                        default:
                            break;
                    }

                    setTimeout(() => {
                        cropService.sendWeeklyCrop({username: userData.user.username, height: accHeight, weekNum: weekSelected, points: points, imagePath: cImgUrl.url});
                    }, 1000);

                    
                    setUploadOpen(false);
                    setTimeout(() => {
                        cropService.getWeeklyCrop({username: userData.user.username}).then(res => {
                            console.log(res.heights);
                            setUserCropHeights(res.heights);
                        });
                    }, 5000);
                });


            });
    }

    const finalCropDisplay = products.map((pro, i) => {
        if(userCropHeights[i]) {
            pro.height = userCropHeights[i].height;
            pro.inventoryStatus = 'INSTOCK';
            pro.uploaded = 'UPLOADED';
            pro.points = userCropHeights[i].points;
            pro.image = userCropHeights[i].imagePath;
            return pro;
        }
        return pro;
    });

    const carouselItemTemplate = (product) => {
        return (
            <div className="product-item">
                <div className="product-item-content">
                    <div className="mb-3">
                        <img src={product.image} alt={product.name} className="product-image" />
                    </div>
                    <div>
                        <h4 className="p-mb-1">
                            {product.name}
                        </h4>
                        <h6 className="mt-0 mb-3">Points: {product.points}</h6>
                        <h6 className="mt-0 mb-3">Height: {product.height} cm</h6>
                        <span className={`product-badge status-${product.inventoryStatus.toLowerCase()}`}>{product.uploaded}</span>
                        <div className="car-buttons mt-5">
                            <Button type="button" onClick={(e) => {
                                e.preventDefault();
                                setWeekSelected(product.week);
                                setUploadOpen(true);
                            }} className="p-button p-button-rounded mr-2" icon="pi pi-upload"></Button>
                            <Button type="button" className="p-button-help p-button-rounded" icon="pi pi-cog"></Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="grid p-fluid media-demo">
            <div className="col-12">
                <div className="card">
                    <h5>Weekly Updates, Get Rewards!</h5>
                    <div className="col-12 md:col-6 lg:col-4 p-4">
                    <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" placeholder="New Crop" />
                    </div>
                    
                    <Carousel value={finalCropDisplay} numVisible={3} numScroll={3} responsiveOptions={carouselResponsiveOptions} itemTemplate={carouselItemTemplate}></Carousel>
                </div>
            </div>

            {
                uploadOpen ? (
                    <div className="col-12">
                        <div className="card">
                            <h4>Week {`${weekSelected}`}</h4>
                            <div className="pt-3"><h5>Please upload a picture of your crop</h5></div>
                            <FileUpload name="imageFile" customUpload uploadHandler={myUploader} accept="image/*" maxFileSize={10000000} />
                        </div>
                    </div>
                ) : null
            }
            
        </div>
    );
}
