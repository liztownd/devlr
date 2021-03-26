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



  });

  getFeaturedDevs();

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
          console.log(JSON.stringify(data));
        }
      });
    });
  };


// getting the user profile to show it on my background section
 function getUserProfile(UserId){
  $.ajax({
    type: 'GET',
    url: `/api/users/${UserId}`,
    success: function (data) {
      console.log('success');
     const profile= data.Profiles[0];
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
    }
  });
 }

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

      });
    });
  };

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

    });
  };

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
        };
      }
  };

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
        };
      };
    
  };

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
          <div class="circle mt-3 devPic" id="${data.id}"></div>
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


});
