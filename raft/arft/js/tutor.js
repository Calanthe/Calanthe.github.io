(function() {
  var $, imgTutor;

  $ = jQuery;

  imgTutor = (function() {

    function imgTutor() {
      this.init();
    }

    imgTutor.prototype.init = function() {
      var jQtutors = $('body').find('.tutor'),
          imgTutor = this;

      $.each( jQtutors, function( key, value ) {
        return imgTutor.enable($(value));
      });
    };

    imgTutor.prototype.enable = function(jQtutor) {
      var height = jQtutor.data('height'),
          tutor = this;

      jQtutor.find('.img-item').css('height',height);
      jQtutor.find('.li-wrapper li a').hover(function() {
        tutor.showImg(this, jQtutor);
      }/*,function() {
        tutor.showActive(this, jQtutor);
      }*/);

      jQtutor.find('.li-wrapper').on('mouseleave', function () {
        tutor.showActive(this, jQtutor);
      });

      jQtutor.find('.li-wrapper li a').click(function(e) {
        e.preventDefault();
        tutor.setActive(this, jQtutor);
        tutor.showActive(this, jQtutor);
      });
    };

    imgTutor.prototype.showImg = function(elem, jQtutor) {
      var index = jQtutor.find('.li-wrapper li a').index( $(elem) );

      jQtutor.find('.img-item').hide();
      jQtutor.find('.img-item').eq(index).show();
    };

    imgTutor.prototype.showActive = function(elem, jQtutor) {
      var activeIndex = jQtutor.find('.li-wrapper li a').index(jQtutor.find('.li-wrapper li a.active'));
      
      jQtutor.find('.img-item').hide();
      jQtutor.find('.img-item').eq(activeIndex).show();   
    };

    imgTutor.prototype.setActive = function(elem, jQtutor) {
      jQtutor.find('.li-wrapper li a').removeClass('active');
      $(elem).addClass('active');
    };

    return imgTutor;

  })();

  $(function() {
    return new imgTutor();
  });

}).call(this);