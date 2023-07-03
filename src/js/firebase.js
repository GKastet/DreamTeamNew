import { initializeApp } from 'firebase/app';
import { getDatabase, set, ref, update } from 'firebase/database';
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import * as basicLightbox from 'basiclightbox';
// import 'basicLightbox/dist/basicLightbox.min.css';

let instance;
const elems = {
  signIn: document.querySelector('.divSignIn'),
  signUp: document.querySelector('.divSignUp'),
  pageShoplist: document.querySelector('#shoplist-link'),
  divSignBtns: document.querySelector('.signInUp'),
  logOutBtn: document.querySelector('.header-btn'),
  modalBtn: document.querySelector('.modal-sub-btn')  
};

elems.signIn.addEventListener('click', handlerOpenSignInModal);

function handlerOpenSignInModal() {
  instance = basicLightbox.create(`
	<form class="js-signIn-form" autocomplete="off">
        
        <input type="text" name="email" placeholder="EMAIL">
        <input type="password" name="password" placeholder="Password">
        <button class="btn" type="submit">SIGN UP</button>
      </form>
`);
  instance.show();
  const signInForm = document.querySelector('.js-signIn-form');
  console.log(signInForm);
  signInForm.addEventListener('submit', onLoginFormSubmit);
}

elems.signUp.addEventListener('click', handlerOpenSignUpModal);

function handlerOpenSignUpModal() {
  const instance = basicLightbox.create(`
	<form class="js-signUp-form" autocomplete="off">
        <input type="text" name="username" placeholder="NAME">
        <input type="text" name="email" placeholder="EMAIL">
        <input type="password" name="password" placeholder="Password">
        <button class="btn" type="submit">SIGN UP</button>
      </form>
`);
  instance.show();  
  const signUpForm = document.querySelector('.js-signUp-form');
  console.log(signUpForm);
  signUpForm.addEventListener('submit', onSignUpFormSubmit);
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCUOAJMmfepQS1vMZoB2PqryATPkPGqCdY',
  authDomain: 'dreamteamnew-4761c.firebaseapp.com',
  projectId: 'dreamteamnew-4761c',
  storageBucket: 'dreamteamnew-4761c.appspot.com',
  messagingSenderId: '975938870084',
  appId: '1:975938870084:web:538917a9b48d05e6d55511',
  measurementId: 'G-8VV155ZTQZ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();


async function onSignUpFormSubmit(e) {
  e.preventDefault();

  const {
    username: { value: username },
    email: { value: email },
    password: { value: password },
  } = e.currentTarget.elements;

  await createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;

      set(ref(database, 'users/' + user.uid), {
        username,
        email,
      });
    //   signOut(auth);

      Notify.success('Signed up!');
    })
    .catch(error => {
      Notify.failure(error.message);
    })
    .finally(()=>{
        instance.close();
    })  
}

async function onLoginFormSubmit(e) {
  e.preventDefault();

  const {
    email : { value : email},
    password : {value : password}
    } = e.currentTarget.elements;

  await signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      
      const user = userCredential.user;
      const currentDate = new Date();

      update(ref(database, 'users/' + user.uid), {
        last_login_date: currentDate,
      });
      
      Notify.success('Logged in!', {
        timeout: 1500,
      });
    })
    .catch(error => {
      Notify.failure(error.message);
    })
    .finally(()=>{
        instance.close(); 
    })
}

// signOut(auth);

function onLogOutBtnClick(e) {
  signOut(auth);
  window.location = 'index.html';
}

onAuthStateChanged(auth, user => {
        
    if(user){      
        localStorage.setItem('user', user.uid);
        elems.logOutBtn.addEventListener('click', onLogOutBtnClick);              
        elems.divSignBtns.classList.add('display');
        elems.pageShoplist.classList.remove('display');        
        elems.logOutBtn.classList.remove('display');

    }else{
        elems.divSignBtns.classList.remove('display');
        elems.pageShoplist.classList.add('display');        
        elems.logOutBtn.classList.add('display');
        localStorage.removeItem('user')
    }    
    return
});