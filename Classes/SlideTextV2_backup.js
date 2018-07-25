//Javascript class: SlideText

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

// SlideText.slideAppear = function( slideID, strSlide, displayID ) {
//     //VAR: strSlide = the string to display in the display area "displayID"
//     //METHOD: makes a slide appear using slide animation
//     //get window dimensions
//     var docWidth = $( window ).width();
//     var docHeight = $( window ).height();

//     //set the font-size
//     var percentFont = 0.05;
//     var textSize = docHeight * percentFont;       //global variable that sets the font-size

//     //create text that will be displayed
//     var dispSent = "<span id='newSlide' style='position:relative; font:"+ textSize +"px Rockwell, Georgia, serif;'> " + slideID + ": " + strSlide + "</span>";
//     //add the displayed text to the larger display area
//     $( "#" + displayID ).html( dispSent );

//     //get dimensions for display area
//     var outerHeight = $( "#newSlide" ).outerHeight(); 
//     var outerWidth = $( "#newSlide" ).outerWidth(); 

//     //get the middle point of the height & width
//     var midH = ( parseInt( $( "#" + displayID ).css("height") ) - outerHeight ) / 2;
//     var midW = ( parseInt( $( "#" + displayID ).css("width") ) - outerWidth ) / 2;
    
//     //position the string sentence
//     $( "#newSlide" ).css( {"top" : midH + SlideText.offsetY, "left" : midW, "opacity" : "0"} );

//     $( "#newSlide" ).animate( {
//             top: "-=" + SlideText.offsetY,
//             opacity: "1"
//         }, SlideText.effectDelay );

//     //Code for displaying & removing slide
//     //     $( "#newSlide" ).animate( {
//     //         top: "-=" + SlideText.offsetY,
//     //         opacity: "1"
//     //     }, "slow" ).delay( inputSpeed ).animate( {
//     //         top: "-=" + SlideText.offsetY,
//     //         opacity: "0"
//     //     }, "slow", function() {
//     //         thisObj.moveDirection();
//     //         thisObj.slideController();
//     //     });
// }

// SlideText.slideAppearV2 = function( keyID, objJSON, displayID ) {
//     //VAR: strSlide = the string to display in the display area "displayID"
//     //METHOD: makes a slide appear using slide animation
//     //get window dimensions
//     var docWidth = $( window ).width();
//     var docHeight = $( window ).height();

//     //get dimensions for display area
//     var outerHeight = $( "#newSlide" ).outerHeight(); 
//     var outerWidth = $( "#newSlide" ).outerWidth(); 

//     //get the middle point of the height & width
//     var midH = ( parseInt($( "#" + displayID ).css("height") ) - outerHeight ) / 2;
//     var midW = ( parseInt($( "#" + displayID ).css("width") ) - outerWidth ) / 2;

//     //set the font-size
//     var percentFont = 0.05;
//     var textSize = docHeight * percentFont;       //global variable that sets the font-size

//     //create text that will be displayed
//     var dispSent = "<span id='newSlide' style='position:relative; font:"+ textSize +"px Rockwell, Georgia, serif;'> " + keyID + ": " + objJSON[keyID]['Q'] + "</span><br/>";
//     dispSent += "<button onclick = 'SlideText.slideHorizontal( " + objJSON[keyID]['A'] + " )'> Answer </button>";
//     //add the displayed text to the larger display area
//     $( "#" + displayID ).html( dispSent );
    
//     //position the string sentence
//     $( "#newSlide" ).css( {"top" : midH + SlideText.offsetY, "left" : midW, "opacity" : "0"} );

//     $( "#newSlide" ).animate( {
//             top: "-=" + SlideText.offsetY,
//             opacity: "1"
//         }, SlideText.effectDelay );

