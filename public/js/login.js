// const { axios } = require("axios");

//axios will trough an erroe whenever we get an error from
// our api endpoint


//this is for the showalert thing    


const loginForm = document.querySelector('.form--login');
// const mapBox = document.getElementById('map');
// const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');





const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
 const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};


//Login thing 
const login = async (email,password)=>{

    console.log("hello from the browser\n");
    console.log(email,password);
    // axios.defaults.withCredentials = true;

 try{
   const res = await axios({

        method:'POST',
        url: 'http://127.0.0.1:3000/api/v1/users/login',
        //and now we need to specify the data which we wanna send it along with the req in the body
        // withCredentials: true,
        data:{
            email:email,
            password:password
        }
    });
  
    console.log(res);

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }



    
}catch(err){
  showAlert('error', err.response.data.message);
// console.log(err.response.data);


}


}


//logout thing

 const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });
    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};

// / type is either 'password' or 'data'
const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};







// if (userDataForm)
//   userDataForm.addEventListener('submit', e => {
//     e.preventDefault();

//     console.log("hello there what's up")
//     //we need to progarmatically recreate multipart formdata
//     // WE BASICALLY RECREATE THIS MULTIPART FORM DATA AND SO THAT'S IS
//     // ACUATLLY WHY IT'S CALLED FORM DATA IS BECAUSE WELL THAT
//     // FORMDATA IS ALSO HERE IN THIS MULTEPART ENCTYPE
//     const form = new FormData();
//     // and then onto this form we need to keep apending the new data
//     //name and the value of the name
//     form.append('name', document.getElementById('name').value)
//     form.append('email',document.getElementById('email').value)
//     form.append('photo',document.getElementById('photo').files[0])
//     // fles over here is acually an array hence we need to select
//     //that first element in the array

//     console.log(form);

//    // now we get ride of this and then in the updatesetting we

//    // passin the form 

//     // const name = document.getElementById('name').value;
//     // const email = document.getElementById('email').value;
//     // updateSettings({ name, email }, 'data');
//     updateSettings(form, 'data');
//     //and then ou rajax call using axios will then actually recognize
//     //this form as and object and will work the same as that before
//    // AND IN THE UPDATE SETTING WE HAVE NOTING TO CHANGE
//    //and also the upate me endpoint where we are submmiting this request to
//    // is already working and ready to accept images and even to resize them

//   });

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    updateSettings(form, 'data');
  });

  
if (userPasswordForm)
userPasswordForm.addEventListener('submit', async e => {
  e.preventDefault();
  document.querySelector('.btn--save-password').textContent = 'Updating...';

  const passwordCurrent = document.getElementById('password-current').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('password-confirm').value;
  await updateSettings(
    { passwordCurrent, password, passwordConfirm },
    'password'
  );

  document.querySelector('.btn--save-password').textContent = 'Save password';
  document.getElementById('password-current').value = '';
  document.getElementById('password').value = '';
  document.getElementById('password-confirm').value = '';
});




// // type is either 'password' or 'data'
// const updateSettings = async (data, type) => {
//   try {
//     const url =
//       type === 'password'
//         ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
//         : 'http://127.0.0.1:3000/api/v1/users/updateMe';

//     const res = await axios({
//       method: 'PATCH',
//       url,
//       data
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', `${type.toUpperCase()} updated successfully!`);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };



if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

  if (logOutBtn) logOutBtn.addEventListener('click', logout);








  