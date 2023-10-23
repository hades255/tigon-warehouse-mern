import React, { useEffect, useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Navbar,
  NavItem,
  Nav,
  Container,
  // UncontrolledTooltip,
} from "reactstrap";
import { useSelector } from "../../redux/store";
import { useCallback } from "react";
import { AuthContext } from "../../context/AuthContextProvider";

function IndexNavbar() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [navbarColor, setNavbarColor] = useState("navbar-transparent");
  const [collapseOpen, setCollapseOpen] = useState(false);

  const handleLogout = useCallback(
    (e) => {
      e.preventDefault();
      authContext.logout();
      setTimeout(() => {
        navigate("/");
      }, 100);
    },
    [authContext, navigate]
  );

  useEffect(() => {
    const updateNavbarColor = () => {
      if (
        document.documentElement.scrollTop > 399 ||
        document.body.scrollTop > 399
      ) {
        setNavbarColor("");
      } else if (
        document.documentElement.scrollTop < 400 ||
        document.body.scrollTop < 400
      ) {
        setNavbarColor("navbar-transparent");
      }
    };
    window.addEventListener("scroll", updateNavbarColor);
    return function cleanup() {
      window.removeEventListener("scroll", updateNavbarColor);
    };
  });

  return (
    <>
      {collapseOpen ? (
        <div
          id="bodyClick"
          onClick={() => {
            document.documentElement.classList.toggle("nav-open");
            setCollapseOpen(false);
          }}
        />
      ) : null}
      <Navbar className={"fixed-top " + navbarColor} expand="lg" color="info">
        <Container>
          <div className="navbar-translate">
            <Link to="/" id="navbar-brand" className="navbar-brand">
              Warehouse
            </Link>
            {/* <UncontrolledTooltip target="#navbar-brand">
              Warehouse
            </UncontrolledTooltip> */}
            <button
              className="navbar-toggler navbar-toggler"
              onClick={() => {
                document.documentElement.classList.toggle("nav-open");
                setCollapseOpen(!collapseOpen);
              }}
              aria-expanded={collapseOpen}
              type="button"
            >
              <span className="navbar-toggler-bar top-bar"></span>
              <span className="navbar-toggler-bar middle-bar"></span>
              <span className="navbar-toggler-bar bottom-bar"></span>
            </button>
          </div>
          {user && (
            <Collapse
              className="justify-content-end"
              isOpen={collapseOpen}
              navbar
            >
              <Nav navbar>
                <NavItem>
                  <NavLink to="/packages" className={"nav-link"}>
                    <i className="now-ui-icons shopping_box"></i>
                    <p>Packages</p>
                  </NavLink>
                </NavItem>
                {user.role === "admin" && (
                  <NavItem>
                    <NavLink to="/users" className={"nav-link"}>
                      <i className="now-ui-icons users_single-02"></i>
                      <p>Users</p>
                    </NavLink>
                  </NavItem>
                )}
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    href="#pablo"
                    nav
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="now-ui-icons users_circle-08"></i>
                    <p>{user.name}</p>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem to="/" tag={Link}>
                      <i className="now-ui-icons business_chart-pie-36 mr-1"></i>
                      Profile
                    </DropdownItem>
                    <DropdownItem onClick={handleLogout}>
                      <i className="now-ui-icons design_bullet-list-67 mr-1"></i>
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          )}
        </Container>
      </Navbar>
    </>
  );
}

export default IndexNavbar;
