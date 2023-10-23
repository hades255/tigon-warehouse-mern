import React, { useState, useCallback } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  Container,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom";

import MyInput from "../form/MyInput";
import { dispatch } from "../../redux/store";
import { register } from "../../redux/reducers/authReducer";

const Register = () => {
  const [state, setState] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleRegister = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(
        register({
          email: state.email,
          password: state.password,
          name: state.lastname + " " + state.firstname,
        })
      );
    },
    [state]
  );

  const handleInputChange = useCallback(
    ({ target: { name, value } }) => {
      setState({ ...state, [name]: value });
    },
    [state]
  );

  return (
    <div>
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("../../assets/img/bg1.jpg") + ")",
          }}
        ></div>
        <Container className="section-signup">
          <Row>
            <Card
              className="card-login card-plain card-signup bg-transparent"
              data-background-color="blue"
            >
              <Form
                action=""
                className="form"
                method=""
                onSubmit={handleRegister}
              >
                <CardHeader className="text-center">
                  <div className="logo-container">
                    <img
                      alt="..."
                      src={require("../../assets/img/now-logo.png")}
                    ></img>
                  </div>
                  <CardTitle className="title-up" tag="h3">
                    Sign Up
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <MyInput
                    icon="users_circle-08"
                    placeholder="Firstname..."
                    type="text"
                    name="firstname"
                    value={state.firstname}
                    onChange={handleInputChange}
                    required
                  />
                  <MyInput
                    icon="users_circle-08"
                    placeholder="Lastname..."
                    type="text"
                    name="lastname"
                    value={state.lastname}
                    onChange={handleInputChange}
                    required
                  />
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
                    className="btn-neutral btn-round"
                    color="info"
                    size="lg"
                    type="submit"
                  >
                    Get Started
                  </Button>
                </CardFooter>
              </Form>
            </Card>
          </Row>
          <div className="col text-center">
            <Link
              className="btn-round btn-white"
              color="default"
              to="/"
              size="lg"
              tag={Link}
            >
              Go Login Page
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Register;
