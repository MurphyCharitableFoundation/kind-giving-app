import { MouseEvent, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

import theme from "../../theme/theme";

import Logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  children?: string;
}

const pages = ["Projects", "Campaigns", "Causes"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Navbar = ({ children }: NavbarProps) => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const navigate = useNavigate();

  // function to handle redirecting the user to the clicked route
  const handleClick = (e: string) => {
    if (pages.includes(e)) {
      for (let i = 0; i < pages.length; i++) {
        if (pages[i] === e) {
          navigate("/" + e.toLowerCase());
        }
      }
    }
  };

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
    <AppBar
      position="static"
      sx={{
        boxShadow: {
          xs: "none",
        },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          backgroundColor: {
            lg: theme.palette.primary.main,
            xl: theme.palette.primary.main,
            md: theme.palette.primary.main,
            sm: theme.palette.primary.main,
            xs: theme.custom.surface.main,
          },
        }}
      >
        <Toolbar disableGutters>
          {/* logo div */}
          <Box
            component="img"
            sx={{
              height: 200,
              width: 200,
              display: {
                xs: "none",
                md: "flex",
                sm: "flex",
                lg: "flex",
                xl: "flex",
              },

              maxHeight: { xs: 60, md: 60 },
              maxWidth: { xs: 60, md: 250, lg: 200, sm: 180 },
            }}
            alt="Logo"
            src={Logo}
          />

          {/* left part of the navbar */}
          <Box
            sx={{
              flexGrow: 0,
              display: {
                xs: "flex",
                md: "none",
                sm: "none",
                lg: "none",
                xl: "none",
              },
            }}
          >
            {/* hamburger menu button */}
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{
                marginRight: "16px",
                color: theme.custom.surface.onColor,
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* dropdown list that appears when we click the hamburger button */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    handleClick(page);
                    handleCloseNavMenu();
                  }}
                >
                  <Typography sx={{ textAlign: "right" }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* navbar options for smaller screens*/}
          <Box
            sx={{
              flexGrow: 1,
              display: {
                xs: "flex",
                sm: "none",
                md: "none",
                lg: "none",
                xl: "none",
                justifyContent: "center",
              },
            }}
          >
            <Typography
              variant="titleXLargetextMedium"
              sx={{
                my: 2,
                color: theme.custom.surface.onColor,
                display: "block",
                textTransform: "none",
              }}
            >
              {children}
            </Typography>
          </Box>

          {/* navbar options for larger screens*/}
          <Box
            sx={{
              flexGrow: 1,
              display: {
                xs: "none",
                sm: "flex",
                md: "flex",
                lg: "flex",
                xl: "flex",
                justifyContent: "end",
                gap: 40,
              },
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleClick(page)}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  textTransform: "none",
                  fontSize: "137%",
                  lineHeight: "28px",
                  letterSpacing: "0%",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Avatar */}
          <Box sx={{ flexGrow: 0, marginLeft: 5 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Gemy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
