import React, { FC, useEffect } from "react";
import Input from "shared/Input/Input";
import Select from "shared/Select/Select";
import CommonLayout from "./CommonLayout";
import FormItem from "./FormItem";
import Textarea from "shared/Textarea/Textarea";
import { useState } from "react";
import { toast } from "react-hot-toast";
import NoImage from "../../images/no-image.jpg";
import GallerySlider from "components/GallerySlider/GallerySlider";
import { InputLabel, TextField} from "@mui/material";
import Amentity from "models/amenity";
import amenitiesService from "api/amenitiesApi";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress,Box,Typography } from "@mui/material";
import stayService from "api/stayApi";
import { useParams } from "react-router-dom";
import Stay from "models/stay";
import PlaceUpdateRequest from "models/request/PlaceUpdateRequest";
import FormImage from "components/ImageForm/ImageForm";
import { LargeNumberLike } from "crypto";
import AutoCompleteSearch from "components/AutoComplete/AutoCompleteSearch";
import placesService from "api/placeApi";
import Place from "models/place";
export interface PageAddListing2Props {
  className?: string;
}

const PageAddListing2: FC<PageAddListing2Props> = ({
  className = "",
}) => {

  const { id } = useParams();
  
  const [place, setPlace] = useState<Place>();
  const [placeName, setPlaceName] = useState<string>("");
  const [placeAddress, setPlaceAddress] = useState({
    address: "",
    longitude: 0,
    latitude: 0
  });
  const [placeDescription, setPlaceDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File[]>([]);
  const [imageLink, setImageLink] = useState<string[] | null>(null);
  const [openTime, setOpenTime] = useState<string>("");
  const [closeTime, setCloseTime] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [deletedImage, setDeletedImage] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [recommendTime, setRecommendTime] = useState("");

  const handlePlaceNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlaceName(event.target.value);
  };

  const handlePlaceAddressChange = (address: { address: string; longitude: number; latitude: number }) => {
    setPlaceAddress(address);
  };

  const handlePlaceDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPlaceDescription(event.target.value);
  };

  const handleRecommendTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= 1 && value <= 8) {
      setRecommendTime(value.toString());
    }
  };

  const handleDeleteImage = (index: number) => {
    if (imageLink && imageLink.length > 0 && imageFile && imageFile.length>0) {
      const updatedImageLink = [...imageLink];
      const updatedImageFile = [...imageFile];
  
      if (updatedImageFile[index] && updatedImageFile[index].size === 0) {
        const deletedImg = updatedImageLink[index];
        setDeletedImage((prevDeletedImage) => [...prevDeletedImage, deletedImg]);
      }
  
      updatedImageLink.splice(index, 1);
      updatedImageFile.splice(index, 1);
  
      setImageLink(updatedImageLink);
      setImageFile(updatedImageFile);
    }
  };

  useEffect(() => {
    const fecthStayInfo = async () => {
      try{
        if (id)
        {
          const place = await placesService.getPlaceById(id);
          const placeImg = place?.placeImage.map((placeImg) => placeImg.imgLink ?? "");
          setPlace(place);
          setPlaceName(place.name);
          setPlaceDescription(place.description ?? "");
          setPlaceAddress((prevState) => ({
            ...prevState,
            longitude: place?.longitude ?? 0,
            latitude: place?.latitude ?? 0,
          }));
          setOpenTime(place?.timeOpen ?? "");
          setCloseTime(place?.timeClose ?? "");
          setImageLink(placeImg ?? []);
          const emptyFiles = placeImg?.map(() => new File([], "")) ?? [];
          setImageFile(emptyFiles);
          setMinPrice(place.minPrice);
          setMaxPrice(place.maxPrice);
          setRecommendTime(place.recommendTime);
        }
      }catch (error) {
        console.log("Lỗi khi lấy thông tin nơi ở", error);
      }
    }

    fecthStayInfo();
  }, [id]);

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
    if (!place || !place.id || !placeName || !placeAddress || !placeDescription || !openTime || openTime=="" ||  !closeTime || closeTime=="") {
      toast.error("Vui lòng điền toàn bộ các trường");
      return;
    }
    if (placeAddress.address=="")
    {
      placeAddress.address = place.addressDescription ?? "";
      placeAddress.latitude = place.latitude ?? 0;
      placeAddress.longitude = place.longitude ?? 0;
    }

    const filteredImageFile = imageFile.filter((file) => file.size > 0);

    const editedStay: PlaceUpdateRequest = {
      id: id ?? "",
      name: placeName,
      addressDescription: placeAddress.address,
      placeImage: filteredImageFile,
      description: placeDescription,
      timeOpen: openTime,
      timeClose: closeTime,
      removedImage: deletedImage,
      longitude: placeAddress.longitude,
      latitude: placeAddress.latitude,
      minPrice: minPrice,
      maxPrice: maxPrice,
      recommendTime: recommendTime
    }
    
    try
    {
      setIsProcessing(true);
      const response = await placesService.updatePlace(editedStay);
      toast.success("Chỉnh sửa thông tin địa điểm thành công");
      window.location.href = "/place";
    }
    catch (error)
    {
      toast.error("Lỗi khi chỉnh sửa nơi ở");
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
        <h2 className="text-2xl font-semibold">Thông tin địa điểm:{place?.name}</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* FORM */}
        <div className="space-y-8">
          {/* ITEM */}
          <FormItem
            label="Loại địa điểm"
            desc=""
          >
              <TextField className="w-full" value={place?.type} disabled
               InputProps={{
                style: { color:'black',fontWeight: 'bold', backgroundColor: 'lightgrey' },
              }} />
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
              value={placeDescription}
              onChange={handlePlaceDescriptionChange}
            />
          </FormItem>
          <FormItem
            label="Tỉnh, thành phố"
            desc="Tỉnh, thành phố của địa điểm"
          >
          <TextField
            value={place?.province?.name || ""}
            disabled
            fullWidth
            InputLabelProps={{ shrink: true}}
            InputProps={{
              style: { color:'black',fontWeight: 'bold', backgroundColor: 'lightgrey' },
            }}
          />
        </FormItem>
        <FormItem label="Địa chỉ cụ thể của địa điểm" desc={`Địa chỉ đã chọn: ${placeAddress.address == "" ? place?.addressDescription : placeAddress.address}`}>
          <AutoCompleteSearch
              value={placeAddress.address}
              onChange={handlePlaceAddressChange}
            />
          </FormItem>
          <FormItem label="Thời gian mở cửa" desc="Chọn thời gian mở cửa">
            <TextField
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              inputProps={{
                step: 300, 
              }}
            />
          </FormItem>

          <FormItem label="Thời gian đóng cửa" desc="Chọn thời gian đóng cửa">
            <TextField
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              inputProps={{
                step: 300, 
              }}
            />
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
              value={Number.parseInt(recommendTime)}
              onChange={handleRecommendTimeChange}
              inputProps={{
                min: 1,
                max: 8,
              }}
            />
          </FormItem>

              <FormImage 
                  label="Hình ảnh"
                  desc=""
                  imageLink={imageLink ?? []}
                  handleUploadImage={handleUploadImage}
                  handleDeleteImage={handleDeleteImage}
                  />
         
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

export default PageAddListing2;
