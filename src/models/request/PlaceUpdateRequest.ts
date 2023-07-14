
interface PlaceUpdateRequest{
    id: string;
    name: string;
    placeImage: File[];
    removedImage: string[];
    description: string;
    addressDescription: string;
    latitude: number;
    longitude: number;
    timeClose: string;
    timeOpen: string;
    minPrice: number;
    maxPrice: number;
    recommendTime: string;
}

export default PlaceUpdateRequest;