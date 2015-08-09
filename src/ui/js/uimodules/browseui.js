var BrowseUI = (function(){

	var module = function(name){
		common.Mod.call(this,name);
		this.configMap.requires = ['utils'];
	};

	module.prototype = Object.create(common.Mod.prototype);
	module.prototype.constructor = module;
	
	module.prototype.loadItems = function(items, container){

		var outdiv = document.createElement("div");
		$( container ).append(outdiv);
		outdiv.classList.add("browse");
		outdiv.classList.add("row");


		for(var i = 0; i < items.length ; i++){
			this.createItemWidget(items[i], outdiv);
		}
	}


	module.prototype.createItemWidget = function(item, container){

		var logger = this.configMap.modules['utils'].logger;
		logger.enter(this.name, 'createItemWidget');

		var outWrapper = document.createElement("div");
		$( container ).append(outWrapper);
		outWrapper.classList.add("col-sm-6");
		outWrapper.classList.add("col-md-4");
		
			
		var thumbWrapper = document.createElement("div");
		outWrapper.appendChild(thumbWrapper);
		thumbWrapper.classList.add("thumbnail");
		thumbWrapper.classList.add("thumbnail-browse-fix");
		
		var slideshow = document.createElement("div");
		thumbWrapper.appendChild(slideshow);
		slideshow.classList.add("slideshow");

		var figcaption = document.createElement("figcaption");
		//---
		slideshow.appendChild(figcaption);
		var row1 = document.createElement("div");
		figcaption.appendChild(row1);
		row1.classList.add("row");
		row1.classList.add("row-fix");
		var row2 = document.createElement("div");
		figcaption.appendChild(row2);
		row2.classList.add("row");
		row2.classList.add("row-fix");

		var titleDiv = document.createElement("div");
		row1.appendChild(titleDiv);
		titleDiv.classList.add("pull-left");
		var anchorWidget = document.createElement("a");
		titleDiv.appendChild(anchorWidget);
		anchorWidget.setAttribute("href",window.location.origin + '/#body=item:id,' + item._id );//+ '|mode,edit'
		var h4 = document.createElement("h4");
		anchorWidget.appendChild(h4);
		h4.textContent = item.name;
		var priceDiv = document.createElement("div");
		row1.appendChild(priceDiv);
		priceDiv.classList.add("pull-right");
		var h5 = document.createElement("h5");
		priceDiv.appendChild(h5);
		h5.innerText = '€ ' + item.price;
		var notesDiv = document.createElement("div");
		row2.appendChild(notesDiv);
		notesDiv.classList.add("pull-left");
		var p = document.createElement("p");
		notesDiv.appendChild(p);
		
		if(200 <= item.notes.length){
			p.textContent = item.notes.substr(0,197) + '...';
		}
		else
			p.textContent = item.notes;

		for(var i = 0 ; i < item.images.length ; i++){
			var figure = document.createElement("figure");
			slideshow.appendChild(figure);
			
			if(i == 0)
				figure.classList.add("show");

			figure.setAttribute('id', item._id);
			var img = item.images[i]
			var imgWidget = document.createElement("img");
			figure.appendChild(imgWidget);
			imgWidget.classList.add("img-thumbnail");
			imgWidget.classList.add("img-thumbnail-fix");
			imgWidget.file = img.name;
			imgWidget.src = img.data;
			imgWidget.setAttribute('id', img.name);
			//figure.appendChild(figcaption);
		}

		var spanPrev = document.createElement("span");
		slideshow.appendChild(spanPrev);
		spanPrev.classList.add("prev");
		spanPrev.setAttribute('id', item._id);
		spanPrev.textContent = '<';

		var spanNext = document.createElement("span");
		slideshow.appendChild(spanNext);
		spanNext.classList.add("next");
		spanNext.setAttribute('id', item._id);
		spanNext.textContent = '>';

		var counter = 0;
		var figures = $( slideshow ).find('figure');
		var numOfFigures = figures.length

		var showCurrent = function(){
			var itemToShow = Math.abs(counter%numOfFigures);
		 
			[].forEach.call( figures, function(el){
				el.classList.remove('show');
				}
			);
		 	logger.log(this.name, 'going to show image ' + itemToShow);
			figures[itemToShow].classList.add('show');
		};
		

		var spanN = $( slideshow ).find('.next','#' + item._id)[0];

		$( spanN ).on('click', function() {
			counter++;
			showCurrent();
			});
		
		var spanP = $( slideshow ).find('.prev','#' + item._id)[0];

		$( spanP ).on('click',function() {
			counter--;
			showCurrent();
			});
		logger.leave(this.name, 'createItemWidget');
	};

	

	return { module: module };

}());


