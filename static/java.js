





// loader function
function loader (){
  document.querySelector('.loader-container').classList.add('active')
}
function fadeOut(){
  setTimeout(loader, 4000);
}
fadeOut();


window.onscroll = () =>{
    // searchForm.classList.remove('active')
    // loginForm.classList.remove('active')

    if(window.scrollY > 80){
        document.querySelector('.header .header-2').classList.add('active');
    }
    else{
        document.querySelector('.header .header-2').classList.remove('active');
    }
}

window.onload = () =>{
    if(window.scrollY > 80){
        document.querySelector('.header .header-2').classList.add('active');
    }
    else{
        document.querySelector('.header .header-2').classList.remove('active');
    }
}


// top book slider

  var swiper = new Swiper(".books-slider", {
    loop:true,
    centeredSlides:true,
    autoplay:{
        delay:950,
        disableOnInteraction:false,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });


  // featured book slider

  var swiper = new Swiper(".featured-slider", {
    loop:true,
    centeredSlides:true,
    autoplay:{
        delay:2000,
        disableOnInteraction:false,
    },
     navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });

    // new arrival book slider

    var swiper = new Swiper(".arrival-slide", {
        loop:true,
        centeredSlides:true,
        autoplay:{
            delay:2000,
            disableOnInteraction:false,
        },
         navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        },
      });



// ---------------------------------------------------

About = document.getElementById('aboutcontent');
document.getElementById('about').onclick = () => {
  About.classList.toggle('active')
}
Feed = document.getElementById('feedcontent');
document.getElementById('feed').onclick = () => {
  Feed.classList.toggle('active')
}
// ----------------------------------------------------

window.onload = () => {
  About.classList.add('active')
}






  


// Get the login modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}



// Get the register modal
var modal = document.getElementById('id02');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}




