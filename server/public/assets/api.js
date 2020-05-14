var currentCode, clickCopy = false,
  requestLock = false;

/*
  Add input filter function to jQuery
    Restricts input to a given regex match
 */
(function($) {
  $.fn.inputFilter = function(inputFilter) {
    return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  };
}(jQuery));

/*
  String format
 */
String.format = function() {
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm");
    s = s.replace(reg, arguments[i + 1]);
  }

  return s;
};

/*
  On click, entidade element
    Copy entidade name to clipboard with fade animation
 */
$('#eNome').on('click', function() {
  if (clickCopy) return;
  clickCopy = true;
  var nome = $('#eNome').text(),
    resultado = copyTextToClipboard(nome);
  if (resultado == true) {
    $('#eNome').fadeTo(150, 0, function() {
      $('#eNome').text('NOME COPIADO');
      $('#eNome').fadeTo(150, 1, function() {
        setTimeout(function() {
          $('#eNome').fadeTo(150, 0, function() {
            $('#eNome').text(nome);
            $('#eNome').fadeTo(150, 1);
            clickCopy = false;
          });
        }, 1500);
      });
    });
  }
});

/*
  On click, app store element
    shows brevemente with fade animation
 */
$('#brevemente').on('click', function() {
  var nome = $('#brevemente').text();
  $('#brevemente').fadeTo(150, 0, function() {
    $('#brevemente').text('BREVEMENTE');
    $('#brevemente').fadeTo(150, 1, function() {
      setTimeout(function() {
        $('#brevemente').fadeTo(150, 0, function() {
          $('#brevemente').text(nome);
          $('#brevemente').fadeTo(150, 1);
        });
      }, 1500);
    });
  });
});

/*
  copyTextToClipboard
    Copies a given text string to Clipboard
 */
function copyTextToClipboard(text) {
  var result, textArea = document.createElement("textarea");
  textArea.style.opacity = 0;
  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    result = successful ? true : false;
  } catch (err) {
    result = false;
  }

  document.body.removeChild(textArea);

  return result;
}

/*
  setLock
    Sets rquest lock to avoid duplicate requests
 */
function setLock() {
  requestLock = true;
  setTimeout(function() {
    requestLock = false;
  }, 450);
}
/*
  On key up, entidade code event
 */
$('#eCodigo').keyup(function() {
  if (($('#eCodigo').val().length == 5) && ($('#eCodigo').val() != currentCode && requestLock == false)) {
    setLock();
    $('#eNome').fadeTo(150, 0, function() {
      $('#eNome').text('...');
      $('#eNome').fadeTo(150, 1, function() {
        $('#eNome').prop('disabled');
        currentCode = $('#eCodigo').val();
        $.ajax({
          url: '/api/entidade',
          type: 'POST',
          data: {
            entidade: currentCode
          },
          dataType: 'json'
        }).done(function(data) {
          $('#eNome').fadeTo(150, 0, function() {
            $('#eNome').text(data.nome);
            $('#eNome').fadeTo(150, 1, function() {
              $('#eNome').prop('disabled', false);
              $('#eNome').text(data.nome);
              $('#tweet').attr('href', 'https://twitter.com/intent/tweet?url=https%3A%2F%2Fentidadesmb.com%2F&text=Entidade Multibanco, ' + data.entidade + ' -> ' + data.nome + '&hashtags=entidadesmb');
              $('#facebook').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fentidadesmb.com%2F&quote=Entidade Multibanco, ' + data.entidade + ' -> ' + data.nome);
              $('#google').attr('href', 'https://www.google.com/search?q=' + data.nome);
            });
          });
        }).fail(function() {
          $('#eNome').fadeTo(150, 0, function() {
            $('#eNome').text('OCORREU UM ERRO, TENTE NOVAMENTE');
            $('#eNome').fadeTo(150, 1, function() {
              $('#eNome').prop("disabled", false);
            });
          });
        });
      });
    });
  }
});

/*
  resetLinks
    Reset external links to default
 */
function resetLinks() {
  $('#tweet').attr('href', 'https://twitter.com/intent/tweet?url=https%3A%2F%2Fentidadesmb.com%2F&hashtags=entidadesmb');
  $('#facebook').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fentidadesmb.com%2F');
  $('#google').attr('href', 'https://www.google.com/search?q=entidadesmb');
}

/*
  Request stats
 */
$.ajax({
  url: 'api/stats',
  type: 'GET',
  data: {
    key: null
  }
}).done(function(data) {
  data = JSON.parse(data);
  $('#eTotal').text(data.etotal);
  $('#eUnicas').text(data.eunicas);
}).fail(function() {
  $('#eTotal').text('?');
  $('#eUnicas').text('?');
});

/*
  On document ready
 */
$(document).ready(function() {
  $("#eCodigo").inputFilter(function(value) {
    return /^\d*$/.test(value); // Allow digits only, using a RegExp
  });
});
