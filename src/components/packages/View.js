import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import moment from "moment";
import MyInput from "../form/MyInput";
import Chat, { UserItem } from "./chat";
import { useSelector } from "../../redux/store";
import AXIOS from "../../helpers/axios";
import "../form/MultiFileUploader.css";

const ViewPackage = () => {
  const navigate = useNavigate();
  const { id: packageId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [package_, setPackage_] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [state, setState] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await AXIOS.get("/api/users/free");
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const getPkg = useCallback((packageId) => {
    (async () => {
      try {
        const response = await AXIOS.get("/api/packages/" + packageId);
        setPackage_(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    getPkg(packageId);
  }, [getPkg, packageId]);

  useEffect(() => {
    if (package_) {
      setState({
        images: package_.images,
        date: moment(new Date(package_.date)).format("yyyy-MM-DDThh:mm"),
        trackingNumber: package_.trackingNumber,
        prefix: package_.customer.prefix,
        id: package_.customer.id,
        weight: package_.package.weight,
        width: package_.package.width,
        length: package_.package.length,
        height: package_.package.height,
      });
    }
  }, [package_]);

  const handleInputChange = useCallback(
    ({ target: { name, value } }) => setState({ ...state, [name]: value }),
    [state]
  );

  const showImage = useCallback(
    (index) => {
      setSelectedImage(state.images[index]);
      setShowModal(true);
    },
    [state]
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleCloseSelectUserModal = useCallback(() => {
    setShowAssignModal((prev) => !prev);
  }, []);

  const handleRemoveImage = useCallback(
    (img) => {
      setState({
        ...state,
        images: state.images.filter((item) => item !== img),
      });
    },
    [state]
  );

  const handleSingleImageUpload = useCallback(
    (event) => {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("files", file);
      fetch(
        (process.env.SERVER_URL || "http://localhost:3000") + "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // Handle the response from the server
          if (data.files) {
            setState({
              ...state,
              images: [...state.images, data.files[0].filename],
            });
          }
        })
        .catch((error) => {
          // Handle any errors that occur during the upload process
          console.error(error);
        });
    },
    [state]
  );

  const updatePkg = useCallback(
    (pkg) => {
      (async () => {
        try {
          await AXIOS.put("/api/packages/" + packageId, pkg);
          window.alert("Update success");
        } catch (error) {
          console.log(error);
        }
      })();
    },
    [packageId]
  );

  const handleSetAssign = useCallback(
    (assign) => {
      (async () => {
        try {
          await AXIOS.patch("/api/packages/" + packageId, { assign });
          getPkg(packageId);
          setUsers((prev) => prev.filter((item) => !assign.includes(item._id)));
          window.alert("Update success");
        } catch (error) {
          console.log(error);
        }
      })();
    },
    [packageId, getPkg]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const {
        images,
        date,
        trackingNumber,
        prefix,
        id,
        weight,
        width,
        length,
        height,
      } = state;
      updatePkg({
        images,
        date,
        trackingNumber,
        customer: { prefix, id },
        package: { weight, width, length, height },
      });
    },
    [state, updatePkg]
  );

  const handleRemove = useCallback(() => {
    if (
      window.prompt(
        "If you sure to remove this package, type 'warehouse' here."
      ) !== "warehouse"
    )
      return;
    (async () => {
      try {
        await AXIOS.delete("/api/packages/" + packageId);
        navigate("/packages");
      } catch (error) {
        console.log(error);
      }
    })();
  }, [packageId, navigate]);

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("../../assets/img/bg2.jpg") + ")",
          }}
        ></div>
        <div className="mt-5 pt-5">
          {package_ && state && (
            <Container>
              <Card
                className="card-plain bg-transparent"
                data-background-color="blue"
              >
                <div className="d-flex flex-wrap">
                  <Col md={6} sm={12}>
                    <div className="d-flex">
                      {package_.recorder && (
                        <div className="d-flex align-items-center">
                          <span className="mr-3">Record:</span>
                          <UserItem user={package_.recorder} size={50} />
                        </div>
                      )}
                    </div>
                    {package_.assign && package_.assign.length > 0 && (
                      <div className="mt-3">
                        <div className="d-flex flex-wrap">
                          <span className="mr-3">Assigned:</span>
                          {package_.assign.map((item, key) => (
                            <UserItem key={key} user={item} size={45} />
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-2 border"></div>
                    <CardBody>
                      <Form onSubmit={handleSubmit}>
                        {(package_.recorder === user._id ||
                          user.role === "admin") && (
                          <div className="d-flex justify-content-center">
                            <Button type="submit" className="btn-primary">
                              Update
                            </Button>
                            {(!package_.assign || !package_.assign.length) && (
                              <>
                                <Button
                                  className="btn-outline-info"
                                  onClick={handleCloseSelectUserModal}
                                >
                                  Assign
                                </Button>
                                <SelectUsersPanel
                                  users={users}
                                  onClose={handleCloseSelectUserModal}
                                  open={showAssignModal}
                                  assign={handleSetAssign}
                                />
                              </>
                            )}
                          </div>
                        )}
                        <div className="d-flex flex-wrap">
                          <Col md={6} className="mb-3">
                            <Label htmlFor="date-input">
                              Confirm Date&Time
                            </Label>
                            <MyInput
                              type="datetime-local"
                              id="date-input"
                              name="date"
                              value={state.date}
                              onChange={handleInputChange}
                              readOnly={
                                !(
                                  package_.recorder === user._id ||
                                  user.role === "admin"
                                )
                              }
                            />
                          </Col>
                          <Col md={6} className="mb-3">
                            <Label htmlFor="prefix-input">
                              Customer Prefix
                            </Label>
                            <MyInput
                              type="text"
                              id="prefix-input"
                              name="prefix"
                              value={state.prefix}
                              onChange={handleInputChange}
                              readOnly={
                                !(
                                  package_.recorder === user._id ||
                                  user.role === "admin"
                                )
                              }
                              required
                            />
                          </Col>
                          <Col md={6} className="mb-3">
                            <Label htmlFor="id-input">Customer Id</Label>
                            <MyInput
                              type="text"
                              id="id-input"
                              name="id"
                              value={state.id}
                              onChange={handleInputChange}
                              readOnly={
                                !(
                                  package_.recorder === user._id ||
                                  user.role === "admin"
                                )
                              }
                              required
                            />
                          </Col>
                          <Col md={6} className="mb-3">
                            <Label htmlFor="trackingNumber-input">
                              Tracking Number
                            </Label>
                            <MyInput
                              type="text"
                              id="trackingNumber-input"
                              name="trackingNumber"
                              value={state.trackingNumber}
                              onChange={handleInputChange}
                              readOnly={
                                !(
                                  package_.recorder === user._id ||
                                  user.role === "admin"
                                )
                              }
                              required
                            />
                          </Col>
                        </div>
                        <div className="d-flex flex-wrap">
                          <Col md={6} className="mb-3">
                            <Label htmlFor="width-input">Width</Label>
                            <MyInput
                              type="text"
                              id="width-input"
                              name="width"
                              value={state.width}
                              onChange={handleInputChange}
                              readOnly={
                                !(
                                  package_.recorder === user._id ||
                                  user.role === "admin"
                                )
                              }
                            />
                          </Col>
                          <Col md={6} className="mb-3">
                            <Label htmlFor="length-input">Length</Label>
                            <MyInput
                              type="text"
                              id="length-input"
                              name="length"
                              value={state.length}
                              onChange={handleInputChange}
                              readOnly={
                                !(
                                  package_.recorder === user._id ||
                                  user.role === "admin"
                                )
                              }
                            />
                          </Col>
                          <Col md={6} className="mb-3">
                            <Label htmlFor="height-input">Height</Label>
                            <MyInput
                              type="text"
                              id="height-input"
                              name="height"
                              value={state.height}
                              onChange={handleInputChange}
                              readOnly={
                                !(
                                  package_.recorder === user._id ||
                                  user.role === "admin"
                                )
                              }
                            />
                          </Col>
                          <Col md={6} className="mb-3">
                            <Label htmlFor="weight-input">Weight</Label>
                            <MyInput
                              type="text"
                              id="weight-input"
                              name="weight"
                              value={state.weight}
                              onChange={handleInputChange}
                              readOnly={
                                !(
                                  package_.recorder === user._id ||
                                  user.role === "admin"
                                )
                              }
                            />
                          </Col>
                        </div>
                      </Form>
                      <div className="d-flex flex-wrap">
                        {state.images?.map((item, key) => (
                          <div
                            className="col-lg-3 col-md-4 col-sm-4 col-6 p-1"
                            key={key}
                          >
                            <div>
                              <img
                                alt="package"
                                src={
                                  (process.env.SERVER_URL ||
                                    "http://localhost:3000") +
                                  `/uploads/${item}`
                                }
                                className="rounded border"
                                onClick={() => showImage(key)}
                              />
                              <span
                                className="remove-button"
                                onClick={() => handleRemoveImage(item)}
                              >
                                <i className="now-ui-icons ui-1_simple-remove"></i>
                              </span>
                            </div>
                          </div>
                        ))}
                        <div className="col-lg-3 col-md-4 col-sm-4 col-6 p-1 d-flex">
                          <div className="custom-file w-100 h-100">
                            <input
                              hidden
                              type="file"
                              className="custom-file-input"
                              id="file-upload"
                              onChange={handleSingleImageUpload}
                            />
                            <label
                              className="cursor-pointer custom-file-label bg-transparent text-white"
                              htmlFor="file-upload"
                              data-browse="Choose"
                              title="Click here to select images"
                            >
                              +
                            </label>
                          </div>
                        </div>
                        <Modal
                          isOpen={showModal}
                          toggle={closeModal}
                          centered
                          className="modal-xl"
                        >
                          <ModalBody className="p-0">
                            <img
                              src={
                                (process.env.SERVER_URL ||
                                  "http://localhost:3000") +
                                `/uploads/${selectedImage}`
                              }
                              alt="Preview"
                              className="rounded img-thumbnail"
                              onClick={() => closeModal()}
                            />
                          </ModalBody>
                        </Modal>
                      </div>
                      {(package_.recorder === user._id ||
                        user.role === "admin") && (
                        <Button onClick={handleRemove} className="mt-5 btn-danger">
                          Remove Package
                        </Button>
                      )}
                    </CardBody>
                  </Col>
                  <Col md={6} sm={12}>
                    <Chat user={user} packageId={packageId} />
                  </Col>
                </div>
              </Card>
            </Container>
          )}
        </div>
      </div>
    </>
  );
};

const SelectUsersPanel = ({ users, open, onClose, assign }) => {
  const [selected, setSelected] = useState([]);

  const handleClose = useCallback(() => {
    onClose();
    setSelected([]);
  }, [onClose]);

  const handleAssign = useCallback(() => {
    assign(selected);
    onClose();
  }, [assign, selected, onClose]);

  return (
    <Modal isOpen={open} toggle={handleClose}>
      <ModalHeader>{selected.length} Employees Selected</ModalHeader>
      <ModalBody>
        <ListGroup>
          {users.map((item, key) => (
            <ListGroupItem
              key={key}
              className={selected.includes(item._id) ? "text-info" : ""}
            >
              <UserItem
                user={item}
                size={50}
                select={() => {
                  setSelected((prev) =>
                    selected.includes(item._id)
                      ? prev.filter((pItem) => pItem !== item._id)
                      : [...prev, item._id]
                  );
                }}
              />
            </ListGroupItem>
          ))}
        </ListGroup>
      </ModalBody>
      <ModalFooter>
        <Button className="btn-info" onClick={handleClose}>
          Close
        </Button>
        <Button className="btn-primary" onClick={handleAssign}>
          Assign
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewPackage;
