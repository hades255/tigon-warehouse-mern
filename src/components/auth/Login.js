import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextProvider";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  Container,
  Col,
  CardTitle,
} from "reactstrap";
import MyInput from "../form/MyInput";
import { useSelector } from "react-redux";

function LoginPage() {
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const user = useSelector((state) => state.auth.user);

  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();
      authContext.login(state);
    },
    [state, authContext]
  );

  const handleInputChange = useCallback(
    ({ target: { name, value } }) => {
      setState({ ...state, [name]: value });
    },
    [state]
  );

  useEffect(() => {
    if (user) {
      const redirect = new URLSearchParams(location.search).get("redirect");
      navigate(redirect || "/packages");
    }
  }, [user, location, navigate]);

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage:
              "url(" + require("../../assets/img/login.jpg") + ")",
          }}
        ></div>
        <div className="content">
          <Container>
            <Col className="ml-auto mr-auto" md="4">
              <Card className="card-login card-plain">
                <Form
                  action=""
                  className="form"
                  method=""
                  onSubmit={handleLogin}
                >
                  <CardHeader className="text-center">
                    <div className="logo-container">
                      <img
                        alt="..."
                        src={require("../../assets/img/now-logo.png")}
                      ></img>
                    </div>
                    <CardTitle className="title-up" tag="h3">
                      Sign In
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <MyInput
                      icon="ui-1_email-85"
                      placeholder="Email..."
                      type="email"
                      name="email"
                      value={state.email}
                      onChange={handleInputChange}
                      required
                    />
                    <MyInput
                      icon="objects_key-25"
                      placeholder="Password..."
                      type="password"
                      name="password"
                      value={state.password}
                      onChange={handleInputChange}
                      required
                    />
                  </CardBody>
                  <CardFooter className="text-center">
                    <Button
                      block
                      className="btn-round mb-5"
                      color="info"
                      size="lg"
                      type="submit"
                    >
                      Get Started
                    </Button>
                    <div className="pull-left">
                      <h6>
                        <Link className="link" to="/register">
                          Create Account
                        </Link>
                      </h6>
                    </div>
                    <div className="pull-right">
                      <h6>
                        <a
                          className="link"
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          Need Help?
                        </a>
                      </h6>
                    </div>
                  </CardFooter>
                </Form>
              </Card>
            </Col>
          </Container>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
