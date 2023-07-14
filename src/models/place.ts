
import Image from "./image";
import Province from "./province";
interface Place{
    id: string;
    name: string;
    hidden: boolean;
    placeImage: Image[];
    province: Province;
    description: string;
    addressDescription: string;
    latitude: number;
    longitude: number;
    timeClose: string;
    timeOpen: string;
    type: string;
    minPrice: number;
    maxPrice: number;
    recommendTime: string;
}

export default Place;