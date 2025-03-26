import React, {useEffect}from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import theme from '../../theme/theme';

import Logo from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';

const pages = ['Projects', 'Campaigns', 'Causes'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
const navigate = useNavigate();

const handleClick = (e: string) => {
  if (pages.includes(e)) {
    console.log(e, "clicked");
    for (let i = 0; i < pages.length; i++) {
      if (pages[i] === e) {
        console.log(pages[i]);
      }
      navigate("/" + e);
    }
  }
}

const updateFavicon = () => {
  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    document.head.appendChild(link);
  }

  link.href = Logo;
  link.sizes = "128x128";

    };

useEffect(() => {
    updateFavicon();
}, []);
  return (
    <AppBar position="static">
      <Container maxWidth="xl" sx={{color:{ lg:theme.palette.primary, xl:theme.palette.primary, md:theme.palette.primary, sm:theme.palette.primary.fixedDim, xs:theme.palette.primary.fixedDim }}}>
        <Toolbar disableGutters>
<Box
component="img"
sx={{
height: 200,
width: 200,
display: { xs: 'none', md: 'flex', sm:"flex", lg:"flex", xl:"flex" },

maxHeight: { xs: 60, md: 60 },
maxWidth: { xs:60, md: 250, lg:200, sm: 180 },
}}
alt="Logo"
src={Logo}
/>


          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none',sm:"none", lg:"none", xl:"none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={(e)=>{handleClick(page); handleCloseNavMenu}}>
                  <Typography sx={{ textAlign: 'right' }} >{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <Typography
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography> */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none',sm: "flex", md: 'flex', lg:"flex", xl:"flex", justifyContent: "end"} }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, ml:5, color: 'white', display: 'block' , textTransform: "none",fontSize: "137%", lineHeight: "28px", letterSpacing: "0%"}}
              >
                {page}
              </Button>
            ))}
          </Box>
          {/* Avatar */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Gemy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
<IconButton onClick={handleOpenUserMenu}>
  <KeyboardArrowDownIcon  sx={{ display:{xs: 'none'},color: 'white'}}/>
</IconButton>

        </Toolbar>
      </Container>
    </AppBar>
  );
}
