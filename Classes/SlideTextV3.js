//Javascript class: SlideTextV3

/*
Requirements for use:
    -need a text field to input the time to transition between slides
    -need an area to display text
*/


function SlideText( objJSON, displayID, timerID ) {
    //VAR: objJSON = object that is retrieve from JSON text (using JSON.parse command)
    //VAR: displayID = string that is the ID where the text will be displayed
    //VAR: timerID = string that is the ID for an input field that will contain the seconds between transitions
    //CONSTRUCTOR: this is the constructor for the class SlideText
    this.direction = 1;     //this is the direction the text will be displayed - forward, backward, pause

    this.tracker = 0;       //this tracks the current slide     
    this.objJSON = objJSON;
    this.keys = SlideText.formatKeys( Object.keys(objJSON) );

    this.displayID = displayID;
    this.timerID = timerID;
    this.intervalTimer;     //this is the interval timer for changing slides

    //class variables
    SlideText.boolPause = false;
    SlideText.offsetY = 50;       //used for the offset for letting text fade in & fade out
    SlideText.offsetX = 50;       //used for the offset for letting text fade in & fade out
    SlideText.effectDelay = 600;
}

//FUNCTIONS: manipulating keys from JSON object
SlideText.formatKeys = function( arrKeys ) {
    //METHOD: format the keys by converting them to integers & sort it from least to greatest
    arrKeys = arrKeys.map( function(x) { return parseInt(x); } );
    // arrKeys = arrKeys.sort( function(a, b) { return a - b; } );
    return arrKeys;
}

//FUNCTIONS: sliding animation
//class variables
SlideText.disappearVertical = function() {
    //if the slide exists, then make it disappear
    if ( $( "#newSlide" ).length ) 
        $( "#newSlide" ).animate( {
            top: "-=" + SlideText.offsetY,
            opacity: "0"
        }, SlideText.effectDelay );
}

SlideText.disappearHorizontal = function() {
    //if the slide exists, then make it disappear
    if ( $( "#newSlide" ).length ) 
        $( "#newSlide" ).animate( {
            top: "-=" + SlideText.offsetX,
            opacity: "0"
        }, SlideText.effectDelay );
}


SlideText.slideVertical = function( type, displayID ) {
    //METHOD: slide an object vertical

    //get window dimensions
    var docWidth = $( window ).width();
    var docHeight = $( window ).height();

    //get dimensions for display area
    var outerHeight = $( "#newSlide" ).outerHeight(); 
    var outerWidth = $( "#newSlide" ).outerWidth(); 

    //get the middle point of the height & width
    var midH = ( parseInt( $( "#" + displayID ).css("height") ) - outerHeight ) / 2;
    var midW = ( parseInt( $( "#" + displayID ).css("width") ) - outerWidth ) / 2;
    
    //position the string sentence
    $( "#newSlide" ).css( {"top" : midH + ( SlideText.offsetY * type ), "left" : midW, "opacity" : "0"} );

    $( "#newSlide" ).animate( {
            top: "-=" + ( SlideText.offsetY * type ),
            opacity: "1"
        }, SlideText.effectDelay );
}

SlideText.slideHorizontal = function( type, displayID ) {
    //METHOD: slide an object vertical

    //get window dimensions
    var docWidth = $( window ).width();
    var docHeight = $( window ).height();

    //get dimensions for display area
    var outerHeight = $( "#newSlide" ).outerHeight(); 
    var outerWidth = $( "#newSlide" ).outerWidth(); 

    //get the middle point of the height & width
    var midH = ( parseInt( $( "#" + displayID ).css("height") ) - outerHeight ) / 2;
    var midW = ( parseInt( $( "#" + displayID ).css("width") ) - outerWidth ) / 2;
    
    //position the string sentence
    $( "#newSlide" ).css( {"top" : midH, "left" : midW + ( SlideText.offsetX * type ), "opacity" : "0"} );

    $( "#newSlide" ).animate( {
            left: "-=" + ( SlideText.offsetX * type ),
            opacity: "1"
        }, SlideText.effectDelay );
}

SlideText.chooseAppear = function( type, displayID ) {
    type = parseInt( type );

    switch( type ) {
        case 1:
            SlideText.slideVertical( 1, displayID );
            break;
        case -1:
            SlideText.slideVertical( -1, displayID );
            break;
        case 2:
            SlideText.slideHorizontal( 1, displayID );
            break;
        case -2: 
            SlideText.slideHorizontal( -1, displayID );
            break;
    }
}

