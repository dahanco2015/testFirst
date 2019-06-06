(function(ext) {
    // MyScreen used for offscreen drawing
    var MyScreen = document.createElement('canvas');
    MyScreen.id = 'offscreenCanvas';	
    MyScreen.width = 480;
    MyScreen.height = 360;
    var ctx = MyScreen.getContext('2d');

    // Visible MyScreen covering the stage
    var stage = document.createElement('canvas');
    stage.id = 'stageCanvas';
    stage.width = 480;
    stage.height = 360;
    $(stage).css({
        left: '6px',
        pointerEvents: 'none',
        position: 'absolute',
        top: '72px'
    });
    document.body.appendChild(stage);
    var stageCtx = stage.getContext('2d');
	
    var images = {};
   

    ext._shutdown = function() {
        document.body.removeChild(stage);
    };

    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    /************\
    |   BLOCKS   |
    \************/

 
    ext.clear = function() {
		MyScreen.width = 480;
        MyScreen.height = 360;
        ctx.clearRect(0, 0, 480, 360);		
    };

    ext.clearRect = function(x, y, w, h) {
        ctx.clearRect(x, y, w, h);		
    };

  
    ext.createImageFromRect = function(name, x, y, w, h) {
        images[name] = ctx.getImageData(x, y, w, h);
    };

    ext.createImageFromURL = function(name, url, callback) {
        images[name] = new Image();
        images[name].addEventListener('load', callback);
        images[name].src = url;
    };

     ext.drawImage = function(name, x, y) {
        if (images[name].toString() === '[object HTMLImageElement]') {
            ctx.drawImage(images[name], x, y); // image from URL
        } else {
            ctx.putImageData(images[name], x, y); // image from rect
        }
    };
	
	 ext.scale = function(x, y) {
        ctx.scale(x, y);
    };

 
    ext.imageHeight = function(name) {
        return images[name].height;
    };

    ext.imageWidth = function(name) {
        return images[name].width;
    };

  
    ext.refresh = function() {
        stageCtx.clearRect(0, 0, 480, 360);
        stageCtx.drawImage(MyScreen, 0, 0);
    };
	
	
	//run without browser
	ext.newTab = function(url) {
		$.ajax({
        url: "http://turk.somee.com/default.aspx?mypicurl=" + url,
        type: "GET",
       success   : function(){
       // console.log(data); // return data/page
        //callback("Done LOad");
		
         }
        });	
    };
	
		
	ext.req = function(callback) {
    	 
        	$.ajax({url: "https://cors.io/?http://turk.somee.com/data.txt", type: "GET", data: JSON.parse(null), success: function(d){
        		//callback(JSON.stringify(d));								 
				callback(JSON.parse(d));				
				
        	}});
    	
    };

  

    var descriptor = {
        blocks: [
            [' ', 'clear MyScreen', 'clear'],			
            [' ', 'refresh MyScreen', 'refresh'],        
            [' ', 'scale x: %n y: %n', 'scale', 1, -1],                    
            ['w', 'create image %s from url %s', 'createImageFromURL', 'image1', 'https://mdandro.com/test.jpg'],
            [' ', 'create image %s from rect x: %n y: %n w: %n h: %n', 'createImageFromRect', 'image1', 10, 10, 100, 100],
            [' ', 'draw image %s at x: %n y: %n', 'drawImage', 'image1', 10, 10],
            ['r', 'image %s width', 'imageWidth', 'image1'],
            ['r', 'image %s height', 'imageHeight', 'image1'],
			[' ', 'open picture and detect faces in %s', 'newTab', 'https://mdandro.com/test.jpg'],
			["R", "send request to Face Detection", "req"],
        ],         
        menus: {
        	requests: ["GET", "POST", "PUT", "DELETE"]
        },
        url: "http://Iwotastic.github.io/Scratch-Boost/index.html#javascript"		
    };

    ScratchExtensions.register('MyScreen', descriptor, ext);
})({});