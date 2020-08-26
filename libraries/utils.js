'use strict';

var FLAG_SECURE_VALUE = "";
var mode = "";
var methodURL = "";
var requestHeaders = "";
var requestBody = "";
var responseHeaders = "";
var responseBody = "";

var Color = {
  RESET: "\x1b[39;49;00m", Black: "0;01", Blue: "4;01", Cyan: "6;01", Gray: "7;11", Green: "2;01", Purple: "5;01", Red: "1;01", Yellow: "3;01",
  Light: {
      Black: "0;11", Blue: "4;11", Cyan: "6;11", Gray: "7;01", Green: "2;11", Purple: "5;11", Red: "1;11", Yellow: "3;11"
  }
};


function traceClass(targetClass)
{

	console.log("entering traceClass")

	var hook = Java.use(targetClass);
	var methods = hook.class.getDeclaredMethods();
	hook.$dispose();

	console.log("entering pasedMethods")

	var parsedMethods = [];
	methods.forEach(function(method) {
		try{
			parsedMethods.push(method.toString().replace(targetClass + ".", "TOKEN").match(/\sTOKEN(.*)\(/)[1]);
		}
		catch(err){}
	});

	console.log("entering traceMethods")


	var targets = uniqBy(parsedMethods, JSON.stringify);
	targets.forEach(function(targetMethod) {
		try{
			traceMethod(targetClass + "." + targetMethod);
		}
		catch(err){}
	});
}

function uniqBy(array, key)
{
        var seen = {};
        return array.filter(function(item) {
                var k = key(item);
                return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        });
}

function traceMethod(targetClassMethod)
{
	var delim = targetClassMethod.lastIndexOf(".");
	if (delim === -1) return;

	var targetClass = targetClassMethod.slice(0, delim)
	var targetMethod = targetClassMethod.slice(delim + 1, targetClassMethod.length)

	var hook = Java.use(targetClass);
	var overloadCount = hook[targetMethod].overloads.length;

	colorLog("Tracing " + targetClassMethod + " [" + overloadCount + " overload(s)]",{c: Color.Green});

	for (var i = 0; i < overloadCount; i++) {

		hook[targetMethod].overloads[i].implementation = function() {
		  colorLog("\n*** entered " + targetClassMethod,{c: Color.Red});

			if (arguments.length) console.log();
			for (var j = 0; j < arguments.length; j++) {
				colorLog("arg[" + j + "]: " + arguments[j], {c: Color.Blue});
			}

			// print retval
			var retval = this[targetMethod].apply(this, arguments); // rare crash (Frida bug?)
			colorLog("\nretval: " + retval, {c: Color.Yellow});
			colorLog("\n*** exiting " + targetClassMethod, {c: Color.Green});
			return retval;
		}
	}
}


var Utf8 = {
  encode : function (string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";
      for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
              utftext += String.fromCharCode(c);
          }
          else if((c > 127) && (c < 2048)) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
          }
          else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
          }
      }
      return utftext;
  },
  // publi
  decode : function (utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;
      while ( i < utftext.length ) {
          c = utftext.charCodeAt(i);
          if (c < 128) {
              string += String.fromCharCode(c);
              i++;
          }
          else if((c > 191) && (c < 224)) {
              c2 = utftext.charCodeAt(i+1);
              string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
              i += 2;
          }
          else {
              c2 = utftext.charCodeAt(i+1);
              c3 = utftext.charCodeAt(i+2);
              string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
              i += 3;
          }
      }
      return string;
  }
}


function describeJavaClass(className) {
  var jClass = Java.use(className);
  console.log(JSON.stringify({
    _name: className,
    _methods: Object.getOwnPropertyNames(jClass.__proto__).filter(function(m) { 
      return !m.startsWith('$') // filter out Frida related special properties
        || m == 'class' || m == 'constructor' // optional
    }), 
    _fields: jClass.class.getFields().map(function(f) {
      return f.toString()
    })  
  }, null, 2));
}

var colorLog = function (input, kwargs) {
  kwargs = kwargs || {};
  var logLevel = kwargs['l'] || 'log', colorPrefix = '\x1b[3', colorSuffix = 'm';
  if (typeof input === 'object')
      input = JSON.stringify(input, null, kwargs['i'] ? 2 : null);
  if (kwargs['c'])
      input = colorPrefix + kwargs['c'] + colorSuffix + input + Color.RESET;
  console[logLevel](input);
};




