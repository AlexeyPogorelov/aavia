// test
$('#main-overlay').on('click', function () {
	$('.main-overlay').toggleClass('hidden');
});
$('#grid-overlay').on('click', function () {
	$('.grid-overlay').toggleClass('hidden');
});
+function () {
	// global
	var currentDate = new Date(),
		dayNames = [ "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье" ],
		dayNamesMin = [ "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс" ],
		dayNamesShort = [ "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс" ],
		monthNames = [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],
		monthNamesAlt = [ "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря" ],
		monthNamesShort = [ "Янв", "Фев", "Мар", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек" ],
		animationPrefix = (function () {
			var t,
			el = document.createElement("fakeelement");
			var transitions = {
				"transition": "animationend",
				"OTransition": "oAnimationEnd",
				"MozTransition": "animationend",
				"WebkitTransition": "webkitAnimationEnd"
			};
			for (t in transitions){
				if (el.style[t] !== undefined){
					return transitions[t];
				}
			}
		})(),
		winHeight = $(window).height(),
		winWidth = $(window).width();

	// main page
	$('.main-input-holder').each(function (i) {
		$(this)
			.one(animationPrefix, function () {
				$(this).removeClass('scaleYIn');
			})
			.addClass('scaleYIn anim-delay-' + (i + 1));
	});
	$('intro-animation').one(animationPrefix, function () {
		$(this).removeClass('scaleYIn');
	});

	// select > blocks
	$('.main-input-holder').each(function () {
		var $self = $(this);
		var elementLink = $self.data('link'),
			$realSelect = $('#' + $(this).data('link'));
		// console.log(elementLink);
		if (!$realSelect.length) {
			return;
		}
		if (elementLink == "") {
		// if special dropdown
		} else if (elementLink == "personsInfo") {
			$self.on('click', function () {
				var flag;
				if ($(this).hasClass('opened')) {
					flag = true;
				}
				$('.main-input-holder').removeClass('opened');
				if (!flag) {
					$self.addClass('opened');
				}
			}).find('.dropdown').on('click', function (e) {
				e.stopPropagation();
				e.preventDefault();
			});
			$self.find('.ui-spinner').spinner({
				value: 2,
				icons: { down: "spinner-down-icon", up: "spinner-up-icon" },
				change: function( event, ui ) {
					$('#' + $(this).data('link')).val(this.value);
				},
				min: 0,
				max: 99
			});

			// $buttonsHolder = $('<div>').addClass('buttons-holder');
			$self.find('.ticket-class-holder button').on('click', function (e) {
				e.preventDefault();
				$(this).addClass('active').siblings().removeClass('active');
				$('#ticketClass').val($(this).data('value'));
			});

		} else if (elementLink == "discount") {
			$self.find('input').on('change', function () {
				$('#discount').val(this.value);
			});
		} else if (elementLink == "departureDate") {
			fillDateBlock($self, currentDate);
			$self.on('click', function () {
				$('#fakeDepartureDate').datepicker("show");
				$('.main-input-holder').removeClass('opened');
			});
		} else if (elementLink == "arrivalDate") {
			fillDateBlock($self, currentDate);
			$self.on('click', function () {
				$('#fakeArrivalDate').datepicker("show");
				$('.main-input-holder').removeClass('opened');
			});
		} else {
			$self.on('click', function (e) {
				//var flag;
				//if ($(this).hasClass('opened')) {
				//	flag = true;
				//}
				//$('.main-input-holder').removeClass('opened');
				//if (!flag) {
				//	$self.addClass('opened');
				//}
				e.stopPropagation();
				$self.addClass('opened');
				setTimeout(function () {
					$('body').one('click', function () {
						$self.removeClass('opened');
					});
				}, 1);
			});
			var $newSelect = $('<div>').addClass('dropdown');
			var $listHolder = $('<ul>');
			$realSelect.find('option').each(function (i) {
				if (i) {
					var $newOption = $('<li>').addClass('list-item');
					$newOption.html($(this).text());
					$newOption.attr('data-val', $(this).val()); // TODO can be removed
					$newOption.on('click', function (e) {
						e.stopPropagation();
						$realSelect.val($(this).data('val'));
						$self.find('.input-label').addClass('selected').html($(this).html());
						$self.removeClass('opened');
					});
					$newOption.appendTo($listHolder);
				}
			});
			$listHolder.appendTo($newSelect);
			$newSelect.appendTo($(this));
		}
	});
	$('#submit-main-form').on('click', function (e) {
		e.preventDefault();
		$('#form-main-form').trigger('submit');
	});

	// jQuery UI
	if ($("#fakeDepartureDate, #fakeArrivalDate").length == 2) {
		$("#fakeDepartureDate").datepicker({
			dayNames: dayNames,
			dayNamesMin: dayNamesMin,
			dayNamesShort: dayNamesShort,
			monthNames: monthNames,
			monthNamesShort: monthNamesShort,
			prevText: "Раньше",
			nextText: "Позже",
			showAnim: "slideDown",
			dateFormat: 'yy-mm-dd',
			onSelect: function () {
				$('#departureDate').val(this.value);
				var newMinDate = new Date(this.value);
				$('#fakeArrivalDate').datepicker( "option", "minDate", new Date(newMinDate.getFullYear(), newMinDate.getMonth(), newMinDate.getDate() + 1) );
				fillDateBlock($(this).closest('.main-input-holder'), new Date(this.value));
			},
			minDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 14)
		});
		$("#fakeArrivalDate").datepicker({
			dayNames: dayNames,
			dayNamesMin: dayNamesMin,
			dayNamesShort: dayNamesShort,
			monthNames: monthNames,
			monthNamesShort: monthNamesShort,
			prevText: "Раньше",
			nextText: "Позже",
			showAnim: "slideDown",
			dateFormat: 'yy-mm-dd',
			onSelect: function () {
				$('#arrivalDate').val(this.value);
				fillDateBlock($(this).closest('.main-input-holder'), new Date(this.value));
			},
			minDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 34)
		});
	}

	function convertDate (date) {
		var day = ("0" + date.getDate()).slice(-2);
		var month = ("0" + (date.getMonth() + 1)).slice(-2);
		var today = date.getFullYear()+"-"+(month)+"-"+(day);
		return today;
	}
	function fillDateBlock ($self, date) {
		$self.find('.date-day').html(date.getDate());
		$self.find('.date-month-year').html(monthNamesAlt[date.getMonth()].toLowerCase() + ' ' + date.getFullYear());
		$self.find('.date-week').html(dayNames[date.getDay()]);
	}
	function selectDateToInput ($input) {
		var fieldDate = [];
		$input.siblings('select').each(function (i) {
			if (i == 2) {
				fieldDate.push($(this).val());
			} else {
				fieldDate.push(("0" + $(this).val()).slice(-2));
			}
		});
		fieldDate.reverse();
		if (fieldDate[0]) {}
		return fieldDate[0] + '-' + fieldDate[1] + '-' + fieldDate[2];
	}


	// order page
	if ($("#mobile-number").length > 0) {
		// TODO move it on other .js file
		$("#mobile-number").intlTelInput({
			autoHideDialCode: true,
			preferredCountries: ['ua']
		});
	}
		// preferredCountries: ['ua', 'ru', 'us', 'pl']

		$('.ticket-footer').on('click', function () {
			$(this).closest('.ticket').toggleClass('opened');
		});

	$('a.tab-switcher').on('click', function (e) {
		e.preventDefault();
		$(this).addClass('active').siblings('.tab-switcher').removeClass('active');
		$($(this).attr('href')).addClass('hidden').siblings().removeClass('hidden');
		// console.log($($(this).attr('href')));
	});

	$('.bottom-tickets-nav').find('button.type-2').on('click', function () {
		$(this).closest('.page-wrapper').find('form').trigger('submit');
	});

	$('.order-form').find('form.container').find('select').one('change', function () {
		$(this).find('option').eq(0).remove();
	});
	+function () {
		var state = {};
		$('.ticket-header').on('click', function () {
			if ($(this).data('way') == "forward") {
				state.forward = parseInt( $(this).data('price') );
				var speed = 800;
				if (state.back) {
					$("html, body").stop().animate({
						scrollTop: $('.bottom-tickets-nav').offset().top
					}, speed, 'swing');
				} else {
					$("html, body").stop().animate({
						scrollTop: $('.tickets-way.back').offset().top
					}, speed, 'swing');
				}
			} else if ($(this).data('way') == "back") {
				state.back = parseInt( $(this).data('price') );
				var speed = 1200;
				if (state.forward) {
					$("html, body").stop().animate({
						scrollTop: $('.bottom-tickets-nav').offset().top
					}, speed, 'swing');
				} else {
					$("html, body").stop().animate({
						scrollTop: $('.tickets-way.forward').offset().top
					}, speed, 'swing');
				}
			}
			if (state.back) {
				$('#arrival-area-info').find('.price').text(state.back + ' $');
			}
			if (state.forward) {
				$('#departure-area-info').find('.price').text(state.forward + ' $');
			}
			if (state.back && state.forward) {
				$('#result-area').find('.bold').text(state.back + state.forward + ' $');
			}
			$('html, body').one('mousewheel DOMMouseScroll touchstart', function () {
				$(this).stop(true, true);
				// bodyOverflow.unfixBody();
			});
			// console.log(state);
		});

	}();
	+function () {
		var renderMessage, valid, settings, notValid;
		settings = {
			'passportYears': 10,
			'halfYears': 12,
			'babyYears': 2
		};
		regularExp = {
			name: function (data) {
				var exp = /^[а-яА-Яa-zA-Z\-]+$/;
				return exp.test(data);
			},
			email: function (data) {
				var exp = /^[0-9a-zA-Z._-]+@[0-9a-zA-Z_-]+\.[a-zA-Z._-]+/;
				return exp.test(data);
			},
			empty: function (data) {
				return data.replace(/\s+/g, '');
			},
			phone: function (data) {
				var exp = /^[\(\)0-9\-\s\+]{8,}/;
				return exp.test(data);
			}
		};
		renderMessage = {
			empty: function ($el, valid, e) {
				var $container = $el.parent();
				if (valid) {
					$container.removeClass('error');
					$container.find('.error').remove();
				} else if ($container.find('.error').length && e.type != 'submit') {
					return false;
				} else if ($container.find('.error').length) {
					$container.addClass('error');
				} else if (e.type == 'submit') {
					$container.addClass('error');
					$container.append('<div class="error">Заполните поле</div>');
				}
			},
			nameError: function ($el, valid, e) {
				var $container = $el.parent();
				if (valid) {
					$container.removeClass('error');
					$container.find('.error').remove();
				} else if (e.target == $el.get(0) && !$container.find('.error').length) {
					$container.append('<div class="error">Введите настояшие данные</div>');
				} else if ($container.find('.error').length && e.type != 'submit') {
					return;
				} else if ($container.find('.error').length) {
					$container.addClass('error');
				} else if (e.type == 'submit') {
					$container.addClass('error');
					$container.append('<div class="error">Заполните поле</div>');
				}
			},
			phone: function ($el, valid, e) {
				var $container = $el.closest('.form-group');
				if (valid) {
					$container.removeClass('error');
					$container.find('.error-abs').remove();
				} else if (e.target == $el.get(0) && !$container.find('.error-abs').length) {
					$container.append('<div class="error-abs">Например: (099)999-99-99</div>');
				} else if ($container.find('.error-abs').length && e.type != 'submit') {
					return;
				} else if ($container.find('.error-abs').length) {
					$container.addClass('error');
				} else if (e.type == 'submit') {
					$container.addClass('error');
					$container.append('<div class="error-abs">Например: (099)999-99-99</div>');
				}
			},
			email: function ($el, valid, e) {
				// TODO realize it
				var $container = $el.parent();
				if (valid) {
					$container.removeClass('error');
					$container.find('.error').remove();
				} else if (e.target == $el.get(0) && !$container.find('.error').length) {
					$container.append('<div class="error">Введите email</div>');
				} else if ($container.find('.error').length && e.type != 'submit') {
					return;
				} else if ($container.find('.error').length) {
					$container.addClass('error');
				} else if (e.type == 'submit') {
					$container.addClass('error');
					$container.append('<div class="error">Введите email</div>');
				}
			},
			birthDate: function ($el, valid, e) {
				var $container = $el.parent(),
					empty;
				$container.find('select').each(function () {
					if (!$(this).val()) {
						empty = true;
					}
				});
				if (valid) {
					$container.removeClass('error');
					$container.find('.error-abs').remove();
				} else if ($container.find('.error-abs').length || (empty && e.type != "submit")) {
					return;
				} else if (!empty && e.type != "submit") {
					$container.addClass('error');
					$container.append('<div class="error-abs">Дата рождения не соответствует типу билета</div>');
				} else if (e.type == "submit") {
					$container.addClass('error');
					$container.append('<div class="error-abs">Введите дату рождения</div>');
				} else {
					$container.append('<div class="error-abs">Введите дату рождения</div>');
				}
			},
			passportExpire: function ($el, valid, e) {
				var $container = $el.parent(),
					empty;
				$container.find('select').each(function () {
					if (!$(this).val()) {
						empty = true;
					}
				});
				if (valid) {
					$container.removeClass('error');
					$container.find('.error-abs').remove();
				} else if ($container.find('.error-abs').length || (empty && e.type != "submit")) {
					return;
				} else if (!empty && e.type != "submit") {
					$container.addClass('error');
					$container.append('<div class="error-abs">Ваш паспорт недействителен</div>');
				} else if (e.type == "submit") {
					$container.addClass('error');
					$container.append('<div class="error-abs">Введите дату выдачи</div>');
				} else {
					$container.append('<div class="error-abs">Введите дату выдачи</div>');
				}
			}
		};
		$('.order-form').find('form.container').on('change submit', function (e) {
			if (notValid) {
				e.preventDefault();
			} else {
				var status = 0;
				$(this).find('input').each(function () {
					var $self = $(this),
						valType = $self.data('validate'),
						now = new Date();
					if (valType) status++;
					if (valType == "name") {
						if (regularExp.name($self.val())) {
							renderMessage.nameError($self, true, e);
							status--;
						} else {
							renderMessage.nameError($self, false, e);
						}
					} else if (valType == "empty") {
						if (regularExp.empty($self.val())) {
							renderMessage.empty($self, true, e);
							status--;
						} else {
							renderMessage.empty($self, false, e);
						}
					} else if (valType == "phone") {
						if (regularExp.phone($self.val())) {
							renderMessage.phone($self, true, e);
							status--;
						} else {
							renderMessage.phone($self, false, e);
						}
					} else if (valType == "email") {
						if (regularExp.email($self.val())) {
							renderMessage.email($self, true, e);
							status--;
						} else {
							renderMessage.email($self, false, e);
						}
					} else if (valType == "date-passport") {
						$self.val( selectDateToInput ($self) );
						if (new Date($self.val()) > new Date(now.getFullYear() - settings.passportYears, now.getMonth(), now.getDate())) {
							renderMessage.passportExpire($self, true, e);
							status--;
						} else {
							renderMessage.passportExpire($self, false, e);
						}
					} else if (valType == "date-full") {
						$self.val( selectDateToInput ($self) );
						if (new Date($self.val()) < new Date(now.getFullYear() - settings.halfYears, now.getMonth(), now.getDate())) {
							renderMessage.birthDate($self, true, e);
							status--;
						} else {
							renderMessage.birthDate($self, false, e);
						}
					} else if (valType == "date-child") {
						$self.val( selectDateToInput ($self) );
						var tempDate = new Date($self.val())
						if (tempDate > new Date(now.getFullYear() - settings.halfYears, now.getMonth(), now.getDate()) && tempDate < new Date(now.getFullYear() - settings.babyYears, now.getMonth(), now.getDate())) {
							renderMessage.birthDate($self, true, e);
							status--;
						} else {
							renderMessage.birthDate($self, false, e);
						}
					} else if (valType == "date-baby") {
						$self.val( selectDateToInput ($self) );
						if (new Date($self.val()) > new Date(now.getFullYear() - settings.babyYears, now.getMonth(), now.getDate())) {
							renderMessage.birthDate($self, true, e);
							status--;
						} else {
							renderMessage.birthDate($self, false, e);
						}
					} else if (valType == "novalidate") {
						//
					} else {
						// console.log($self);
						// console.log(valType);
						// status--;
					}
				});
			}
			console.log(status);
			if (e.type == 'submit' && status == 0) {
				notValid = true;
				$(this).trigger('submit');
			}
		});
	}();


	/* ========================================================================
 * Bootstrap: tooltip.js v3.3.6
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

	+function ($) {
		'use strict';

		// TOOLTIP PUBLIC CLASS DEFINITION
		// ===============================

		var Tooltip = function (element, options) {
			this.type       = null;
			this.options    = null;
			this.enabled    = null;
			this.timeout    = null;
			this.hoverState = null;
			this.$element   = null;
			this.inState    = null;

			this.init('tooltip', element, options)
		};

		Tooltip.VERSION  = '3.3.6';

		Tooltip.TRANSITION_DURATION = 150;

		Tooltip.DEFAULTS = {
			animation: true,
			placement: 'top',
			selector: false,
			template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
			trigger: 'hover focus',
			title: '',
			delay: 0,
			html: false,
			container: false,
			viewport: {
				selector: 'body',
				padding: 0
			}
		};

		Tooltip.prototype.init = function (type, element, options) {
			this.enabled   = true;
			this.type      = type;
			this.$element  = $(element);
			this.options   = this.getOptions(options);
			this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport));
			this.inState   = { click: false, hover: false, focus: false };

			if (this.$element[0] instanceof document.constructor && !this.options.selector) {
				throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
			}

			var triggers = this.options.trigger.split(' ');

			for (var i = triggers.length; i--;) {
				var trigger = triggers[i];

				if (trigger == 'click') {
					this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
				} else if (trigger != 'manual') {
					var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin';
					var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';

					this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
					this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
				}
			}

			this.options.selector ?
				(this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
				this.fixTitle()
		};

		Tooltip.prototype.getDefaults = function () {
			return Tooltip.DEFAULTS
		};

		Tooltip.prototype.getOptions = function (options) {
			options = $.extend({}, this.getDefaults(), this.$element.data(), options);

			if (options.delay && typeof options.delay == 'number') {
				options.delay = {
					show: options.delay,
					hide: options.delay
				}
			}

			return options
		};

		Tooltip.prototype.getDelegateOptions = function () {
			var options  = {};
			var defaults = this.getDefaults();

			this._options && $.each(this._options, function (key, value) {
				if (defaults[key] != value) options[key] = value
			});

			return options
		};

		Tooltip.prototype.enter = function (obj) {
			var self = obj instanceof this.constructor ?
				obj : $(obj.currentTarget).data('bs.' + this.type);

			if (!self) {
				self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
				$(obj.currentTarget).data('bs.' + this.type, self)
			}

			if (obj instanceof $.Event) {
				self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
			}

			if (self.tip().hasClass('in') || self.hoverState == 'in') {
				self.hoverState = 'in';
				return
			}

			clearTimeout(self.timeout);

			self.hoverState = 'in';

			if (!self.options.delay || !self.options.delay.show) return self.show();

			self.timeout = setTimeout(function () {
				if (self.hoverState == 'in') self.show()
			}, self.options.delay.show)
		};

		Tooltip.prototype.isInStateTrue = function () {
			for (var key in this.inState) {
				if (this.inState[key]) return true
			}

			return false
		};

		Tooltip.prototype.leave = function (obj) {
			var self = obj instanceof this.constructor ?
				obj : $(obj.currentTarget).data('bs.' + this.type);

			if (!self) {
				self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
				$(obj.currentTarget).data('bs.' + this.type, self)
			}

			if (obj instanceof $.Event) {
				self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
			}

			if (self.isInStateTrue()) return;

			clearTimeout(self.timeout);

			self.hoverState = 'out';

			if (!self.options.delay || !self.options.delay.hide) return self.hide();

			self.timeout = setTimeout(function () {
				if (self.hoverState == 'out') self.hide()
			}, self.options.delay.hide)
		};

		Tooltip.prototype.show = function () {
			var e = $.Event('show.bs.' + this.type);

			if (this.hasContent() && this.enabled) {
				this.$element.trigger(e);

				var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
				if (e.isDefaultPrevented() || !inDom) return;
				var that = this;

				var $tip = this.tip();

				var tipId = this.getUID(this.type);

				this.setContent();
				$tip.attr('id', tipId);
				this.$element.attr('aria-describedby', tipId);

				if (this.options.animation) $tip.addClass('fade');

				var placement = typeof this.options.placement == 'function' ?
					this.options.placement.call(this, $tip[0], this.$element[0]) :
					this.options.placement;

				var autoToken = /\s?auto?\s?/i;
				var autoPlace = autoToken.test(placement);
				if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

				$tip
					.detach()
					.css({ top: 0, left: 0, display: 'block' })
					.addClass(placement)
					.data('bs.' + this.type, this);

				this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
				this.$element.trigger('inserted.bs.' + this.type);

				var pos          = this.getPosition();
				var actualWidth  = $tip[0].offsetWidth;
				var actualHeight = $tip[0].offsetHeight;

				if (autoPlace) {
					var orgPlacement = placement;
					var viewportDim = this.getPosition(this.$viewport);

					placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
											placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
											placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
											placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
											placement;

					$tip
						.removeClass(orgPlacement)
						.addClass(placement)
				}

				var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

				this.applyPlacement(calculatedOffset, placement);

				var complete = function () {
					var prevHoverState = that.hoverState;
					that.$element.trigger('shown.bs.' + that.type);
					that.hoverState = null;

					if (prevHoverState == 'out') that.leave(that)
				};

				$.support.transition && this.$tip.hasClass('fade') ?
					$tip
						.one('bsTransitionEnd', complete)
						.emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
					complete()
			}
		};

		Tooltip.prototype.applyPlacement = function (offset, placement) {
			var $tip   = this.tip();
			var width  = $tip[0].offsetWidth;
			var height = $tip[0].offsetHeight;

			// manually read margins because getBoundingClientRect includes difference
			var marginTop = parseInt($tip.css('margin-top'), 10);
			var marginLeft = parseInt($tip.css('margin-left'), 10);

			// we must check for NaN for ie 8/9
			if (isNaN(marginTop))  marginTop  = 0;
			if (isNaN(marginLeft)) marginLeft = 0;

			offset.top  += marginTop;
			offset.left += marginLeft;

			// $.fn.offset doesn't round pixel values
			// so we use setOffset directly with our own function B-0
			$.offset.setOffset($tip[0], $.extend({
				using: function (props) {
					$tip.css({
						top: Math.round(props.top),
						left: Math.round(props.left)
					})
				}
			}, offset), 0);

			$tip.addClass('in');

			// check to see if placing tip in new offset caused the tip to resize itself
			var actualWidth  = $tip[0].offsetWidth;
			var actualHeight = $tip[0].offsetHeight;

			if (placement == 'top' && actualHeight != height) {
				offset.top = offset.top + height - actualHeight
			}

			var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

			if (delta.left) offset.left += delta.left;
			else offset.top += delta.top;

			var isVertical          = /top|bottom/.test(placement);
			var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
			var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

			$tip.offset(offset);
			this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
		};

		Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
			this.arrow()
				.css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
				.css(isVertical ? 'top' : 'left', '')
		};

		Tooltip.prototype.setContent = function () {
			var $tip  = this.tip();
			var title = this.getTitle();

			$tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
			$tip.removeClass('fade in top bottom left right')
		};

		Tooltip.prototype.hide = function (callback) {
			var that = this;
			var $tip = $(this.$tip);
			var e    = $.Event('hide.bs.' + this.type);

			function complete() {
				if (that.hoverState != 'in') $tip.detach();
				that.$element
					.removeAttr('aria-describedby')
					.trigger('hidden.bs.' + that.type);
				callback && callback()
			}

			this.$element.trigger(e);

			if (e.isDefaultPrevented()) return;

			$tip.removeClass('in');

			$.support.transition && $tip.hasClass('fade') ?
				$tip
					.one('bsTransitionEnd', complete)
					.emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
				complete();

			this.hoverState = null;

			return this
		};

		Tooltip.prototype.fixTitle = function () {
			var $e = this.$element;
			if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
				$e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
			}
		};

		Tooltip.prototype.hasContent = function () {
			return this.getTitle()
		};

		Tooltip.prototype.getPosition = function ($element) {
			$element   = $element || this.$element;

			var el     = $element[0];
			var isBody = el.tagName == 'BODY';

			var elRect    = el.getBoundingClientRect();
			if (elRect.width == null) {
				// width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
				elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
			}
			var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset();
			var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
			var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

			return $.extend({}, elRect, scroll, outerDims, elOffset)
		};

		Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
			return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
						 placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
						 placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
					/* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

		};

		Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
			var delta = { top: 0, left: 0 };
			if (!this.$viewport) return delta;

			var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
			var viewportDimensions = this.getPosition(this.$viewport);

			if (/right|left/.test(placement)) {
				var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll;
				var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
				if (topEdgeOffset < viewportDimensions.top) { // top overflow
					delta.top = viewportDimensions.top - topEdgeOffset
				} else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
					delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
				}
			} else {
				var leftEdgeOffset  = pos.left - viewportPadding;
				var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
				if (leftEdgeOffset < viewportDimensions.left) { // left overflow
					delta.left = viewportDimensions.left - leftEdgeOffset
				} else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
					delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
				}
			}

			return delta
		};

		Tooltip.prototype.getTitle = function () {
			var title;
			var $e = this.$element;
			var o  = this.options;

			title = $e.attr('data-original-title')
				|| (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title);

			return title
		};

		Tooltip.prototype.getUID = function (prefix) {
			do prefix += ~~(Math.random() * 1000000);
			while (document.getElementById(prefix));
			return prefix
		};

		Tooltip.prototype.tip = function () {
			if (!this.$tip) {
				this.$tip = $(this.options.template);
				if (this.$tip.length != 1) {
					throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
				}
			}
			return this.$tip
		};

		Tooltip.prototype.arrow = function () {
			return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
		};

		Tooltip.prototype.enable = function () {
			this.enabled = true
		};

		Tooltip.prototype.disable = function () {
			this.enabled = false
		};

		Tooltip.prototype.toggleEnabled = function () {
			this.enabled = !this.enabled
		};

		Tooltip.prototype.toggle = function (e) {
			var self = this;
			if (e) {
				self = $(e.currentTarget).data('bs.' + this.type);
				if (!self) {
					self = new this.constructor(e.currentTarget, this.getDelegateOptions());
					$(e.currentTarget).data('bs.' + this.type, self)
				}
			}

			if (e) {
				self.inState.click = !self.inState.click;
				if (self.isInStateTrue()) self.enter(self);
				else self.leave(self)
			} else {
				self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
			}
		};

		Tooltip.prototype.destroy = function () {
			var that = this;
			clearTimeout(this.timeout);
			this.hide(function () {
				that.$element.off('.' + that.type).removeData('bs.' + that.type);
				if (that.$tip) {
					that.$tip.detach()
				}
				that.$tip = null;
				that.$arrow = null;
				that.$viewport = null
			})
		};


		// TOOLTIP PLUGIN DEFINITION
		// =========================

		function Plugin(option) {
			return this.each(function () {
				var $this   = $(this);
				var data    = $this.data('bs.tooltip');
				var options = typeof option == 'object' && option;

				if (!data && /destroy|hide/.test(option)) return;
				if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)));
				if (typeof option == 'string') data[option]()
			})
		}

		var old = $.fn.tooltip;

		$.fn.tooltip             = Plugin;
		$.fn.tooltip.Constructor = Tooltip;


		// TOOLTIP NO CONFLICT
		// ===================

		$.fn.tooltip.noConflict = function () {
			$.fn.tooltip = old;
			return this
		}

	}(jQuery);

	$('.hint').tooltip();

}();