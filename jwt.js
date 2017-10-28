(function() {
	"use strict";
	
	const B64URL  = require( './b64url' );
	const JWA	  = require( './jwa' );
	
	
	
	const objDefSyntax = /^{.*}$/;
	const __algs  = {};
	const exports = {};
	Object.defineProperties(exports, {
		Base64Url:{
			value:B64URL,
			writable:false,
			configurable:false,
			enumerable:true
		},
		sign: {
			value:(alg, data, secret)=> {
				if ( alg === 'NONE' ) return '';
				
				__algs[alg] = __algs[alg] || JWA(alg);
				return __algs[alg].sign(data, secret);
			},
			writable:false,
			configurable:false,
			enumerable:true
		},
		verify: {
			value:(alg, data, signature, secret)=>{
				if ( alg === 'NONE' ) return true;
				
				__algs[alg] = __algs[alg] || JWA(alg);
				return __algs[alg].verify(data, signature, secret);
			},
			writable:false,
			configurable:false,
			enumerable:true
		},
		parse: {
			value:(token)=>{
				let parts = token.split('.');
				if ( parts.length < 2 ) {
					return null;
				}
				
				
				
				let [header, payload, signature] = parts;
				try {
					header	= B64URL.decode( header, 'utf8' );
					payload = B64URL.decode( payload, 'utf8' );
					if ( !objDefSyntax.test(header) || !objDefSyntax.test(payload) ) {
						throw "Invalid JWT Syntax";
					}
					
					
					
					header		= JSON.parse( header );
					payload		= JSON.parse( payload );
					signature	= signature || '';
				}
				catch(e) {
					return null;
				}
				
				
				
				return {
					header,
					payload,
					raw:{
						content:`${parts[0]}.${parts[1]}`,
						signature
					}
				};
			},
			writable:false,
			configurable:false,
			enumerable:true
		},
		genToken: {
			value:(header, payload, secret)=>{
				let alg = header.alg;
				
				let encHeader = B64URL.encode(JSON.stringify(header));
				let encPayload = B64URL.encode(JSON.stringify(payload));
				let content = `${encHeader}.${encPayload}`;
				if ( alg === "NONE" ) return content;
				
				__algs[alg] = __algs[alg] || JWA(alg);
				let signature = __algs[alg].sign(content, secret);
				return `${content}.${signature}`;
			},
			writable:false,
			configurable:false,
			enumerable:true
		}
	});
	module.exports = exports;
})();
