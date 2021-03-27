$(document).ready(() => {
   
    console.log(UserId)

    getProfile();
    getFeaturedDevs();

    function getProfile() {
        $.ajax({
            type: 'GET',
            url: `/api/users/${UserId}`,
            success: function (data) {
                console.log(data);

                const profile = data.Profile;
                const posts = data.Posts
                 console.log(profile); //says undefined - I'm only getting back the profile
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

            let postText = $(
                `<div class="mt-3"> <h5>${title}</h5>
            <p>${body}<p>
            <p class="small">${posts[i].createdAt.split('T')[0]}<p>
            <hr class="75">
            </div>`
            )

            $(postDiv).prepend(postText);

        };//for loop end tag

    }; //getPost fn end tag

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
                let UserId = response[devIndex].UserId;
                let devName = response[devIndex].name;
                let devGit = response[devIndex].gitUserName;
                let devPic = response[devIndex].profilePic;

                console.log(devPic);

                let featDevDiv = $(
                    `<div class="separator mt-3"></div>
            <div class="dev row align-items-center">
            <div class="circle mt-3 devPic" data-value="${UserId}"><img src = ${devPic} class="img-fluid circle" height="250" width= "250"></img>
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

    //getting github repos and avatar
    function githubRepo(gitUserName) {
        $.ajax({
            type: 'GET',
            url: `/github/${gitUserName}`
        }).then(data => {
            console.log(data)
            console.log(data[0].html_url);
            console.log(data[0].full_name);
            const avatar = data[0].owner.avatar_url;

            for (let i = 0; i < 5; i++) {

                var projDesc;

                if (data[i].description === null) {
                    projDesc = 'This project does not have a description yet.'
                }
                else {
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
            };//for loop end tag

            let avatarUrl = $(
                `<img src = ${avatar} class="img-fluid circle" height="250" width= "250"></img>`
            )
            $('#userPic').append(avatarUrl);

            let postData = { profilePic: avatar };

            $.ajax(
                {
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(postData),
                    url: `/api/users/pic/${gitUserName}`,
                }).then((response) => console.log(response));

            //  window.location.reload();
        });//first ajax call end tag
    }; //get github fn end tag

      // browse users modal
  $('#browse').on('click',

  function getAllDevs() {

    $.ajax({
      type: 'GET',
      contentType: 'application/json',
      url: '/api/devs/profiles',
    }).then((response) => {


      for (let i = 0; i < response.length; i++) {
        // let len = response.length
        // let devIndex = Math.floor(Math.random() * Math.floor(len))
        let UserId = response[i].UserId;
        let devName = response[i].name;
        let devGit = response[i].gitUserName;
        let devPic = response[i].profilePic;

        // console.log(UserId);

        let allDevDiv = $(
          `<div class="separator mt-3"></div>
        <div class="dev row align-items-center">
        <div class="circle mt-3 devPic" data-value="${UserId}"><img src = ${devPic} class="img-fluid circle" height="250" width= "250"></img>
        </div>
        <div class="ml-3 mt-3">
        <h5 class="text-center">${devName}</h5>
        <h6 class="text-center">@${devGit}</h6>
        </div>
        </div>`
        )

        $('#browseUsers').append(allDevDiv);

      };//for loop end tag
    });//then end tag
  }); //fn end tag


    // click to view another profile
    $(document).on('click', '.devPic', function(){
       
        let UserId = $(this).data('value');
        window.location.replace(`/${UserId}`);

      });

    }); // doc ready end tag