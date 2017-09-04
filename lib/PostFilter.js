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

"use strict" ;



// Load modules
var kungFig = require( './kungFigExt.js' ) ;
var math = require( 'math-kit' ) ;
var string = require( 'string-kit' ) ;



function PostFilter() { throw new Error( '[PostFilter] Use PostFilter.create() instead.' ) ; }
module.exports = PostFilter ;



/*
	PostFilter.create( [options] )
	
	* options `object` where:
		* rng `object` (optional) a math-kit's random object to use, instead of creating a brand new one
*/
PostFilter.create = function create( options )
{
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	var self = Object.create( PostFilter.prototype , {
		filterList: { value: [] , enumerable: true } ,
		rng: { value: null , enumerable: true , writable: true }
	} ) ;
	
	if ( options.rng )
    {
        self.rng = options.rng ;
    }
    else
    {
        self.rng = new math.random.MersenneTwister() ;
        self.rng.betterInit() ;
    }

	return self ;
} ;



/*
	addFilter( filterName )
	* filterName `string` the name of the filter to apply
*/
PostFilter.prototype.addFilter =function addFilter( filterName )
{
	var filter = kungFig.load( __dirname + '/../data/filters/' + filterName + '.kfg' ) ;
	this.filterList.push( filter ) ;
} ;



PostFilter.prototype.filter = function filter( input )
{
	var i , iMax , j , jMax , c , output = '' ;
	
	input = input.toLowerCase( input ) ;
	
	// unaccent
	input = string.latinize( input ) ;
	
	for ( i = 0 , iMax = input.length ; i < iMax ; i ++ )
	{
		c = input[ i ] ;
		
		for ( j = 0 , jMax = this.filterList.length ; j < jMax ; j ++ )
		{
			if ( Array.isArray( this.filterList[ j ].replace[ c ] ) )
			{
				c = this.rng.randomElement( this.filterList[ j ].replace[ c ] ) ;
				break ;
			}
		}
		
		output += c ;
		
		if ( this.filterList[ 0 ].letterSpacing ) { output += this.filterList[ 0 ].letterSpacing ; }
	}
	
	return output ;
} ;


