'use strict';
/*global $:false */
/*jshint camelcase: false */
/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.browser.mobile will be true if the browser is a mobile device
 *
 **/
(function(a) {
	($.browser = $.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
})(navigator.userAgent || navigator.vendor || window.opera);

(function(a) {
	($.browser = $.browser || {}).ipad = /ipad/i.test(a);
})(navigator.userAgent || navigator.vendor || window.opera);

var mobile = $.browser.mobile;
var ipad = $.browser.ipad;

function angularContentLoaded() {// jshint ignore:line
	testimonials.init();
	home.initCarousel();
	overlay.init();
	$('body').scrollspy({ target: '#mini-navbar', offset: 100 });
	$('.home-carousel-wrapper').delay(500).transition({ opacity : 1 }, 800, function(){
		
		waypoints_init();
		$('.home-carousel-wrapper').find('.yo-anim').each(function() {
			var delay = $(this).data('animation-delay');

			if (delay) {
				var $this = $(this);
				setTimeout(function() {
					$this.addClass('yo-anim-start');
				}, delay);
			} else {
				$(this).addClass('yo-anim-start');
			}

		});		
		$('body').scrollspy('refresh');
	});

	navbar.show();
	mobileNav.show();
	video.init();
	loadEnquire();
	if(mobile || ipad) {
		$('.feature-hover').removeClass('feature-hover');
	}
}


$('#contact-form').submit(function(e) {
	$('#contact-form .contact-form').removeClass('#contact-form message-error');
	$.post('contact-send.php', $('#contact-form').serialize(), function(data) {
		if (data.status === 'ok') {
			$('#contact-form .message-success').removeClass('hidden').transition({ opacity : 1 });
			$('#contact-form .button-submit .button-send').addClass('button-transparent');
			$('#contact-form .contact-form').val('');
			setTimeout(function(){
				$('#contact-form .message-success').transition({ opacity : 0 }, function(){
					$(this).addClass('hidden');
				});
				$('#contact-form .button-submit .button-send').removeClass('button-transparent');
			}, 3000);
		} else {
			$.each(data.errors, function(i) {
				$('.' + i).addClass('#contact-form message-error');
			});
		}
	}, 'json');
	e.preventDefault();
});
$('#contact-form').on('keyup', '.contact-form', function() {
	var that = this;
	if ($(this).val() !== '') {
		$(this).removeClass('message-error');
	} else {
		$(that).addClass('message-error');
	}
});
$('#newsletter-form').submit(function(e) {
		$('#newsletter-form .newsletter-form').removeClass('#newsletter-form message-error');
		$.post('newsletter-send.php', $('#newsletter-form').serialize(), function(data) {
			if (data.status === 'ok') {
				$('#newsletter-form .message-success').removeClass('hidden').transition({ opacity : 1 });
				$('#newsletter-form .button-submit .button-send').addClass('button-transparent');
				$('#newsletter-form .newsletter-form').val('');
				setTimeout(function(){
					$('#newsletter-form .message-success').transition({ opacity : 0 }, function(){
						$(this).addClass('hidden');
					});
					$('#newsletter-form .button-submit .button-send').removeClass('button-transparent');
				}, 3000);
			} else {
				$.each(data.errors, function(i) {
					$('.' + i).addClass('#newsletter-form message-error');
				});
			}
		}, 'json');
		e.preventDefault();
	});

	$('#newsletter-form').on('keyup', '.newsletter-form', function() {
		var that = this;
		if ($(this).val() !== '') {
			$(this).removeClass('message-error');
		} else {
			$(that).addClass('message-error');
		}
	});
var testimonials = {// jshint ignore:line
	init: function() {
		var owl = $('#testimonial-carousel');
		owl.on('initialized.owl.carousel',function(){
			var controls = $(this).find('.owl-controls');
			controls.prependTo($('.controls-testimonials'));
		});
		
		owl.owlCarousel({
			items: 1,
			transitionStyle: 'fade',
			loop: true,
			merge: true,
			nav: true,
			slideSpeed: 2000,
			dots: true,
			callbacks: true,
			navText: ['<i class="fa fa-arrow-left"></i>', '<i class="fa fa-arrow-right"></i>'],
			responsiveClass:true,
			responsive:{
				0:{
				  dots: true, 
				  nav: false,
				},
				767:{
				  dots: false,
				  nav: true,
				},
			}
		});
		
	}
};
var home = {// jshint ignore:line
	initCarousel: function() {
		var that = this;
		var owl = $('#home-carousel');
		owl.on('initialized.owl.carousel',function(){
			var controls = owl.find('.owl-controls');
			controls.prependTo($('.controls-home'));
		});			
		
		owl.on('initialized.owl.carousel',function(){
			var controls = $(that).find('.owl-controls');
			controls.prependTo($('.controls-home'));
		});
		owl.owlCarousel({
			items: 1,
			loop: true,
			autoplay: true,
			autoplayTimeout: 8000,
			autoplayHoverPause: true,
			autoplaySpeed: 625,
			merge: true,
			callbacks: true,
			navText: ['<i class="fa fa-arrow-left"></i>', '<i class="fa fa-arrow-right"></i>'],
			dots: true,
			nav: true, 
			responsiveClass: false,
			responsive:{
				0:{
				  dots: true, 
				  nav: false,
				},

				767:{
				  dots: false,
				  nav: true,
				},

			  }
		  });

	}
};

var overlay = {// jshint ignore:line
	carousel: false,
	isLarge: false,
	isAnimating: false,
	init: function() {
		
		var that = this;
		$('body').on('click', '.open-overlay', function(e) {
			e.preventDefault();
			$('html').addClass('mobile-overflow');
			that.open($(this).attr('href'), this);
		});

		$('.gallery-wrapper').on('click', '.close-button, .close-overlay', function(e) {
			e.preventDefault();
			that.close();
			$('html').removeClass('mobile-overflow');
		});

	},
			
	initCarousel: function(current) {
		var owl = $('#images');
		owl.on('initialized.owl.carousel',function(){
			var controls = $(this).find('.owl-controls');
			controls.prependTo($('.controls'));
			if(current !== undefined) {
				console.log(current);
				owl.trigger('to.owl.carousel', [current, 500]);
			}
			
			if($(owl).find('.item').length === 1){
				$('.controls').hide();
			}
			
			$('#gallery #images .owl-item img').each(function(i, el) {
				
				var imgLoad = imagesLoaded( el );// jshint ignore:line
				imgLoad.on( 'done', function() {
					if(el.offsetWidth !== 0) {
						$(el).css('margin-left', - (el.width / 2));
					}
					if(el.offsetHeight !== 0){
						$(el).css('margin-top', - (el.height / 2));
					}
					
					if(i === $('#gallery #images .owl-item img').length - 1) {
						setTimeout(function(){
							$('.gallery-content #images').css('opacity', 1);
							$('.gallery-content .loading-spinner').transition({opacity: 0});
						},500);
					} 
				});
			});
			
			
		});
		owl.on('onChangeState',function(){
			$('#gallery #images .owl-item img').each(function(i, el) {
				if(el.offsetWidth !== 0) {
					$(el).css('margin-left', - (el.width / 2));
				}
				if(el.offsetHeight !== 0){
					$(el).css('margin-top', - (el.height / 2));
				}
			});		
		});

		
		owl.on('onResponsiveAfter',function(){
			$('#images .owl-item img').each(function(i, el) {
				if(el.offsetWidth !== 0){
					$(el).css('margin-left', - (el.offsetWidth / 2));
				}
				if(el.offsetHeight !== 0){
					$(el).css('margin-top', - (el.offsetHeight / 2));
				}
			});
		});
		
		owl.imagesLoaded(function(){
			var loop = true;
			if($(owl).find('.item').length === 1){
				loop = false;
			}
			owl.owlCarousel({
				items: 1,
				loop: loop,
				startPosition: current,
				merge: true,
				nav: true,
				slideSpeed: 2000,
				dots: false,
				callbacks: true,
				navText: ['<i class="fa fa-arrow-left"></i>', '<i class="fa fa-arrow-right"></i>'],
				responsiveClass: false,
			});
		});


		$(document.documentElement).on('keyup.portfolio', function(event) {
			// handle cursor keys
			if (event.keyCode === 37) {
				$('#images').data('owlCarousel').prev();
			} else if (event.keyCode === 39) {
				$('#images').data('owlCarousel').next();
			}
		});
	},
	open: function(url, element) {
		var that = this;
		if (url === undefined || url === ''){
			return false;
		}

		if (/\.(jpg|png|gif|jpeg)$/.test(url)) {
			var response = '';
			var current = 0;
			
			if(element.rel) {
				$('a[rel='+element.rel+']').each(function(i, el) {
					response += '<div class="item"><figure><img class="" src="'+el.href+'" /></figure></div>';
					if(el === element){
						current = i;
					}
				});
			} else {
				response = '<div class="item"><figure><img src="'+element.href+'" /></figure></div>';
			}
			response = '<section id="gallery"><div class="gallery-content fullscreen"><a class="close-button"><i class="icon-close"></i></a><div class="gallery"><div class="loading-spinner"></div><div id="images" class="owl-carousel owl-theme">'+response+'</div><div class="controls"></div></div></div></section>';
			$('.gallery-wrapper').html(response);
			$('body').css('overflow-y', 'hidden');
			$('.gallery-wrapper').show(0, function() {
				that.initCarousel(current);
				$(this).transition({x: 0, opacity: 1}, function(){
					$(this).find('.owl-stage-outer').transition({ opacity : 1 });
					
				}).addClass('overlay-active');
			});	
		} else {
			$.get(url , function(response) {
				$('.gallery-wrapper').html(response);
				$('body').css('overflow-y', 'hidden');
				$('.gallery-wrapper').show(0, function() {

					that.initCarousel();

					$(this).transition({x: 0, opacity: 1}, function(){
						
						$(this).find('.owl-stage-outer').transition({ opacity : 1 });

					}).addClass('overlay-active');
				});
			}, 'html');
		}
	},
	close: function() {
		var that = this;
		$('body').css('overflow-y', 'auto');
		$('.gallery-wrapper').transition({x: -90, opacity: 0}, function() {
			$(this).removeClass('overlay-active').hide();
			if($('#images').data('owlCarousel')) {
				$('#images').remove();
			} 
			$(document.documentElement).off('keyup.portfolio');
			that.isLarge = false;
			that.isAnimating = false;
			$('.gallery-wrapper').removeClass('full-image');
			$('.gallery-wrapper').removeClass('large-image');
		});
	}
};

var navbar = {// jshint ignore:line
	show: function() {
		if (mobile){
			return;
		}
		
		$('body').on('click', '#navbar li .home-page, #mini-navbar li .home-page, .footer-nav li .home-page', function(e) {
			e.preventDefault();
			var that = this; 
			
			$('html, body').animate({
				scrollTop: $($(that).data('target')).offset().top -  ($('#mini-navbar .nav-height').height())
			}, 500);
		});
		
		/*if($('#navbar').length === 0) {
			console.log('nie ma navbara');
			$('#mini-navbar').addClass('show-mini-nav');
			return;
		}*/
		
		$(window).scroll(function() {
			if($(window).scrollTop() > $('#navbar').height()){
				$('#navbar').addClass('hide-nav');
				$('#mini-navbar').addClass('show-mini-nav');
			}
			else {
				$('#mini-navbar').removeClass('show-mini-nav');
				$('#navbar').removeClass('hide-nav');
			}	
		});
	},
		
	
};

var features = {
	init: function() {
		this.initCarousel();
	},
	
	initCarousel: function() {
		var owl = $('#features-carousel');
		owl.owlCarousel({
			items: 1,
			loop: true,
			nav: true,
			autoplay: false,
			autoplayHoverPause: false,
			merge: true,
			center: true,
			dots: true,
			autoHeight: false,
			slideSpeed: 2000,
			callbacks: true,
//			navText: ['<i class="arrow-left"></i>', '<i class="arrow-right"></i>'],
			responsiveClass: false
		});
	},
	
	destroy: function() {
		var owl = $('#features-carousel');
		owl.on('onResponsiveAfter.destroy', function(){
			owl.data('owlCarousel').destroy();
			owl.off('onResponsiveAfter.destroy');
		});
		
	}
	
};

var team = {
	init: function() {
		
		this.initCarousel();
	},
	
	initCarousel: function() {
		var owl = $('#team-carousel');
		owl.owlCarousel({
			items: 1,
			autoHeight: false,
			autoplay: false,
			autoplayHoverPause: false,
			loop: true,
			merge: true,
			nav: false,
			center: true,
			slideSpeed: 2000,
			dots: true,
			callbacks: true,
			responsiveClass: false,
		});
	},
	
	destroy: function() {
		var owl = $('#team-carousel');
		owl.on('onResponsiveAfter.destroy', function(){
			owl.data('owlCarousel').destroy();
			owl.off('onResponsiveAfter.destroy');
		});
		
	}
	
};

var mobileNav = {// jshint ignore:line
	show: function() {
		this.open();
		this.close();
	},
	open: function() {
		$('.reorder a').click(function(e) {
			e.preventDefault();
			if ($('body').hasClass('mobile-nav-show')) {
				$(this).parent().removeClass('flyout-open');
				$('#flyout-container').transition({height: 0}, 600, function() {
					$('#flyout-container .open').removeClass('open');
					$('#flyout-container .subnav-open').removeClass('subnav-open');
				});

				$('body').removeClass('mobile-nav-show');
			} else {
				$(this).parent().addClass('flyout-open');
				$('#flyout-container').transition({height: $('#flyout-container .flyout-menu > li').height() * $('#flyout-container .flyout-menu > li').length}, 600, function() {
				});
				$('body').addClass('mobile-nav-show');
			}
		});
		
	},
	close: function() {
		$('#menu-mobile .menu-item .home-page').on('click', function(e) {
			e.preventDefault();
			var that = this;
			
			$('.flyout-menu .open-children').parent().removeClass('subnav-open');
			$('#flyout-container').animate({height: 0}, function() {
				$('#flyout-container .open').css('height', 0).removeClass('open');
				$('body').removeClass('mobile-nav-show');
			});
				
//			if($(that).hasClass('header-inside')) {
//				$('html, body').animate({
//					scrollTop: $($(that).data('target')).offset().top - ($(that).parents('.nav-height').height())
//				}, 500);
//			} 
//			else {
				$('html, body').animate({
					scrollTop: $($(that).data('target')).offset().top - ($(that).parents('.nav-height').height())
				}, 500);
//			}
	
		});
	}
	
};

	function waypoints_init() {// jshint ignore:line
		if(!ipad && !mobile) {
			if(jQuery.waypoints) {// jshint ignore:line
				$('.yo-anim').each(function(){
					var delay=$(this).data('animation-delay');
					$(this).waypoint(function(){
						if(delay) {
							var $this=$(this);
							setTimeout(function(){
								$this.addClass('yo-anim-start');
							}, delay);
						} else {
							$(this).addClass('yo-anim-start');
						}
					},{
						offset: '80%',
						triggerOnce: true
					});
				});
			}
		} else {
			$('.yo-anim').removeClass('yo-anim');
		}
	}

function loadEnquire() {// jshint ignore:line
	enquire.register('screen and (max-width: 767px)', {// jshint ignore:line

		// OPTIONAL
		// If supplied, triggered when a media query matches.
		match : function() {
			features.init();
			team.init();
		},      
									
		// OPTIONAL
		// If supplied, triggered when the media query transitions 
		// *from a matched state to an unmatched state*.
		unmatch : function() {
			features.destroy();
			team.destroy();
		},    
		
		// OPTIONAL
		// If supplied, triggered once, when the handler is registered.
		setup : function() {

		},    
									
		// OPTIONAL, defaults to false
		// If set to true, defers execution of the setup function 
		// until the first time the media query is matched
		deferSetup : true,
									
		// OPTIONAL
		// If supplied, triggered when handler is unregistered. 
		// Place cleanup code here
		destroy : function() {}
		  
	});
}

var video = {// jshint ignore:line
	videoUrl : 'http://www.vimeo.com/118917181',
	endpoint : 'http://www.vimeo.com/api/oembed.json',
	callback : 'video.embedVideo',
	url : '',
	
	videoInit: function() {
		var width = $('.video-section').width();
		this.url = this.endpoint + '?url=' + encodeURIComponent(this.videoUrl) + '&callback=' + this.callback + '&width='+width+'&byline=false&portrait=false&title=false';
	},
			
	embedVideo: function(video) {
		document.getElementById('embed').innerHTML = unescape(video.html);// jshint ignore:line
	},
			
	init : function() {
		if($('#video-section').length === 0){
			return false;
		}
		this.videoInit();
		var js = document.createElement('script');
		js.setAttribute('type', 'text/javascript');
		js.setAttribute('src', this.url);
		document.getElementsByTagName('head').item(0).appendChild(js);
	}

};