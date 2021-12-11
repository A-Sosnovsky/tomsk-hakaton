import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ethers, utils, Wallet, Wordlist } from "ethers";
import { getRandomMnemonic, getBalance } from 'utils/api';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Chip,
    ClickAwayListener,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Typography,
    Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions, Grid, Divider
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import UpgradePlanCard from './UpgradePlanCard';
import User1 from 'assets/images/users/user-round.svg';

// assets
import { IconLogout, IconSettings } from '@tabler/icons';
import useMediaQuery from '@mui/material/useMediaQuery';

// ==============================|| PROFILE MENU ||============================== //

const CreateWalletDialog = ({opened, onClose}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [mnemonic, setMnemonic] = useState([]);
    useEffect(() => {
        setMnemonic(getRandomMnemonic);
    },[]);

    const handleClose = () => {
        onClose?.call();
    };

    const handleCreate = () => {

        onClose?.call();
    };

    return (<Dialog
        fullScreen={fullScreen}
        open={opened}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
    >
        <DialogTitle id="responsive-dialog-title">
            Do not share this words!!!
        </DialogTitle>
        <DialogContent>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {mnemonic.map((word, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <Chip avatar={<Avatar>{index+1}</Avatar>} label={word} />
                    </Grid>
                ))}
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={handleCreate}>
                Create
            </Button>
        </DialogActions>
    </Dialog>);
};

const BalanceValue = () =>{
    const [balance, setBalance] = useState(null);
    const [balanceLoading, setBalanceLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        async function loadBalance() {
            const balance = await getBalance();
            setBalance(balance);
            setBalanceLoading(false);
            console.log(balance)
        }
        // Execute the created function directly
        loadBalance().then();
    },[]);

    if(balance == null)
        return null;
    return (<Chip
        sx={{
            height: '48px',
            alignItems: 'center',
            borderRadius: '27px',
            transition: 'all .2s ease-in-out',
            borderColor: theme.palette.primary.light,
            backgroundColor: theme.palette.primary.light,
            '& .MuiChip-label': {
                lineHeight: 0
            }
        }}

        label={<Typography>
            Balance: {balance} ETH
        </Typography>}
        variant="outlined"
        aria-haspopup="true"
        color="primary"
    />);
};

const ProfileSection = () => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();

    const [sdm, setSdm] = useState(true);
    const [value, setValue] = useState('');
    const [notification, setNotification] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);
    const [createWalletDialogOpen, setCreateWalletDialogOpen] = useState(false);
    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);
    const handleLogout = async () => {
        // eslint-disable-next-line no-debugger
        debugger;
        const provider = ethers.getDefaultProvider();
        const dd = ethers.utils.randomBytes(16);
        // utils.HDNode.fromMnemonic("ottffssentet", null, )
        const mnemonic = ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(16), "en");
        // const ss = await ethers.utils.HDNode.fromMnemonic(phrase);
        const wallet = utils.HDNode.fromMnemonic(mnemonic);

        console.log('Logout');
    };

    const handleLogin = async () => {

    };

    const handleCreateNewWalletClose = () => {
        setCreateWalletDialogOpen(false);
    }

    const handleCreateNewWallet = async () => {
        setCreateWalletDialogOpen(true);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleListItemClick = (event, index, route = '') => {
        setSelectedIndex(index);
        handleClose(event);

        if (route && route !== '') {
            navigate(route);
        }
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.primary.light,
                    backgroundColor: theme.palette.primary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                icon={
                    <Avatar
                        src={User1}
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: '8px 0 8px 8px !important',
                            cursor: 'pointer'
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                    />
                }
                label={<div>
                    <IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />
                </div>}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                                        <Box sx={{ p: 2 }}>
                                            <List
                                                component="nav"
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 350,
                                                    minWidth: 300,
                                                    backgroundColor: theme.palette.background.paper,
                                                    borderRadius: '10px',
                                                    [theme.breakpoints.down('md')]: {
                                                        minWidth: '100%'
                                                    },
                                                    '& .MuiListItemButton-root': {
                                                        mt: 0.5
                                                    }
                                                }}
                                            >
                                                <ListItemButton
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    selected={selectedIndex === 4}
                                                    onClick={handleLogin}
                                                >
                                                    <ListItemIcon>
                                                        <IconLogout stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Login</Typography>} />
                                                </ListItemButton>
                                                <ListItemButton
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    selected={selectedIndex === 5}
                                                    onClick={handleCreateNewWallet}
                                                >
                                                    <ListItemIcon>
                                                        <IconLogout stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Create new wallet</Typography>} />
                                                </ListItemButton>
                                            </List>
                                        </Box>
                                    </PerfectScrollbar>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
            {createWalletDialogOpen && <CreateWalletDialog opened={createWalletDialogOpen} onClose={handleCreateNewWalletClose}/>}
        </>
    );
};

export default ProfileSection;
