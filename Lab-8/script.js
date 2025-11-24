function sanitize(str=''){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

const form=document.getElementById('registrationForm');
const fname=document.getElementById('fname');
const lname=document.getElementById('lname');
const email=document.getElementById('email');
const password=document.getElementById('password');
const confirm=document.getElementById('confirm');

const errFname=document.getElementById('err-fname');
const errLname=document.getElementById('err-lname');
const errEmail=document.getElementById('err-email');
const errPassword=document.getElementById('err-password');
const errConfirm=document.getElementById('err-confirm');
const globalMsg=document.getElementById('globalMsg');
const togglePassword=document.getElementById('togglePassword');

function isEmpty(v){ return !v||v.trim()===''; }
function validEmail(v){ return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v); }

function markFieldOK(f,err){ f.classList.remove('error'); f.classList.add('success'); if(err) err.textContent=''; }
function markFieldError(f,err,msg){ f.classList.add('error'); f.classList.remove('success'); err.textContent=msg; }
function clearFieldMarks(){ [fname,lname,email,password,confirm].forEach(i=>i.parentNode.classList.remove('error','success')); [errFname,errLname,errEmail,errPassword,errConfirm].forEach(e=>e.textContent=''); globalMsg.textContent=''; }

togglePassword.addEventListener('click',()=>{ const type=password.type==='password'?'text':'password'; password.type=confirm.type=type; togglePassword.textContent=type==='text'?'Hide':'Show'; });

form.addEventListener('submit',e=>{
  e.preventDefault(); clearFieldMarks(); let ok=true;
  const f=sanitize(fname.value.trim()), l=sanitize(lname.value.trim()), em=sanitize(email.value.trim()), p=password.value, c=confirm.value;
  if(isEmpty(f)){ markFieldError(fname,errFname,'First name required'); ok=false;} else markFieldOK(fname,errFname);
  if(isEmpty(l)){ markFieldError(lname,errLname,'Last name required'); ok=false;} else markFieldOK(lname,errLname);
  if(isEmpty(em)){ markFieldError(email,errEmail,'Email required'); ok=false;} else if(!validEmail(em)){ markFieldError(email,errEmail,'Invalid email'); ok=false;} else markFieldOK(email,errEmail);
  if(isEmpty(p)){ markFieldError(password,errPassword,'Password required'); ok=false;} else if(p.length<8){ markFieldError(password,errPassword,'At least 8 chars'); ok=false;} else markFieldOK(password,errPassword);
  if(isEmpty(c)){ markFieldError(confirm,errConfirm,'Confirm password'); ok=false;} else if(c!==p){ markFieldError(confirm,errConfirm,'Passwords do not match'); ok=false;} else markFieldOK(confirm,errConfirm);
  if(ok){ globalMsg.style.color='#2ee6a5'; globalMsg.textContent='Form validated successfully!'; form.reset(); }
});
