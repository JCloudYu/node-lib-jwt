(()=>{
	"use strict";
	
	Object.defineProperties(module.exports = {}, {
		encode:{value:encode, writable:false, configurable:false, enumerable:true},
		decode:{value:decode, writable:false, configurable:false, enumerable:true},
		toBase64:{value:toBase64, writable:false, configurable:false, enumerable:true},
		fromBase64:{value:fromBase64, writable:false, configurable:false, enumerable:true}
	});



	function encode(input, encoding) {
		let buffer = Buffer.isBuffer(input) ? input : Buffer.from(input, encoding || 'utf8');
		return fromBase64(buffer.toString( "base64" ));
	}
	function decode(base64url, encoding) {
		let buffer = Buffer.from(toBase64(base64url), 'base64');
		return (arguments.length > 1) ? buffer.toString(encoding) : buffer;
	}
	function toBase64(base64url) {
		return (base64url + '==='.slice((base64url.length + 3) % 4))
			.replace(/\-/g, "+")
			.replace(/_/g, "/");
	}
	function fromBase64(base64) {
		return base64
			.replace(/=/g, "")
			.replace(/\+/g, "-")
			.replace(/\//g, "_");
	}
})();

