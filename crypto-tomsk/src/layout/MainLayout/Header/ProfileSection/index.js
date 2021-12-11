import {useState, useRef, useEffect} from 'react';

import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {ethers, utils, Wallet, Wordlist} from "ethers";
import {getRandomMnemonic, getBalance, createNewWallet, logoutWallet, sendTransaction} from 'utils/api';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// material-ui
import Select from '@mui/material/Select';
import SendIcon from '@mui/icons-material/Send';
import {useTheme, styled} from '@mui/material/styles';
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
    Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions, Grid, Divider, TextField, MenuItem
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import User1 from 'assets/images/users/user-round.svg';

// assets
import {IconLogout, IconSettings} from '@tabler/icons';
import useMediaQuery from '@mui/material/useMediaQuery';
import {LOGIN_WALLET} from "../../../../store/actions";

// ==============================|| PROFILE MENU ||============================== //

const LoginWalletDialog = ({opened, onClose}) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [mnemonic, setMnemonic] = useState(Array.from({length: 12}, (_) => ""));
    useEffect(() => {
        setMnemonic(["napkin", "special", "aunt", "elite", "slice", "scheme", "sand", "always", "tongue", "suit", "mushroom", "half"]);
    }, []);

    const handleClose = () => {
        onClose?.call();
    };

    const handleLogin = () => {
        const wallet = createNewWallet(mnemonic.join(' '));
        dispatch({type: LOGIN_WALLET, wallet});
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
            <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 4, sm: 8, md: 12}} sx={{paddingTop: 1}}>
                {mnemonic.map((word, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <TextField
                            required
                            id={`outlined-required-${index}`}
                            label={index + 1}
                            defaultValue={word}
                        />
                    </Grid>
                ))}
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={handleLogin}>
                Create
            </Button>
        </DialogActions>
    </Dialog>);
}

const SendTransactionDialog = ({opened, onClose}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [mnemonic, setMnemonic] = useState([]);
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("");
    const dispatch = useDispatch();

    const onAddressChange = (e) => setAddress(e.target.value);
    const onAmountChange = (e) => setAmount(e.target.value);

    const handleSend = async () => {
        if (address && amount){
            const result = await sendTransaction(address, amount, 900000);
            onClose?.call();
        }

    }

    const handleClose = () => {
        onClose?.call();
    }

    return (<Dialog
        fullScreen={fullScreen}
        open={opened}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
    >
        <DialogTitle id="responsive-dialog-title">
            Send Transaction
        </DialogTitle>
        <DialogContent>
            <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 2, sm: 8, md: 12}} sx={{paddingTop: 1}}>
                <Grid item>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value="ETH"
                        defaultValue="ETH"
                        placeholder="Token"
                        label="Coin"
                    >
                        <MenuItem value="ETH">
                            <em>ETH</em>
                        </MenuItem>
                    </Select>
                </Grid>
                <Grid item component="div">
                    <TextField
                        id="outlined-number"
                        label="Amount"
                        type="number"
                        onChange={onAmountChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>

                <Grid item>
                    <TextField
                        required
                        onChange={onAddressChange}
                        id="outlined-required"
                        label="To Address"
                    />
                </Grid>

            </Grid>
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={handleSend}>
                Send
            </Button>
        </DialogActions>
    </Dialog>);

};

const CreateWalletDialog = ({opened, onClose}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [mnemonic, setMnemonic] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        setMnemonic(getRandomMnemonic);
    }, []);

    const handleClose = () => {
        onClose?.call();
    };

    const handleCreate = () => {
        const wallet = createNewWallet(mnemonic.join(' '));
        dispatch({type: LOGIN_WALLET, wallet});
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
            <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 4, sm: 8, md: 12}} sx={{paddingTop: 1}}>
                {mnemonic.map((word, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <TextField
                            id={`outlined-required-${index}`}
                            label={index + 1}
                            defaultValue={word}
                            disabled
                        />
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
    const [loginWalletDialogOpen, setLoginWalletDialogOpen] = useState(false);
    const [sendTransactionDialogOpen, setSendTransactionDialogOpen] = useState(false);
    const dispatch = useDispatch();
    const {wallet} = useSelector((state) => (state.wallet));

    const loggedIn = wallet != null;
    console.log(wallet);
    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

    const handleLogin = async () => {
        setLoginWalletDialogOpen(true);
    };

    const handleSendTransaction = async () => {
        setSendTransactionDialogOpen(true);
    };

    const handleCreateNewWalletClose = () => {
        setCreateWalletDialogOpen(false);
    }

    const handleLoginWalletClose = () => {
        setLoginWalletDialogOpen(false);
    }

    const handleSendTransactionClose = () => {
        setSendTransactionDialogOpen(false);
    }

    const handleCreateNewWallet = async () => {
        setCreateWalletDialogOpen(true);
    };

    const handleLogoutWallet = async () => {
        logoutWallet();
        dispatch({type: LOGIN_WALLET, wallet: null});
        setOpen(false);
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
                    <IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main}/>
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
                {({TransitionProps}) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow
                                          shadow={theme.shadows[16]}>
                                    <PerfectScrollbar
                                        style={{height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden'}}>
                                        <Box sx={{p: 2}}>
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
                                                {!loggedIn && <ListItemButton
                                                    sx={{borderRadius: `${customization.borderRadius}px`}}
                                                    selected={selectedIndex === 4}
                                                    onClick={handleLogin}
                                                >
                                                    <ListItemIcon>
                                                        <LoginIcon stroke={1.5} size="1.3rem"/>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={<Typography variant="body2">Login</Typography>}/>
                                                </ListItemButton>}
                                                {!loggedIn && <ListItemButton
                                                    sx={{borderRadius: `${customization.borderRadius}px`}}
                                                    selected={selectedIndex === 5}
                                                    onClick={handleCreateNewWallet}
                                                >
                                                    <ListItemIcon>
                                                        <AddCircleOutlineIcon stroke={1.5} size="1.3rem"/>
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Create new
                                                        wallet</Typography>}/>
                                                </ListItemButton>}
                                                {loggedIn && <ListItemButton
                                                    sx={{borderRadius: `${customization.borderRadius}px`}}
                                                    selected={selectedIndex === 6}
                                                    onClick={handleSendTransaction}
                                                >
                                                    <ListItemIcon>
                                                        <SendIcon stroke={1.5} size="1.3rem"/>
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Send
                                                        transaction</Typography>}/>
                                                </ListItemButton>}
                                                {loggedIn && <ListItemButton
                                                    sx={{borderRadius: `${customization.borderRadius}px`}}
                                                    selected={selectedIndex === 5}
                                                    onClick={handleLogoutWallet}
                                                >
                                                    <ListItemIcon>
                                                        <LogoutIcon stroke={1.5} size="1.3rem"/>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={<Typography variant="body2">Logout</Typography>}/>
                                                </ListItemButton>}

                                            </List>
                                        </Box>
                                    </PerfectScrollbar>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
            {createWalletDialogOpen &&
            <CreateWalletDialog opened={createWalletDialogOpen} onClose={handleCreateNewWalletClose}/>}
            {loginWalletDialogOpen &&
            <LoginWalletDialog opened={loginWalletDialogOpen} onClose={handleLoginWalletClose}/>}
            {sendTransactionDialogOpen &&
            <SendTransactionDialog opened={sendTransactionDialogOpen} onClose={handleSendTransactionClose}/>}
        </>
    );
};

export default ProfileSection;
