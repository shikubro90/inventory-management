const multer = require('multer')

// Define file storage

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, '../upload')
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname,
    )
  },
})

// specify file format that can be save
function fileFilter(req, res, cb) {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'jpeg' ||
    file.mimetype === 'image/webp' ||
    file.mimetype === 'video/mp4'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({ storage, fileFilter })

module.exports = { upload }