/*


		<div class="col-sm-12 col-md-6">
		<div class="thumbnail thumbnail-fix-2">

				<div class="diy-slideshow">

					<figure class="show">
						<img src="img/2.jpg" class="img-thumbnail img-thumbnail-fix" /> 
						
					</figure>
					<figure>
						<img src="img/3.jpg" class="img-thumbnail img-thumbnail-fix" /> 
						<figcaption>Image caption goes here.</figcaption>
					</figure>
					<span class="prev"><</span>
					<span class="next">></span>
				
				</div>


  			</div>
  		</div>	
		<div class="col-sm-12 col-md-6">


			<form class="form-horizontal">
				  <div class="form-group"> 
				    <label for="inputName" class="col-sm-2 control-label">name</label> 
				    <div class="col-sm-10"> 
				      <input type="text" class="form-control" id="inputName" placeholder="part name"> 
				    </div> 
				  </div> 
				  <div class="form-group"> 
				    <label class="col-sm-2 control-label" for="inputAmount">&euro;</label> 
				    <div class="col-sm-4"> 
				    	<input type="text" class="form-control" id="inputAmount" placeholder="amount"> 
				    </div> 
				    <div class="col-sm-offset-6"></div> 
				  </div> 
				<div class="form-group"> 
	    			<label for="inputNotes" class="col-sm-2 control-label">notes</label> 
	    			<div class="col-sm-10"> 
			      		<textarea class="form-control" id="inputNotes" placeholder="...part notes..." rows="4"></textarea> 
			    	</div> 
		  		</div> 
				 
				<div class="form-group"> 
					<div class="col-sm-offset-4 col-sm-4 col-sm-offset-4"> 
		    			<input type="file" id="file" accept="image/*" class="form-control" multiple="true"/> 
				    </div> 
				</div> 
				<div class="form-group"> 
				    <div class="col-sm-offset-8 col-sm-2"> 
				      <button type="submit" class="btn btn-default pull-right" id="remove">Remove</button> 
				    </div> 
				    <div class="col-sm-2"> 
				      <button type="submit" class="btn btn-default pull-right" id="submit">Submit</button> 
				    </div> 
				</div> 
				</form>


			
		</div>

*/


/*
	<div class="col-sm-6 col-md-4">
			<div class="thumbnail thumbnail-browse-fix">

				<div class="diy-slideshow">

					<figure class="show">
						<img src="img/2.jpg" class='img-thumbnail img-thumbnail-fix'/> 
						<figcaption>
							<div class="pull-left">
								<a href="item.html">
	  								<h4>Thumbnail label</h4>
	  							</a>
	  						</div>
		  					<div class="pull-right">
		  						<h5>&euro; 1234</h5>
		  					</div>

		  					<div class="pull-left">
			  					<p>
						        ..ssadadadsa  dsadsad sadsadsadadasdadddd dddddddd dddddddd ddddddddasda dddddddddddddddddsadsada  sad sadddd ddddddddddddddd asdsa dsaddas mansdmd masnd,msa masd ,....
						        </p>
					        </div>
						</figcaption>
					</figure>
					<figure>
						<img src="img/3.jpg" class='img-thumbnail'/> 
						<figcaption>Image caption goes here.</figcaption>
					</figure>
					<span class="prev"><</span>
					<span class="next">></span>
				
				</div>


  			</div>
		</div>
*/