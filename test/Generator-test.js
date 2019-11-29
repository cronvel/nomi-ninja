/*
	Nomi Ninja

	Copyright (c) 2015 - 2019 Cédric Ronvel

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

/* global describe, it, before, after */



const string = require( 'string-kit' ) ;
const Generator = require( '..' ).Generator ;



function deb( v ) {
	console.log( string.inspect( { depth: Infinity , style: 'color' } , v ) ) ;
}



describe( "Graph creation" , () => {
	
	it( "Markov order 1" , () => {
		var nomi = Generator.create( { order: 1 } ) ;
		
		nomi.addSamples( [
			'abc' , 'aei' , 'xyz'
		] ) ;
		
		//console.log( nomi.graph ) ;
		
		expect( nomi.graph ).to.equal( {
			'': { sum: 3, next: { a: 2, x: 1 } },
			a: { sum: 2, next: { b: 1, e: 1 } },
			b: { sum: 1, next: { c: 1 } },
			c: { sum: 1, next: { '': 1 } },
			e: { sum: 1, next: { i: 1 } },
			i: { sum: 1, next: { '': 1 } },
			x: { sum: 1, next: { y: 1 } },
			y: { sum: 1, next: { z: 1 } },
			z: { sum: 1, next: { '': 1 } }
		} ) ;
	} ) ;
	
	it( "Markov order 2" , () => {
		var nomi = Generator.create( { order: 2 } ) ;
		
		nomi.addSamples( [
			'abc' , 'aei' , 'xyz'
		] ) ;
		
		//console.log( string.inspect( { depth: 4 , style: 'color' } , nomi.graph ) ) ;
		
		var expected = {
			'': {
				'': { sum: 3, next: { a: 2, x: 1 } }
			},
			a: {
				'': { sum: 2, next: { b: 1, e: 1 } }
			},
			b: {
				a: { sum: 1, next: { c: 1 } }
			},
			c: {
				b: { sum: 1, next: { '': 1 } }
			},
			e: {
				a: { sum: 1, next: { i: 1 } }
			},
			i: {
				e: { sum: 1, next: { '': 1 } }
			},
			x: {
				'': { sum: 1, next: { y: 1 } }
			},
			y: {
				x: { sum: 1, next: { z: 1 } }
			},
			z: {
				y: { sum: 1, next: { '': 1 } }
			}
		} ;
		
		expect( nomi.graph ).to.eql( expected ) ;
	} ) ;
	
	it( "Atoms" , () => {
		var nomi , expected ;
		
		nomi = Generator.create( { order: 1 , atomList: [ 'th' ] } ) ;
		
		nomi.addSamples( [
			'the' , 'that' , 'both' , 'what' , 'whether'
		] ) ;
		
		//console.log( nomi.graph ) ;
		
		expected = {
			'': { sum: 5, next: { th: 2, b: 1, w: 2 } },
			th: { sum: 4, next: { e: 2, a: 1, '': 1 } },
			e: { sum: 3, next: { '': 1, th: 1, r: 1 } },
			a: { sum: 2, next: { t: 2 } },
			t: { sum: 2, next: { '': 2 } },
			b: { sum: 1, next: { o: 1 } },
			o: { sum: 1, next: { th: 1 } },
			w: { sum: 2, next: { h: 2 } },
			h: { sum: 2, next: { a: 1, e: 1 } },
			r: { sum: 1, next: { '': 1 } }
		} ;
		
		expect( nomi.graph ).to.eql( expected ) ;
		
		
		nomi = Generator.create( { order: 1 , atomList: [ 'th' , 'wh' ] } ) ;
		
		nomi.addSamples( [
			'the' , 'that' , 'both' , 'what' , 'whether'
		] ) ;
		
		//console.log( nomi.graph ) ;
		
		expected = {
			'': { sum: 5, next: { th: 2, b: 1, wh: 2 } },
			th: { sum: 4, next: { e: 2, a: 1, '': 1 } },
			e: { sum: 3, next: { '': 1, th: 1, r: 1 } },
			a: { sum: 2, next: { t: 2 } },
			t: { sum: 2, next: { '': 2 } },
			b: { sum: 1, next: { o: 1 } },
			o: { sum: 1, next: { th: 1 } },
			wh: { sum: 2, next: { a: 1, e: 1 } },
			r: { sum: 1, next: { '': 1 } }
		} ;
		
		expect( nomi.graph ).to.eql( expected ) ;
	} ) ;
} ) ;



describe( ".generate()" , () => {
	
	it( "Markov order 2" , () => {
		var i , max = 1000 , name , names = {} ;
		
		var nomi = Generator.create( { order: 2 } ) ;
		
		nomi.addSamples( [
			'sally' , 'sells' , 'seashells' , 'seashore'
		] ) ;
		
		var expected = [
			'sally' , 'sells' , 'seashells' , 'seashore' ,
			'salls' , 'selly' , 'seashelly'
		] ;
		
		for ( i = 0 ; i < max ; i ++ )
		{
			name = nomi.generate() ;
			
			// expect.js is really slow, so we call it only on when it fails
			if ( expected.indexOf( name ) < 0 ) { expect().fail() ; }
			
			if ( names[ name ] ) { names[ name ] ++ ; }
			else { names[ name ] = 1 ; }
		}
		
		//console.log( names ) ;
		//console.log( 'diff: ' , names.seashore - ( names.seashells + names.seashelly ) ) ;
	} ) ;
} ) ;

