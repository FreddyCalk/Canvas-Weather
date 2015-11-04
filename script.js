$(document).ready(function(){
	
	var weatherIconURL = 'http://openweathermap.org/img/w/'

	var apiKey = '1a5d837d4c874f4635ed8ae9ecae0ca9';
	
	function getWeather(location){
		var searchType = typeof(location);

		if(searchType === 'string'){
			root = 'q=';
		}else if(searchType === 'number'){
			root = 'zip=';
		}

		var weatherURL = 'http://api.openweathermap.org/data/2.5/weather?'+root+location+',us&units=imperial&APPID='+apiKey;
		
		$.getJSON(weatherURL, function(weatherData){
			var currTemp = weatherData.main.temp;
			var finalTemp = currTemp + ' \xB0F'
			var image = new Image;
			var icon = weatherIconURL + weatherData.weather[0].icon + '.png';
			image.src = icon;
			var condition = weatherData.weather[0].description;
			var area = weatherData.name;
			var canvas = $('#weather-canvas')[0];
			var context = canvas.getContext('2d');
			
			// context.beginPath();
			// context.lineWidth = '3';
			// context.moveTo(0,0);
			// context.lineTo(100,50);
			// context.stroke();

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
				if(currTemp<32){
					shadeColor = '#00f';
				}else if(currTemp<60){
					shadeColor = '#39f'
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
				context.arc(100,75,outterRadius,-(quart),(current*(circ)-quart),false);
				context.stroke()
				context.font = '34px Myriad Pro';
				context.fillStyle = "black";
				context.textBaseline = 'top';
				context.fillText(finalTemp,110-outterRadius, 92-outterRadius/2)
				context.font = '12px Myriad Pro';
				context.fillText(condition,140-outterRadius, 135-outterRadius/2)
				context.fillText(area,145-outterRadius, 150-outterRadius/2)
				context.drawImage(image,75,20)
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
	};
	$('form').submit(function(){
		var location = $('#search-field').val();
		event.preventDefault();
		var canvas = $('#weather-canvas')[0];
		var context = canvas.getContext('2d');
		context.clearRect(0,0, canvas.width, canvas.height)
		getWeather(location);
	});
	getWeather('atlanta');
})	










