import multer from 'multer'

// import path from '../../public/temp'



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      // console.log("file info", file)
      cb(null, file.originalname)
    }
  })
  
  export const upload = multer({ storage: storage })