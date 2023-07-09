import { FC, ChangeEvent, useState, useEffect } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import User from 'models/user';
import adminService from 'api/adminApi';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import authenticationService from 'api/authenticationApi';
import Helmet from 'react-helmet'
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
import toast from 'react-hot-toast';

interface RecentUsersTableProps {
  className?: string;
}

interface Filters {
  status?: boolean;
}

const getStatusLabel = (status: boolean): JSX.Element => {
  const map: { [key: string]: { text: string; color: 'error' | 'success' } } = {
    false: {
      text: 'Bị chặn',
      color: 'error',
    },
    true: {
      text: 'Hoạt động',
      color: 'success',
    },
  };

  const { text, color } = map[status.toString() as keyof typeof map];

  return (
    <Label color={color as 'error' | 'success'}>
      <Typography variant="body1" fontWeight="bold" color="text.primary">
        {text}
      </Typography>
    </Label>
  );
};

const applyFilters = (users: User[], filters: Filters): User[] => {
  return users.filter((user) => {
    let matches = true;

    if (filters.status !== undefined && user.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (users: User[], page: number, limit: number): User[] => {
  return users.slice(page * limit, page * limit + limit);
};

const UserPageContent: FC<RecentUsersTableProps> = ({}) => {
  const [reasonDialogOpen, setReasonDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [needFetch, setNeedFetch] = useState<boolean>(false);
  const [unbannedConfirmOpen, setUnbannedConfirmOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [ownerData, setOwnerData] = useState({
    email: "",
    phone: "",
    fullName: "",
    gender: "",
    password: ""
  });
  const [filters, setFilters] = useState<Filters>({
    status: undefined,
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const fetchUsers = async () => {
      try {
        const userList = await adminService.getListUserInfo(searchKey);
        setUsers(userList);
      } catch (error) {
        toast.error('Lỗi khi lấy dữ liệu user');
        console.log(error);
      }
    };

    const debounceFetch = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchUsers, 1000);
    };
    debounceFetch();
    return () => {
      clearTimeout(timeoutId);
    };

  }, [needFetch, searchKey]);

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
    setSelectedStatus(null);
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

  const filteredUsers = applyFilters(users, { status: selectedStatus !== null ? selectedStatus === 'true' : undefined });
  const paginatedUsers = applyPagination(filteredUsers, page, limit);

  const blueCardCount = users.length;
  const greenCardCount = users.filter((user) => user.status === true).length;
  const redCardCount = users.filter((user) => user.status === false).length;

  const handleLockClick = (user: User): void => {
    setSelectedUser(user);
    setBanReason('');
    setReasonDialogOpen(true);
  };

  const handleUnlockClick = async (user: User): Promise<void> => {
    setSelectedUser(user);
    setUnbannedConfirmOpen(true);
  };

  const handleUnblockConfirm = async (): Promise<void> => {
    try {
      if (selectedUser && selectedUser.id) {
        setUnbannedConfirmOpen(false);
        setIsProcessing(true);
        await authenticationService.unbannedUser(selectedUser.id);
        const updatedUsers = users.map((u) => (u.id === selectedUser.id ? { ...u, status: true } : u));
        setUsers(updatedUsers);
        toast.success(`Tài khoản có email "${selectedUser.email}" đã được mở khóa`);
        setNeedFetch(needFetch!);
      }
    } catch (error) {
      toast.error('Lỗi khi mở khóa tài khoản.');
      console.log(error);
    }
    finally{
      setIsProcessing(false);
    }
  };

  const handleBanConfirm = async (): Promise<void> => {
    if (selectedUser && selectedUser.id) {
      try {
        setReasonDialogOpen(false);
        setIsProcessing(true);
        console.log(banReason);
        await authenticationService.bannedUser(selectedUser.id, banReason);
        const updatedUsers = users.map((u) => (u.id === selectedUser.id ? { ...u, status: false } : u));
        setUsers(updatedUsers);
        toast.success(`Tài khoản có email "${selectedUser.email}" đã bị khóa`);
        setNeedFetch(needFetch!);
      } catch (error) {
        toast.error('Lỗi khi khóa tài khoản.');
        console.log(error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    const parsedValue = selectedValue === "both" ? null : selectedValue === "true";
    setSelectedStatus(parsedValue !== null ? parsedValue.toString() : null);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setOwnerData((prevData) => ({
      ...prevData,
      [name!]: value as string
    }));
  };

  const randomString = (length: number) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handleAddOwner = async () => {
    const password = randomString(8);
    const owner = {
      ...ownerData,
      password
    };
    try{
      handleDialogClose();
      setIsProcessing(true);
      await authenticationService.createOwner(owner)
      toast.success('Thêm đối tác thành công')
      setNeedFetch(!needFetch);
    }
      catch(error) {
        toast.success('Thêm đối tác thất bại')
        console.error(error);
      }
      finally{
        setIsProcessing(false)
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
              Tổng số tài khoản
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#4caf50', color: '#fff', width: 300 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {greenCardCount}
            </Typography>
            <Typography variant="body2" component="div">
              Tài khoản đang hoạt động
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#f44336', color: '#fff', width: 300 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {redCardCount}
            </Typography>
            <Typography variant="body2" component="div">
              Tài khoản bị khóa
            </Typography>
          </CardContent>
        </Card>
      </Box>
    <Card>
    <CardHeader
      title={
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quản lý người dùng
        </Typography>
      }
      action={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleDialogOpen} style={{marginRight: '10px'}}>
            Thêm đối tác
          </Button>
          <Box mr={1}>
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              size="small"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </Box>
          <Box>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={selectedStatus || 'both'}
                onChange={handleStatusFilterChange}
                label="Trạng thái"
              >
                <MenuItem value="both">Tất cả</MenuItem>
                <MenuItem value="true">Hoạt động</MenuItem>
                <MenuItem value="false">Bị chặn</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      }
    />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Tên hiển thị</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Giới tính</TableCell> 
              <TableCell align="right">Số điện thoại</TableCell>
              <TableCell align="right">Trạng thái</TableCell>
              <TableCell align="right">Khóa tài khoản</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => {
              return (
                <TableRow hover key={user.id}>
                  <TableCell>
                    <img
                      src={user.imgLink ?? ''}
                      alt="Avatar"
                      style={{ width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer' }}
                      onClick={() => handleImageClick(user.imgLink ?? '')}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                      {user.fullName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                      <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                    <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                      {user.gender}
                    </Typography>
                  </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                        {user.phone}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{getStatusLabel(user.status ?? false)}</TableCell>
                    <TableCell align="center">
                    {user.status === false ? (
                      <>
                        <Tooltip title="Mở khóa tài khoản" arrow>
                          <IconButton
                            sx={{
                              '&:hover': { background: theme.palette.success.light },
                              color: theme.palette.success.main,
                            }}
                            color="inherit"
                            size="small"
                            onClick={() => handleUnlockClick(user)}
                          >
                            <LockOpenTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Khóa tài khoản" arrow>
                          <IconButton
                            sx={{
                              '&:hover': { background: theme.palette.error.light },
                              color: theme.palette.error.main,
                            }}
                            color="inherit"
                            size="small"
                            onClick={() => handleLockClick(user)}
                          >
                            <LockTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
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
          count={filteredUsers.length}
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
    <Dialog
  open={reasonDialogOpen}
  onClose={() => setReasonDialogOpen(false)}
  PaperProps={{
    sx: {
      width: '80%',
      maxHeight: 'none',
    },
  }}
>
  <DialogTitle>Nhập lý do khóa tài khoản</DialogTitle>
  <DialogContent dividers>
    <TextField
      fullWidth
      label="Lý do..."
      variant="outlined"
      value={banReason}
      onChange={(e) => setBanReason(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setReasonDialogOpen(false)}>Hủy</Button>
    <Button onClick={handleBanConfirm} disabled={!banReason.trim()} color="primary">
      Xác nhận
    </Button>
  </DialogActions>
</Dialog>

      <Dialog open={unbannedConfirmOpen} onClose={() => setUnbannedConfirmOpen(false)}>
        <DialogTitle>Mở khóa tài khoản</DialogTitle>
        <DialogContent>
          <Typography>
           Bạn có chắc muốn mở khóa tài khoản: <strong>{selectedUser?.email}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnbannedConfirmOpen(false)}>Hủy</Button>
          <Button onClick={handleUnblockConfirm} color="primary">
            Xác nhận
          </Button>
        </DialogActions>
    </Dialog>
    <Dialog open={isProcessing}>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Đang xử lý...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Thêm đối tác</DialogTitle>
        <DialogContent>
          <TextField
            name="email"
            label="Email"
            value={ownerData.email}
            onChange={handleInputChange}
            style={{marginTop: '5px'}}
          />
          <br/>
          <TextField
            name="phone"
            label="Phone"
            value={ownerData.phone}
            onChange={handleInputChange}
            style={{marginTop: '5px'}}
          />
          <br/>
          <TextField
            name="fullName"
            label="Full Name"
            value={ownerData.fullName}
            onChange={handleInputChange}
            style={{marginTop: '5px'}}
          />
          <br/>
          <Select
            name="gender"
            value={ownerData.gender}
            style={{marginTop: '5px'}}
            onChange={handleInputChange as (event: SelectChangeEvent<string>) => void}
          >
            <MenuItem value="Nam">Nam</MenuItem>
            <MenuItem value="Nữ">Nữ</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Hủy bỏ</Button>
          <Button onClick={handleAddOwner} color="primary">
            Thêm đối tác
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserPageContent;