var printBacktrace=function () {
  Java.perform(function() {
      var android_util_Log = Java.use('android.util.Log'), java_lang_Exception = Java.use('java.lang.Exception');
      var exc = android_util_Log.getStackTraceString(java_lang_Exception.$new());
      colorLog(exc, { c: Color.Green });
  });
};

var processArgs = function(command, envp, dir) {
    var output = {};
    if (command) {
      console.log("Command: " + command);
    //   output.command = command;
    }
    if (envp) {
      console.log("Environment: " + envp);
    //   output.envp = envp;
    }
    if (dir) {
      console.log("Working Directory: " + dir);
    //   output.dir = dir;
    }
    // return output;
  }
  

var _byteArraytoHexString = function(byteArray) {
    if (!byteArray) { return 'null'; }
    if (byteArray.map) {
      return byteArray.map(function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
      }).join('');
    } else {
      return byteArray + "";
    }
  }
  
  var updateInput = function(input) {
    if (input.length && input.length > 0) {
      var normalized = byteArraytoHexString(input);
    } else if (input.array) {
      var normalized = byteArraytoHexString(input.array());
    } else {
      var normalized = input.toString();
    }
    return normalized;
  }
  

var byteArraytoHexString = function(byteArray) {
  if (byteArray && byteArray.map) {
    return byteArray.map(function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  } else {
    return JSON.stringify(byteArray);
  }
}

var hexToAscii = function(input) {
  var hex = input.toString();
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

var displayString = function(input){
	var str = input.replace('[','');
	var str1 = str.replace(']','');
	var res = str1.split(',');
	var ret = '';
	for(var i = 0; i<res.length; i++){
		if(res[i] > 31 && res[i]<127)
			ret += String.fromCharCode(res[i]);
		else ret += ' ';

	}

  colorLog("[+] PARSING TO STRING: " + ret,{c:Color.Green});
  colorLog('',{c:Color.RESET});
}
var normalize = function(input) {
    if (input.length && input.length > 0) {
      var normalized = byteArraytoHexString(input);
    } else if (input.array) {
      var normalized = byteArraytoHexString(input.array());
    } else {
      var normalized = input.toString();
    }
    return normalized;
  }

var normalizeInput = function(input) {
  if (input.array) {
    var normalized = byteArraytoHexString(input.array());
  } else if (input.length && input.length > 0) {
    var normalized = byteArraytoHexString(input);
  } else {
    var normalized = JSON.stringify(input);
  }
  return normalized;
}

var getMode = function(Cipher, mode) {
  if (mode === 2) {
    mode = "DECRYPT";
  } else if (mode === 1) {
    mode = "ENCRYPT";
  }
  return mode;
}

var getRandomValue = function(arg) {
  if (!arg) { return 'null'; }
  var type = arg.toString().split('@')[0].split('.');
  type = type[type.length - 1];
  if (type === "SecureRandom") {
    if (arg.getSeed) {
      return byteArraytoHexString(arg.getSeed(10));
    }
  }
}

var normalizeKey = function(cert_or_key) {
  var type = cert_or_key.toString().split('@')[0].split('.');
  type = type[type.length - 1];
  if (type === "SecretKeySpec") {
    return byteArraytoHexString(cert_or_key.getEncoded());
  } else {
    return "non-SecretKeySpec: " + cert_or_key.toString() + ", encoded: " + byteArraytoHexString(cert_or_key.getEncoded()) + ", object: " + JSON.stringify(cert_or_key);
  }

}
var byteArrayToString = function(input){
  var buffer = Java.array('byte', input);
  var result = "";
  for(var i = 0; i < buffer.length; ++i){
      if(buffer[i] > 31 && buffer[i]<127)
        result+= (String.fromCharCode(buffer[i]));
      else result += ' ';
  
    }
      
  
  return result;

}

function getContext() {
	return Java.use('android.app.ActivityThread').currentApplication().getApplicationContext();
  }

  function readStreamToHex (stream) {
    var data = [];
    var byteRead = stream.read();
    while (byteRead != -1)
    {
        data.push( ('0' + (byteRead & 0xFF).toString(16)).slice(-2) );
                /* <---------------- binary to hex ---------------> */
        byteRead = stream.read();
    }
    stream.close();
    return data.join('');
}

  
