import { useCallback, useEffect, useState } from "react";
import { Modal, ModalBody } from "reactstrap";

import "./MultiFileUploader.css";

const MultiFileUploader = ({ getpath, setUploading, setImagesPath }) => {
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [upload, setUpload] = useState("selected");

  const handleUpload = useCallback(() => {
    if (images && images.length === 0) {
      setUploading(false);
      return window.alert("You have to select images.");
    }
    const formData = new FormData();
    images
      .map((item) => item.file)
      .forEach((file) => {
        formData.append("files", file);
      });
    fetch((process.env.SERVER_URL || "http://localhost:3000") + "/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server
        if (data.files) {
          setImagesPath(data.files.map((item) => item.filename));
          setUpload("uploaded");
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the upload process
        console.error(error);
      });
  }, [images, setImagesPath, setUploading]);

  useEffect(() => {
    if (getpath) handleUpload();
  }, [getpath, handleUpload, images]);

  const handleFileChanged = useCallback(
    (event) => {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (images.find((item) => item.file.name === files[i].name)) return;
          setImages((prevImages) => [
            ...prevImages,
            {
              file: files[i],
              previewUrl: e.target.result,
            },
          ]);
        };
        reader.readAsDataURL(files[i]);
      }
      setUpload("selected");
    },
    [images]
  );

  const removeImage = useCallback(
    (index) => {
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages.splice(index, 1);
        return updatedImages;
      });
    },
    [setImages]
  );

  const showImage = useCallback(
    (index) => {
      setSelectedImage(images[index]);
      setShowModal(true);
    },
    [images]
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <div className="container">
      <form>
        <div className="col-md-3 custom-file">
          <input
            hidden
            type="file"
            className="custom-file-input"
            id="file-upload"
            multiple
            onChange={handleFileChanged}
          />
          <label
            className="custom-file-label bg-transparent text-white"
            htmlFor="file-upload"
            data-browse="Choose"
            title="Click here to select images"
          >
            {images.length} Images {upload}
          </label>
        </div>
        <div className="mt-2 d-flex flex-wrap">
          {images.map((image, index) => (
            <div key={index} className="col-md-2 col-sm-4 p-1">
              <img
                src={image.previewUrl}
                alt="Preview"
                className="rounded border"
                onClick={() => showImage(index)}
              />
              <span
                className="remove-button"
                onClick={() => removeImage(index)}
              >
                <i className="now-ui-icons ui-1_simple-remove"></i>
              </span>
            </div>
          ))}
        </div>
      </form>
      <Modal
        isOpen={showModal}
        toggle={closeModal}
        centered
        className="modal-xl"
      >
        <ModalBody className="p-0">
          <img
            src={selectedImage.previewUrl}
            alt="Preview"
            className="rounded img-thumbnail"
            onClick={() => closeModal()}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default MultiFileUploader;
