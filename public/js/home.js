$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
    const UserId = data.id;
    editProfile(UserId);
    setTheme(UserId);
    saveLanguage(UserId);
    getUserProfile(UserId);
    addPost(UserId);
    addModalPost(UserId);
    getFeaturedDevs();
    deleteAccount(UserId);
  }); //initial get call end tag

  var element= localStorage.getItem('status');
  if (element == null || element == '') {
      localStorage.setItem('status', 1);
      $('#editProfileToast').toast('show');
  }; //localstorage check end tag

    function editProfile(UserId) {
      $('form').on("submit", (e) => {
        e.preventDefault();
        // console.log('clicked')
        const name = $('#userName').val()
        const highGrad = $('#userGraduation').val().trim();
        const school = $('#userSchool').val().trim();
        const skills = $('#userSkills').val().trim();
        const experience = parseInt($('#userExperience').val());
        const position = $('#userPosition').val().trim();
        const company = $('#userCompany').val().trim();
        const startDate = $('#userStartDate').val().trim();
        const endDate = $('#userEndDate').val().trim();
        const gitUserName = $('#userGitHub').val().trim();

        const ProfileObj = {
          "name": name,
          "highestGraduation": highGrad,
          "school": school,
          "skills": skills,
          "TotalYearsOfexp": experience,
          "currentPosition": position,
          "companyName": company,
          "from": startDate,
          "to": endDate,
          "gitUserName": gitUserName,
          "UserId": UserId
        }

        console.log(ProfileObj)

        $.ajax({
          type: 'POST',
          data: JSON.stringify(ProfileObj),
          contentType: 'application/json',
          url: '/api/profiles',
          success: function (data) {
            console.log('success');
            console.log(JSON.stringify(data))
          },
          error: function (err) {
            console.log(err)
          }
        }); //post ajax end tag
        window.location.reload();
      }); //submit onclick end tag
    }; //editProfile fn end tag


    // getting the user profile to show it on my background section
    function getUserProfile(UserId) {
      $.ajax({
        type: 'GET',
        url: `/api/users/${UserId}`,
        success: function (data) {
          console.log('success');

          const profile = data.Profile;
          const posts = data.Posts
          // console.log(profile);
          let fromDate = profile.from;
          fromDate = fromDate.split('T')[0];
          let endDate = profile.to;
          endDate = endDate.split('T')[0];
          
          let backgroundInfo = $(
            `<div>
            <h5>GitHub</h5>
            <p>${profile.gitUserName}</p>
            <hr class="75">
            <h5>Highest Level of Education</h5>
            <p>${profile.highestGraduation}</p>
            <h5 class="mt-2">School</h5>
            <p>${profile.school}</p>
            <hr class="75">
            <h5>Skills</h5>
            <p>${profile.skills}</p>
            <h5 class="mt-2">Years of Experience</h5>
            <p>${profile.TotalYearsOfexp}</p>
            <hr class="75">
            <h5>Company</h5>
            <p>${profile.companyName}</p>
            <h5 class="my-2">Position</h5>
            <p>${profile.currentPosition}</p>
            <p>From: ${fromDate} to ${endDate}</p>
            </div>
            `
          )

          const gitUserName = profile.gitUserName

          $('#backgroundInfo').append(backgroundInfo);
          $(".name").text(profile.name);
          $(".gitUserName").text(`GitHub User Name: ${profile.gitUserName}`)
          
          
          getAllPosts(posts);
          githubRepo(gitUserName)
          const themePref = profile.themePref;
          const savedLang = profile.languages;
          setThemePref(themePref);
          getLang(savedLang);
        } //success end tag


      }); //ajax call end tag
    }//get profilie end tag

    function getAllPosts(posts) {
      console.log(posts);
      let title = $('#post-title');
      let body = $('#post-body');
      let postDiv = $('#post-div');

      for (let i = 0; i < posts.length; i++) {
        title = posts[i].title
        console.log(title);
        body = posts[i].body;

        let id = posts[i].id;

        let postText = $(
          `<div class="mt-3"> <h5>${title}</h5>
          <button class="btn btn-secondary float-right deletePost" style="border: none" data-value="${id}" type="submit">
          <i class="material-icons" style="font-size:20px;">delete_outline</i></button>
          <p>${body}<p>
          <p class="small">${posts[i].createdAt.split('T')[0]}<p>
          <hr class="75">
          </div>
          `
        )

          $(postDiv).prepend(postText);

      };//for loop end tag

    }; //getPost fn end tag

   

    //add a new post
    function addPost(UserId) {
      $('#postBtn').on('click', (e) => {
        console.log('clicked');
        e.preventDefault();
        const title = $('#postTitle').val().trim();
        const body = $('#wallPost').val().trim();
        const postObj = {
          "title": title,
          "body": body,
          "UserId": UserId
        }
        console.log(postObj);
        $.ajax({
          type: 'POST',
          data: JSON.stringify(postObj),
          contentType: 'application/json',
          url: '/api/posts',
          success: function (data) {
            console.log('Posted successfully');
            console.log(JSON.stringify(data));
          }
        }); //ajax call end tag
        $('#postTitle').val("");
        $('#wallPost').val("");
        window.location.reload();
      }) //post button onclick end tag
    }; //add post fn end tag

        //add a new post, modal version
        function addModalPost(UserId) {
          $('#modalPostBtn').on('click', (e) => {
            console.log('clicked');
            e.preventDefault();
            const title = $('#modalPostTitle').val().trim();
            const body = $('#modalWallPost').val().trim();
            const postObj = {
              "title": title,
              "body": body,
              "UserId": UserId
            }
            console.log(postObj);
            $.ajax({
              type: 'POST',
              data: JSON.stringify(postObj),
              contentType: 'application/json',
              url: '/api/posts',
              success: function (data) {
                console.log('Posted successfully');
                console.log(JSON.stringify(data));
              }
            }); //ajax call end tag
            $('#modalPostTitle').val("");
            $('#modalWallPost').val("");
            window.location.reload();
          }) //post button onclick end tag
        }; //add post fn end tag

        

    // to change appearance
    function setTheme(UserId) {
      $('.theme').on('click', function (event) {
        event.preventDefault();

        let color = $(this).attr('id')
        let r = document.querySelector(':root');

        if (color === 'linen') {
          r.style.setProperty('--main-bg-color', `#${color}`);
          r.style.setProperty('--main-text-color', '#222222');
          // r.style.setProperty('--secondary-bg-color', '#979797')
        }
        else {
          r.style.setProperty('--main-bg-color', `#${color}`);
          r.style.setProperty('--main-text-color', 'linen');
          r.style.setProperty('--secondary-bg-color', 'transparent');
        };

        $('#saveTheme').on('click', function (e) {
          e.preventDefault();

          // send it to the db
          $.ajax(
            {
              type: 'PUT',
              dataType: 'text',
              data: { color: color },
              url: `/api/users/${UserId}/color`,
            }).then((response) => console.log(response));

          // close modal automatically

        }); //save theme onclick end tag
      }); // choose theme onclick end tag
    }; //set theme fn end tag

    // add languages
    function saveLanguage(UserId) {
      $('#saveLang').on('click', function () {
        let languages = [];
        $.each($("input[name='langOpt']:checked"), function () {
          languages.push($(this).val());
        });
        let postData = {
          "lang": languages
        }
        // send to db
        $.ajax(
          {
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(postData),
            url: `/api/users/languages/${UserId}`,
          }).then((response) => console.log(response));
        // we need a location reload here and to close the modal
        window.location.reload();
      });//onclick end tag
    }; // saveLang fn end tag




    // set theme stored in db
    function setThemePref(themePref) {
      console.log(themePref);
      if (!themePref) {
        return
      }
      else {
        let r = document.querySelector(':root');
        let color = themePref;

        if (color === 'linen') {
          r.style.setProperty('--main-bg-color', `#${color}`);
          r.style.setProperty('--main-text-color', '#222222');
          // r.style.setProperty('--secondary-bg-color', '#979797')
        }
        else {
          r.style.setProperty('--main-bg-color', `#${color}`);
          r.style.setProperty('--main-text-color', 'linen');
          r.style.setProperty('--secondary-bg-color', 'transparent');
        };//nested if else end tag
      }//main if else end tag

    }; //setTheme end tag

    // load languages stored in db
    function getLang(savedLang) {
      console.log(savedLang);

      if (!savedLang) {

        return
      }
      else {

        for (let i = 0; i < savedLang.length; i++) {
          let langItems = $(
            ` <button class="btn btn-secondary mx-2 my-3 language disabled">${savedLang[i]}</button>`
          )
          $('#langDisplay').append(langItems);
        }; //for loop end tag
      }; //else end tag

    }; //getLang fn end tag
    

    //get featured devs info and append
    function getFeaturedDevs() {

      $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: '/api/devs/profiles',
      }).then((response) => {

        for (let i = 0; i < 3; i++) {
          let len = response.length
          let devIndex = Math.floor(Math.random() * Math.floor(len))
          let profId = response[devIndex].id;
          let devName = response[devIndex].name;
          let devGit = response[devIndex].gitUserName;
          let devPic = response[devIndex].profilePic;

          console.log(devPic);

            let featDevDiv = $(
              `<div class="separator mt-3"></div>
          <div class="dev row align-items-center">
          <div class="circle mt-3 devPic" data-value="${profId}"><img src = ${devPic} class="img-fluid circle" height="250" width= "250"></img>
          </div>
          <div class="ml-3 mt-3">
          <h5 class="text-center">${devName}</h5>
          <h6 class="text-center">@${devGit}</h6>
          </div>
          </div>`
            )
            


            $('#Featured').append(featDevDiv);

         
        };//for loop end tag
      });//then end tag
    }; //fn end tag


    function deleteAccount(UserId){
      $("#account").on("click", function(){
        console.log("clicked");
        $.ajax({
          type: "DELETE",
          url:`api/users/${UserId}`
        }).then(response=> {console.log(response)
          window.location.replace("/");
        }
        );
      });
    };
        //getting github repos and avatar
        function githubRepo(gitUserName){
          $.ajax({
            type:'GET',
            url:`/github/${gitUserName}`
          }).then(data=>{
            console.log(data)
            console.log(data[0].html_url);
            console.log(data[0].full_name);
            const avatar= data[0].owner.avatar_url;

            for(let i=0; i<5; i++){

              var projDesc;

              if(data[i].description === null) {
                projDesc = 'This project does not have a description yet.'
              }
              else{
                projDesc = data[i].description
              }

            let repoDiv = $(
          `
          <div class="mt-2">
           <h5 class="">${data[i].name}</h5>
           <p class="small my-2">${projDesc}</p>
         <p><a class=" m-4" href= "${data[i].html_url}" target="_blank">Project Repo</a></p>
         </div>
         <hr class="75">`)
           
           $('#PinnedProjects').append(repoDiv)
         };

        let avatarUrl = $(
     `<img src = ${avatar} class="img-fluid circle" height="250" width= "250"></img>`
            )
            $('#userPic').append(avatarUrl);

            let postData = {profilePic: avatar};

          $.ajax(
            {
              type: 'PUT',
              contentType: 'application/json',
              data: JSON.stringify(postData),
              url: `/api/users/pic/${gitUserName}`,
            }).then((response) => console.log(response));
  
          //  window.location.reload();

         });
        
  
      



      $(document).on('click', '.devPic', function(){
       
        let profileId = $(this).data('value');
        console.log(profileId);
        // this needs a route to view another users profile

      })
    
    } //getrepo end tag


    // DELETE post
    $("#post-div").on("click", "button", function(event){
      console.log($(this));
      let id = $(this).data('value');

      $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        url: `/api/posts/${id}`,
        success: function () {
          console.log(`Deleted post: ${id}`);
        }
      }); //ajax call end tag
      window.location.reload();
   }); //delete post button onclick end tag
  //delete post fn end tag

  
}); //document ready end tag