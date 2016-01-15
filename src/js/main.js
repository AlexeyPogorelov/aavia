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
	monthNamesShort = [ "Янв", "Фев", "Мар", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек" ];

// main page
$('.main-input-holder').each(function (i) {
	$(this)
		.one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function () {
			$(this).removeClass('scaleYIn');
		})
		.addClass('scaleYIn anim-delay-' + (i + 1));
});
$('intro-animation').one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function () {
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
		$realSelect.find('option').each(function (i) {
			if (i) {
				var $newOption = $('<div>').addClass('list-item');
				$newOption.html($(this).text());
				$newOption.attr('data-val', $(this).val()); // TODO can be removed
				$newOption.on('click', function (e) {
					e.stopPropagation();
					$realSelect.val($(this).data('val'));
					$self.find('.input-label').addClass('selected').html($(this).html());
					$self.removeClass('opened');
				});
				$newOption.appendTo($newSelect);
			}
		});
		$newSelect.appendTo($(this));
	}
});
$('#submit-main-form').on('click', function () {
	$('#form-main-form').trigger('submit');
});

// jQuery UI
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