import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Checkbox,
    IconButton,
    Box,
    Typography,
    Avatar,
    Chip,
    Menu,
    MenuItem,
    CircularProgress,
    Link
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreIcon,
    Visibility as ViewIcon,
    Block as BlockIcon,
    CheckCircle as VerifyIcon,
    Email as EmailIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/format';

interface UserTableProps {
    users: any[];
    loading: boolean;
    selected: string[];
    onSelectChange: (selected: string[]) => void;
    page: number;
    rowsPerPage: number;
    totalUsers: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
    onRefresh: () => void;
    userType: 'customer' | 'admin';
}

export const UserTable: React.FC<UserTableProps> = ({
    users,
    loading,
    selected,
    onSelectChange,
    page,
    rowsPerPage,
    totalUsers,
    onPageChange,
    onRowsPerPageChange,
    onRefresh,
    userType
}) => {
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedUser, setSelectedUser] = React.useState<any>(null);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            onSelectChange(users.map(user => user._id));
        } else {
            onSelectChange([]);
        }
    };

    const handleSelectOne = (userId: string) => {
        const selectedIndex = selected.indexOf(userId);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, userId);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        onSelectChange(newSelected);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: any) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedUser(null);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={users.length > 0 && selected.length === users.length}
                                    indeterminate={selected.length > 0 && selected.length < users.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                            {userType === 'customer' && (
                                <>
                                    <TableCell align="right">Total Orders</TableCell>
                                    <TableCell align="right">Total Spent</TableCell>
                                </>
                            )}
                            <TableCell>Last Active</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => {
                            const isSelected = selected.indexOf(user._id) !== -1;

                            return (
                                <TableRow
                                    hover
                                    key={user._id}
                                    selected={isSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() => handleSelectOne(user._id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar
                                                src={user.avatar}
                                                sx={{ width: 40, height: 40, mr: 2 }}
                                            />
                                            <Box>
                                                <Link
                                                    component={RouterLink}
                                                    to={`/admin/users/${user._id}`}
                                                    color="inherit"
                                                    underline="hover"
                                                >
                                                    <Typography variant="subtitle2">
                                                        {user.name}
                                                    </Typography>
                                                </Link>
                                                <Typography variant="body2" color="text.secondary">
                                                    {user.phone || 'No phone'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {user.email}
                                        </Typography>
                                        {user.isVerified && (
                                            <Chip
                                                label="Verified"
                                                color="success"
                                                size="small"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.isActive ? 'Active' : 'Inactive'}
                                            color={user.isActive ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    {userType === 'customer' && (
                                        <>
                                            <TableCell align="right">
                                                {user.totalOrders || 0}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatCurrency(user.totalSpent || 0)}
                                            </TableCell>
                                        </>
                                    )}
                                    <TableCell>
                                        {user.lastActiveAt ? format(new Date(user.lastActiveAt), 'PP') : 'Never'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={(e) => handleMenuOpen(e, user)}
                                            size="small"
                                        >
                                            <MoreIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={totalUsers}
                page={page}
                onPageChange={(event, newPage) => onPageChange(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />

            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem
                    component={RouterLink}
                    to={`/admin/users/${selectedUser?._id}`}
                >
                    <ViewIcon fontSize="small" sx={{ mr: 1 }} />
                    View Profile
                </MenuItem>
                <MenuItem
                    component={RouterLink}
                    to={`/admin/users/${selectedUser?._id}/edit`}
                >
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem
                    component="a"
                    href={`mailto:${selectedUser?.email}`}
                >
                    <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                    Send Email
                </MenuItem>
                {selectedUser?.isActive ? (
                    <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
                        <BlockIcon fontSize="small" sx={{ mr: 1 }} />
                        Deactivate
                    </MenuItem>
                ) : (
                    <MenuItem onClick={handleMenuClose} sx={{ color: 'success.main' }}>
                        <VerifyIcon fontSize="small" sx={{ mr: 1 }} />
                        Activate
                    </MenuItem>
                )}
                <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>
        </>
    );
};
