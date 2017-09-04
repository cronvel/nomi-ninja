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
var tree = require( 'tree-kit' ) ;
var string = require( 'string-kit' ) ;
var math = require( 'math-kit' ) ;
var doormen = require( 'doormen' ) ;



function Generator() { throw new Error( '[nomi-ninja] Use Generator.create() instead.' ) ; }
module.exports = Generator ;



/*
	Generator.create( [options] )
	
	* options `object` where:
		* order `number` Markov order
		* sourceSplitter `string` or `RegExp` what is used to split the source into samples, if it is not an array
		* sampleSplitter `string` or `RegExp` what is used to split a sample into atom chain, if it is not an array
		* atomList `Array` of `string` contains atoms that have a length greater than one
		* atomMin `number` minimal number of atom the generator will try to produce, if possible
		* atomMax `number` maximal number of atom the generator will try to produce, if possible
		* rebranching `number` if >0, when the generator cannot reach the atomMin due to a high Markov order,
		  it will try to generate "as if" the current generating string contains more atoms at the begining
		* sampleJoint `string` what is used to join atoms when generating
		* sampleAppend `string` a string append at the end of the sample when generating
		* rng `object` (optional) a math-kit's random object to use, instead of creating a brand new one
*/
Generator.create = function create( options )
{
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	var self = Object.create( Generator.prototype , {
		order: {
			enumerable: true ,
			value: ( typeof options.order === 'number' && options.order > 0 ) ? options.order : 2
		} ,
		sourceSplitter: {
			enumerable: true ,
			writable: true ,
			value: ( typeof options.sourceSplitter === 'string' || options.sourceSplitter instanceof RegExp ) ? options.sourceSplitter : null
		} ,
		sampleSplitter: {
			enumerable: true ,
			writable: true ,
			value: ( typeof options.sampleSplitter === 'string' || options.sampleSplitter instanceof RegExp ) ? options.sampleSplitter : ''
		} ,
		sampleJoint: {
			enumerable: true ,
			writable: true ,
			value: typeof options.sampleJoint === 'string' ? options.sampleJoint : ''
		} ,
		sampleAppend: {
			enumerable: true ,
			writable: true ,
			value: typeof options.sampleAppend === 'string' ? options.sampleAppend : ''
		} ,
		outputSanitizers: {
			enumerable: true ,
			writable: true ,
			value: options.outputSanitizers || null ,
		} ,
		atomList: {
			enumerable: true ,
			writable: true ,
			value: Array.isArray( options.atomList ) ? options.atomList : null
		} ,
		graph: {
			enumerable: true ,
			//writable: true ,
			value: Object.create( tree.path.prototype )
		} ,
		atomMin: { enumerable: true , writable: true , value: options.atomMin || 0 } ,
		atomMax: { enumerable: true , writable: true , value: options.atomMax || Infinity } ,
		rebranching: { enumerable: true , writable: true , value: options.rebranching || 0 } ,
		rng: { enumerable: true , writable: true , value: null }
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
	addSamples( samples , [options] )
		* samples `array` or `string`
		* options `object`, where:
			* sourceSplitter `string` or `RegExp` what is used to split the source into samples, if it is not an array
			* sampleSplitter `string` or `RegExp` what is used to split a sample into atom chain, if it is not an array
			* atomList `Array` of `string` contains atoms that have a length greater than one
*/
Generator.prototype.addSamples = function addSamples( samples , options )
{
	var i , sample , startingChain , sourceSplitter , sampleSplitter , atomList , atomListPattern ;
	
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	if ( ! Array.isArray( samples ) )
	{
		sourceSplitter = ( typeof options.sourceSplitter === 'string' || options.sourceSplitter instanceof RegExp ) ?
			options.sourceSplitter : this.sourceSplitter ;
		
		//console.log( samples , sourceSplitter ) ;
		if ( ! sourceSplitter ) { throw new TypeError( '[nomi-ninja] .addSamples(): argument #0 should be an Array, or a sourceSplitter should be provided' ) ; }
		
		samples = samples.split( sourceSplitter ) ;
	}
	
	sampleSplitter = ( typeof options.sampleSplitter === 'string' || options.sampleSplitter instanceof RegExp ) ?
		options.sampleSplitter : this.sampleSplitter ;
	
	atomList = Array.isArray( options.atomList ) ? options.atomList : this.atomList ;
	
	if ( atomList )
	{
		atomListPattern = string.regexp.array2alternatives( atomList ) ;
		atomListPattern = '(' + atomListPattern + ')|.' ;
	}
	
	startingChain = [] ;
	for ( i = 0 ; i < this.order ; i ++ ) { startingChain[ i ] = '' ; }
	
	
	for ( i = 0 ; i < samples.length ; i ++ )
	{
		if ( typeof samples[ i ] === 'string' )
		{
			sample = string2sample( samples[ i ] , sampleSplitter , atomListPattern ) ;
		}
		else if ( Array.isArray( samples[ i ] ) )
		{
			sample = samples[ i ].slice() ;
		}
		else
		{
			continue ;
		}
		
		// Always add the empty string, that is used as the string terminator
		sample.push( '' ) ;
		
		//console.log( "Sample:" , sample ) ;
		
		this.addSampleToGraph( sample , startingChain ) ;
	}
	
	//console.error( 'Graph:\n' + string.inspect( { depth: Infinity , style: 'color' } , this.graph ) ) ;
} ;



// Transform a string to a sample (array).
function string2sample( str , sampleSplitter , atomListPattern )
{
	var sample , atomRegexp , match , accumulator ;
	
	if ( ! atomListPattern ) { return str.split( sampleSplitter ) ; }
	
	// Split the sample using both the atom's list and the sample splitter
	
	//console.log( '>>>>>>>>>>>>>>>>>>>>>>' , samples[ i ] ) ;
	accumulator = '' ;
	sample = [] ;
	atomRegexp = new RegExp( atomListPattern , 'g' ) ;
	
	while ( ( match = atomRegexp.exec( str ) ) !== null )
	{
		if ( match[ 1 ] )
		{
			if ( accumulator )
			{
				sample = sample.concat( accumulator.split( sampleSplitter ) ) ;
				accumulator = '' ; 
			}
			
			sample.push( match[ 1 ] ) ;
		}
		else
		{
			accumulator += match[ 0 ] ;
		}
	}
	
	if ( accumulator ) { sample = sample.concat( accumulator.split( sampleSplitter ) ) ; }
	//console.log( sample ) ;
	
	return sample ;
}



// Add one sample (array) to the graph
Generator.prototype.addSampleToGraph = function addSampleToGraph( sample , startingChain )
{
	var i , atom , leaf , chain = startingChain.slice() ;
	
	for ( i = 0 ; i < sample.length ; i ++ )
	{
		atom = sample[ i ] ;
		
		leaf = this.graph.define( chain , { sum: 0 , nexts: {} } ) ;
		
		leaf.sum ++ ;
		
		if ( atom in leaf.nexts ) { leaf.nexts[ atom ] ++ ; }
		else { leaf.nexts[ atom ] = 1 ; }
		
		
		//console.log( '#' + i , chain ) ;
		chain.unshift( sample[ i ] ) ;
		chain.pop() ;
	}
} ;



/*
	The graph is in reverse order to gain flexibility.
	For example, it is possible to use a kind of dynamic Markov order (by lowering it).
	"abc"-> b.a.c (the last is the leaf, the first is the last added atom).
*/


/*
	generate( [options] )
	
	* options `object` where:
		* sampleJoint `string` what is used to join atoms when generating
		* sampleAppend `string` a string append at the end of the sample when generating
		* arrayMode `boolean` true if this function should output an array of atoms instead of a string
*/
Generator.prototype.generate = function generate( options )
{
	var i , key , length , chain , leaf , str = [] , r , atomCount = 0 , sampleJoint , sampleAppend ,
		rebranch , rebranchCount = this.rebranching ;
	
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	sampleJoint = options.sampleJoint || this.sampleJoint ;
	sampleAppend = options.sampleAppend || this.sampleAppend ;
	
	chain = [] ;
	for ( i = 0 ; i < this.order ; i ++ ) { chain[ i ] = '' ; }
	
	while( true )
	{
		leaf = this.graph.get( chain ) ;
		
		if ( ! leaf ) { throw new Error( '[nomi-ninja] .generate(): unexpected error, leaf not found...' ) ; }
		
		if ( atomCount < this.atomMin && leaf.nexts[''] && ( ( length = Object.keys( leaf.nexts ).length ) > 1 || rebranchCount ) )
		{
			if ( rebranchCount && length <= 1 )
			{
				rebranch = this.rebranch( chain , atomCount ) ;
				if ( ! rebranch ) { rebranchCount = 0 ; }
				else { chain = rebranch ; rebranchCount -- ; }
				continue ;
			}
			else
			{
				// We don't want to exit, remove the '' key
				r = this.rng.random( 1 , leaf.sum - leaf.nexts[''] ) ;
				
				for ( key in leaf.nexts )
				{
					if ( key === '' ) { continue ; }
					r -= leaf.nexts[ key ] ;
					if ( r <= 0 ) { break ; }
				}
				
				if ( r > 0 ) { throw new Error( "[nomi-ninja] .generate() - unexpected internal error: 'r' is still positive" ) ; }
			}
		}
		else if ( atomCount >= this.atomMax && leaf.nexts[''] )
		{
			// We want to exit and it is possible
			key = '' ;
		}
		else
		{
			// Normal case
			r = this.rng.random( 1 , leaf.sum ) ;
			
			for ( key in leaf.nexts )
			{
				r -= leaf.nexts[ key ] ;
				if ( r <= 0 ) { break ; }
			}
			
			if ( r > 0 ) { throw new Error( "[nomi-ninja] .generate() - unexpected internal error: 'r' is still positive" ) ; }
		}
		
		str.push( key ) ;
		if ( key === '' ) { break ; }
		
		atomCount ++ ;
		if ( rebranchCount && atomCount >= this.order ) { rebranchCount = 0 ; }
		
		chain.unshift( key ) ;
		chain.pop() ;
	}
	
	str.pop() ;
	
	if ( options.arrayMode ) { return str ; }
	
	str = str.join( sampleJoint ) + sampleAppend ;
	
	if ( this.outputSanitizers )
	{
		str = doormen( { sanitize: this.outputSanitizers } , str ) ;
	}
	
	return str ;
} ;



Generator.prototype.rebranch = function rebranch( chain , place )
{
	var newChain = chain.slice() , i , shortNode , shortKeys , key ,
		originalKey = chain[ place ] , indexOf ;
	
	//console.error( '>>> Trying to rebranch from' , chain.join( ' - ' ) , '   original key:' , originalKey ) ;
	//console.error( 'Leaf:' , this.graph.get( chain ) ) ;
	
	shortNode = this.graph.get( newChain.slice( 0 , place ) ) ;
	shortKeys = Object.keys( shortNode ) ;
	
	//console.error( 'shortNode:' , shortNode ) ;
	if ( shortKeys.length === 1 ) { return false ; }
	indexOf = shortKeys.indexOf( originalKey ) ;
	shortKeys.splice( indexOf , 1 ) ;
	
	key = shortKeys[ this.rng.random( shortKeys.length ) ] ;
	newChain[ place ] = key ;
	
	for ( i = place + 1 ; i < this.order ; i ++ )
	{
		shortNode = shortNode[ key ] ;
		shortKeys = Object.keys( shortNode ) ;
		key = shortKeys[ this.rng.random( shortKeys.length ) ] ;
		newChain[ i ] = key ;
	}
	
	//console.error( 'Rebranching to' , newChain.join( ' - ' ) ) ;
	
	return newChain ;
} ;


