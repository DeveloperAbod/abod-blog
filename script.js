
const baseUrl = "https://tarmeezacademy.com/api/v1"
let currentPage = 1
let lastPage = 1
let pageCountHandle =true

setUpUi()

function getPosts(reload = true ,page = 1){
    axios.get(`${baseUrl}/posts?limit=3&page=${page}`)
    .then((response)=>{
    const posts = response.data.data
    lastPage = response.data.meta.last_page
    if(reload){
        document.getElementById('posts').innerHTML =""
    }
    for (const post of posts) {
        let postTitle  =""
        if(post.title != null && post.title != "null"){
            postTitle = post.title
        }
    
        let postImage  ="http://tarmeezacademy.com/images/posts/naPDQh7dEDTNj2f.jpg"
        if (post.image != null && post.image != "null" && JSON.stringify(post.image) !== "{}") {
            postImage = post.image;
        }
    
        let userImage  ="https://images.tarmeezacademy.com/users/n9TNMeF18Ys0ckt.jpg"
        if (JSON.stringify(post.author.profile_image) !== "{}") {
            userImage = post.author.profile_image;
        }
        const user = getCurrentUser()
        let editBtn = ""
        if(user != null &&post.author.id == user.id   ){
         editBtn = `<div class="float-end"><button class="btn btn-secondary" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
         <button class="btn btn-danger" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">delete</button></div>
         `  
        }

        document.getElementById('posts').innerHTML +=`
          
          <div class="card shadow my-4">
                        <div class="card-header">
                      <span style="cursor:pointer;" onclick="userClicked(${post.author.id})">
                        <img class="user-image rounded-circle border border-3" src="${userImage}"
                                alt="${post.author.name}">
                            <b>@${post.author.name}</b>
                      </span>
                            
                            ${editBtn}
                        </div>
                            <div class="card-body">
                             <a style="text-decoration: unset;color:black;" href="/postDetails.html?id=${post.id}">

                                <img class="w-100 post-image" style="object-fit: contain;" src="${postImage}"
                                    alt="${post.body}">
                                <h6 class="text-secondary mt-1">
                                    ${post.created_at}
                                </h6>
                                <h5 class="card-title">${postTitle}</h5>
                                <p class="card-text">${post.body}</p>
                                <hr>
                                <div>
                                    <i class="bi bi-chat"></i>
                                    <span>
                                        (${post.comments_count}) commits
                                    </span>
                                </div>
                                   </a>
                            </div>
                        
                    </div>
                 
                        
        `
    }

    pageCountHandle = true
    })
    .catch((error)=>{
    console.log(error)
    document.getElementById('posts').innerHTML = `error with status: ${error.request.status}`
    })
    
}

function getPostDetails(){
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')
    axios.get(`${baseUrl}/posts/${id}`)
    .then((response)=>{
    const post = response.data.data


    let postTitle  =""
    if(post.title != null && post.title != "null"){
        postTitle = post.title
    }

    let postImage  ="http://tarmeezacademy.com/images/posts/naPDQh7dEDTNj2f.jpg"

    if (post.image != null && post.image != "null" && JSON.stringify(post.image) !== "{}") {
        postImage = post.image;
    }

    let userImage  ="https://images.tarmeezacademy.com/users/n9TNMeF18Ys0ckt.jpg"
    if (JSON.stringify(post.author.profile_image) !== "{}") {
        userImage = post.author.profile_image;
    }
    
    document.getElementById('post-details-name').innerHTML = post.author.name


    const Comments  = post.comments
    let CommentsContents =""
    for(comment of Comments){
        let commentUserImage  ="https://images.tarmeezacademy.com/users/n9TNMeF18Ys0ckt.jpg"
        if (JSON.stringify(comment.author.profile_image) !== "{}") {
            commentUserImage = comment.author.profile_image;
        }
        CommentsContents +=`
                        <div class="p-3" style="background-color: rgb(231, 231, 231);">
                                <!-- Profile Pic + Username -->
                                <div>
                                    <img src="${commentUserImage}" class="rounded-circle"
                                        style="width: 40px; height: 40px;" alt="">
                                    <b>${comment.author.username}</b>
                                </div>
                                <!-- End Profile Pic + Username -->

                                <!-- Comment's Body -->
                                <div>${comment.body}</div>
                                <!-- End Comment's Body -->
                                </div>
        `

    }
    

    const postDetails = `
    <div class="card shadow my-4">
         <div class="card-header">
                 <img class="user-image rounded-circle border border-3"
                         src="${userImage}" alt="${post.author.name}">
                 <b>@${post.author.name}</b>
                 </div>
             <div class="card-body">
                  <img class="w-100 post-image" src="${postImage}" alt="${post.body}">
                         <h6 class="text-secondary mt-1">
                             ${post.created_at} 
                         </h6>
                         <h5 class="card-title">${postTitle}</h5>
                         <p class="card-text">${post.body}</p>
                         <hr>
                         <div>
                             <i class="bi bi-chat"></i>
                             <span>
                                 (${post.comments_count}) commits
                             </span>
                         </div>
            </div>
            <div id="comments">
            ${CommentsContents}
            </div>
            <div class="input-group mb-3" id="add-comment-div">
            <input id="comment-input" class="form-control" type="text" placeholder="add your comment here...">
            <button id="add-comment-button" onclick="createCommentClicked(${post.id})" class="btn btn-outline-primary">send</button>
            </div>
        </div>
                 
 `
    document.getElementById('post-details').innerHTML =postDetails

  

    })
    .catch((error)=>{
    console.log(error)
    document.getElementById('post-details').innerHTML = `error with status: ${error.request.status}`
    })
    
}


