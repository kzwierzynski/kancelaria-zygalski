import $ from 'jquery';

let sendButton = document.getElementById("js_send");
let form_id_js = "contactForm";
let data_js = {
    "access_token": "niw1vc2lbonxc8p9iaic1zzb"
    // "access_token": "sdf"
};

function validateName(name) {
  const minLength = 2;
  const maxLength = 50;
  return (name.length >= minLength) && (name.length <= maxLength);
}

function validateTopic(topic) {
  const maxLength = 50;
  return (topic.length <= maxLength);
}

function validatePhone(phone) {
  if (phone.length == 0) {
    return true;
  }
  const rePhone = /^[(]?[\+]?[0-9]{2,4}[)]?[-\s\. ]?[0-9]{2,3}[-\s\. ]?[0-9]{2,3}[-\s\. ]?[0-9]{2,3}$/;
  return rePhone.test(phone);
  
}

function validateEmail(email) {
  const reEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  return reEmail.test(email);
}

function validateMsg(msg) {
  const maxLength = 10000;
  return (msg.length <= maxLength);
}

function typeValidation(inputToValidate) {
  const validationType = $(inputToValidate).data('validation');
  const input = $(inputToValidate);
  const inputValue = input.val();
  let inputValid = false;

  switch (validationType) {
    case 'name':
      inputValid = validateName(inputValue);
      break;
    case 'phone':
      inputValid = validatePhone(inputValue);
      break;
    case 'topic':
      inputValid = validateTopic(inputValue);
      break;
    case 'email':
      inputValid = validateEmail(inputValue);
      break;
    case 'msg':
      inputValid = validateMsg(inputValue);
      break;
    default:
      inputValid = false;
      break;
  }

  return inputValid;
}

function validateInput(inputToValidate) {
  if (typeValidation(inputToValidate) === true) {
    $(inputToValidate).addClass('js-valid');
    $(inputToValidate).removeClass('js-invalid');
    $(inputToValidate).siblings('.invalid').removeClass('show');
  } else {
    $(inputToValidate).removeClass('js-valid');
    $(inputToValidate).addClass('js-invalid');
    $(inputToValidate).siblings('.invalid').addClass('show');
  }
  $(inputToValidate).removeClass('js-validate');
}

function validateInputOnEvent(inputToValidate) {
  $(inputToValidate).on('keyup blur change', () => {
    validateInput(inputToValidate);
  });
}


function resetInputsValidation() {
  const form = $('form');
  const inputElements = form.find('.js-valid');
  inputElements.each((_, inputElement) => {
    $(inputElement).addClass('js-validate');
    $(inputElement).removeClass('js-valid');
    $(inputElement).removeClass('js-invalid');
    $(inputElement).off('keyup blur change');
    $(inputElement).val('');
  });
}

function validateForm(form) {
  const inputsToValidate = form.find('.js-validate');

  inputsToValidate.each((_, inputToValidate) => {
    validateInput(inputToValidate);
    validateInputOnEvent(inputToValidate);
  });

  const invalidInputs = form.find('.js-invalid');
  return invalidInputs.length === 0;
}

function toParams(data_js) {
  let form_data = [];
  for ( let key in data_js ) {
      form_data.push(encodeURIComponent(key) + "=" + encodeURIComponent(data_js[key]));
  }
  return form_data.join("&");
}

function sendMsgSuccess() {
  $(".wrapper").addClass("bounceOutRight");
  setTimeout(function(){
      sendButton.value = 'Send';
      sendButton.setAttribute("title", "Email został wysłany. Proszę, odczekaj 2 minuty, aby ponownie móc wysłać wiadomość.");
      resetInputsValidation();
      $(".wrapper").removeClass("bounceOutRight"); 
  }, 2000);

  setTimeout(function(){
      sendButton.disabled = false;
      sendButton.removeAttribute("title");
  }, 120000);
}

function sendMsgError(error) {
  $("#limitReached").removeClass("d-none");
}

function sendMsg() {
  let msg = document.querySelector("#" + form_id_js + " [name='message']").value;
  let name = document.querySelector("#" + form_id_js + " [name='name']").value;
  let topic = document.querySelector("#" + form_id_js + " [name='topic']").value;
  let email = document.querySelector("#" + form_id_js + " [name='email']").value;
  let phone = document.querySelector("#" + form_id_js + " [name='phone']").value;

  sendButton.value='Sending…';
  sendButton.disabled = true;

  
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
          sendMsgSuccess();
      } else
      if(request.readyState == 4) {
          sendMsgError(request.response);
      }
  };
  
  data_js['subject'] = `Wiadomość ze strony WWW od ${name}`;
  data_js['text'] = `Dane kontaktowe:
      email: ${email}
      tel: ${phone}

      temat: ${topic}
      
      wiadomość:
          ${msg}`;

  let params = toParams(data_js);

  request.open("POST", "https://postmail.invotes.com/send", true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(params);

  return false;
}

(function() {
  $(window).ready(() => {
    $('.js-sendMsg').each((_, btn) => {
      $(btn).click(() => {
        const form = $('form');
        if (validateForm(form) === true) {
          sendMsg();
        }
      });
    });
  });
})();
