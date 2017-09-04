/*
	Nomi Ninja
	
	Copyright (c) 2015 - 2017 Cédric Ronvel
	
	The MIT License (MIT)
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

/* jshint unused:false */
/* global describe, it, before, after */



var string = require( 'string-kit' ) ;
var expect = require( 'expect.js' ) ;

//var Nomi = require( '../lib/Nomi.js' ) ;
var PostFilter = require( '../' ).PostFilter ;



function deb( v )
{
	console.log( string.inspect( { depth: Infinity , style: 'color' } , v ) ) ;
}



describe( "Post filters" , function() {
	
	it( "simple test" , function() {
		
		var ninjaStyle = PostFilter.create() ;
		
		//ninjaStyle.addFilter( 'genin' ) ;
		//ninjaStyle.addFilter( 'taijutsu' ) ;
		//ninjaStyle.addFilter( 'iaido-no-jutsu' ) ;
		//ninjaStyle.addFilter( 'monkey-style' ) ;
		//ninjaStyle.addFilter( 'suiton-no-jutsu' ) ;
		//ninjaStyle.addFilter( 'genjutsu' ) ;
		//ninjaStyle.addFilter( 'kinjutsu' ) ;
		//ninjaStyle.addFilter( 'kendo' ) ;
		//ninjaStyle.addFilter( 'drunken-master' ) ;
		ninjaStyle.addFilter( 'kuchiyose-no-jutsu' ) ;
		
		//console.log( ninjaStyle.jutsuList ) ;
		console.log( ninjaStyle.filter( 'Hellow world, this is the ancient art of ninja!' ) ) ;
		console.log( ninjaStyle.filter( 'éàùïÖ' ) ) ;
	} ) ;
} ) ;



