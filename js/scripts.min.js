
"use strict";

// ...........................Custom JS......................... //
 

window.onload = function() {	
	let matrix = '128';
	let fileName = '4x4';	
	let myColor = "black";	
	
	let linkMatrix = document.getElementsByClassName('link-matrix');
	let linkTools = document.getElementsByClassName('link-tools');
	let div = document.querySelector('.draw');
	let button = document.querySelector('.btn-clear');
	let chooseColor = document.getElementById('color');	
	let paletteColors = document.querySelectorAll('span.palette-color');
	let currentColor =  paletteColors[0];
	let prevColor =  paletteColors[1];

	// Function showImage
	
	function showImage(name) {		
		while (div.firstChild) {
			div.removeChild(div.firstChild);
		}
		div.insertAdjacentHTML('beforeend', `<img src="img/${name}.png" class="default-image" width="512" height ="512">`);
	}

	// Function showFrame

	function showFrame(scale) {	
		while (div.firstChild) {
			div.removeChild(div.firstChild);
		}
		div.insertAdjacentHTML('beforeend', `<canvas id="canvas" width="512" height="512"></canvas>`);		

		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');	
		let isDrawing = false;
		let lastX = 0;
		let lastY = 0;						
		
		let current = document.querySelector('.current');
		let method = current.dataset.method;
		
		function frame(current) {
			current = document.querySelector('.current');			
			method = current.dataset.method;									
		}		
		
		frame.fill = function() {			
			ctx.fillStyle = myColor;
			ctx.fillRect(0, 0, 512, 512);			
		};

		frame.eyedropper = function() {			
			chooseColor.style.visibility = "visible";

			chooseColor.oninput = function() {
				prevColor.style.backgroundColor = myColor;	
				myColor = this.value;						
				currentColor.style.backgroundColor = this.value;						
			}	
		};

		frame.draw = function(e) {			
			if(!isDrawing) return; // stop the fn from running when they are not moused down		

			chooseColor.oninput = function() {	
				myColor = this.value;				
			}			
				
			ctx.strokeStyle = myColor;
			ctx.lineJoin = 'round'; // round || bevel || miter
			ctx.lineCap = 'round'; // round || butt || square		
			ctx.lineWidth = scale;		
			
			ctx.beginPath();			
			ctx.moveTo(lastX, lastY);			
			ctx.lineTo(e.offsetX, e.offsetY);	
			ctx.stroke();	
			[lastX, lastY] = [e.offsetX, e.offsetY];
		};		

		frame.checkTools = function() {

			function handle(e) {				
				if (method == 'pencil') {
					isDrawing = true;			
					[lastX, lastY]  = [e.offsetX, e.offsetY];	
					frame.draw(e);
				} else if(method == 'fill') {
					frame.fill();
				} else {
					canvas.removeEventListener('mousedown', handle);
				}				
			};

			switch(method) {
				case 'fill':
					chooseColor.style.visibility = "hidden";
					canvas.addEventListener('mousedown', handle);					
					break;
					
				case 'eyedropper':
					this.eyedropper();					
					break;

				case 'pencil':
					chooseColor.style.visibility = "hidden";
					canvas.addEventListener('mousedown', handle);
					canvas.addEventListener('mousemove', this.draw);
					canvas.addEventListener('mouseup', () => isDrawing = false);
					canvas.addEventListener('mouseout', () => isDrawing = false);										
					break;	

				default:
					chooseColor.style.visibility = "hidden";
					alert(`method: ${method}`);																	
			}			
		};					

		frame.clear = function() {
			button.onclick = function() {
				ctx.clearRect(0, 0, 512, 512); // clear canvas
			}
		};

		return frame;

	}	// end showFrame

	// run application

	let frame = showFrame(matrix);
	frame.checkTools();
	frame.clear();

	for(let i = 0; i < linkMatrix.length; i++) {	
		linkMatrix[i].addEventListener('click', function() {
			matrix = this.getAttribute('matrix');
			fileName = this.innerText.split(' ').join('');

			let active = document.querySelector('.active');			
			active.classList.remove('active');
			this.parentElement.classList.add('active');						

			if(fileName == 'image') {
				showImage(fileName);
			}	else {
				frame = showFrame(matrix);
				frame.checkTools();
				frame.clear();
			}	
		});			
	}		

	for(let j = 0; j < linkTools.length; j++) {
		linkTools[j].addEventListener('click', function() {
			let current = document.querySelector('.current');			
			current.classList.remove('current');
			this.parentElement.classList.add('current');			

			frame();
			frame.checkTools();
		});		
	}

}

