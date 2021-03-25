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
    setPreferences(UserId);
  });

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
          console.log(JSON.stringify(data));
        }
      });
      $('#pullProjectsToast').toast('show');
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
    });
  };

  function setPreferences(UserId) {
    $.get(`/api/users/${UserId}`).then((data) => {
      console.log(data);
      let r = document.querySelector(':root');
      let color = data.themePref;
      let languages = data.languages;

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

      console.log(languages)

      for (let i = 0; i < languages.length; i++) {
        let langItems = $(
          ` <button class="btn btn-secondary mx-2 my-3 language disabled">${languages[i]}</button>`
        )
        $('#langDisplay').append(langItems);
      };

    })
  }

// Post to Feed
const submitPostBtn = document.getElementById('postBtn');
submitPostBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const newPost = {
    title: document.getElementById('postTitle').value.trim(),
    body: document.getElementById('wallPost').value.trim(),
    createdAt: new Date(),
  };

  fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPost),
  }).then((data) => {
      console.log('Success!', data);
      const row = document.createElement('div');
      const feed = document.getElementById('feed');
      const deleteBtn = document.createElement('button');
      row.classList.add('post');
      deleteBtn.classList.add('btn');

      const postTitle = document.createElement('h6');
      const postBody = document.createElement('p');
      const postDate = document.createElement('small');

      postTitle.textContent = `${data.title}`;
      postBody.textContent = `${data.body}`;
      postDate.textContent = `${new Date(
        data.createdAt
      ).toLocaleDateString()}`;

      row.appendChild(postTitle);
      row.appendChild(postBody);
      row.appendChild(postDate);
      row.appendChild(deleteBtn);

      feed.prepend(row);
    });

  // Empty the input box
  document.getElementById('wallPost').value = '';
  document.getElementById('postTitle').value = '';
});

fetch('/api/posts', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log('Successful GET all posts:', data);
    data.map(({ title, body, createdAt }) => {
      const row = document.createElement('div');
      const feed = document.getElementById('feed');
      row.classList.add('post');

      const postTitle = document.createElement('h6');
      const postBody = document.createElement('p');
      const postDate = document.createElement('p');
      postTitle.textContent = `${title}`;
      postBody.textContent = `${body}`;
      postDate.textContent = `at ${new Date(createdAt).toLocaleDateString()}`;

      row.appendChild(postTitle);
      row.appendChild(postBody);
      row.appendChild(postDate);

      feed.append(row);
    });
  })
  .catch((err) => console.error(err));

});
