// const { axios } = require("axios");

//axios will trough an erroe whenever we get an error from
// our api endpoint

const login = async (email,password)=>{

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


const loginForm = document.querySelector('.form--login');

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });


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
  