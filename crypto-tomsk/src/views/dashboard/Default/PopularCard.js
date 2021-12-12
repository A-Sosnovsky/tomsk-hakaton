import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';

// material-ui
import {useTheme} from '@mui/material/styles';
import {Avatar, Button, CardActions, CardContent, Divider, Grid, Menu, MenuItem, Typography, Link} from '@mui/material';


// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import {gridSpacing} from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import {getTransactions} from "../../../utils/api";
import moment from "moment";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {useSelector} from "react-redux";
import config from "../../../config";

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = () => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const {wallet} = useSelector((state) => (state.wallet));

    useEffect(() => {
        async function loadTransactions() {
            const transactions = await getTransactions(1, 10);
            setTransactions(transactions);
            setIsLoading(false);
        }

        // Execute the created function directly
        loadTransactions().then();
    }, [wallet]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard/>
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Grid container alignContent="center" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="h4">Last transactions</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                {transactions.map((tran, i) => (<div key={i}>
                                    <Grid container direction="column">
                                        <Grid item>
                                            <Grid container alignItems="center" justifyContent="space-between">
                                                <Grid item>
                                                    <Typography variant="subtitle1" color={tran.isError === true ? theme.palette.error.dark : "inherit"}>
                                                        {moment.unix(tran.timeStamp).fromNow(true)} ago
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Grid container alignItems="center" justifyContent="space-between">
                                                        <Grid item>
                                                            <Typography variant="subtitle1" color="inherit">
                                                                {tran.value}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Avatar
                                                                variant="rounded"
                                                                sx={{
                                                                    width: 16,
                                                                    height: 16,
                                                                    borderRadius: '5px',
                                                                    backgroundColor: theme.palette.success.light,
                                                                    color: theme.palette.success.dark,
                                                                    ml: 2
                                                                }}
                                                            >
                                                                {tran.incoming ?
                                                                    <KeyboardArrowUpOutlinedIcon fontSize="small"
                                                                                                 color="inherit"/> :
                                                                    <KeyboardArrowDownOutlinedIcon fontSize="small"
                                                                                                   color="inherit"/>}
                                                            </Avatar>

                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </div>))}
                                <Divider sx={{my: 1.5}}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                    {wallet != null && <CardActions sx={{p: 1.25, pt: 0, justifyContent: 'center'}}>
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => {
                                window.open(`https://etherscan.io/address/${wallet.address}`);
                            }}
                        >
                            View all
                        </Link>
                    </CardActions>}
                </MainCard>
            )}
        </>
    );
};


export default PopularCard;