//     //Code for displaying & removing slide
//     //     $( "#newSlide" ).animate( {
//     //         top: "-=" + SlideText.offsetY,
//     //         opacity: "1"
//     //     }, "slow" ).delay( inputSpeed ).animate( {
//     //         top: "-=" + SlideText.offsetY,
//     //         opacity: "0"
//     //     }, "slow", function() {
//     //         thisObj.moveDirection();
//     //         thisObj.slideController();
//     //     });
// }

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

    //FUNCTIONS: organize keys
    organizeKeys: function( order ) {
        //VAR: order = integer that will arrange the order of the keys. 1 = sort from least to greatest, 2 = sort from greatest to least, 3 = shuffle order of keys
        //METHOD: arrange the order of the keys to be displayed.
        if ( order == 1 )       //order from least to greatest
            this.keys = this.keys.sort( function(a, b) { return a - b; } );
        else if ( order == 2 )       //order from least to greatest
            this.keys = this.keys.sort( function(a, b) { return b - a; } );
        else if ( order == 3 )
            this.keys.shuffle();
    },

    displayQues: function() {
        //METHOD: displays the question in this.objJSON in the slideshow area

        //set the font-size
        var docHeight = $( window ).height();
        var percentFont = 0.05;
        var textSize = docHeight * percentFont;       //global variable that sets the font-size
        var textSizeButton = docHeight * ( percentFont / 3 );

        //create text that will be displayed
        var keyID = this.keys[ this.tracker ];
        var dispSent = "<span id = 'newSlide' style = 'position:relative; font:"+ textSize +"px Rockwell, Georgia, serif;'> " + keyID + ": " + this.objJSON[keyID]['Q'] + "<br/>";
        dispSent += "<span id = 'rejoinder' class = 'answerButton' style = 'font:" + textSizeButton + "px Rockwell, Georgia, serif;''> Answer </span>";
        dispSent += "</span>";
        //add the displayed text to the larger display area
        $( '#' + this.displayID ).html( dispSent );

        //AMAZING!!! I'M A GENIUS - This is how you can call a instance method & pass the 'this' object
        var that = this;        //need to save the current 'this' to be able to pass to the function
        $( '#rejoinder' ).click( function() { SlideText.prototype.displayAns.call( that ); } );        //if do not do use 'that', then 'this' will refer to '#getAns'

        //display string
        SlideText.slideVertical( 1, this.displayID );
    },

    displayAns: function() {
        //METHOD: displays the answer in this.objJSON in the slideshow area
        //set the font-size
        var docHeight = $( window ).height();
        var percentFont = 0.05;
        var textSize = docHeight * percentFont;       //global variable that sets the font-size
        var textSizeButton = docHeight * ( percentFont / 3 );

        //create text that will be displayed
        var keyID = this.keys[ this.tracker ];
        var dispSent = "<span id = 'newSlide' style = 'position:relative; font:"+ textSize +"px Rockwell, Georgia, serif;color: #6699cc;'> " + keyID + ": " + this.objJSON[keyID]['A'] + "<br/>";
        dispSent += "<span id = 'rejoinder' class = 'questionButton' style = 'font:" + textSizeButton + "px Rockwell, Georgia, serif;''> Question </span>";
        dispSent += "</span>";
        //add the displayed text to the larger display area
        $( "#" + this.displayID ).html( dispSent );

        //AMAZING!!! I'M A GENIUS - This is how you can call a instance method & pass the 'this' object
        var that = this;        //need to save the current 'this' to be able to pass to the function
        $( '#rejoinder' ).click( function() { SlideText.prototype.displayQues.call( that ); } );        //if do not do use 'that', then 'this' will refer to '#getAns'

        //display string
        SlideText.slideHorizontal( 1, this.displayID );
    },

    //I SHOULD FINISH THIS.... - PERHAPS CAN REPLACE 'displayQues' & 'displayAns'
    // displayQA: function( typeQA ) {
    //     //VAR: typeQA = string that if 'q', means it is in question mode, else if 'a', then in 'answer mode'
    //     //METHOD: displays the answer in this.objJSON in the slideshow area
    //     //set the font-size
    //     var docHeight = $( window ).height();
    //     var percentFont = 0.05;
    //     var textSize = docHeight * percentFont;       //global variable that sets the font-size
    //     var textSizeButton = docHeight * ( percentFont / 3 );

    //     if ( typeQA.toLowerCase() == 'q' ) {
    //         var strSlide = this.objJSON[keyID]['Q'];
    //         var strButton = 'Answer';
    //     }
    //     else {
    //         var strSlide = this.objJSON[keyID]['A'];
    //         var strButton = 'Question';
    //     }

    //     //create text that will be displayed
    //     var keyID = this.keys[ this.tracker ];
    //     var dispSent = "<span id = 'newSlide' style = 'position:relative; font:"+ textSize +"px Rockwell, Georgia, serif;'> " + keyID + ": " + strSlide + "<br/>";
    //     dispSent += "<span id = 'rejoinder' class = 'answerButton' style = 'font:" + textSizeButton + "px Rockwell, Georgia, serif;''> " + strButton + " </span>";
    //     dispSent += "</span>";
    //     //add the displayed text to the larger display area
    //     $( '#' + this.displayID ).html( dispSent );

    //     //AMAZING!!! I'M A GENIUS - This is how you can call a instance method & pass the 'this' object
    //     var that = this;        //need to save the current 'this' to be able to pass to the function
    //     if ( typeQA.toLowerCase() == 'q' ) {        //if in 'question' mode
    //         $( '#rejoinder' ).click( function() { SlideText.prototype.displayAns.call( that ); } );        //if do not do use 'that', then 'this' will refer to '#getAns'

    //         //display string
    //         SlideText.slideVertical( this.displayID );
    //     }
    //     else {      //if in 'answer' mode
    //         $( '#rejoinder' ).click( function() { SlideText.prototype.displayQues.call( that ); } );        //if do not do use 'that', then 'this' will refer to '#getAns'

    //         //display string
    //         SlideText.slideHorizontal( this.displayID );
    //     }
    // },

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

        //if element id = newSlide exists, then make it disappear
        SlideText.disappearVertical();

        //display slide
        // SlideText.slideAppear( this.keys[ this.tracker ], this.displayID );

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

        //TEST::
        console.log( "slideForward = ", this.tracker, " & ", this.keys, " & len = ", this.keys.length );

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
