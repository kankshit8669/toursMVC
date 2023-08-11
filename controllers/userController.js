const multer = require('multer');
const sharp = require('sharp');
// sharp is a very nice and easy to use image processing 
// library for nodejs
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
;



//now lets configure our multer uploads to our needs
//for that we are going to create one Multer storage
//and one multer filter and then we are going to use
// fileter and the storage to create the upload from there
//

// {
//   fieldname: 'photo',
//   originalname: 'leo.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'public/img/users',
//   filename: 'a5b1d551641c62782c684c3aa3ee2cde',
//   path: 'public\\img\\users\\a5b1d551641c62782c684c3aa3ee2cde',
//   size: 207078
// }


// const multerStorage = multer.diskStorage({

//   destination:(req,file,cb) => {
//     cb(null,'public/img/users');
//   },
//   filename:(req,file,cb)=>{ 
//     //now we want to get our files some unique file name
//   //user-34343-3434(which is the current timestamp).jpeg
//   //so this will garuantee the facct that there wont be two imgaes
//   // with same file name if we only use the user id then 
//   //multiple uploads by same user wolud override the previos image

//   //extacting the file name from the upload

//   // you can see the req.file in order to get the obj names in there
//   const ext = file.mimetype.split('/')[1]; //so this is the extension
//   // so then we need to call the callback functions with  no error that is null
//   cb( null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }

// }
  
// )
// so this is the complete defination of how we want to store our file with 
// destination and the filename

// this way the image will then be stored as the buffer

const  multerStorage = multer.memoryStorage();
//and then that buffer is then availabl at req.file .buffer



//creating a multer filter\
//this function goal is to test if the upload file is an image
// and if it is so then we pass true inot the cb function else false in cb along with the error
//cuz we don't want the files to be uploaded that are not images
//and that's what this filter does

//now in our own app if we want to upload the csv files 
// then we can check for that instead of images  over her
// so this works for all kinds of files not only images by the way
const multerFilter = (req,file,cb)=>{


  //for that again we gonna use mimetype so whatever image is uploaded
  // for ig jpeg , png or bitmap or a tiff or etc
  //the minetype will alawys start with the image wow thats cools right
  
  if(file.mimetype.startsWith('image'))
  {
 // well in that case we acually have a image
 // so in the cb we say no error that is null and 
 // we say true
 cb(null, true)

  }
  else{
 ///otherwise we will pass the error and then false   /// 400 for bad req
  cb( new AppError('Not an image! Please upload only images',400), false); 

  }


}


//Everything realted to multer over here 
//if we call the multer fun without any opetion then the
// /// img would simply  be stored in the memory and not saved anywhere to the disk
// const upload = multer({dest:'public/img/users'});

// const upload = multer({dest:'public/img/users'});

// now the upload will look like this

const upload = multer({
  //we could have written all over here only but thislooks good
  storage:multerStorage,
  fileFilter:multerFilter
})

/// after all of this config this is how our req.file will look like 
// {
//   fieldname: 'photo',
//   originalname: 'leo.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'public/img/users',
//   filename: 'user-5c8a1f292f8fb814b56fa184-1667564215248.jpeg',
//   path: 'public\\img\\users\\user-5c8a1f292f8fb814b56fa184-1667564215248.jpeg',
//   size: 207078
// }

exports.uploadUserPhoto = upload.single('photo');

//Lets now save the actaull name of the
// uploaded image to the corrosponding
// updated user document
//and then we wil do in the upadteme mid 




// everywhre in our userinterface we assume that the uploaded 
// images are squares so then we can display them as the 
// cirles and this only works when they are squares so we 
// want to resize the images to make them squares for that 
// we will add another middlware in the update me route which 
// will take care of the image proces

exports.resizeUserPhoto = (req, res, next)=>
{
  console.log(req.file)
  /// so at this point of time we already have the file on the req obj
  //atleast if there was an upload and if there was no upload then we dont wwant to don anything

 if(!req.file) return next();


//we are doing it like this cuz right now this filename
//is not defined so when we decide to save the image into memory
//as the buffer the file name will not really get set
//but we really need that file name in our other mid fun
//in update me where we save the name into our db
req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`
//we can get rife of ext cuz we took care of it in the below thing

console.log(req.file.buffer);


 //else we will do the resizing for that we are going to use the 
 //sharp package 
 // so we say the sharp and then we need to pass in the file
 //now when doing the image processing like this right after uploading the file
 //and it's always best to not even save the file to the disk but instead
 // save it to the memory for that we need to have to change our multer
 // config a bit
 //we used memeoryStorage instead of disk 

//  sharp( req.file.buffer);
 //this is way more efficient like this
 //instead of having to write the file to the disk 
 //and then in sharp read it again what we do instead is
 // we simply keep the image in the memory and then
 // here with the help of req.file.buffer we can read that
 //calling the sharp function like this will then create
 // an object on which we can chain mulltiple methods in order
 // to do our image processing 

// resize in where we can specify the height and the width
//now covert images to always jpeg
//and then quality so that it doesnt take up lot of space
// and then we will finally want to write that into a file on our disk and for that we cacn use
// tofile thing//and this method acually needs the entire path to
//the file 
sharp (req.file.buffer)
  .resize(500,500)
  .toFormat('jpeg')
  .jpeg({quality :90})
  .toFile(`public/img/users/${req.file.filename}`);


//and then call the next mid in the stack

console.log(req.user)


next();

}


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {


// console.log(req.file);


// {
//   fieldname: 'photo',
//   originalname: 'leo.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'public/img/users',
//   filename: 'a5b1d551641c62782c684c3aa3ee2cde',
//   path: 'public\\img\\users\\a5b1d551641c62782c684c3aa3ee2cde',
//   size: 207078
// }

// console.log(req.body);
//it's only the name hence our body parse is not really able to handle
//files tha is why the file is not at all showing up in the body atall
//and then is the whole reason why we actually need the multer package
// { name: 'Leo kankshit Gillespie' }



  // 1) Create error if user POSTs password data
  
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  //Lets now save the actaull name of the
// uploaded image to the corrosponding
// updated user document
//and then we wil do in the upadteme mid 
  // so the date that gets updated is stored in the filterBody obj
 // this filteredBody obj is the result of filtering the req.body
 //leaving only the name and the email an we wil add photo to it
//  .photo is the name of the filed which holds the photo
// we only store the image name to our doc and not the entrie path to the image
if(req.file) filteredBody.photo = req.file.filename;
  
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
