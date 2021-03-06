$(document).ready(function(){	
	var weatherIconURL = 'http://openweathermap.org/img/w/';
	var apiKey = '1a5d837d4c874f4635ed8ae9ecae0ca9';
	$.backstretch('weather image.jpg');
	function getDayOfWeek(){
		var today = new Date();
		var dayOfWeek = today.getDay();
		return dayOfWeek;
	}
	function getDayWords(day){
		var dayOfWeek = day;
		var dayWords;
			switch(dayOfWeek){
				case 0:
					dayWords = 'Sunday'
					break;
				case 1:
					dayWords = 'Monday'
					break;
				case 2:
					dayWords = 'Tuesday'
					break;
				case 3:
					dayWords = 'Wednesday'
					break;
				case 4:
					dayWords = 'Thursday'
					break;
				case 5:
					dayWords = 'Friday'
					break;
				case 6:
					dayWords = 'Saturday'
					break;
			}
			return dayWords;	
		}
	function getForecastArray(){
		var today = getDayOfWeek() + 1;
		var weekArray = [];

		for(i=0;i<7;i++){
			weekArray[i] = getDayWords(today)
			today++;
			if(today==7){
				today = 0;
			}
		}
		return weekArray;
	}

	function getWeather(location){
		var searchType = typeof(location);
		var root;
		if(searchType === 'string'){
			root = 'q=';
		}else if(searchType === 'number'){
			root = 'zip=';
		}

		var weatherURL = 'http://api.openweathermap.org/data/2.5/weather?'+root+location+',us&units=imperial&APPID='+apiKey;
		var forecastURL = 'http://api.openweathermap.org/data/2.5/forecast/daily?'+root+location+',us&units=imperial&APPID='+apiKey;
		
		function cardinalDirection(deg){
			var direction;
			if((deg<11.25)||(deg>348.75)){
				direction = 'N';
			}else if(deg<33.75){
				direction = 'NNE';
			}else if(deg<56.25){
				direction = 'NE';
			}else if(deg<78.75){
				direction = 'ENE';
			}else if(deg<101.25){
				direction = 'E';
			}else if(deg<123.75){
				direction = 'ESE';
			}else if(deg<146.25){
				direction = 'SE';
			}else if(deg<168.75){
				direction = 'SSE';
			}else if(deg<191.25){
				direction = 'S';
			}else if(deg<213.75){
				direction = 'SSW';
			}else if(deg<236.25){
				direction = 'SW';
			}else if(deg<258.75){
				direction = 'WSW';
			}else if(deg<281.25){
				direction = 'W';
			}else if(deg<303.75){
				direction = 'WNW';
			}else if(deg<326.25){
				direction = 'NW';
			}else if(deg<348.75){
				direction = 'NNW';
			}
			return direction;
		}

		$.getJSON(weatherURL, function(weatherData){
			var currTemp = Math.round(Number(weatherData.main.temp));
			var finalTemp = currTemp + ' \xB0F'
			var icon = weatherIconURL + weatherData.weather[0].icon + '.png';
			var windCoord = weatherData.wind.deg;
			console.log(windCoord);
			var cards = cardinalDirection(windCoord);
			
			if(windCoord>=180){
				windCoordMod = windCoord - 180;
			}

			var windSpeed = Math.round(Number(weatherData.wind.speed));
			var condition = weatherData.weather[0].description;
			var area = weatherData.name;

			var canvas = $('#weather-canvas')[0];
			var context = canvas.getContext('2d');

			var html = '<div id="city-info">';
					html += '<img src='+icon+'>';
					html += '<h3 id="city-name">'+area+'</h3>';
					html += '<p id="condition">'+condition+'</p>';
					html += '<p id="wind-info">Winds: '+cards+' at '+windSpeed+' mph</p>'
					html += '<div id="compass"><p id="N">N</p><p id="E">E</p><p id="S">S</p><p id="W">W</p></div>'
					html += '<img id="wind-arrow" src="windarrow.png">'
				html += '</div>';
			$('#city-results').append(html);
			
			$('#wind-arrow').addClass('rotate');
			$('#wind-arrow').css('transition', 'transform '+ 10/windSpeed +'s cubic-bezier(0.09,0.25,0.49,1.58)');
			if(windCoord<=180){
				var rotationAngle = -(180-windCoord);
				setTimeout(function(){$('.rotate').css('transform','rotate('+rotationAngle+'deg)')},0)
			}else{
				setTimeout(function(){$('.rotate').css('transform','rotate('+windCoordMod+'deg)')},0)
			}
			
			
			var lineWidth = 5;
			var outterRadius = 70;
			var innerRadius = outterRadius - lineWidth;
			var currPercent = 0;
			var counterClockwise = false;
			var circ = Math.PI * 2;
			var quart = Math.PI / 2;

			function animate(current){
				context.fillStyle = '#ccc'
				context.beginPath();
				context.arc(100,75,innerRadius,0,circ,true);
				context.closePath();
				context.fill()
				if(currTemp<10){
					shadeColor= '#00f';
				}else if(currTemp<32){
					shadeColor = '#36f';
				}else if(currTemp<60){
					shadeColor = '#3af'
				}else if(currTemp<75){
					shadeColor = '#1cff1c'
				}else if(currTemp<90){
					shadeColor = '#FFFF1A'
				}else{
					shadeColor = '#E3170D';
				}
				context.strokeStyle = shadeColor;
				context.lineWidth= '10';
				context.beginPath();
				// If statement is to decide which direction the animation should proceed to
				// depict the temperature
				if(currTemp<0){
					context.arc(100,75,outterRadius,-(quart),2*Math.PI-quart-(current*(circ)),true)
				}else{
					context.arc(100,75,outterRadius,-(quart),(current*(circ)-quart),false);
				}
				context.stroke()
				// 
				context.font = '34px Myriad Pro';
				context.fillStyle = "black";
				context.textBaseline = 'top';
				context.fillText(finalTemp,130-outterRadius, 92-outterRadius/2,80)
				currPercent++;
				if(currPercent < Math.abs(currTemp)){
					requestAnimationFrame(function(){
						animate(currPercent/100);
					});
				};
			};
			animate()
			context.closePath();
			})

		$.getJSON(forecastURL, function(weatherData){
			var forecast = weatherData.list;
			var days = getForecastArray();
			days[0] = 'Tomorrow';
			for(i=0;i<days.length;i++){
				var html2 = '<div class="days" id="day'+i+'"><span class="bold">'+days[i]+'</span>';
						html2 += '<div class="highs">High: '+Math.round(forecast[i].temp.max)+' \xB0F</div>'
						html2 += '<div class="lows">Low: '+Math.round(forecast[i].temp.min)+' \xB0F</div>'
						html2 += '<div class="rain">'
					html2 += '</div>'

				$('#forecast').append(html2);
			}
		})
	};

	$('form').submit(function(){
		var location = $('#search-field').val();
		event.preventDefault();
		var canvas = $('#weather-canvas')[0];
		var context = canvas.getContext('2d');
		context.clearRect(0,0, canvas.width, canvas.height)
		getWeather(location);
		$('#search-field').val('');
		$('#city-results').empty();
	});
	getWeather('atlanta');
})	