//default value
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


function setUpUi(){
    const loginBtn = document.getElementById('register-btn')
    const registerBtn =  document.getElementById('login-btn')
    const logoutBtn =  document.getElementById('logout-btn')
    const addPostBtn =  document.getElementById('add-btn')

    const navUsername =  document.getElementById('nav-username')
    const navAvatar =  document.getElementById('nav-avatar')
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if(token == null){ // user is guest
        loginBtn.style.display = "flex"
        registerBtn.style.display = "flex"
        logoutBtn.style.display = "none"
        addPostBtn.style.display = "none"
        navUsername.style.display = "none"
        navAvatar.style.display = "none"

    }else{
      loginBtn.style.display = "none"
      registerBtn.style.display = "none"
      logoutBtn.style.display = "flex"
      addPostBtn.style.display = "flex"
      navUsername.style.display = "flex"
      navAvatar.style.display = "flex"
        //  
        const user =  getCurrentUser()
        navUsername.innerHTML = user.username
        let userImage  ="https://images.tarmeezacademy.com/users/n9TNMeF18Ys0ckt.jpg"

        if (JSON.stringify(user.profile_image) !== "{}") {
            userImage = user.profile_image;
        }

       navAvatar.src = userImage

    }
    
    var path = window.location.pathname;
    var page = path.split("/").pop();
    if(page =="home.html"){
        getPosts()
    }else if(page =="postDetails.html"){
        getPostDetails()
    }
    else if(page =="profile.html"){
        getUser()
        getUserPosts()
    }
}




function getCurrentUser(){
    let user = null
    const storageUser = localStorage.getItem("user")
    if(storageUser){
        user = JSON.parse(storageUser)
    }
    return user
}

function logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUpUi()
    showAlert("logout successfully","success")
}




//login form
document.getElementById('login-form').addEventListener('submit',(event)=>{
      //loading btn
      document.getElementById('submit-login-btn').innerHTML =`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...`
      document.getElementById('submit-login-btn').disabled = true;
      // end loading btn
    event.preventDefault();
    const username = document.getElementById('login_username').value
    const password = document.getElementById('login_password').value
    const params = {
        "username":username,
        "password":password
    }
    axios.post(`${baseUrl}/login`,params).then((response)=>{
        const token = response.data.token
        const user = JSON.stringify(response.data.user)
        localStorage.setItem("token",token)
        localStorage.setItem("user",user)


        const Modal = document.getElementById('loginModal');
        const modalInstance = bootstrap.Modal.getInstance(Modal); // Returns a Bootstrap modal instance
        modalInstance.hide();
        showAlert("logged in successfully","success")
        setUpUi()

    }).catch((error)=>{
        showAlert(error.response.data.message,"danger")
    }).finally(() => {
        document.getElementById('submit-login-btn').innerHTML =`Login`
        document.getElementById('submit-login-btn').disabled = false;
    });
}) 






//register form
document.getElementById('register-form').addEventListener('submit',(event)=>{
    event.preventDefault();
      //loading btn
      document.getElementById('submit-register-btn').innerHTML =`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...`
      document.getElementById('submit-register-btn').disabled = true;
      // end loading btn

    const name = document.getElementById('registerName').value
    const username = document.getElementById('registerUsername').value
    const password = document.getElementById('registerPassword').value
    const avatar = document.getElementById('registeravatar').files[0]

    

    let formData = new FormData()
    formData.append('name',name)
    formData.append('username',username)
    formData.append('password',password)
    formData.append('image',avatar)

    const params = {
        "name":name,
        "username":username,
        "password":password
    }
    axios.post(`${baseUrl}/register`,formData).then((response)=>{
        const token = response.data.token
        const user = JSON.stringify(response.data.user)
        localStorage.setItem("token",token)
        localStorage.setItem("user",user)
        


        const Modal = document.getElementById('registerModal');
        const modalInstance = bootstrap.Modal.getInstance(Modal); // Returns a Bootstrap modal instance
        modalInstance.hide();
        showAlert("New User Registered successfully","success")
        setUpUi()

    }).catch((error)=>{
        showAlert(error.response.data.message,"danger")
    }).finally(() => {
        document.getElementById('submit-register-btn').innerHTML =`Register`
      document.getElementById('submit-register-btn').disabled = false;

    });
}) 




