
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
    addPost(UserId)
    getFeaturedDevs();
  }); //initial get call end tag

    setThemePref(UserId);
    getLang(UserId);


  var element= localStorage.getItem('status');
    if (element == null || element == '') {
        localStorage.setItem('status', 1);
        $('#editProfileToast').toast('show');
  };
  
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
        $('#pullProjectsToast').toast('show');
      }); //submit onclick end tag
    }; //editProfile fn end tag


// getting the user profile to show it on my background section
 function getUserProfile(UserId){
  $.ajax({
    type: 'GET',
    url: `/api/users/${UserId}`,
    success: function (data) {
      console.log('success');
      
     const profile= data.Profile;
     const posts = data.Posts
      // console.log(profile);
      let fromDate = profile.from;
      fromDate = fromDate.split('T')[0];
      let startDate = profile.from;
      startDate = startDate.split('T')[0];
      $(".highestGraduation").text(`Highest Graduation: ${profile.highestGraduation}`);
      $(".school").text(`School: ${profile.school}`);
      $(".name").text(`Name: ${profile.name}`);
      $(".skills").text(`Skills: ${profile.skills}`);
      $(".experience").text(`Years of Experience: ${profile.TotalYearsOfexp}`);
      $(".position").text(`Position: ${profile.currentPosition}`);
      $(".company").text(`Company: ${profile.companyName}`);
      $(".startDate").text(`Started: ${fromDate}`);
      $(".endDate").text(`Ended: ${startDate}`);
      $(".gitUserName").text(`Git User Name: ${profile.gitUserName}`);
      getAllPosts(posts);
      setPreferences(profile);
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
        var titletag = $('<h6></h6>').text(title);
        var bodytag = $('<p></p>').text(body);
        let date = $('<p></p>').text(posts[i].createdAt);
        $(bodytag).append(date);
        $(titletag).append(bodytag);
        $(postDiv).prepend(titletag);
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
        let color = data.themePref;

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
    $.get(`/api/users/${UserId}`).then((data) => {


      if (!data.languages) {
        return
      }
      else {
        let languages = data.languages;

        for (let i = 0; i < languages.length; i++) {
          let langItems = $(
            ` <button class="btn btn-secondary mx-2 my-3 language disabled">${languages[i]}</button>`
          )
          $('#langDisplay').append(langItems);
        }; //for loop end tag
      }; //else end tag

    })}; //getLang fn end tag

    //get featured devs info and append
    function getFeaturedDevs() {

      $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: '/api/count/profiles',
      }).then((response) => {

        for (let i = 0; i < 3; i++) {
          let len = response.length
          let devIndex = Math.floor(Math.random() * Math.floor(len))
          let profId = response[devIndex].id;

          $.get(`api/profiles/${profId}`).then((data) => {
            // console.log(data);

            let featDevDiv = $(
              `<div class="separator mt-3"></div>
          <div class="dev row align-items-center">
          <div class="circle mt-3" id="${data.id}"></div>
          <div class="ml-3 mt-3">
          <h5 class="text-center">${data.name}</h5>
          <h6 class="text-center">@${data.gitUserName}</h6>
          </div>
          </div>`
            )


            $('#Featured').append(featDevDiv);

          })//2nd get end tag
        };//for loop end tag
      });//then end tag
    }; //fn end tag



  }); //document ready end tag