SlideText.prototype = {
    constructor: SlideText,

    /* FUNCTIONS: organize keys */
    resetTracker: function() {
        this.tracker = 0;
    },

    organizeKeys: function( order ) {
        //VAR: order = integer that will arrange the order of the keys. 1 = sort from least to greatest, 2 = sort from greatest to least, 3 = shuffle order of keys
        //METHOD: arrange the order of the keys to be displayed.
        if ( order == 1 )       //order from least to greatest
            this.keys = this.keys.sort( function(a, b) { return a - b; } );
        else if ( order == 2 )       //order from least to greatest
            this.keys = this.keys.sort( function(a, b) { return b - a; } );
        else if ( order == 3 )      //shuffle the order
            this.keys.shuffle();
    },

    setSpecificKeys: function( strKeys ) {
        //VAR: strKeys = string in the format "a,b,c,d,e,f,g" (e.g. 12,34,5,6,22)
        //VAR: listKeys = array of integers that are the keys 
        //METHOD: saves the set of keys

        //if string is has elements, then split string into an array, convert all elements into integers, & save to this.keys
        if ( /\S/.test(strKeys) ) {
            var delim = ',';
            this.keys = strKeys.split( delim ).map( function(x) { return parseInt(x); });
        }
        else    //else if string is empty, then reset set of indices that keep track of slides
            this.keys = SlideText.formatKeys( Object.keys(this.objJSON) );

        //sort keys from least to greatest
        this.organizeKeys(1);
        //reset tracker (the element that traverses the keys) for new keys
        this.resetTracker();
    },

    getQues: function() {
        //METHOD: retrieves the question in this.objJSON in the slideshow area

        //set the font-size
        var docHeight = $( window ).height();
        var percentFont = 0.05;
        var textSize = docHeight * percentFont;       //global variable that sets the font-size
        var textSizeButton = docHeight * ( percentFont / 3 );

        //create text that will be displayed
        var keyID = this.keys[ this.tracker ];
        var dispSent = "<span id = 'newSlide' style = 'position:relative; font:"+ textSize +"px Rockwell, Georgia, serif;'> " + keyID + ": " + this.objJSON[keyID]['Q'] + "<br/>";
        dispSent += "<button id = 'rejoinder' class = 'answerButton' slideAns = 'no' style = 'font:" + textSizeButton + "px Rockwell, Georgia, serif;''> Answer </button>";
        dispSent += "</span>";
        //add the displayed text to the larger display area
        $( '#' + this.displayID ).html( dispSent );

        //AMAZING!!! I'M A GENIUS - This is how you can call a instance method & pass the 'this' object
        var that = this;        //need to save the current 'this' to be able to pass to the function
        $( '#rejoinder' ).click( function() { SlideText.prototype.displayAns.call( that ); } );        //if do not do use 'that', then 'this' will refer to '#getAns'
    },

    getAns: function() {
        //METHOD: retrieves the answer in this.objJSON in the slideshow area
        //set the font-size
        var docHeight = $( window ).height();
        var percentFont = 0.05;
        var textSize = docHeight * percentFont;       //global variable that sets the font-size
        var textSizeButton = docHeight * ( percentFont / 3 );

        //create text that will be displayed
        var keyID = this.keys[ this.tracker ];

        var dispSent = "<span id = 'newSlide' style = 'position:relative; font:" + textSize + "px Rockwell, Georgia, serif;color: #6699cc;'> " + keyID + ": " + this.objJSON[keyID]['A'] + "<br/>";
        //check if key 'Source' is present object
        if ( 'Source' in this.objJSON[keyID] )
            dispSent += "<span id = 'newSlide' style = 'position:relative; font:9px Rockwell, Georgia, serif;color: #6699cc;'> " + keyID + ": " + this.objJSON[keyID]['Source'] + "<br/>";
        dispSent += "<button id = 'rejoinder' class = 'questionButton' style = 'font:" + textSizeButton + "px Rockwell, Georgia, serif;'> Question </button>";
        dispSent += "</span>";
        //add the displayed text to the larger display area
        $( "#" + this.displayID ).html( dispSent );

        //AMAZING!!! I'M A GENIUS - This is how you can call a instance method & pass the 'this' object
        var that = this;        //need to save the current 'this' to be able to pass to the function
        $( '#rejoinder' ).click( function() { SlideText.prototype.displayQues.call( that ); } );        //if do not do use 'that', then 'this' will refer to '#getAns'
    },

    displayQues: function() {
        //METHOD: displays question 
        //place question
        this.getQues();
        //use effect to slide in question
        SlideText.slideVertical( 1, this.displayID );
    },

    displayAns: function() {
        //place question
        this.getAns();
        //use effect to slide in question
        SlideText.slideHorizontal( 1, this.displayID );
    },

    //controller - change the direction of the controller
    setDirection: function( direction ) {
        this.direction = direction;
    },

    //move in desired direction
    moveDirection: function() {
        //decide the direction. 0 = pause, 1 = forward, 2 = backwards
        if ( this.direction == 0 )
            this.slidePause();
        else if ( this.direction == 1 )
            this.slideForward();
        else if ( this.direction == 2 )
            this.slideBackward();
    },

    //NOTE: SHOULD RENAME THIS FUNCTION
    slideController: function( direction ) {
        //METHOD: controls the flow of slides being presented

        //prepare display text by incrementing to next slide and then prepare to show the slide
        this.setDirection( direction );
        this.moveDirection();

        //if element id = newSlide exists, then make it disappear -> place the next slide -> display next slide
        SlideText.disappearVertical();
        
        //IMPORTANT: this is important because this shows how to refer to 'this' object's instance method  
        var that = this;        //need a reference to the object 'this', else in setTimeout 'this' will refer to the global object (i.e. window class)
        setTimeout( function() { that.displayQues() }, SlideText.effectDelay );        //also need to use 'function(){}' when calling 'that', else doesn't pass the correct 'this'
    },


    //FUNCTIONS: controls for popping up the slides
    slidePlay: function() {
        //METHOD: 
        //retrieve time
        var slideRate = parseInt( $( "#" + this.timerID ).val() )
        if ( isNaN(slideRate) )     //if not a number, then set to default value of a default value
            slideRate = 3 * 1000;
        else
            slideRate *= 1000;

        //TEST::
        console.log( "slidePlay timer = ", slideRate );
        
        //set speed
        var t = this;
        clearInterval( this.intervalTimer );
        this.intervalTimer = setInterval( function() { t.slideController( 1 ); }, slideRate );
    },

    slidePause: function() {
        //METHOD: will pause on the current slide
        clearInterval( this.intervalTimer );
    },

    slideForward: function() {
        //METHOD: will play the slides forward
        this.tracker++;
        if ( this.tracker >= this.keys.length )
            this.tracker = 0;
    },

    slideBackward: function() {
        //METHOD: will play the slides backwards
        this.tracker--;
        if ( this.tracker < 0 )
            this.tracker = this.keys.length - 1;
    },
};


