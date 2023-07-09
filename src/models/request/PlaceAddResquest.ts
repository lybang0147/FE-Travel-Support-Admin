

interface PlaceAddRequest{
    name: string;
    placeImage: File[];
    provinceId: string;
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

export default PlaceAddRequest;