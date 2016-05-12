function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/**
 * Simulate click when enter pressed on user check button.
 */

$('#rform-email').keyup(function(e){
  if(e.keyCode == 13) {
    $('#check-user').click();
  }
});

/**
 * Check user button behaviour.
 */

$('#check-user').click(function (ev) {
  var email = $('#rform input[name=email]').val();

  if (!validateEmail(email)) {
    alert('Uveďte platný e-mail.');
    return;
  }

  // Check if user exists
  $.getJSON('user-exists/' + email, function (response) {

    if (response.result != 'ok') {
      console.error(response.error);
      alert('Došlo k chybě.');
      return;
    }

    if (response.exists) {
      // Pre-fill his information, and allow him to skip the registration
      var knownname = response.attendee.name + ' ' + response.attendee.surname;
      $('#rform .known-name').text(knownname);
      $('#rform-exists').val('on');

      if (response.isAttending) {
        // If he's event attending, offer user to show his registration details
        $('.registration-form-done').removeClass('u-visuallyhidden');
        var link = '/payment-details/' + response.attendee.id + '/' + response.attendee.secret;
        $('#rform .known-url').attr('href', link);
      } else {
        $('.registration-form-known').removeClass('u-visuallyhidden');
        $('.registration-form-submit').removeClass('u-visuallyhidden');
      }

    } else {
      $('.registration-form-others').removeClass('u-visuallyhidden');
      $('.registration-form-submit').removeClass('u-visuallyhidden');
      $('#rform-exists').val('off');
    }

    $('#rform input[name=email]').attr('disabled', 'disabled');
    $('.registration-form-email').removeClass('registration-form-email--down');
    $('#check-user').addClass('u-visuallyhidden');

  }).fail(function() {
    alert('Došlo k chybě.');
  });
});

$('#rform .not-known').click(function (ev) {
  ev.preventDefault();
  $('.registration-form-email').addClass('registration-form-email--down');
  $('.registration-form-submit').addClass('u-visuallyhidden');
  $('#check-user').removeClass('u-visuallyhidden');
  $('.registration-form-known').addClass('u-visuallyhidden');
  $('#rform input[name=email]').removeAttr('disabled').focus();
});

$('#rform').submit(function (ev) {
  var errors = [];
  var exists = $('#rform-exists').val() == 'on';

  if ($('#rform-name').val().length == 0) {
    errors.push('Chybí jméno.');
  }

  if ($('#rform-surname').val().length == 0) {
    errors.push('Chybí příjmení.');
  }

  if (!(/^[0-9]{9}$/).test($('#rform-phone').val())) {
    errors.push('Špatné telefonní číslo.');
  }

  if (!$('#rform-18').is(':checked')) {
    errors.push('Chybí potvrzení o věku.');
  }

  if (errors.length > 0 && !exists) {
    ev.preventDefault();
    alert('- ' + errors.join('\n- '));
  } else {
    $('#rform input[name=email]').removeAttr('disabled');
  }
});
