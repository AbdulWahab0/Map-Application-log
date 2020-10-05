import React, { Fragment, useState } from "react";
import axios from "axios";
import mainLogo from "../../client/sample.png";

const FileUpload = () => {
  const mystyle = {
    width: "100%",
  };
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });

      setMessage("File Uploaded");
    } catch (err) {
      if (err.response.status === 500) {
        setMessage("There was a problem with the server");
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input type="file" id="customFile" onChange={onChange} />
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>

        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
      <br />
      {uploadedFile ? (
        <div>
          <div>
            <h3 className="text-center">{uploadedFile.fileName}</h3>
            <img style={mystyle} src={mainLogo} alt="" />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;
