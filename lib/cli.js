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



// Load modules
var Generator = require( './Generator.js' ) ;
var minimist = require( 'minimist' ) ;
var kungFig = require( 'kung-fig' ) ;
var tree = require( 'tree-kit' ) ;



function cli()
{
	var nomi , configPath , config , count , port ,
		args = minimist( process.argv.slice( 2 ) ) ;
	
	if ( ! args._.length )
	{
		console.log( 'Usage is ./nomi <config-file-path> [count] [--order <value>]' ) ;
		process.exit() ;
	}
	
	configPath = args._[ 0 ] ;
	count = args._[ 1 ] || 1 ;
	delete args._ ;
	
	config = kungFig.load( configPath ) ;
	tree.extend( { deep: true } , config , args ) ;
	
	//console.log( config ) ;
	
	nomi = Generator.create( config ) ;
	nomi.addSamples( config.samples ) ;
	
	while ( count > 0 )
	{
		console.log( nomi.generate() ) ;
		count -- ;
	}
}

module.exports = cli ;


