
interface PlaceUpdateRequest{
    name: string;
    placeImage: File[];
    stayRemoveImage: string[];
    province: string;
    description: String;
    addressDescription: String;
    latitude: number;
    longitude: number;
    timeClose: string;
    timeOpen: string;
    minPrice: number;
    maxPrice: number;
    recommended_time: string;
}

export default PlaceUpdateRequest;