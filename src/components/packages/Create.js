import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Label,
} from "reactstrap";
import MyInput from "../form/MyInput";
import MultiFileUploader from "../form/MultiFileUploader";
import AXIOS from "../../helpers/axios";

const initialState = {
  date: "",
  trackingNumber: "",
  prefix: "",
  id: "",
  weight: "",
  width: "",
  length: "",
  height: "",
};

const CreatePackage = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = useCallback(
    ({ target: { name, value } }) => setState({ ...state, [name]: value }),
    [state]
  );

  const createPkg = useCallback(
    (pkg) => {
      (async () => {
        try {
          await AXIOS.post("/api/packages", pkg);
          navigate("/packages");
        } catch (error) {
          console.log(error);
        }
      })();
    },
    [navigate]
  );

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (
      !window.confirm("Are you sure upload? If once upload, you cannot change.")
    )
      return;
    setUploading(true);
  }, []);

  useEffect(() => {
    if (uploading) {
      if (images && images.length) {
        const {
          date,
          trackingNumber,
          prefix,
          id,
          weight,
          width,
          length,
          height,
        } = state;
        createPkg({
          images,
          date,
          trackingNumber,
          customer: { prefix, id },
          package: { weight, width, length, height },
        });
      }
    }
  }, [state, images, createPkg, uploading]);

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage:
              "url(" + require("../../assets/img/bg5.webp") + ")",
          }}
        ></div>
        <div className="content">
          <Container>
            <Card
              className="card-plain bg-transparent"
              data-background-color="blue"
            >
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Button
                    type="submit"
                    className="btn-primary"
                    disabled={uploading}
                  >
                    Submit
                  </Button>
                  <div className="d-flex flex-wrap">
                    <Col lg={3} md={6} sm={6} className="mb-3">
                      <Label htmlFor="date-input">Confirm Date&Time</Label>
                      <MyInput
                        type="datetime-local"
                        id="date-input"
                        name="date"
                        value={state.date}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col lg={3} md={6} sm={6} className="mb-3">
                      <Label htmlFor="prefix-input">Customer Prefix</Label>
                      <MyInput
                        type="text"
                        id="prefix-input"
                        name="prefix"
                        value={state.prefix}
                        onChange={handleInputChange}
                        required
                        list="customer-prefix-list"
                      />
                      <datalist id="customer-prefix-list">
                        <option value="B2B" />
                        <option value="B2C" />
                      </datalist>
                    </Col>
                    <Col lg={3} md={6} sm={6} className="mb-3">
                      <Label htmlFor="id-input">Customer Id</Label>
                      <MyInput
                        type="number"
                        id="id-input"
                        name="id"
                        value={state.id}
                        onChange={handleInputChange}
                        required
                      />
                    </Col>
                    <Col lg={3} md={6} sm={6} className="mb-3">
                      <Label htmlFor="trackingNumber-input">
                        Tracking Number
                      </Label>
                      <MyInput
                        type="number"
                        id="trackingNumber-input"
                        name="trackingNumber"
                        value={state.trackingNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </Col>
                  </div>
                  <div className="d-flex flex-wrap">
                    <Col lg={3} md={3} sm={6} className="mb-3">
                      <Label htmlFor="width-input">Width</Label>
                      <MyInput
                        type="number"
                        id="width-input"
                        name="width"
                        value={state.width}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col lg={3} md={3} sm={6} className="mb-3">
                      <Label htmlFor="length-input">Length</Label>
                      <MyInput
                        type="number"
                        id="length-input"
                        name="length"
                        value={state.length}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col lg={3} md={3} sm={6} className="mb-3">
                      <Label htmlFor="height-input">Height</Label>
                      <MyInput
                        type="number"
                        id="height-input"
                        name="height"
                        value={state.height}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col lg={3} md={3} sm={6} className="mb-3">
                      <Label htmlFor="weight-input">Weight</Label>
                      <MyInput
                        type="number"
                        id="weight-input"
                        name="weight"
                        value={state.weight}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </div>
                </Form>
                <div className="d-flex">
                  <MultiFileUploader
                    getpath={uploading}
                    setImagesPath={setImages}
                    setUploading={setUploading}
                  />
                </div>
              </CardBody>
            </Card>
          </Container>
        </div>
      </div>
    </>
  );
};

export default CreatePackage;
