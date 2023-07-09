import React, { FC, useEffect } from "react";
import Input from "shared/Input/Input";
import Select from "shared/Select/Select";
import CommonLayout from "./CommonLayout";
import FormItem from "./FormItem";
import Label from "components/Label/Label";
import Textarea from "shared/Textarea/Textarea";
import { useState } from "react";
import useWindowSize from "hooks/useWindowResize";
import { DayPickerSingleDateController } from "react-dates";
import Province from "models/province";
import provinceService from "api/provinceApi";
import { toast } from "react-hot-toast";
import NoImage from "../../images/no-image.jpg";
import GallerySlider from "components/GallerySlider/GallerySlider";
import { InputLabel, TextField} from "@mui/material";
import Amentity from "models/amenity";
import amenitiesService from "api/amenitiesApi";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress,Box,Typography } from "@mui/material";
import stayService from "api/stayApi";
import AutoCompleteSearch from "components/AutoComplete/AutoCompleteSearch";
import PlaceAddRequest from "models/request/PlaceAddResquest";
import placesService from "api/placeApi";

export interface PageAddListing1Props {
  className?: string;
}

const PageAddListing1: FC<PageAddListing1Props> = ({
  className = "",
}) => {

  const [provinces,setProvinces] = useState<Province[]>();
  const [pickedProvince, setPickedProvince] = useState<string | undefined>();
  const [pickedType, setPickedType] = useState<string | undefined>();
  const [placeName, setPlaceName] = useState<string>("");
  const [placeAddress, setPlaceAddress] = useState({
    address: "",
    longitude: 0,
    latitude: 0
  });
  const [placeDetails, setPlaceDetails] = useState<string>("");
  const [imageFile, setImageFile] = useState<File[] | null>(null);
  const [imageLink, setImageLink] = useState<string[] | null>(null);
  const [amenities, setAmenities] = useState<Amentity[]>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [checkinTime, setCheckinTime] = useState<string>("");
  const [checkoutTime, setCheckoutTime] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [recommendTime, setRecommendTime] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);


  const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPickedProvince(event.target.value);
  };

  const handleTypedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPickedType(event.target.value);
  };

  const handlePlaceNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlaceName(event.target.value);
  };

  const handlePlaceAddressChange = (address: { address: string; longitude: number; latitude: number }) => {
    setPlaceAddress(address);
    console.log(address);
  };

  const handlePlaceDetailsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPlaceDetails(event.target.value);
  };

  const handleDialogToggle = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleRecommendTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= 1 && value <= 8) {
      setRecommendTime(value.toString());
    }
  };

  const handleDeleteImage = () => {
    if (imageLink && imageLink.length > 0) {
      const updatedImageLink = imageLink.slice(1); 
      setImageLink(updatedImageLink);
  
      if (imageFile && imageFile.length > 0) {
        const updatedImageFile = imageFile.slice(1); 
        setImageFile(updatedImageFile);
      }
    }
  };

  useEffect(() => {
    const fetchProvinceList = async () => {
      try {
        const provinceList = await provinceService.getAllProvince();
        setProvinces(provinceList.content);
      } catch (error) {
        console.log("Error fetching booking list:", error);
      }
    };
    
    fetchProvinceList();
  }, []);


  const checkTypeFile = (type: any, filename: string) => {
    const typeFile = ["image/jpeg", "image/png", "image/jpg"];
    const validFilenameRegex = /^[a-zA-Z0-9_.-]+$/;
    return typeFile.includes(type) && validFilenameRegex.test(filename);
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const filename = file.name;
      console.log(filename);
      reader.readAsDataURL(file);
      if (checkTypeFile(file.type,filename)) {
        if (file.size < 1024 * 1024 * 5) {
          setImageFile((prevImageFiles) => {
            if (prevImageFiles) {
              return [...prevImageFiles, file];
            }
            return [file];
          });
          reader.onloadend = function (e: ProgressEvent<FileReader>) {
            setImageLink((prevImageLinks) => {
              if (prevImageLinks) {
                return [...prevImageLinks, reader.result as string];
              }
              return [reader.result as string];
            });
          }.bind(this);
        } else {
          toast.error("Hình ảnh upload quá lớn, Hình ảnh phải nhỏ hơn 5MB");
        }
      } else {
        toast.error(
          " Chỉ cho phép upload đuôi (.jpg .png .jpeg) và tên tệp chỉ bao gồm chữ thường, chữ hoa, số, dấu gạch dưới và dấu gạch giữa '_-'"
        );
      }
    }
  };

  const handleSubmit = async () => {
    if (
      !pickedType ||
      !placeName ||
      !placeAddress ||
      placeAddress.address === "" ||
      !placeDetails ||
      !pickedProvince ||
      !imageLink ||
      imageLink.length === 0 ||
      !imageFile ||
      !checkinTime ||
      checkinTime === "" ||
      !checkoutTime ||
      checkoutTime === "" ||
      minPrice>maxPrice ||
      !recommendTime
    ) {
      toast.error("Vui lòng điền toàn bộ các trường");
      return;
    }
    const newPlace: PlaceAddRequest = {
      name: placeName,
      addressDescription: placeAddress.address,
      placeImage: imageFile,
      type: pickedType,
      description: placeDetails,
      provinceId: pickedProvince,
      timeOpen: checkinTime,
      timeClose: checkoutTime,
      longitude: placeAddress.longitude,
      latitude: placeAddress.latitude,
      recommendTime: recommendTime,
      minPrice: minPrice,
      maxPrice: maxPrice,
    }
    
    try
    {
      setIsProcessing(true);
      const response = await placesService.createPlace(newPlace);
      toast.success("Thêm nơi ở thành công");
      window.location.href = "/place";
    }
    catch (error)
    {
      toast.error("Lỗi khi thêm địa điểm");
    }
    finally
    {
      setIsProcessing(false);
    }
  };


  return (
    <CommonLayout
      index="01"
      backtHref="/place"
      nextHref="/add-listing-2"
      nextBtnText="Submit"
      onSubmit={handleSubmit}
    >
      <>
        <h2 className="text-2xl font-semibold">Thông tin địa điểm</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* FORM */}
        <div className="space-y-8">
          {/* ITEM */}
          <FormItem
            label="Loại địa điểm"
            desc=""
          >
            <Select onChange={handleTypedChange} value={pickedType}>
              <option value="">Chọn Loại địa điểm</option>
              <option value="Ẩm thực">Ẩm thực</option>
              <option value="Tham Quan">Du lịch</option>
            </Select>
          </FormItem>
          <FormItem
            label="Tên địa điểm"
            desc="Tên ngắn gọn của địa điểm"
          >
            <Input
              placeholder="Tên địa điểm"
              value={placeName}
              onChange={handlePlaceNameChange}
            />
          </FormItem>
          <FormItem
            label="Chi tiết địa điểm"
            desc="Các thông tin chi tiết hơn về địa điểm này"
          >
            <Textarea
              placeholder="..."
              rows={14}
              value={placeDetails}
              onChange={handlePlaceDetailsChange}
            />
          </FormItem>
        <FormItem
            label="Tỉnh, thành phố"
            desc="Tỉnh, thành phố của địa điểm"
          >
            <Select onChange={handleProvinceChange} value={pickedProvince}>
              <option value="">Chọn tỉnh/thành phố</option>
              {provinces?.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </Select>
          </FormItem>
          <FormItem label="Địa chỉ cụ thể của địa điểm" desc={`Địa chỉ đã chọn: ${placeAddress.address}`}>
            <AutoCompleteSearch
              value={placeAddress.address}
              onChange={handlePlaceAddressChange}
            />
          </FormItem>
          <FormItem label="Thời gian mở cửa" desc="Chọn thời gian mở cửa">
            <TextField
              type="time"
              value={checkinTime}
              onChange={(e) => setCheckinTime(e.target.value)}
              inputProps={{
                step: 300, 
              }}
            />
          </FormItem>

          <FormItem label="Thời gian đóng cửa" desc="Chọn thời gian đóng cửa">
            <TextField
              type="time"
              value={checkoutTime}
              onChange={(e) => setCheckoutTime(e.target.value)}
              inputProps={{
                step: 300, 
              }}
            />
          </FormItem>
          <FormItem label="Hình ảnh" desc="">
          <div
            className={`nc-StayCard group relative bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden will-change-transform hover:shadow-xl transition-shadow ${className}`}
            data-nc-id="StayCard"
          >
          <div className="relative w-full">
            <GallerySlider
                  uniqueID={`StayCard_duiahfiouqhgowiho`}
                  ratioClass="aspect-w-4 aspect-h-3"
                  galleryImgs={
                    imageLink && imageLink.length!=0
                      ? imageLink.map((link, index) => ({
                          imgId: String(index),
                          imgLink: link,
                        }))
                      : [{ imgId: "19110052", imgLink: NoImage }]
                  }
                />
            </div>
          </div>
              <div className="flex justify-between mt-4">
                <InputLabel id="province-image-label">Hình ảnh</InputLabel>
                  <input
                    accept="image/*"
                    id="province-image-input"
                    type="file"
                    onChange={handleUploadImage}
                    hidden
                  />
                  <label htmlFor="province-image-input">
                    <Button variant="contained" component="span">
                      Chọn hình ảnh
                    </Button>
                  </label>
                {imageLink && imageLink.length > 0 && imageLink[0] !== NoImage && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={handleDeleteImage}
                  >
                    Delete
                  </button>
                )}
              </div>
          </FormItem>
          <FormItem
            label="Giá tối thiểu"
            desc="Giá tối thiểu của địa điểm"
          >
            <TextField
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              inputProps={{
                min: 0,
              }}
            />
          </FormItem>
          <FormItem
            label="Giá tối đa"
            desc="Giá tối đa của địa điểm"
          >
            <TextField
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              inputProps={{
                min: 0,
              }}
            />
          </FormItem>
          <FormItem
            label="Thời gian đề xuất"
            desc="Thời gian đề xuất cho địa điểm"
          >
            <TextField
              type="number"
              value={recommendTime}
              onChange={handleRecommendTimeChange}
              inputProps={{
                min: 1,
                max: 8,
              }}
            />
          </FormItem>
        </div>
      </>
      <Dialog open={isProcessing}>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Đang xử lý...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
      </CommonLayout>
  );
};

export default PageAddListing1;
