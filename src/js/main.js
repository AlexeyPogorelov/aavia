// test
$('#main-overlay').on('click', function () {
	$('.main-overlay').toggleClass('hidden');
});
$('#grid-overlay').on('click', function () {
	$('.grid-overlay').toggleClass('hidden');
});
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
	})();

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
		$self.on('click', function () {
			var flag;
			if ($(this).hasClass('opened')) {
				flag = true;
			}
			$('.main-input-holder').removeClass('opened');
			if (!flag) {
				$self.addClass('opened');
			}
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

$('a.tab-switcher').on('click', function (e) {
	e.preventDefault();
	$(this).addClass('active').siblings('.tab-switcher').removeClass('active');
	$($(this).attr('href')).addClass('hidden').siblings().removeClass('hidden');
	// console.log($($(this).attr('href')));
})

$('.bottom-tickets-nav').find('button.type-2').on('click', function () {
	$(this).closest('.page-wrapper').find('form').trigger('submit');
});

$('.order-form').find('form.container').on('submit', function (e) {
	e.preventDefault();
	var renderMessage, valid;
	renderMessage = {
		nameError: function () {
			return 'Введите Ваше имя';
		}
	};
	valid = {
		name: function (data) {
			//
		}
	};
	$(this).find('input, .validate').each(function () {
		var $self = $(this),
			valType = $self.data('validate'),
			now = new Date();
		if (valType == "name") {
			//
		} else if (valType == "empty") {
			//
		} else if (valType == "date-full") {
			$self.val(selectDateToInput ($self));
			if (new Date($self.val()) < new Date(now.getFullYear() - 18, now.getMonth(), now.getDate())) {
				alert(1);
			}
		} else if (valType == "date-passport") {
			$self.val(selectDateToInput ($self));
			if (new Date($self.val()) < new Date(now.getFullYear() - 10, now.getMonth(), now.getDate())) {
				alert(1);
			}
		}
		console.log(valType);
	});
});