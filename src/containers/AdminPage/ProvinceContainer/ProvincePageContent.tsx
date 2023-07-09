import { FC, ChangeEvent, useState, useEffect } from 'react';
import { AddCircleOutline } from '@mui/icons-material';
import Helmet from 'react-helmet'
import Province from 'models/province';
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

const applyPagination = (provinces: Province[], page: number, limit: number): Province[] => {
  return provinces.slice(page * limit, page * limit + limit);
};

const ProvincePageContent: FC<RecentUsersTableProps> = ({}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [needFetch, setNeedFetch] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState<boolean>(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editedProvince, setEditedProvince] = useState<Province | null>(null);
  const [editedProvinceName, setEditedProvinceName] = useState('');
  const [editedImageFile, setEditedImageFile] = useState<File | null>(null);
  const [editedImageLink, setEditedImageLink] = useState<string | null>(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState<boolean>(false);
  const [newProvinceName, setNewProvinceName] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');


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

  const paginatedProvinces = applyPagination(provinces, page, limit);

  const blueCardCount = provinces.length;

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

  const openEditForm = (province: Province) => {
    setIsEditFormOpen(true);
    setEditedProvince(province);
    setEditedProvinceName(province.name);
    setEditedImageFile(null);
    setEditedImageLink(province.imgLink || null);
  };

  const openCreateForm = () => {
    setIsCreateFormOpen(true);
    setNewProvinceName('');
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setIsProcessing(true);
        const provinceList = await provinceService.getAllProvince();
        setProvinces(provinceList.content);
      } catch (error) {
        toast.error('Lỗi khi lấy dữ liệu tỉnh thành');
        console.log(error);
      } finally {
        setIsProcessing(false);
      }
    };

    fetchProvinces();
  }, [needFetch]);

  const saveEditedProvinceName = async () => {
    try {
      const formData = new FormData();
      if (editedImageFile) {
        formData.append("file", editedImageFile);
      }
      if (editedProvince?.id) {
        setIsProcessing(true);
        await provinceService.updateProvinceImg(editedProvince?.id, formData);
      }
      toast.success(`Cập nhật hình ảnh thành công`);
    } catch (error) {
      toast.error('Lỗi khi cập nhật tỉnh thành');
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
    setIsEditFormOpen(false);
    setNeedFetch(!needFetch);
  };

  const saveNewProvince = async () => {
    try {
      const formData = new FormData();
      if (editedImageFile) {
        formData.append("file", editedImageFile);
      }
      formData.append('name', newProvinceName);
      setIsProcessing(true);
      await provinceService.createProvince(formData);
      toast.success('Thêm tỉnh thành thành công');
      setIsCreateFormOpen(false);
      setNeedFetch(!needFetch);
    } catch (error) {
      toast.error('Lỗi khi thêm tỉnh thành');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteDialogOpen = (provinceId: string) => {
    setSelectedProvinceId(provinceId);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteProvince = async () => {
    try {
      setIsProcessing(true);
      handleDeleteDialogClose();
      await provinceService.deleteProvince(selectedProvinceId);
      toast.success('Xóa tỉnh thành thành công');
      setNeedFetch(!needFetch);
    } catch (error) {
      toast.error('Hãy chắc chắn rằng tỉnh thành không còn khách sạn nào trước khi xóa');
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
              Tổng số tỉnh thành
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
                <TableCell align="right">Số lượng khách sạn</TableCell>
                <TableCell align="right">Chỉnh sửa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProvinces.map((province) => {
                return (
                  <TableRow hover key={province.id}>
                    <TableCell>
                      <img
                        src={province.imgLink ?? ''}
                        alt="Avatar"
                        style={{ width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer' }}
                        onClick={() => handleImageClick(province.imgLink ?? '')}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                        {province.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                        {province.placeCount}
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
                          onClick={() => openEditForm(province)}
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
                          onClick={() => handleDeleteDialogOpen(province.id)}
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
            count={paginatedProvinces.length}
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
        <DialogTitle>Chỉnh sửa thông tin tỉnh thành</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            <TextField
              label="Tên tỉnh thành"
              variant="outlined"
              value={editedProvinceName}
              disabled = {false}
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
                style={{ maxWidth: '500px', maxHeight: '500px', objectFit: 'contain' }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditFormOpen(false)}>Hủy</Button>
          <Button onClick={saveEditedProvinceName} disabled={isProcessing} autoFocus>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isCreateFormOpen} onClose={() => setIsCreateFormOpen(false)}>
        <DialogTitle>Thêm tỉnh thành mới</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <TextField
              label="Tên tỉnh thành"
              variant="outlined"
              value={newProvinceName}
              onChange={(e) => setNewProvinceName(e.target.value)}
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
                style={{ maxWidth: '500px', maxHeight: '500px', objectFit: 'contain' }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateFormOpen(false)}>Hủy</Button>
          <Button onClick={saveNewProvince} disabled={isProcessing} autoFocus>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Xác nhận xóa tỉnh thành</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa tỉnh thành này?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Hủy</Button>
          <Button onClick={handleDeleteProvince} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProvincePageContent;
