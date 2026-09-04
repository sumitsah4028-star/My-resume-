"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* LOADER */

  const loader =
    document.querySelector(".loader");

  window.addEventListener("load", () => {

    setTimeout(() => {

      loader.classList.add("hide");

    }, 500);

  });


  /* MOBILE MENU */

  const menuBtn =
    document.getElementById("menuBtn");

  const navMenu =
    document.getElementById("navMenu");

  menuBtn.addEventListener("click", () => {

    const open =
      navMenu.classList.toggle("open");

    menuBtn.setAttribute(
      "aria-expanded",
      String(open)
    );

  });


  navMenu
    .querySelectorAll("a")
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {

          navMenu.classList.remove("open");

          menuBtn.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );

    });


  /* TYPING EFFECT */

  const typingElement =
    document.getElementById("typing");

  const words = [
    "Web Developer",
    "App Developer",
    "Cyber Security Expert",
    "Software Engineer"
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;


  function typeEffect() {

    const word =
      words[wordIndex];


    if (!deleting) {

      typingElement.textContent =
        word.substring(
          0,
          charIndex + 1
        );

      charIndex++;


      if (charIndex === word.length) {

        deleting = true;

        setTimeout(
          typeEffect,
          1600
        );

        return;
      }

    } else {

      typingElement.textContent =
        word.substring(
          0,
          charIndex - 1
        );

      charIndex--;


      if (charIndex === 0) {

        deleting = false;

        wordIndex =
          (wordIndex + 1)
          % words.length;

      }

    }


    setTimeout(
      typeEffect,
      deleting ? 45 : 90
    );

  }


  typeEffect();


  /* SCROLL REVEAL */

  const revealElements =
    document.querySelectorAll(".reveal");


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target
              .classList
              .add("active");

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  revealElements.forEach(element => {

    observer.observe(element);

  });


  /* CONTACT FORM */

  const form =
    document.getElementById(
      "contactForm"
    );

  const message =
    document.getElementById(
      "formMessage"
    );


  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      message.textContent =
        "Sending...";

      message.style.color =
        "#8992a5";


      const formData =
        new FormData(form);


      const payload = {

        name:
          formData.get("name"),

        email:
          formData.get("email"),

        message:
          formData.get("message")

      };


      try {

        const response =
          await fetch(
            "/api/contact",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(payload)
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Request failed"
          );

        }


        message.textContent =
          data.message;

        message.style.color =
          "#00ff9d";


        form.reset();


      } catch (error) {

        message.textContent =
          "Unable to send message. Please try again.";

        message.style.color =
          "#ff4d6d";

      }

    }
  );


  /* 2026 */

  document.getElementById(
    "year"
  ).textContent = "2026";

});