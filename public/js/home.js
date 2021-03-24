$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
   const UserId = data.id;
    editProfile(UserId)
      
  });


  // const editBtn = $('updateProfile');
  // console.log(editBtn)
  
  
  // function editProfile(UserId){
  //   console.log(UserId)
  //   editBtn.on("click", (e)=>{
  //     e.preventDefault();
  //     console.log('clicked');
  //     
      
  //   })
     
     
     
     
     
    
  //  }
  function editProfile(UserId){
    $('form').on("submit",(e)=>{
      e.preventDefault();
       // console.log('clicked')
       const name = $('#userName').val()
       const highGrad = $('#userGraduation').val().trim();
       const school = $('#userSchool').val().trim();
       const skills =$('#userSkills').val().trim();
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
              "gitUserName":gitUserName,
              "UserId":UserId
             }
       
        console.log(ProfileObj)
       
					$.ajax({
						type: 'POST',
						data: JSON.stringify(ProfileObj),
				        contentType: 'application/json',
                        url: '/api/profiles',						
                        success: function(data) {
                            console.log('success');
                            console.log(JSON.stringify(data));
                        }
                    });
     })
  }
  
  // to change appearance

   
    $('.cssTheme').on('click', function (event) {
      event.preventDefault();

      let color = $(this).attr('id')
      let r = document.querySelector(':root');

      //console.log(color);

      if (color === 'linen') {
        r.style.setProperty('--main-bg-color', `#${color}`);
        r.style.setProperty('--main-text-color', '#222222');
        // r.style.setProperty('--secondary-bg-color', '#979797')
      }
      else{
      r.style.setProperty('--main-bg-color', `#${color}`);
      r.style.setProperty('--main-text-color', 'linen');
      r.style.setProperty('--secondary-bg-color', 'transparent');
      };


    });

    // add languages

    $('#saveLang').on('click', function() {

      let languages = [];

      $.each($("input[name='langOpt']:checked"), function() {
          languages.push($(this).val());
        
      });
      
      console.log(languages);

  });
  

});