//create post form
document.getElementById('create-post-form').addEventListener('submit',(event)=>{
    event.preventDefault();
    //loading btn
    document.getElementById('create-post-button').innerHTML =`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...`
    document.getElementById('create-post-button').disabled = true;
    // end loading btn

    // postImage
    // postTitle
    // postBody

    const postTitle = document.getElementById('postTitle').value
    const postBody = document.getElementById('postBody').value
    const postImage = document.getElementById('postImage').files[0]

    
    const token = localStorage.getItem('token')

    let formData = new FormData()
    formData.append('title',postTitle)
    formData.append('body',postBody)
    formData.append('image',postImage)

    const params = {
        "title":postTitle,
        "body":postBody
    }
    const headers = {
        "Content-Type":"multipart/form-data",
        "authorization":`Bearer ${token}`
    }

    axios.post(`${baseUrl}/posts`,formData,{
        headers: headers
    }).then((response)=>{
        const Modal = document.getElementById('create-post-modal');
        const modalInstance = bootstrap.Modal.getInstance(Modal); // Returns a Bootstrap modal instance
        modalInstance.hide();
        showAlert("New Post added successfully","success")
        setUpUi()

    }).catch((error)=>{
        showAlert(error.response.data.message,"danger")
    }).finally(() => {
        document.getElementById('create-post-button').innerHTML =`Create`
        document.getElementById('create-post-button').disabled = false;

    });
}) 



//update post form
document.getElementById('update-post-form').addEventListener('submit',(event)=>{
    event.preventDefault();
    //loading btn
    document.getElementById('update-post-button').innerHTML =`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...`
    document.getElementById('update-post-button').disabled = true;
    
    // end loading btn

    // postImage
    // postTitle
    // postBody

    const postTitle = document.getElementById('edit-postTitle').value
    const postBody = document.getElementById('edit-postBody').value
    const postImage = document.getElementById('edit-postImage').files[0]
    const postId = document.getElementById('edit-postId').value
    
    const token = localStorage.getItem('token')

    let formData = new FormData()
    formData.append('title',postTitle)
    formData.append('body',postBody)
    if(postImage != null && postImage != "" ){
        formData.append('image',postImage)
    }
  
    formData.append('_method',"PUT")


   
    const headers = {
        "Content-Type":"multipart/form-data",
        "authorization":`Bearer ${token}`
    }

    axios.post(`${baseUrl}/posts/${postId}`,formData,{
        headers: headers
    }).then((response)=>{
        const Modal = document.getElementById('edit-post-modal');
        const modalInstance = bootstrap.Modal.getInstance(Modal); // Returns a Bootstrap modal instance
        modalInstance.hide();
        showAlert("Post updated successfully","success")
        setUpUi()

    }).catch((error)=>{
        showAlert(error.response.data.message,"danger")
    }).finally(() => {
        document.getElementById('update-post-button').innerHTML =`update`
        document.getElementById('update-post-button').disabled = false;

    });
}) 


function createCommentClicked(id){
    document.getElementById('add-comment-button').innerHTML =`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...`
    document.getElementById('add-comment-button').disabled = true;
    
    const commentBody =document.getElementById("comment-input").value
    let params ={
        "body":commentBody
    }
    let token = localStorage.getItem("token")
    let headers ={
         "authorization":`Bearer ${token}`
    }
    axios.post(`${baseUrl}/posts/${id}/comments`,params,{
        headers: headers
    }).then(function(response){
    console.log(response.data);
    showAlert("comment added successfully","success")
    getPostDetails()
    }).catch(function(error){
        showAlert(error.response.data.message,"danger")
    }).finally(() => {
        document.getElementById('add-comment-button').innerHTML =`send`
        document.getElementById('add-comment-button').disabled = false;

    });


}

function editPostBtnClicked(post){
    post = JSON.parse(decodeURIComponent(post))
    document.getElementById('edit-postTitle').value = post.title
    document.getElementById('edit-postBody').value =  post.body
    document.getElementById('show-postImage').src =  post.image
    document.getElementById('edit-postId').value =  post.id


    let postModal = new bootstrap.Modal(document.getElementById('edit-post-modal'),{})
    postModal.toggle()
}

let deleteModal = new bootstrap.Modal(document.getElementById('delete-post-modal'),{})

function deletePostBtnClicked(post){
    post = JSON.parse(decodeURIComponent(post))

    document.getElementById('delete-post-title').innerText = post.title
    document.getElementById('delete-post-id').value = post.id
    deleteModal.toggle()
}




