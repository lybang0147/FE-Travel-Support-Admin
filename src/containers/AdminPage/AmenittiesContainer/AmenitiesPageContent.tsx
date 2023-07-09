import { FC, ChangeEvent, useState, useEffect } from 'react';
import { AddCircleOutline } from '@mui/icons-material';
import Helmet from 'react-helmet'
import Province from 'models/province';
import amenitiesService from 'api/amenitiesApi';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  CardContent,
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField,
  CircularProgress,
  SelectChangeEvent 
} from '@mui/material';

import Label from 'components/Label';
import Amentity from 'models/amenity';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import provinceService from 'api/provinceApi';
import toast from 'react-hot-toast';

interface RecentUsersTableProps {
  className?: string;
}

interface Filters {
  status?: boolean;
}

const applyPagination = (amenities: Amentity[], page: number, limit: number): Amentity[] => {
  return amenities.slice(page * limit, page * limit + limit);
};

const AmenitiesPageContent: FC<RecentUsersTableProps> = ({}) => {
  const [amenities, setAmenities] = useState<Amentity[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [needFetch, setNeedFetch] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState<boolean>(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editedAmenity, setEditedAmenity] = useState<Amentity | null>(null);
  const [editedAmenityName, setEditedAmenityName] = useState('');
  const [editedImageFile, setEditedImageFile] = useState<File | null>(null);
  const [editedImageLink, setEditedImageLink] = useState<string | null>(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState<boolean>(false);
  const [newAmenityName, setNewAmenityName] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAmenityId, setSelectedAmenityId] = useState<string>('');


  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
    setPage(0);
  };

  const handleImageClick = (imageLink: string): void => {
    setSelectedImage(imageLink);
    setIsImageDialogOpen(true);
  };

  const handleImageDialogClose = (): void => {
    setIsImageDialogOpen(false);
  };

  const paginatedAmenities = applyPagination(amenities, page, limit);

  const blueCardCount = amenities.length;

  const checkTypeFile = (type: any) => {
    const typeFile = ["image/jpeg", "image/png", "image/jpg"];
    return typeFile.includes(type);
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader();
    if (e.target.files) {
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
        if (checkTypeFile(e.target.files[0].type)) {
          if (e.target.files[0].size < 1024 * 1024 * 5) {
            setEditedImageFile(e.target.files[0]);
            reader.onloadend = function (e: ProgressEvent<FileReader>) {
              setEditedImageLink(reader.result as string);
            }.bind(this);
          } else {
            toast.error("Hình ảnh upload quá lớn, Hình ảnh phải nhỏ hơn 5MB");
          }
        } else {
          toast.error(
            "Hình ảnh:" +
              e.target.files[0].name +
              " Chỉ cho phép upload đuôi (.jpg .png .jpeg)"
          );
        }
      }
    }
  };

  const openEditForm = (amenities: Amentity) => {
    setIsEditFormOpen(true);
    setEditedAmenity(amenities);
    setEditedAmenityName(amenities.name);
    setEditedImageFile(null);
    setEditedImageLink(amenities.icons || null);
  };

  const openCreateForm = () => {
    setIsCreateFormOpen(true);
    setNewAmenityName('');
  };

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setIsProcessing(true);
        const amenitiesList = await amenitiesService.getAllAmenities();
        setAmenities(amenitiesList.content);
      } catch (error) {
        toast.error('Lỗi khi lấy dữ liệu dịch vụ');
        console.log(error);
      } finally {
        setIsProcessing(false);
      }
    };

    fetchAmenities();
  }, [needFetch]);

  const saveEditedAmenityName = async () => {
    try {
      const formData = new FormData();
      if (editedImageFile) {
        formData.append("file", editedImageFile);
      }
      if (editedAmenity?.id) {
        setIsProcessing(true);
        await amenitiesService.updateAmenity(editedAmenity?.id, formData);
      }
      toast.success(`Cập nhật dịch vụ thành công`);
    } catch (error) {
      toast.error('Lỗi khi cập nhật dịch vụ');
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
    setIsEditFormOpen(false);
    setNeedFetch(!needFetch);
  };

  const saveNewAmenities = async () => {
    try {
      const formData = new FormData();
      if (editedImageFile) {
        formData.append("file", editedImageFile);
      }
      formData.append('name', newAmenityName);
      setIsProcessing(true);
      setIsCreateFormOpen(false);
      await provinceService.createProvince(formData);
      toast.success('Thêm dịch vụ thành công');
      setNeedFetch(!needFetch);
    } catch (error) {
      toast.error('Lỗi khi thêm dịch vụ');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteDialogOpen = (amenityId: string) => {
    setSelectedAmenityId(amenityId);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteAmenity = async () => {
    try {
      setIsProcessing(true);
      handleDeleteDialogClose();
      await amenitiesService.deleteAmenity(selectedAmenityId);
      toast.success('Xóa dịch vụ thành công');
      setNeedFetch(!needFetch);
    } catch (error) {
      toast.error('Lỗi khi xóa dịch vụ');
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const theme = useTheme();
  return (
    <div>
      <Helmet>
        <title>UTEadmin</title>
      </Helmet>
      <Box p={2} display="flex" justifyContent="space-between">
        <Card sx={{ backgroundColor: '#1976d2', color: '#fff', width: 300 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {blueCardCount}
            </Typography>
            <Typography variant="body2" component="div">
              Tổng số dịch vụ hiện có
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Quản lý tỉnh thành
              </Typography>
              <IconButton onClick={openCreateForm} sx={{ color: theme.palette.success.main }}>
                <AddCircleOutline />
              </IconButton>
            </Box>
          }
        />
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Tên hiển thị</TableCell>
                <TableCell align="right">Chỉnh sửa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAmenities.map((amenities) => {
                return (
                  <TableRow hover key={amenities.id}>
                    <TableCell>
                      <img
                        src={amenities.icons ?? ''}
                        alt="Avatar"
                        style={{ width: '32px', height: '32px', cursor: 'pointer' }}
                        onClick={() => handleImageClick(amenities.icons ?? '')}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                        {amenities.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Thay đổi thông tin" arrow>
                        <IconButton
                          sx={{
                            '&:hover': { background: theme.palette.success.light },
                            color: theme.palette.success.main,
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => openEditForm(amenities)}
                        >
                          <EditTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa tỉnh thành" arrow>
                        <IconButton
                          sx={{
                            '&:hover': { background: theme.palette.error.light },
                            color: theme.palette.error.main,
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => handleDeleteDialogOpen(amenities.id)}
                        >
                          <DeleteTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box p={2}>
          <TablePagination
            component="div"
            count={paginatedAmenities.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25, 30]}
          />
        </Box>
        <Dialog open={isImageDialogOpen} onClose={handleImageDialogClose}>
          <DialogContent>
            {selectedImage && <img src={selectedImage} alt="Full Size" style={{ maxWidth: '500px' }} />}
          </DialogContent>
        </Dialog>
      </Card>
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
      <Dialog open={isEditFormOpen} onClose={() => setIsEditFormOpen(false)}>
        <DialogTitle>Chỉnh sửa thông tin dịch vụ</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px',marginTop: '10px' }}>
            <TextField
              label="Tên dịch vụ"
              variant="outlined"
              value={editedAmenityName}
              onChange={(e) => setEditedAmenityName(e.target.value)}
            />
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
            {editedImageLink && (
              <img
                src={editedImageLink}
                alt="Selected"
                style={{ maxWidth: '32px', maxHeight: '32px', objectFit: 'fill' }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditFormOpen(false)}>Hủy</Button>
          <Button onClick={saveEditedAmenityName} disabled={isProcessing} autoFocus>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isCreateFormOpen} onClose={() => setIsCreateFormOpen(false)}>
        <DialogTitle>Thêm dịch vụ mới</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
            <TextField
              label="Tên dịch vụ"
              variant="outlined"
              value={newAmenityName}
              onChange={(e) => setNewAmenityName(e.target.value)}
            />
            <InputLabel id="new-province-image-label">Hình ảnh</InputLabel>
            <input
              accept="image/*"
              id="new-province-image-input"
              type="file"
              onChange={handleUploadImage}
              hidden
            />
            <label htmlFor="new-province-image-input">
              <Button variant="contained" component="span">
                Chọn hình ảnh
              </Button>
            </label>
            {editedImageLink && (
              <img
                src={editedImageLink}
                alt="Selected"
                style={{ maxWidth: '32px', maxHeight: '32px', objectFit: 'fill' }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateFormOpen(false)}>Hủy</Button>
          <Button onClick={saveNewAmenities} disabled={isProcessing} autoFocus>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Xác nhận xóa dịch vụ</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa dịch vụ này?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Hủy</Button>
          <Button onClick={handleDeleteAmenity} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AmenitiesPageContent;
