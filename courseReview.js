const baseUrl = "https://tarmeezacademy.com/api/v1"
//review course form
document.getElementById('review-course-form').addEventListener('submit',(event)=>{
    //loading btn
    document.getElementById('submit-course-review-btn').innerHTML =`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...`
    document.getElementById('submit-course-review-btn').disabled = true;
    // end loading btn
  event.preventDefault();
  const name = document.getElementById('c-r-form-name').value
  const github_account = document.getElementById('c-r-form-github_account').value
  const twitter_account = document.getElementById('c-r-form-twitter_account').value
  const linkedin_account = document.getElementById('c-r-form-linkedin_account').value
  const body = document.getElementById('c-r-form-body').value

  const params = {
      "name":name,
      "github_account":github_account,
      "twitter_account":twitter_account,
      "linkedin_account":linkedin_account,
      "body":body,

  }
  axios.post(`${baseUrl}/courseReviews`,params).then((response)=>{
    console.log(response)
      showAlert("thank you to review the course","success")


      document.getElementById('c-r-form-name').value =""
      document.getElementById('c-r-form-github_account').value =""
      document.getElementById('c-r-form-twitter_account').value =""
      document.getElementById('c-r-form-linkedin_account').value =""
      document.getElementById('c-r-form-body').value =""

  }).catch((error)=>{
      showAlert(error.response.data.message,"danger")
  }).finally(() => {
      document.getElementById('submit-course-review-btn').innerHTML =`submit`
      document.getElementById('submit-course-review-btn').disabled = false;
  });
}) 

//alert
function showAlert(msg,type="success"){
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = [
        `<div id="alert-msg" class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
      ].join('')
    
      alertPlaceholder.append(wrapper)
    
    }
    appendAlert(msg, type)
    setTimeout(()=>{
        const alert = bootstrap.Alert.getOrCreateInstance('#alert-msg')
        alert.close()
    },3000)
    
    
    }