import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Pagination } from '@mui/material';
import theme from "../theme/theme";

interface PaginationProps {
    count: number;
    limit?: number;
    offset?: number;
    children: React.ReactNode;
}

const PaginationContainer: React.FC<PaginationProps> = ({
    count,
    limit = 10,
    offset = 0,
    children
}) => {
    const location = useLocation();
    const navigate = useNavigate();

    const totalPages = Math.ceil(count / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    const onPageChange = (pageNumber: number) => {
        const newOffset = (pageNumber - 1) * limit;
        navigate(`${location.pathname}?limit=${limit}&offset=${newOffset}`);
    };

    const onLimitChange = (newLimit: number) => {
        navigate(`${location.pathname}?limit=${newLimit}&offset=0`);
    };

    return (
        <>
            {/* Limit Selector */}
            <FormControl size="small" sx={{ width: '7rem' }}>
                <InputLabel id="limit-label">Items per page</InputLabel>
                <Select
                    labelId="limit-label"
                    value={limit}
                    label="Items per page"
                    onChange={(e) => onLimitChange(Number(e.target.value))}
                    sx={{ minWidth: 'fit-content' }}
                >
                    {[5, 10, 20, 50].map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {children}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    bgcolor: theme.custom.misc.background,
                    pb: '10px'
                }}
            >
                <Pagination
                    page={currentPage}
                    count={totalPages}
                    onChange={(_, page) => onPageChange(page)}
                    variant="outlined"
                    color="primary"
                    // sx={{
                    //     '& .MuiPaginationItem-root': {
                    //         color: theme.palette.primary.main,
                    //         '&.Mui-selected': {
                    //             backgroundColor: theme.palette.primary.main,
                    //             color: theme.palette.primary.onColor,
                    //         },
                    //     },
                    // }}
                />
                {/* <Pagination
                page={currentPage}
                count={30}
                onChange={(_, page) => onPageChange(page)}
                variant="outlined"
                color="primary" 
            /> */}
            </Box>
        </>

    );
};

export default PaginationContainer;
