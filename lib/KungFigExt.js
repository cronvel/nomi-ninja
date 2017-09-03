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



// Load modules
var kungFig = require( 'kung-fig' ) ;
var tree = require( 'tree-kit' ) ;



module.exports = kungFig.extendOperators( {
	merge: {
		priority: -20 ,
		stack: function( source , target , key , baseKey ) {
			target[ key ] = source[ key ] ;
			
			/*
			if ( ! Array.isArray( target[ key ] ) ) { target[ key ] = [] ; }
			if ( ! Array.isArray( source[ key ] ) ) { source[ key ] = [  source[ key ]  ] ; }
			target[ key ] = target[ key ].concat( source[ key ] ) ;
			*/
		} ,
		reduce: function( target , key , baseKey ) {
			var k , source = target[ key ] ;
			
			this.reduce( source ) ;
			
			for ( k in source.replace )
			{
				if ( ! target.replace[ k ] ) { target.replace[ k ] = source.replace[ k ] ; }
				else { target.replace[ k ] = target.replace[ k ].concat( source.replace[ k ] ) ; }
			}
			
			delete target[ key ] ;
		}
	}
} ) ;