//Other Functions
Object.defineProperty( Array.prototype, 'shuffle', {
    value: function() {
        var currentIndex = this.length, temporaryValue, randomIndex;

        //while there are array elements to shuffle
        while ( 0 !== currentIndex ) {
            //generate a random number
            randomIndex = Math.floor( Math.random() * currentIndex );
            currentIndex -= 1;

            temporaryValue = this[currentIndex];
            this[currentIndex] = this[randomIndex];
            this[randomIndex] = temporaryValue;
        } 
    },
    enumerable: false,
    configurable: false,
    writable: false,
});

// function shuffleArray( array ) {
//     //METHOD: shuffles elements in an array so it is randomized
//     var currentIndex = array.length, temporaryValue, randomIndex;

//     //while there are array elements to shuffle
//     while ( 0 !== currentIndex ) {
//         //generate a random number
//         randomIndex = Math.floor( Math.random() * currentIndex );
//         currentIndex -= 1;

//         temporaryValue = array[currentIndex];
//         array[currentIndex] = array[randomIndex];
//         array[randomIndex] = temporaryValue;
//     }

//     return array;
// }


Object.defineProperty( Array.prototype, 'removeBlanks', {
    value: function() {
        return this.map( function(x) {
            if ( /\S/.test(x) )
                return x;
        } ).filter( function(x) { return x; } );
    },
    enumerable: false,
    configurable: false,
    writable: false,
});