function confirmDelete(){
     //loading btn
     document.getElementById('delete-post-button').innerHTML =`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...`
     document.getElementById('delete-post-button').disabled = true;
    
     const postId =  document.getElementById('delete-post-id').value
    let token = localStorage.getItem("token")
    let headers ={
        "authorization":`Bearer ${token}`
   }
    axios.delete(`${baseUrl}/posts/${postId}`,{
        headers:headers
    }).then((response)=>{
        deleteModal.toggle()     
        showAlert("Post deleted successfully","success")
        setUpUi()

    }).catch((error)=>{
        showAlert(error.response.data.message,"danger")
    }).finally(() => {
        document.getElementById('delete-post-button').innerHTML =`delete`
        document.getElementById('delete-post-button').disabled = false;

    });
}


function userClicked(userId){
    
window.location = `profile.html?userId=${userId}`
}
function profileClicked(){
    const user = getCurrentUser()
    window.location = `profile.html?userId=${user.id}`
}




function getUser(){
    const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userId = urlParams.get('userId')

    axios.get(`${baseUrl}/users/${userId}`)
    .then((response)=>{
        document.getElementById('main-info').classList.remove('placeholder-glow')
        document.getElementById('email-main-info').classList.remove('placeholder')
        document.getElementById('user-main-info').classList.remove('placeholder')
        document.getElementById('username-main-info').classList.remove('placeholder')

        document.getElementById('count-number-info').classList.remove('placeholder-glow')
        document.getElementById('posts-number-info').classList.remove('placeholder')
        document.getElementById('comments-number-info').classList.remove('placeholder')

        const user = response.data.data
        document.getElementById('email-main-info').innerText = user.email
        document.getElementById('user-main-info').innerText = user.name
        document.getElementById('username-main-info').innerText = user.username
        document.getElementById('username-title').innerText = `${user.username} Posts`

        

        document.getElementById('posts-number-info').innerText = user.posts_count
        document.getElementById('comments-number-info').innerText = user.comments_count

        let userImage  ="https://images.tarmeezacademy.com/users/n9TNMeF18Ys0ckt.jpg"

        if (JSON.stringify(user.profile_image) !== "{}") {
            userImage = user.profile_image;
        }

        document.getElementById('profile-header-image').src = userImage



    })
    .catch((error)=>{
    console.log(error)
    // document.getElementById('posts').innerHTML = `error with status: ${error.request.status}`
    })
    
}




function getUserPosts(){
    const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userId = urlParams.get('userId')
    axios.get(`${baseUrl}/users/${userId}/posts`)
    .then((response)=>{
    const posts = response.data.data
    document.getElementById('userPosts').innerHTML =""

    for (const post of posts) {
        let postTitle  =""
        if(post.title != null && post.title != "null"){
            postTitle = post.title
        }
    
        let postImage  ="http://tarmeezacademy.com/images/posts/naPDQh7dEDTNj2f.jpg"
        if (post.image != null && post.image != "null" && JSON.stringify(post.image) !== "{}") {
            postImage = post.image;
        }
    
        let userImage  ="https://images.tarmeezacademy.com/users/n9TNMeF18Ys0ckt.jpg"
        if (JSON.stringify(post.author.profile_image) !== "{}") {
            userImage = post.author.profile_image;
        }
        const user = getCurrentUser()
        let editBtn = ""
        if(user != null &&post.author.id == user.id   ){
         editBtn = `<div class="float-end"><button class="btn btn-secondary" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
         <button class="btn btn-danger" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">delete</button></div>
         `  
        }

        document.getElementById('userPosts').innerHTML +=`
          
          <div class="card shadow my-4">
                        <div class="card-header">
                            <img class="user-image rounded-circle border border-3" src="${userImage}"
                                alt="${post.author.name}">
                            <b>@${post.author.name}</b>
                            
                            ${editBtn}
                        </div>
                            <div class="card-body">
                             <a style="text-decoration: unset;color:black;" href="/postDetails.html?id=${post.id}">

                                <img class="w-100 post-image" style="object-fit: contain;" src="${postImage}"
                                    alt="${post.body}">
                                <h6 class="text-secondary mt-1">
                                    ${post.created_at}
                                </h6>
                                <h5 class="card-title">${postTitle}</h5>
                                <p class="card-text">${post.body}</p>
                                <hr>
                                <div>
                                    <i class="bi bi-chat"></i>
                                    <span>
                                        (${post.comments_count}) commits
                                    </span>
                                </div>
                                   </a>
                            </div>
                        
                    </div>
                 
                        
        `
    }

    })
    .catch((error)=>{
    console.log(error)
    document.getElementById('userPosts').innerHTML = `error with status: ${error.request.status}`
    })
    
}