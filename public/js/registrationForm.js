let registrationForm=document.getElementById('registration-form')


if(registrationForm){
    let errorFlag = 0;
    // let text=document.getElementById('arrays')
    
    registrationForm.addEventListener('submit',(event)=>{
        // Input Validation
        if(errorFlag!==0){
            event.preventDefault()
        }
    })
}