/*
	The Cedric's Swiss Knife (CSK) - Nomi no Jutsu

	Copyright (c) 2015 - 2016 Cédric Ronvel 
	
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

"use strict" ;



// Load modules
var kungFig = require( './KungFigExt.js' ) ;
var math = require( 'math-kit' ) ;
var string = require( 'string-kit' ) ;



function NinjaStyle() { throw new Error( '[NinjaStyle] Use NinjaStyle.create() instead.' ) ; }
module.exports = NinjaStyle ;



NinjaStyle.create = function create( options )
{
	var ninjaStyle = Object.create( NinjaStyle.prototype , {
		jutsuList: { value: [] , enumerable: true } ,
		rng: { value: new math.random.MersenneTwister() } ,
	} ) ;
	
	ninjaStyle.rng.betterInit() ;

	return ninjaStyle ;
} ;



/*
	learnJutsu( jutsuName , [opacity] )
		- jutsuName `string` the name of the jutsu to apply
*/
NinjaStyle.prototype.learnJutsu = function learnJutsu( jutsuName )
{
	var jutsu = kungFig.load( __dirname + '/../data/jutsu/' + jutsuName + '.kfg' ) ;
	this.jutsuList.push( jutsu ) ;
} ;



NinjaStyle.prototype.performJutsu = function performJutsu( input )
{
	var i , iMax , j , jMax , c , output = '' ;
	
	input = input.toLowerCase( input ) ;
	
	// unaccent
	input = string.latinize( input ) ;
	
	for ( i = 0 , iMax = input.length ; i < iMax ; i ++ )
	{
		c = input[ i ] ;
		
		for ( j = 0 , jMax = this.jutsuList.length ; j < jMax ; j ++ )
		{
			if ( Array.isArray( this.jutsuList[ j ].replace[ c ] ) )
			{
				c = this.rng.randomElement( this.jutsuList[ j ].replace[ c ] ) ;
				break ;
			}
		}
		
		output += c ;
		
		if ( this.jutsuList[ 0 ].letterSpacing ) { output += this.jutsuList[ 0 ].letterSpacing ; }
	}
	
	return output ;
} ;



