/*! 
 jQuery LightLayer Plugin v2.3.0
 https://lightlayer.metodiev.dev

 Copyright (c) 2020 Martin Metodiev
 Licensed under the MIT license.
*/

;(function($) {

  'use strict';

// Wrapping the content
  $(function() {$('body').wrapInner('<div class="lightlayer-general">');});

// Defining LightLayer
  $.lightlayer = function(params) {

    // Defining shortcut
    var ll = $.lightlayer;

    // Saving the given parameters
    ll.params = params;

    // Extending $.lightlayer (if not yet)
    if (!ll.extended) {
      $.extend(ll, {
        extended: true,

        // Default data
        initial: {
          // Popup
          target: {
            object: $('#popup')
          },

          // Options
          options: {
            cache           : true,      // true    | false         || Default: true
            escape          : true,      // true    | false         || Default: true
            position        : 'middle',  // middle  | third | top   || Default: middle
            backgroundColor : '#000000', // #000000 | hex color     || Default: #000000
            opacity         : 0.3,       // 0.3     | custom num    || Default: 0.3
            transition      : 0.1        // 0.1     | custom num    || Default: 0.1
          }
        },

        // Flags
        flags: {},

        // Storage
        storage: {},

        // Data
        css:  {
          transitionend: 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
          transitions: {
            '-webkit-transition': null,
            '-moz-transition': null,
            '-ms-transition': null,
            '-o-transition': null,
            'transition': null
          }
        },

        define: {
          target: function() {
            ll.target = {
              object: ll.params && ll.params.hasOwnProperty('object') ?
                ll.params.object : ll.initial.target.object,
              data: ll.params && ll.params.hasOwnProperty('data') ?
                ll.params.data : {}
            };

            return this;
          },

          options: function() {
            ll.options = {};

            for (var option in ll.initial.options) {
              ll.options[option] = ll.params && ll.params.hasOwnProperty(option) ?
                ll.params[option] : ll.initial.options[option];
            }

            return this;
          },

          events: function() {
            ll.events = {};

            var events = [
              'onOpen',                   // e, popup
              'onClose',                  // e, popup
              'onChangeBackgroundColor',  // e, data
              'onChangeOpacity',          // e, data
              'onChangePosition',         // e, data
              'onChangeEscape',           // e, data
              'onChangeSettings'          // e, data
            ];

            for (var event = 0; event < events.length; event++) {
              if (ll.params && ll.params.hasOwnProperty(events[event])) {
                ll.events[events[event]] = ll.params[events[event]];
              }
            }

            return this;
          }
        },

        layerMethods: {
          getPopupData: function() {
            var data = this.popup.data;

            return data;
          },

          backgroundColor: function(value) {
            (function() {
              if (value !== 'undefined' && ll.set.check('backgroundColor', value)) {
                ll.layer.trigger(
                  'onChangeBackgroundColor',
                  [{
                    old_value: ll.options.backgroundColor,
                    new_value: value
                  }]
                );
                ll.options.backgroundColor = value;
                ll.set.background();
              }
            }());
          },

          opacity: function(value) {
            (function() {
              if (value !== 'undefined' && ll.set.check('opacity', value)) {
                ll.layer.trigger(
                  'onChangeOpacity',
                  [{
                    old_value: ll.options.opacity,
                    new_value: value
                  }]
                );
                ll.options.opacity = value;
                ll.set.background();
              }
            }());
          },

          position: function(value) {
            (function() {
              if (value !== 'undefined' && ll.set.check('position', value)) {
                ll.layer.trigger(
                  'onChangePosition',
                  [{
                    old_value: ll.options.position,
                    new_value: value
                  }]
                );
                ll.options.position = value;

                // Reset
                $('.lightlayer-cell').removeAttr('style');
                ll.layer.popup.css('top', '');
                $(window).unbind('resize', ll.set.thirdPosition);
              }
            }());

            if (!ll.layer.popup.is(':visible')) {
              ll.layer.popup.css('display', 'inline-block');
            }

            switch(ll.options.position) {
              case 'middle':
                $('.lightlayer-cell').css('vertical-align', 'middle');
                break;
              case 'third':
                ll.set.thirdPosition();

                $(window).bind('resize', ll.set.thirdPosition);

                $('.lightlayer-holder').css('margin-top', '20px');
                break;
              case 'top':
                $('.lightlayer-cell').css('vertical-align', 'top');
                break;
            }

            return ll.layer;
          },

          escape: function(value) {
            (function() {
              if (value !== 'undefined' && ll.set.check('escape', value)) {
                ll.layer.trigger(
                  'onChangeEscape',
                  [{
                    old_value: ll.options.escape,
                    new_value: value
                  }]
                );
                ll.options.escape = value;
              }
            }());

            var xButton = (function() {
              if (ll.layer.popup.find('.x-button').length > 0) {
                ll.layer.popup.find('.x-button').remove();
              }

              return ll.layer.popup.find('.x-button').length > 0 ?
                ll.layer.popup.find('.x-button') :
                ll.layer.popup
                  .prepend($('<a class="x-button" href="javascript:;"></a>'))
                  .find('.x-button');
            }());

            if (ll.options.escape) {

              if (!ll.flags.escape) {
                // Closing by pressing the x-button
                xButton.bind('click', function(e) {
                  ll.layer.exit();
                  e.stopPropagation();
                });

                ll.layer
                // Closing by pressing the Esc button
                  .bind('keydown', function(e) {
                    if (e.keyCode === 27) {
                      ll.layer.exit();
                    }
                  })

                  // Closing by clicking on the stage
                  .bind('click', function(e) {
                    ll.layer.exit();
                    e.stopPropagation();
                  });

                ll.flags.escape = true;
              }
            }
            else {
              // Removing the x-button
              if (xButton) {
                xButton.remove();
              }

              if (ll.flags.escape) {
                ll.layer.unbind('keydown');
                ll.layer.unbind('click');

                ll.flags.escape = false;
              }
            }

            return ll.layer;
          },

          change: function(data) {
            (function() {
              data = typeof data === 'object' && !$.isEmptyObject(data) ? data : null;
            }());

            if (data) {
              ll.layer.trigger('onChangeSettings', [data]);
              for (var option in data) {
                if (ll.layer.hasOwnProperty(option)) {
                  ll.layer[option](data[option]);
                }
              }
            }

            return this;
          },

          exit: function() {
            var actions = function() {
              $('body').removeClass('lightlayer');
              $('.lightlayer-general').removeAttr('style');

              ll.layer.popup.removeClass('active-popup')
                .css({ display: 'none', opacity: '', top: '' });

              ll.layer.trigger('onClose', [ll.layer.popup]);

              ll.storage[ll.layer.popup.attr('id')].cached = ll.layer.popup.clone();

              ll.layer.popup.removeClass('lightlayer-popup');

              ll.layer.popup.find('.custom-close').unbind('click');
              $(window).unbind('resize', ll.set.thirdPosition);

              ll.set.originLocation(ll.storage[ll.layer.popup.attr('id')].original);

              ll.layer.remove();

              $(document).scrollTop(ll.flags.scrolled);

              delete ll.layer;
              delete ll.target;
              delete ll.options;
              delete ll.events;
              delete ll.params;
              ll.flags = {};
            };

            if (
              ll.options.transition !== '0' &&
              !navigator.userAgent.match(/msie/i) &&
              !(Object.hasOwnProperty.call(window, 'ActiveXObject') &&
              !window.ActiveXObject)
            ) {
              ll.layer.bind(ll.css.transitionend, function() { actions(); });
            }
            else {
              actions();
            }

            ll.layer.css({'opacity': 0});

            $('body').removeClass('opened-lightlayer');

            if (ll.get.scrollbarWidth() > 0) {
              setTimeout(function() {
                $('body').removeClass('overflowed-lightlayer');
              }, 200);
            }
          }
        },

        popupMethods: {
          saveOriginLocation: function(obj) {
            this.originLocation = ll.get.originLocation(obj);

            return this;
          },

          saveData: function() {
            this.data = ll.target.hasOwnProperty('data') ? ll.target.data : null;

            return this;
          },

          bindCustomClose: function() {
            if (this.find('.custom-close').length > 0) {
              this.find('.custom-close').bind('click', function(e) {
                ll.layer.exit();
                e.stopPropagation();
              });
            }

            return this;
          },

          move: function(obj) {
            ll.layer.popup.addClass('lightlayer-popup').appendTo($('.lightlayer-holder'));
            obj.remove();

            return this;
          },

          store: function() {
            if (!ll.storage.hasOwnProperty(this.attr('id'))) {
              ll.storage[this.attr('id')] = {
                original: this
              };
            }

            return this;
          }
        },

        init: {
          layer: function() {
            // Appending the layer to the DOM
            $('body').append(
              $('<div>', {'id': 'lightlayer', 'tabindex': '1', 'class': 'lightlayer'})
                .css({'display': 'table'}).append(
                $('<div>', {'class': 'lightlayer-cell'}).append(
                  $('<div>', {'class': 'lightlayer-holder'})
                )
              )
            );

            // Populate all types of CSS transition properties
            for (var item in ll.css.transitions) {
              ll.css.transitions[item] = 'opacity '+
                ll.options.transition+'s ease-in, background-color 0.2s ease-in';
            }
            ll.layer = $('.lightlayer').css(ll.css.transitions);

            // Extending the layer with methods
            $.extend(ll.layer, ll.layerMethods);

            return this;
          },

          popup: function() {
            var obj = ll.get.object();

            if (obj) {
              ll.layer.popup = $.extend(obj.clone(), ll.popupMethods);

              ll.layer.popup
                .saveOriginLocation(obj)
                .saveData()
                .bindCustomClose()
                .move(obj)
                .store();
            }
            else {
              return;
            }
          }
        },

        prepare: {
          scrollTop: function() {
            // Get the current scroll position
            ll.flags.scrolled = $(document).scrollTop();

            return this;
          },

          document: function() {
            // Fixing the document
            $('.lightlayer-general').css({
              width: '100%',
              position: 'fixed',
              left: 0,
              top: '-'+ll.flags.scrolled+'px',
              minHeight: '100%'
            });

            return this;
          },

          events: function() {
            for (var event in ll.events) {
              ll.layer.bind(event, ll.events[event]);
            }

            return this;
          }
        },

        set: {
          check: function(type, value) {
            $.extend(this.check, {
              escape: function() {
                return typeof value === 'boolean' &&
                value !== ll.options.escape ?
                  true : false;
              },

              position: function() {
                return value === 'top' || value === 'third' || value === 'middle' &&
                value !== ll.options.position ?
                  true : false;
              },

              backgroundColor: function() {
                return typeof value === 'string' &&
                value !== ll.options.backgroundColor ?
                  true : false;
              },

              opacity: function() {
                return typeof value === 'number' && value >= 0 && value <= 1 &&
                value !== ll.options.opacity ?
                  true : false;
              }
            });

            return this.check[type]();
          },

          background: function() {
            var color = JSON.parse((function(color) {
              if (color.charAt(0) === '#') {
                color = color.substr(1);
              }

              return JSON.stringify({
                r: parseInt(color.charAt(0) + '' + color.charAt(1), 16),
                g: parseInt(color.charAt(2) + '' + color.charAt(3), 16),
                b: parseInt(color.charAt(4) + '' + color.charAt(5), 16)
              });
            }(ll.options.backgroundColor)));

            ll.layer.css(
              'background-color',
              'rgba('+color.r+', '+color.g+', '+color.b+', '+ll.options.opacity+')'
            );

            return ll.layer;
          },

          thirdPosition: function() {
            if (ll.layer) {
              ll.layer.popup.css(
                (ll.layer.popup.height() < $(window).height() - 40) ?
                  {top: parseInt((($(window).height() -
                    ll.layer.popup.height()) / 3) - 20)} :
                  {top: 'auto'}
              );
            }
            else {
              return false;
            }
          },

          originLocation: function(popup) {
            var loc = popup.originLocation;

            if (loc.parent) {
              $(loc.parent).prepend(loc.obj);
            }
            else {
              $(loc.prev).after(loc.obj);
            }
          }
        },

        get: {
          object: function() {
            var object = $.extend($(ll.target.object[0]), {
              idCheck: function() {
                if (typeof this.attr('id') === 'undefined') {
                  ll.flags.index = ll.flags.hasOwnProperty('index') ?
                    ll.flags.index + 1 : 1;

                  this.attr('id', 'popup_' + ll.flags.index);
                }

                return this;
              }
            });

            return ll.options.cache && ll.storage[object.idCheck().attr('id')] ?
              ll.storage[object.attr('id')].cached : object.length !== 0 ? object :
                null;
          },

          originLocation: function(obj) {
            var loc = {};

            var item = $(obj).prev();
            loc.obj = obj;
            if (item.length) {
              loc.prev = item[0];
            }
            else {
              loc.parent = $(obj).parent()[0];
            }
            return(loc);
          },

          scrollbarWidth: function() {
            var outer = document.createElement('div');
            outer.style.visibility = 'hidden';
            outer.style.width = '100px';
            outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

            document.body.appendChild(outer);

            var widthNoScroll = outer.offsetWidth;
            // force scrollbars
            outer.style.overflow = 'scroll';

            // add innerdiv
            var inner = document.createElement('div');
            inner.style.width = '100%';
            outer.appendChild(inner);

            var widthWithScroll = inner.offsetWidth;

            // remove divs
            outer.parentNode.removeChild(outer);

            return widthNoScroll - widthWithScroll;
          }
        },

        reveal: {
          popup: function() {
            ll.layer.trigger('onOpen', [ll.layer.popup]);

            // Fix for stopping propagation of exiting from LightLayer
            ll.layer.popup.bind('click', function(e) {
              e.stopPropagation();
            }).find('a').bind('click', function(e) {
              e.stopPropagation();
            });

            // Open popup
            setTimeout(function() {$(document).scrollTop(0);}, 100);
            ll.layer.popup.css('opacity', 1).addClass('active-popup');

            return this;
          },

          layer: function() {
            if (ll.get.scrollbarWidth() > 0) {
              $('body').addClass('overflowed-lightlayer');
            }

            // used setTimeout so the CSS3 transition to be attached properly
            setTimeout(function() {
              ll.layer
                .css({'opacity': 1})
                .focus();

              $('body').addClass('opened-lightlayer');
            }, 0);

            return this;
          }
        }
      });
    }

    // If it's not opened
    if (!ll.layer) {
      ll.define
        .target()
        .options()
        .events();

      ll.init
        .layer()
        .popup();

      ll.prepare
        .scrollTop()
        .document()
        .events();

      ll.set
        .background()
        .position()
        .escape();

      ll.reveal
        .popup()
        .layer();
    }

    return ll.layer;
  };

// Defining LightLayer method
  $.fn.lightlayer = function(params) {
    var layer;
    this.each(function(i) {
      if (i === 0) {
        params = $.extend({}, {object: $(this)}, params);
        layer = $.lightlayer(params);
      }

      return layer;
    });
  };

}(jQuery));