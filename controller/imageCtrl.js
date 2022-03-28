const cloudinary = require("cloudinary");
const fs = require("fs");

cloudinary.config({
  cloud_name: require("../config.json").config.cloudinary_cloud,
  api_key: require("../config.json").config.cloudinary_api,
  api_secret: require("../config.json").config.cloudinary_secret,
});

const imageCtrl = {
  upload: async (req, res) => {
    try {
      // res.json({"data":req.files})     //files is borrowed from express-fileupload

      if (!req.files || Object.keys(req.files).length === 0)
        return res.status(400).json({ msg: "no file selected" });

      const file = req.files.myfile; //myfile is defined on postman by user
      if (file.size > 1 * 1024 * 1024) {
        removeTemp(file.tempFilePath);
        return res.status(400).json({ msg: "file size is not more  than 1 mb " });
      }

      if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png" && file.mimetype !== "image/jpg")
       {
        removeTemp(file.tempFilePath);
        return res.status(400).json({ msg: "incorrect file format " });
      }

      cloudinary.v2.uploader.upload(file.tempFilePath,{ folder: "myphotos" },async (err, result) => {
          if (err) throw err;
          removeTemp(file.tempFilePath);
          res.json({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const {public_id} = req.body;
        if(!public_id) 
            return res.status(400).json({msg:"No images selected"});

        cloudinary.v2.uploader.destroy(public_id, async(err,result) => {
            if(err) 
                return res.status(400).json({msg:err.message});
            res.status(200).json({msg:"Image deleted Successfully"});
        })
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

//for remove the temp files
const removeTemp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = imageCtrl;
