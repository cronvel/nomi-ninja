#!/usr/bin/env node
/*
	The Cedric's Swiss Knife (CSK) - Nomi no Jutsu

	Copyright (c) 2015 Cédric Ronvel 
	
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
var spp = require( 'smart-preprocessor' ) ;


var args = require( 'minimist' )( process.argv.slice( 2 ) ) ;


if ( args._.length < 1 )
{
	console.log( 'Usage is ./tests.js <markov order> [count]' ) ;
	process.exit() ;
}


var order = parseInt( args._[ 0 ] , 10 ) ;
var count = parseInt( args._[ 1 ] , 10 ) || 1 ;
delete args._ ;


var Nomi = spp.require( __dirname + '/../lib/Nomi.js' , args ) ;


var names =
	"ab,ac,bd" ;
//	"abcde,cdx,cdz,acd" ;


var nomi = Nomi.create( {
	order: order ,
	sourceSplitter: ','
} ) ;


nomi.addSamples( names ) ;


while ( count > 0 )
{
	console.log( nomi.generate() ) ;
	count -- ;
}


