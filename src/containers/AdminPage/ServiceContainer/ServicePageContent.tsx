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
import Service from 'models/service';
import Label from 'components/Label';
import Amentity from 'models/amenity';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import provinceService from 'api/provinceApi';
import serviceRoomService from 'api/roomServiceApi';
import toast from 'react-hot-toast';
interface RecentUsersTableProps {
  className?: string;
}

interface Filters {
  status?: boolean;
}

const applyPagination = (services: Service[], page: number, limit: number): Service[] => {
  return services.slice(page * limit, page * limit + limit);
};

const AdminServicePageContent: FC<RecentUsersTableProps> = ({}) => {
  const [amenities, setAmenities] = useState<Amentity[]>([]);
  const [services, setService] = useState<Service[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [needFetch, setNeedFetch] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAmenityId, setSelectedAmenityId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [nameList, setNameList] = useState<string[]>([]);
  const [editedName, setEditedName] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service>();


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

  const paginatedService = applyPagination(services, page, limit);

  const blueCardCount = services.length;

  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsProcessing(true);
        const serviceList = await serviceRoomService.getAllRoomService();
        setService(serviceList);
      } catch (error) {
        toast.error('Lỗi khi lấy dữ liệu dịch vụ');
        console.log(error);
      } finally {
        setIsProcessing(false);
      }
    };

    fetchService();
  }, [needFetch]);



  const handleDeleteDialogOpen = (amenityId: string) => {
    setSelectedAmenityId(amenityId);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteService = async () => {
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
  const openCreateForm = () => {
    setIsDialogOpen(true);
  };

  const closeCreateForm = () => {
  setIsDialogOpen(false);
  setItemName('');
};

const handleItemNameChange = (event: ChangeEvent<HTMLInputElement>) => {
  setItemName(event.target.value);
};

const handleFormSubmit = async () => {
  const names = itemName.split(';').map((name) => name.trim());
  setNameList(names);
  try
  {
  await serviceRoomService.createRoomService(names)
  toast.success("Thêm dịch vụ phòng thành công")
  setNeedFetch(!needFetch);
  }catch (error)
  {
    toast.error('Lỗi khi thêm dịch vụ')
  }
  finally
  {
    closeCreateForm();
  }
};

const openEditDialog = (service: Service) => {
  setEditedName(service.roomServiceName);
  setSelectedService(service);
  setIsEditDialogOpen(true);
};

const handleEditSubmit = async () => {
  try
  {
  await serviceRoomService.updateRoomService(selectedService?.id ?? "",
    { name: editedName }
  )
  toast.success("Thay đổi tên dịch vụ thành công!!!")
  setNeedFetch(!needFetch);
  }catch (error)
  {
    toast.error('Lỗi khi sửa dịch vụ phòng')
  }
  finally
  {
    setIsEditDialogOpen(false);
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
                Quản lý dịch vụ phòng
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
                <TableCell>Tên hiển thị</TableCell>
                <TableCell align="right">Chỉnh sửa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedService.map((service) => {
                return (
                  <TableRow hover key={service.id}>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                        {service.roomServiceName}
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
                          onClick={() => openEditDialog(service)}
                        >
                          <EditTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa dịch vụ" arrow>
                        <IconButton
                          sx={{
                            '&:hover': { background: theme.palette.error.light },
                            color: theme.palette.error.main,
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => handleDeleteDialogOpen(service.id)}
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
            count={services.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25, 30]}
          />
        </Box>
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

      <Dialog open={isDialogOpen} onClose={closeCreateForm}>
        <DialogTitle>Thêm dịch vụ phòng</DialogTitle>
        <DialogContent>
          <TextField
            value={itemName}
            onChange={handleItemNameChange}
            label="Nhập dịch vụ (cách nhau bởi dấu ;)"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreateForm}>Hủy bỏ</Button>
          <Button onClick={handleFormSubmit} autoFocus>
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
          <Button onClick={handleDeleteService} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Chỉnh sửa tên dịch vụ</DialogTitle>
        <DialogContent>
          <TextField
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            label="Tên dịch vụ"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Hủy bỏ</Button>
          <Button onClick={handleEditSubmit} autoFocus>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminServicePageContent;
