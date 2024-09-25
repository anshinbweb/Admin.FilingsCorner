import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Col, Label } from "reactstrap";
import { toast , ToastContainer } from 'react-toastify';
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// let ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;



const ImageUploader = forwardRef(({ onSave, initialLogo ,ASPECT_RATIO}, ref) => {
    const [showCrop, setShowCrop] = useState(false);
    const [error, setError] = useState("");
    const [croppedImages, setCroppedImages] = useState([]);
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState({
        unit: "%",
        width: 90,
        aspect: ASPECT_RATIO, // You can modify this based on your use case
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [croppedBlobs, setCroppedBlobs] = useState([]);

    useImperativeHandle(ref, () => ({
        emptyFields() {
            setCroppedImages([]);
            setCroppedBlobs([]);
            setShowCrop(false);
            setCompletedCrop(null);
            setImgSrc("");
        }
    }));

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, 1 / 1)); // Use aspect ratio from props if needed
    };

    const centerAspectCrop = (mediaWidth, mediaHeight, aspect) => {
        return centerCrop(
            makeAspectCrop(
                {
                    unit: "%",
                    width: 90,
                },
                aspect,
                mediaWidth,
                mediaHeight
            ),
            mediaWidth,
            mediaHeight
        );
    };

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );
    }, [completedCrop]);

    const onSelectFile = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            const image = new Image();
            image.src = reader.result.toString();
            image.onload = function () {
              const { naturalWidth, naturalHeight } = this;
              if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
                toast.error("Image must be at least 150 x 150 pixels.")
                setError("Image must be at least 150 x 150 pixels.");
                setImgSrc("");
              } else {
                setError("");
                setImgSrc(this.src);
              }
            };
          });
          reader.readAsDataURL(file);
        }
      };

    const handleSaveCroppedImage = () => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            setShowCrop(false);
            return;
        }

        const canvas = previewCanvasRef.current;
        canvas.toBlob((blob) => {
            const croppedImageURL = URL.createObjectURL(blob);
            onSave(blob, croppedImageURL); // Pass cropped image blob and URL to parent
            setCroppedImages(croppedImageURL);
            setCroppedBlobs(blob);
            setImgSrc("");
            setCrop({
                unit: "%",
                width: 90,
                aspect: ASPECT_RATIO,
            });
            setShowCrop(false);
            setCompletedCrop(null);
        });
    };

    return (
        <>
        <ToastContainer />
            <button
                type="button"
                className="btn btn-primary text-light mb-3"
                onClick={() => setShowCrop(true)}
            >
                Upload Images
            </button>

            {croppedImages.length > 0 ? (
                <div>
                    <div className="uploaded-images">
                        <img
                            src={croppedImages}
                            style={{
                                height: "300px",
                                width: "300px",
                            }}
                        />
                    </div>
                </div>
            ) : initialLogo ? (
                <div className="uploaded-images">
                    <img
                        src={`${process.env.REACT_APP_API_URL_COFFEE}/${initialLogo}`}
                        style={{
                            height: "300px",
                            width: "300px",
                        }}
                    />
                </div>
            ) : null}

            <Modal isOpen={showCrop} toggle={() => setShowCrop(!showCrop)} centered>
                <ModalHeader toggle={() => setShowCrop(false)}>Upload Image</ModalHeader>
                <ModalBody>
                    <Col>
                        <Label className="form-label">Gallery Image</Label>
                        <input type="file" accept="image/*" onChange={onSelectFile} />
                        {imgSrc && (
                            <div>
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={1 / 1}
                                >
                                    <img ref={imgRef} src={imgSrc} onLoad={onImageLoad} alt="Crop me" />
                                </ReactCrop>
                                <canvas
                                    ref={previewCanvasRef}
                                    style={{
                                        border: "1px solid black",
                                        objectFit: "contain",
                                        width: completedCrop?.width ?? 0,
                                        height: completedCrop?.height ?? 0,
                                    }}
                                />
                            </div>
                        )}
                        <p className="text-danger">{error}</p>
                    </Col>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-primary text-light" onClick={handleSaveCroppedImage}>
                        Save Cropped Image
                    </button>
                    <button className="btn btn-outline-danger" onClick={() => setShowCrop(false)}>
                        Close
                    </button>
                </ModalFooter>
            </Modal>
        </>
    );
});

ImageUploader.displayName = "ImageUploader"; // Add display name here

export default ImageUploader;
