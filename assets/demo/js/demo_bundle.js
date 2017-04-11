// =========================| Demo scripts |========================= //



//--------------------------| DOM Ready

jQuery(document).ready(function($) {

  'use strict';

  $.ajax({
    url: 'assets/demo/demo.html',
    dataType: 'html'
  }).done(function(response) {
    $('.demo-holder .content').html(response).promise().done(function(){
      // Options
      (function() {
        $.fn.numsOnly = function() {
          return this.each(function() {
            $(this).keydown(function(e) {
              var key = e.charCode || e.keyCode || 0;

              return (key === 190 ||
                      key ===   8 ||
                      key ===   9 ||
                      key ===  16 ||
                      key ===  36 ||
                      key ===  46 ||
                     (key  >=  37 && key <=  40) ||
                     (key  >=  48 && key <=  57) ||
                     (key  >=  96 && key <= 105)
              );
            });
          });
        };

        $('#demo-plugin-options .submit input').click(function() {
          var valid = (function() {
            var fields = {b: false, o: false, t: false},
                bO = $('.input-background-color'),
                oO = $('.input-opacity'),
                tO = $('.input-transition'),
                addError = function(obj) {obj.closest('li').addClass('error');};

            for (var i in fields) {
              var obj, reg;
              switch(i) {
                case 'b': obj = bO; reg = /(^[0-9A-F]{6}$)/i;  break;
                case 'o': obj = oO; reg = /^-?\d+(?:\.\d+)?$/; break;
                case 't': obj = tO; reg = /^-?\d+(?:\.\d+)?$/; break;
              }

              if (reg.test(obj.val())) {fields[i] = true;} else {addError(obj);}
            }

            return (fields.b && fields.o && fields.t ? true : false);
          })();

          if (valid) {
            $.lightlayer({
              object: $('.popup_options'),
              backgroundColor: '#'+$('.input-background-color').val(),
              opacity: $('.input-opacity').val(),
              onOpen: function() {
                $('#man-background')
                  .val($.lightlayer.options.backgroundColor.substring(1));
                $('#man-opacity').val($.lightlayer.options.opacity);
                $('#man-y-position-' + $.lightlayer.options.position)
                  .attr('checked', 'checked');
                $('#man-escape-' + $.lightlayer.options.escape)
                  .attr('checked', 'checked');

                $.lightlayer().popup.find('input.btn').click(function() {
                  switch($(this).parent().parent().attr('id')) {
                    case 'man-background-color':
                      $.lightlayer().backgroundColor($('#man-background').val());
                      break;
                    case 'man-opt-opacity':
                      $.lightlayer().opacity(parseFloat($('#man-opacity').val()));
                      break;
                    case 'man-opt-y-position':
                      $.lightlayer()
                        .position($('#man-opt-y-position input:checked')
                          .val());
                      break;
                    case 'man-opt-exit-ability':
                      $.lightlayer()
                        .escape($('#man-opt-exit-ability input:checked')
                          .val() === 'true' ? true : false);
                      break;
                  }
                });

                $('#man-demo-btn').click(function() {
                  $.lightlayer().change({
                    backgroundColor: $('#man-background').val(),
                    opacity: parseFloat($('#man-opacity').val()),
                    position: $('#man-opt-y-position input:checked').val(),
                    escape: $('#man-opt-exit-ability input:checked')
                      .val() === 'true' ? true : false
                  });
                });
              },
              transition: $('.input-transition').val(),
              cache: false,
              position: $('#opt-y-position input:checked').val(),
              escape: $('#opt-exit-ability input:checked').val() === 'true' ?
                true : false
            });
          }
        });

        $('#demo-plugin-options .submit input').mousedown(function() {
          $('#demo .error').removeClass('error');
        });

        $('#demo-plugin-options input').focus(function() {
          if ($(this).closest('li').hasClass('error')) {
            $(this).closest('li').removeClass('error');
          }
        });

        $('.input-opacity, .input-transition').numsOnly();
      }());

      // Cache
      (function() {
        $('#demo-plugin-cache .submit input').click(function() {
          $.lightlayer({
            object: $('.popup_cache'),
            cache: $('#opt-cache input:checked').val() === 'true' ? true : false
          });
        });
      }());

      // Data transfer
      (function() {
        $('#demo-plugin-data-transfer .btn').click(function() {
          $.lightlayer({
            object: $('.popup_data_transfer'),
            data: {
              first_name: $('#value-data-first-name').val(),
              last_name: $('#value-data-last-name').val()
            },
            onOpen: function() {
              var popup = $.lightlayer().popup,
                  data = popup.data,
                  sentence = data.first_name === '' && data.last_name === '' ?
                    'You didn\'t provide your names.' :
                    data.first_name === '' ? 'Hello, '+data.last_name+'!' :
                      data.last_name === '' ? 'Hello, '+data.first_name+'!' :
                        'Hello, ' +data.first_name+ ' ' +data.last_name+ '!';

              popup.find('.body').html('<p>'+sentence+'</p>');
            }
          });
        });
      }());

      // Content
      (function() {
        $('#demo-plugin-content .btn').click(function() {
          $.lightlayer({
            object: $('#' + $('#opt-content input:checked').val())
          });
        });
      }());
    });
  });

});