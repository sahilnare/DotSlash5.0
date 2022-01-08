import axios from 'axios';

const cropUrl = 'http://localhost:3001/crops';

export class CropService {

    getCrop(cropData) {
        console.log(cropData);
        return axios.post(cropUrl, {
            cropData: cropData
        }).then(res => res.data);
        
    }

}