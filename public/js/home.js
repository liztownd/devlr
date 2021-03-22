$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
  });

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

});
