var CURRENT_COIN = 'SWIFT';
var PARAMS = {
	'SWIFT': {
		coingecko: 'swiftcash',
		coinjs: cc.swiftcash,
		qrColor: '3875CE',
		minFee: 0.002,
		maxFee: 0.2,
		txFee: 0.002,
		explorer: 'https://explorer.swiftcash.cc/',
		donation: 'SXucSXaV5HURNyJUWnPrVFHTdRzoU2u19F',
		unspentApi: 'https://explorer.swiftcash.cc/api/unspent/',
		sendApi: 'https://explorer.swiftcash.cc/api/pushtx/',
		sendTxid1: 'txid',
		unspentTxid: 'txid',
		unspentOutput: 'output',
		unspentValue: 'value'
	},

        'BTC': {
		coingecko: 'bitcoin',
                coinjs: cc.bitcoin,
                qrColor: 'FC8F43',
                minFee: 0.0001,
                maxFee: 0.01,
		txFee: 0.0001,
                explorer: 'https://live.blockcypher.com/btc/',
		donation: '1BccQgoLLvHDrfX1yMQmwM8tyemNe84ZjJ',
                unspentApi: 'https://chain.so/api/v2/get_tx_unspent/BTC/',
		sendApi: 'https://chain.so/api/v2/send_tx/BTC/',
		sendTxid1: 'data',
                sendTxid2: 'txid',
                unspentArray1: 'data',
                unspentArray2: 'txs',
                unspentTxid: 'txid',
                unspentOutput: 'output_no',
                unspentValue: 'value'
        },

	'LTC': {
		coingecko: 'litecoin',
		coinjs: cc.bitcoin,
		network: cc.bitcoin.networks.litecoin,
		qrColor: '5C5C5C',
                minFee: 0.001,
                maxFee: 0.1,
		txFee: 0.001,
                explorer: 'https://live.blockcypher.com/ltc/',
		donation: 'LVqZfu7ARaXH7UDB9VQ5DNCfBs8eqfRRNx',
                unspentApi: 'https://chain.so/api/v2/get_tx_unspent/LTC/',
                sendApi: 'https://chain.so/api/v2/send_tx/LTC/',
                sendTxid1: 'data',
                sendTxid2: 'txid',
		unspentArray1: 'data',
		unspentArray2: 'txs',
		unspentTxid: 'txid',
		unspentOutput: 'output_no',
		unspentValue: 'value'
	},

        'DOGE': {
		coingecko: 'dogecoin',
                coinjs: cc.bitcoin,
                network: cc.bitcoin.networks.dogecoin,
                qrColor: 'C19347',
                minFee: 1,
                maxFee: 100,
                txFee: 1,
                explorer: 'https://live.blockcypher.com/doge/',
		donation: 'DFkhwwjyeLBWPfhchwQLV7JVrnVg45zgh6',
                unspentApi: 'https://chain.so/api/v2/get_tx_unspent/DOGE/',
                sendApi: 'https://chain.so/api/v2/send_tx/DOGE/',
                sendTxid1: 'data',
                sendTxid2: 'txid',
                unspentArray1: 'data',
                unspentArray2: 'txs',
                unspentTxid: 'txid',
                unspentOutput: 'output_no',
                unspentValue: 'value'
        }
};

window.Clipboard = (function(window, document, navigator) {
    var textArea,
        copy;

    function isOS() {
        return navigator.userAgent.match(/ipad|iphone/i);
    }

    function createTextArea(text) {
        textArea = document.createElement('textArea');
        textArea.value = text;
        document.body.appendChild(textArea);
    }

    function selectText() {
        var range,
            selection;

        if (isOS()) {
            range = document.createRange();
            range.selectNodeContents(textArea);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            textArea.setSelectionRange(0, 999999);
        } else {
            textArea.select();
        }
    }

    function copyToClipboard() {
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    copy = function(text) {
        createTextArea(text);
        selectText();
        copyToClipboard();
    };

    return {
        copy: copy
    };
})(window, document, navigator);

var donation=0;
var scanner;
var qrIdToFill;
function openQrModal(param) {
  qrIdToFill = param;
  scanner = new Instascan.Scanner({ video: document.getElementById('qrScannerPreview') });

  scanner.addListener('scan', function (content) {
    scanner.stop();
    $('#' + qrIdToFill).val(content);
    $('#' + qrIdToFill).change();
    $('#modalQrCode').modal('toggle');
  });

  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 1) {
      scanner.start(cameras[1]);
    } else if(cameras.length > 0) {
      scanner.start(cameras[0]);
    } else {
      $('#modalQrCode').modal('toggle');
      alert('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
  });

  $('#modalQrCode').modal('toggle');
}

function closeQrModal() {
  scanner.stop();
}

var passphrase="";
var hashedPass="";
var loginPrivkey="";
var keyPair="";
function hashit(hash, callback) {
  for(i=0; i<100*1440; i++) {
    hash = cc.swiftcash.crypto.keccak256(hash+passphrase);
    hash = hash.toString("hex");
  }

  hashedPass = hash;
  callback(hash);
}

var params = new window.URLSearchParams(window.location.search);
var opData = params.get('data');
function switchCoin(whichCoin) {
  if(disableSwitchCoin) { alert("This transaction must be paid in " + CURRENT_COIN + "!"); return; }
  if(disableSwitchCoinFlag) {
     disableSwitchCoin = true; $('#spendRadio').click();
     $('#address').prop('disabled', true).val(params.get('mAddress'));
     if(params.get('currency')) {
        $.ajax({
           url: 'https://api.coingecko.com/api/v3/simple/price?ids=' + PARAMS[CURRENT_COIN].coingecko + '&vs_currencies=' + params.get('currency'),
           type: "GET",
           dataType: "json",
           data: {
         },
         success: function (result) {
           var fiatPrice = Number(result[PARAMS[CURRENT_COIN].coingecko][params.get('currency').toLowerCase()]);
           var deductFromPrice = params.get('deduct');
           if(deductFromPrice) fiatPrice = (100-deductFromPrice)*fiatPrice/100;
           $('#amount').prop('disabled', true).val((Number(params.get('amount'))/fiatPrice).toFixed(8));
         },
         error: function () {
           console.log("error");
         }
        });
     } else {
        $('#amount').prop('disabled', true).val(params.get('amount'));
     }
  }

  $("#addr-qr").attr("src", "./images/qrloader.gif");
  setTimeout(switchCoinNow, 100, whichCoin);
}

function switchCoinNow(whichCoin) {
  CURRENT_COIN = whichCoin;

  var cLogos = document.getElementsByClassName("currency-logo");
  for(i=0; i<cLogos.length; i++) {
     var title = cLogos[i].title;

     if(title != whichCoin) {
        cLogos[i].style.filter = "none";
     } else {
	cLogos[i].style.filter = "drop-shadow(1px 1px 2px #4b4b4c)";
     }
  }

  if(whichCoin != loginPrivkey) {
     var d = new cc.bigi.fromBuffer(hashedPass);
     keyPair = new PARAMS[CURRENT_COIN].coinjs.ECPair(d, null, { network: PARAMS[CURRENT_COIN].network });
  } else {
     keyPair = PARAMS[CURRENT_COIN].coinjs.ECPair.fromWIF(hashedPass, PARAMS[CURRENT_COIN].network);
  }

  loadAddress();
}

var disableSwitchCoinFlag = false;
var disableSwitchCoin = false;
function login() {
  var pCoin = params.get("coin");
  if(pCoin && PARAMS[pCoin]) {
     CURRENT_COIN = pCoin;
     disableSwitchCoinFlag = true;
  }

  // Make sure the password is strong enough
  if( $('ul.error-list').html() != "" || $('span.password-verdict').html() != "Very Strong" ) { alert("You need a stronger password! Try choosing a longer password(at least 14 characters recommended), with both uppercase and lowercase characters as well as numbers and special characters."); return; }

  // Login with private key
  // TODO: Add the ability to login with BTC or LTC private keys
  if( $('#privlogintoggle').attr('aria-pressed') == "true" ) {
    var privateKey = $('#password').val();
    var success = false;
    $.each( PARAMS, function( key, value ) {
	if (!success && (!pCoin || pCoin == key)) try {
	   hashedPass = privateKey;
	   loginPrivkey = key;
	   CURRENT_COIN = key;
	   keyPair = PARAMS[CURRENT_COIN].coinjs.ECPair.fromWIF(privateKey, PARAMS[CURRENT_COIN].network);
	   success = true;
	} catch(e) {}
    });

    if(!success) {  alert("Invalid Private Key!"); return; }
    else { switchCoin(CURRENT_COIN); return; }
  }

  // Login with email + password
  passphrase = $("#email").val() + ";" + $("#password").val();
  var hash = cc.swiftcash.crypto.keccak256(passphrase);
  $('#email').prop("disabled", true);
  $('#password').prop("disabled", true);
  $('#signin').prop("disabled", true);
  $('#privlogintoggle').prop("disabled", true);
  $("#loginprogress").show();
  $("form[role='login']").click();
  setTimeout(hashit, 1000, hash.toString("hex"), function(hashed) {
    var d = new cc.bigi.fromBuffer(hashed);
    keyPair = new PARAMS[CURRENT_COIN].coinjs.ECPair(d, null, { network: PARAMS[CURRENT_COIN].network });
    switchCoin(CURRENT_COIN);
  });
}

function loadAddress() {
  $("#addr-balance-refresh").prop("disabled", true);
  $('#addr-balance').html('Balance: 0.00000000 ' + CURRENT_COIN);
  $("#addr-balance").css("color", "#74bed8");
  $("#pwd-container").hide();
  $("#addr-container").show();
  $("#addr-qr").attr("src", "https://qr-generator.qrcode.studio/qr/custom?download=false&file=png&data=" + keyPair.getAddress() + "&size=400&config=%7B%22body%22%3A%22rounded-pointed%22%2C%22eye%22%3A%22frame6%22%2C%22eyeBall%22%3A%22ball6%22%2C%22erf1%22%3A%5B%22fv%22%5D%2C%22gradientColor1%22%3A%22%23" + PARAMS[CURRENT_COIN].qrColor + "%22%2C%22gradientColor2%22%3A%22%23" + PARAMS[CURRENT_COIN].qrColor + "%22%2C%22gradientType%22%3A%22radial%22%2C%22gradientOnEyes%22%3A%22true%22%2C%22logo%22%3A%22%22%7D");
  $("#addr-qr").attr("alt", keyPair.getAddress());
  $("#addr-id-clipboard").attr("data-clipboard-text", keyPair.getAddress());
  $("#addr-id").attr("href", PARAMS[CURRENT_COIN].explorer + "address/" + keyPair.getAddress());
  $("#addr-id").html(keyPair.getAddress());
  changeAddress = keyPair.getAddress();
  donation = 0;
  refresh();
}

function refresh() {
  $.ajax({
    url: PARAMS[CURRENT_COIN].unspentApi + keyPair.getAddress(),
    type: "GET",
    dataType: "json",
    data: {
    },
    success: function (result) {
        loadAddressTxes(result);
	$("#addr-balance-refresh").prop("disabled", false);
	$("#addr-balance").css("color", "");
    },
    error: function () {
        console.log("error");
	$("#addr-balance-refresh").prop("disabled", false);
    }
  });
}

var USD = false;
var usdBalance = false;
var balance=0;
var changeAddress="";
var utxos=[];
function loadAddressTxes(result) {
  var sum = 0;
  var F1 = PARAMS[CURRENT_COIN].unspentArray1;
  var F2 = PARAMS[CURRENT_COIN].unspentArray2;

  if(F1 && F2) {
     utxos = result[F1][F2];
  } else if(F1) {
     utxos = result[F1];
  } else { utxos=result; }

  for(i in utxos) {
    sum += Number(utxos[i].value);
  } balance = sum;

  USD = false;
  usdBalance = false;
  $('#addr-balance').html('Balance: ' + balance.toFixed(8) + ' ' + CURRENT_COIN);
}

function _setTooltip(message, classId) {
  $(classId)
    .attr('data-original-title', message)
    .tooltip('show');
  }

function _hideTooltip(classId) {
  setTimeout(function() {
    $(classId).attr('data-original-title', '').tooltip('hide');
  }, 1000);
}

function modifyTheChangeAddress() {
  var result = prompt('Enter a custom change address:', changeAddress);
  if(result) {
    try {
      PARAMS[CURRENT_COIN].coinjs.address.toOutputScript(result, PARAMS[CURRENT_COIN].network);
      changeAddress = result;
    } catch(e) { alert("Please enter a valid address!"); return; }
  }
}

function donate() {
  var result = prompt('Enter an amount to donate:', donation);
  if(!isNaN(result)) { donation = Number(result); }
  else alert(result + " is not a valid amount!");
}

function changeTheFee() {
  var minFee = PARAMS[CURRENT_COIN].minFee;
  var maxFee = PARAMS[CURRENT_COIN].maxFee
  var txFee = PARAMS[CURRENT_COIN].txFee;
  var result = prompt('Enter a custom fee:', txFee);
  if(Number(result) >= minFee && Number(result) <= maxFee) {
    PARAMS[CURRENT_COIN].txFee = Number(result);
  } else if(result != null) {
      if(Number(result) < minFee) alert("Minimum transaction fee allowed is " + minFee + " " + CURRENT_COIN + "!");
      else if(Number(result) > maxFee) alert("Maximum transaction fee allowed is " + maxFee + " " + CURRENT_COIN + "!");
      else alert(result + " is not a valid fee!");
  }
}

function togglePrice() {
  if(balance > 0 && !USD && !usdBalance) {
    $.ajax({
        url: 'https://api.coingecko.com/api/v3/simple/price?ids=' + PARAMS[CURRENT_COIN].coingecko + '&vs_currencies=usd',
        type: "GET",
        dataType: "json",
        data: {
      },
      success: function (result) {
        USD = true;
	var usdPrice = Number(result[PARAMS[CURRENT_COIN].coingecko].usd);
        usdBalance = balance * usdPrice;
        $("#addr-balance").html("Balance: $" + usdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " US");
      },
      error: function () {
        console.log("error");
        $("#addr-balance-refresh").prop("disabled", false);
      }
    });
  } else if(!USD && usdBalance) {
     USD = true;
     $("#addr-balance").html("Balance: $" + usdBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " US");
  } else if(!USD && !usdBalance) {
     USD = true;
     $("#addr-balance").html("Balance: $0.00 US");
  } else if(USD) {
     USD = false;
     $("#addr-balance").html("Balance: " + balance.toFixed(8) + " " + CURRENT_COIN);
  }
}

function copyPrivateKey() {
  var result = prompt("This operation will copy your private key to clipboard. Your private key is very important and anyone who has it will be able to spend from your account. You should never share your private key with anyone.\n\nType 'Yes' with capital 'Y' to continue:", "No");
  if(result == 'Yes') {
    try {
      Clipboard.copy(keyPair.toWIF());
      setTimeout(_setTooltip, 200, "Copied!", ".privkey");
      setTimeout(_hideTooltip, 200, ".privkey");
   } catch(e) {
      setTimeout(_setTooltip, 200, "Failed!", ".privkey");
      setTimeout(_hideTooltip, 200, ".privkey");
   }
  }
}

function rsvs(radio) {
  switch(radio.value) {
    case 'R':
	$("#addr-spend").hide();
	$("#addr-receive").show();
	break;
    case 'S':
        $("#addr-spend").show();
        $("#addr-receive").hide();
        break;
  }
}

var tx;
function spendf() {
  var amount = Number($("#amount").val());
  const FEE = PARAMS[CURRENT_COIN].txFee + donation;
  if(balance < FEE || SWIFT(amount+FEE) > balance) { alert("Insufficient funds! Minimum network fee is " + FEE + " " + CURRENT_COIN + "."); return; }

  // Validate the address
  try {
    PARAMS[CURRENT_COIN].coinjs.address.toOutputScript($("#address").val(), PARAMS[CURRENT_COIN].network);
  } catch(e) { alert("Please enter a valid address!"); return; }

  // Disable the elements in the form
  $('#address').prop("disabled", true);
  $('#amount').prop("disabled", true);
  $('#send').prop("disabled", true);
  $('#sendprogress').show();

  // Create the transaction
  tx = new PARAMS[CURRENT_COIN].coinjs.TransactionBuilder(PARAMS[CURRENT_COIN].network);

  // Add all the available input(s)
  for(i in utxos) {
     tx.addInput(utxos[i].txid, utxos[i][PARAMS[CURRENT_COIN].unspentOutput]);
  }

  // Add the output
  tx.addOutput($("#address").val(), Math.ceil(amount*100000000));

  // Add the change (if any)
  var change = SWIFT(balance - amount - FEE);
  if(change > 0) {
    tx.addOutput(changeAddress, Math.ceil(change*100000000));
  }

  // Add the donation output (if any)
  if(donation > 0) {
    tx.addOutput(PARAMS[CURRENT_COIN].donation, Math.ceil(donation*100000000));
  }

  // Add the data output (if any)
  if(opData) {
    var data = cc.Buffer(opData);

    opRet = PARAMS[CURRENT_COIN].coinjs.script.compile(
    [
      PARAMS[CURRENT_COIN].coinjs.opcodes.OP_RETURN,
      data
    ]);

    tx.addOutput(opRet, 0);
  }

  // Sign all the inputs
  for(i=0; i<utxos.length; i++) {
    tx.sign(i, keyPair);
  }

  $.ajax({
    url: PARAMS[CURRENT_COIN].sendApi,
    type: "POST",
    dataType: "json",
    data: "tx_hex=" + tx.build().toHex(),
    success: function (result) {
	var T1 = PARAMS[CURRENT_COIN].sendTxid1;
	var T2 = PARAMS[CURRENT_COIN].sendTxid2;
	var txid = '';

	if(T1 && T2 && result && result[T1]) txid = result[T1][T2];
	else if(T1 && result) txid = result[T1];

	if (txid && (typeof txid === 'string' || txid instanceof String)) {
	   balance = change;
	   $('#addr-balance').html("Balance: " + balance.toFixed(8) + " " + CURRENT_COIN);
	   USD = false;
	   usdBalance = false;
	   if(change > 0 && ( changeAddress == keyPair.getAddress() )) {
		var p1 = PARAMS[CURRENT_COIN].unspentTxid;
		var p2 = PARAMS[CURRENT_COIN].unspentOutput;
		var p3 = PARAMS[CURRENT_COIN].unspentValue;
		utxos = [{[p1]: txid, [p2]: 1, [p3]: change}];
	   } else { utxos = []; }

	   window.open(PARAMS[CURRENT_COIN].explorer + "tx/" + txid);
	   returnToMerchant(txid);
	} else {
	   console.log(result);
	   alert("Broadcast failed! Check console for the details!");
	}

	$('#address').prop("disabled", false).val("");
	$('#amount').prop("disabled", false).val("");
	$('#send').prop("disabled", false).html("Send");
	$('#sendprogress').hide();
    },
    error: function (error) {
        $('#address').prop("disabled", false).val("");
        $('#amount').prop("disabled", false).val("");
        $('#send').prop("disabled", false).html("Send");
        $('#sendprogress').hide();
	alert("Broadcast failed! Check console for the details!");
        console.log(error);
    }
  });
}

function returnToMerchant(txid) {
  var retURL = params.get("retURL");
  if(retURL) {
	retURL += window.location.href.substring(window.location.href.indexOf('?')) + '&txid=' + txid;
	window.location.href = retURL;
  }
}

function sendProgress(status) {
  var btnText = $("#send").html();

  if(status=="sending") {
    if(!btnText.endsWith("!")) btnText += ".";
    if(btnText.endsWith("......")) btnText = "Send";
    $("#send").html(btnText);
    setTimeout(sendProgress, 1000, status);
  } else {
    $("#send").html(status);
    setTimeout(enableSendForm, 1000);
  }
}

function enableSendForm() {
  $('#address').prop("disabled", false).val("");
  $('#amount').prop("disabled", false).val("");
  $('#send').prop("disabled", false).html("Send");
}

function SWIFT(a) {
  return Number(a.toFixed(8));
}

function accept() {
  Cookies.set('termsAccepted', '1');
}

function copyWholeBalance() {
  const FEE = PARAMS[CURRENT_COIN].txFee + donation;
  if(balance - FEE > 0) {
     $('#amount').val(SWIFT(balance - FEE));
  }
}

jQuery(document).ready(function() {
  // PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../service-worker.js').catch(function(err) {
      console.log(err);
    });
  }

  // Warning
  if (Cookies.get('termsAccepted') == null) {
    $('#modalWarning').modal('show');
  }

  // Private key login
  $('#privlogintoggle').click(function() {
   var state = $('#privlogintoggle').attr('aria-pressed');
   if(state == "false") {
    $('#email').val("");
    $('#email').prop("disabled", true);
    $('#password').prop("placeholder", "Private Key");
   } else {
    $('#email').prop("disabled", false);
    $('#password').prop("placeholder", "Password");
   }
  });

  // Copying to clipboard - Tooltip
  $('.clipboard').tooltip({
    trigger: 'click',
    placement: 'bottom'
  });

  function setTooltip(message) {
    $('.clipboard')
      .attr('data-original-title', message)
      .tooltip('show');
  }

  function hideTooltip() {
    setTimeout(function() {
      $('.clipboard').tooltip('hide');
    }, 1000);
  }

  // Clipboard
  var clipboard = new ClipboardJS('.clipboard');

  clipboard.on('success', function(e) {
    setTooltip('Copied!');
    hideTooltip();
  });

  clipboard.on('error', function(e) {
    setTooltip('Failed!');
    hideTooltip();
  });

  "use strict";
  var options = {};
  options.ui = {
    container: "#pwd-container",
    showVerdictsInsideProgressBar: true,
    viewports: {
      progress: ".pwstrength_viewport_progress",
      errors: ".pwstrength_viewport_errors"
    }
  };
  options.common = {
    debug: false,
    onLoad: function() {
      $('#messages').text('Start typing password');
    }
  };
  $(':password').pwstrength(options);
});


(function (jQuery) {
// Source: src/rules.js




var rulesEngine = {};

try {
    if (!jQuery && module && module.exports) {
        var jQuery = require("jquery"),
            jsdom = require("jsdom").jsdom;
        jQuery = jQuery(jsdom().parentWindow);
    }
} catch (ignore) {}

(function ($, rulesEngine) {
    "use strict";
    var validation = {};

    rulesEngine.forbiddenSequences = [
        "0123456789", "abcdefghijklmnopqrstuvwxyz", "qwertyuiop", "asdfghjkl",
        "zxcvbnm", "!@#$%^&*()_+"
    ];

    validation.wordNotEmail = function (options, word, score) {
        if (word.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i)) {
            return score;
        }
        return 0;
    };

    validation.wordLength = function (options, word, score) {
        var wordlen = word.length,
            lenScore = Math.pow(wordlen, options.rules.raisePower);
        if (wordlen < options.common.minChar) {
            lenScore = (lenScore + score);
        }
        return lenScore;
    };

    validation.wordSimilarToUsername = function (options, word, score) {
        var username = $(options.common.usernameField).val();
        if (username && word.toLowerCase().match(username.toLowerCase())) {
            return score;
        }
        return 0;
    };

    validation.wordTwoCharacterClasses = function (options, word, score) {
        if (word.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) ||
                (word.match(/([a-zA-Z])/) && word.match(/([0-9])/)) ||
                (word.match(/(.[!,@,#,$,%,\^,&,*,?,_,~])/) && word.match(/[a-zA-Z0-9_]/))) {
            return score;
        }
        return 0;
    };

    validation.wordRepetitions = function (options, word, score) {
        if (word.match(/(.)\1\1/)) { return score; }
        return 0;
    };

    validation.wordSequences = function (options, word, score) {
        var found = false,
            j;
        if (word.length > 2) {
            $.each(rulesEngine.forbiddenSequences, function (idx, seq) {
                var sequences = [seq, seq.split('').reverse().join('')];
                $.each(sequences, function (idx, sequence) {
                    for (j = 0; j < (word.length - 2); j += 1) { // iterate the word trough a sliding window of size 3:
                        if (sequence.indexOf(word.toLowerCase().substring(j, j + 3)) > -1) {
                            found = true;
                        }
                    }
                });
            });
            if (found) { return score; }
        }
        return 0;
    };

    validation.wordLowercase = function (options, word, score) {
        return word.match(/[a-z]/) && score;
    };

    validation.wordUppercase = function (options, word, score) {
        return word.match(/[A-Z]/) && score;
    };

    validation.wordOneNumber = function (options, word, score) {
        return word.match(/\d+/) && score;
    };

    validation.wordThreeNumbers = function (options, word, score) {
        return word.match(/(.*[0-9].*[0-9].*[0-9])/) && score;
    };

    validation.wordOneSpecialChar = function (options, word, score) {
        return word.match(/.[!,@,#,$,%,\^,&,*,?,_,~]/) && score;
    };

    validation.wordTwoSpecialChar = function (options, word, score) {
        return word.match(/(.*[!,@,#,$,%,\^,&,*,?,_,~].*[!,@,#,$,%,\^,&,*,?,_,~])/) && score;
    };

    validation.wordUpperLowerCombo = function (options, word, score) {
        return word.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && score;
    };

    validation.wordLetterNumberCombo = function (options, word, score) {
        return word.match(/([a-zA-Z])/) && word.match(/([0-9])/) && score;
    };

    validation.wordLetterNumberCharCombo = function (options, word, score) {
        return word.match(/([a-zA-Z0-9].*[!,@,#,$,%,\^,&,*,?,_,~])|([!,@,#,$,%,\^,&,*,?,_,~].*[a-zA-Z0-9])/) && score;
    };

    rulesEngine.validation = validation;

    rulesEngine.executeRules = function (options, word) {
        var totalScore = 0;

        $.each(options.rules.activated, function (rule, active) {
            if (active) {
                var score = options.rules.scores[rule],
                    funct = rulesEngine.validation[rule],
                    result,
                    errorMessage;

                if (!$.isFunction(funct)) {
                    funct = options.rules.extra[rule];
                }

                if ($.isFunction(funct)) {
                    result = funct(options, word, score);
                    if (result) {
                        totalScore += result;
                    }
                    if (result < 0 || (!$.isNumeric(result) && !result)) {
                        errorMessage = options.ui.spanError(options, rule);
                        if (errorMessage.length > 0) {
                            options.instances.errors.push(errorMessage);
                        }
                    }
                }
            }
        });

        return totalScore;
    };
}(jQuery, rulesEngine));

try {
    if (module && module.exports) {
        module.exports = rulesEngine;
    }
} catch (ignore) {}

// Source: src/options.js




var defaultOptions = {};

defaultOptions.common = {};
defaultOptions.common.minChar = 6;
defaultOptions.common.usernameField = "#username";
defaultOptions.common.userInputs = [
    // Selectors for input fields with user input
];
defaultOptions.common.onLoad = undefined;
defaultOptions.common.onKeyUp = undefined;
defaultOptions.common.zxcvbn = false;
defaultOptions.common.debug = false;

defaultOptions.rules = {};
defaultOptions.rules.extra = {};
defaultOptions.rules.scores = {
    wordNotEmail: -100,
    wordLength: -50,
    wordSimilarToUsername: -100,
    wordSequences: -50,
    wordTwoCharacterClasses: 2,
    wordRepetitions: -25,
    wordLowercase: 1,
    wordUppercase: 3,
    wordOneNumber: 3,
    wordThreeNumbers: 5,
    wordOneSpecialChar: 3,
    wordTwoSpecialChar: 5,
    wordUpperLowerCombo: 2,
    wordLetterNumberCombo: 2,
    wordLetterNumberCharCombo: 2
};
defaultOptions.rules.activated = {
    wordNotEmail: true,
    wordLength: true,
    wordSimilarToUsername: true,
    wordSequences: false,
    wordTwoCharacterClasses: false,
    wordRepetitions: false,
    wordLowercase: true,
    wordUppercase: true,
    wordOneNumber: true,
    wordThreeNumbers: true,
    wordOneSpecialChar: true,
    wordTwoSpecialChar: true,
    wordUpperLowerCombo: true,
    wordLetterNumberCombo: true,
    wordLetterNumberCharCombo: true
};
defaultOptions.rules.raisePower = 1.4;

defaultOptions.ui = {};
defaultOptions.ui.bootstrap2 = false;
defaultOptions.ui.showProgressBar = true;
defaultOptions.ui.showPopover = false;
defaultOptions.ui.showStatus = false;
defaultOptions.ui.spanError = function (options, key) {
    "use strict";
    var text = options.ui.errorMessages[key];
    if (!text) { return ''; }
    return '<span style="color: #d52929">' + text + '</span>';
};
defaultOptions.ui.popoverError = function (errors) {
    "use strict";
    var message = "<div>Errors:<ul class='error-list' style='margin-bottom: 0;'>";

    jQuery.each(errors, function (idx, err) {
        message += "<li>" + err + "</li>";
    });
    message += "</ul></div>";
    return message;
};
defaultOptions.ui.errorMessages = {
    wordLength: "Your password is too short",
    wordNotEmail: "Do not use your email as your password",
    wordSimilarToUsername: "Your password cannot contain your username",
    wordTwoCharacterClasses: "Use different character classes",
    wordRepetitions: "Too many repetitions",
    wordSequences: "Your password contains sequences"
};
defaultOptions.ui.verdicts = ["Weak", "Normal", "Medium", "Strong", "Very Strong"];
defaultOptions.ui.showVerdicts = true;
defaultOptions.ui.showVerdictsInsideProgressBar = false;
defaultOptions.ui.showErrors = true;
defaultOptions.ui.container = undefined;
defaultOptions.ui.viewports = {
    progress: undefined,
    verdict: undefined,
    errors: undefined
};
defaultOptions.ui.scores = [14, 26, 38, 50];

// Source: src/ui.js




var ui = {};

(function ($, ui) {
    "use strict";

    var barClasses = ["danger", "warning", "success"],
        statusClasses = ["error", "warning", "success"];

    ui.getContainer = function (options, $el) {
        var $container;

        $container = $(options.ui.container);
        if (!($container && $container.length === 1)) {
            $container = $el.parent();
        }
        return $container;
    };

    ui.findElement = function ($container, viewport, cssSelector) {
        if (viewport) {
            return $container.find(viewport).find(cssSelector);
        }
        return $container.find(cssSelector);
    };

    ui.getUIElements = function (options, $el) {
        var $container, result;

        if (options.instances.viewports) {
            return options.instances.viewports;
        }

        $container = ui.getContainer(options, $el);

        result = {};
        result.$progressbar = ui.findElement($container, options.ui.viewports.progress, "div.progress");
        if (options.ui.showVerdictsInsideProgressBar) {
            result.$verdict = result.$progressbar.find("span.password-verdict");
        }

        if (!options.ui.showPopover) {
            if (!options.ui.showVerdictsInsideProgressBar) {
                result.$verdict = ui.findElement($container, options.ui.viewports.verdict, "span.password-verdict");
            }
            result.$errors = ui.findElement($container, options.ui.viewports.errors, "ul.error-list");
        }

        options.instances.viewports = result;
        return result;
    };

    ui.initProgressBar = function (options, $el) {
        var $container = ui.getContainer(options, $el),
            progressbar = "<div class='progress'><div class='";

        if (!options.ui.bootstrap2) {
            progressbar += "progress-";
        }
        progressbar += "bar'>";
        if (options.ui.showVerdictsInsideProgressBar) {
            progressbar += "<span class='password-verdict'></span>";
        }
        progressbar += "</div></div>";

        if (options.ui.viewports.progress) {
            $container.find(options.ui.viewports.progress).append(progressbar);
        } else {
            $(progressbar).insertAfter($el);
        }
    };

    ui.initHelper = function (options, $el, html, viewport) {
        var $container = ui.getContainer(options, $el);
        if (viewport) {
            $container.find(viewport).append(html);
        } else {
            $(html).insertAfter($el);
        }
    };

    ui.initVerdict = function (options, $el) {
        ui.initHelper(options, $el, "<span class='password-verdict'></span>",
                        options.ui.viewports.verdict);
    };

    ui.initErrorList = function (options, $el) {
        ui.initHelper(options, $el, "<ul class='error-list'></ul>",
                        options.ui.viewports.errors);
    };

    ui.initPopover = function (options, $el) {
        $el.popover("destroy");
        $el.popover({
            html: true,
            placement: "bottom",
            trigger: "manual",
            content: " "
        });
    };

    ui.initUI = function (options, $el) {
        if (options.ui.showPopover) {
            ui.initPopover(options, $el);
        } else {
            if (options.ui.showErrors) { ui.initErrorList(options, $el); }
            if (options.ui.showVerdicts && !options.ui.showVerdictsInsideProgressBar) {
                ui.initVerdict(options, $el);
            }
        }
        if (options.ui.showProgressBar) {
            ui.initProgressBar(options, $el);
        }
    };

    ui.possibleProgressBarClasses = ["danger", "warning", "success"];

    ui.updateProgressBar = function (options, $el, cssClass, percentage) {
        var $progressbar = ui.getUIElements(options, $el).$progressbar,
            $bar = $progressbar.find(".progress-bar"),
            cssPrefix = "progress-";

        if (options.ui.bootstrap2) {
            $bar = $progressbar.find(".bar");
            cssPrefix = "";
        }

        $.each(ui.possibleProgressBarClasses, function (idx, value) {
            $bar.removeClass(cssPrefix + "bar-" + value);
        });
        $bar.addClass(cssPrefix + "bar-" + barClasses[cssClass]);
        $bar.css("width", percentage + '%');
    };

    ui.updateVerdict = function (options, $el, text) {
        var $verdict = ui.getUIElements(options, $el).$verdict;
        $verdict.text(text);
    };

    ui.updateErrors = function (options, $el) {
        var $errors = ui.getUIElements(options, $el).$errors,
            html = "";
        $.each(options.instances.errors, function (idx, err) {
            html += "<li>" + err + "</li>";
        });
        $errors.html(html);
    };

    ui.updatePopover = function (options, $el, verdictText) {
        var popover = $el.data("bs.popover"),
            html = "",
            hide = true;

        if (options.ui.showVerdicts &&
                !options.ui.showVerdictsInsideProgressBar &&
                verdictText.length > 0) {
            html = "<h5><span class='password-verdict'>" + verdictText +
                "</span></h5>";
            hide = false;
        }
        if (options.ui.showErrors) {
            if (options.instances.errors.length > 0) {
                hide = false;
            }
            html += options.ui.popoverError(options.instances.errors);
        }

        if (hide) {
            $el.popover("hide");
            return;
        }

        if (options.ui.bootstrap2) { popover = $el.data("popover"); }

        if (popover.$arrow && popover.$arrow.parents("body").length > 0) {
            $el.find("+ .popover .popover-content").html(html);
        } else {
            // It's hidden
            popover.options.content = html;
            $el.popover("show");
        }
    };

    ui.updateFieldStatus = function (options, $el, cssClass) {
        var targetClass = options.ui.bootstrap2 ? ".control-group" : ".form-group",
            $container = $el.parents(targetClass).first();

        $.each(statusClasses, function (idx, css) {
            if (!options.ui.bootstrap2) { css = "has-" + css; }
            $container.removeClass(css);
        });

        cssClass = statusClasses[cssClass];
        if (!options.ui.bootstrap2) { cssClass = "has-" + cssClass; }
        $container.addClass(cssClass);
    };

    ui.percentage = function (score, maximun) {
        var result = Math.floor(100 * score / maximun);
        result = result < 0 ? 0 : result;
        result = result > 100 ? 100 : result;
        return result;
    };

    ui.getVerdictAndCssClass = function (options, score) {
        var cssClass, verdictText, level;

        if (score <= 0) {
            cssClass = 0;
            level = -1;
            verdictText = options.ui.verdicts[0];
        } else if (score < options.ui.scores[0]) {
            cssClass = 0;
            level = 0;
            verdictText = options.ui.verdicts[0];
        } else if (score < options.ui.scores[1]) {
            cssClass = 0;
            level = 1;
            verdictText = options.ui.verdicts[1];
        } else if (score < options.ui.scores[2]) {
            cssClass = 1;
            level = 2;
            verdictText = options.ui.verdicts[2];
        } else if (score < options.ui.scores[3]) {
            cssClass = 1;
            level = 3;
            verdictText = options.ui.verdicts[3];
        } else {
            cssClass = 2;
            level = 4;
            verdictText = options.ui.verdicts[4];
        }

        return [verdictText, cssClass, level];
    };

    ui.updateUI = function (options, $el, score) {
        var cssClass, barPercentage, verdictText;

        cssClass = ui.getVerdictAndCssClass(options, score);
        verdictText = cssClass[0];
        cssClass = cssClass[1];

        if (options.ui.showProgressBar) {
            barPercentage = ui.percentage(score, options.ui.scores[3]);
            ui.updateProgressBar(options, $el, cssClass, barPercentage);
            if (options.ui.showVerdictsInsideProgressBar) {
                ui.updateVerdict(options, $el, verdictText);
            }
        }

        if (options.ui.showStatus) {
            ui.updateFieldStatus(options, $el, cssClass);
        }

        if (options.ui.showPopover) {
            ui.updatePopover(options, $el, verdictText);
        } else {
            if (options.ui.showVerdicts && !options.ui.showVerdictsInsideProgressBar) {
                ui.updateVerdict(options, $el, verdictText);
            }
            if (options.ui.showErrors) {
                ui.updateErrors(options, $el);
            }
        }
    };
}(jQuery, ui));

// Source: src/methods.js




var methods = {};

(function ($, methods) {
    "use strict";
    var onKeyUp, applyToAll;

    onKeyUp = function (event) {
        var $el = $(event.target),
            options = $el.data("pwstrength-bootstrap"),
            word = $el.val(),
            userInputs,
            verdictText,
            verdictLevel,
            score;

        if (options === undefined) { return; }

        options.instances.errors = [];
        if (options.common.zxcvbn) {
            userInputs = [];
            $.each(options.common.userInputs, function (idx, selector) {
                userInputs.push($(selector).val());
            });
            userInputs.push($(options.common.usernameField).val());
            score = zxcvbn(word, userInputs).entropy;
        } else {
            score = rulesEngine.executeRules(options, word);
        }
        ui.updateUI(options, $el, score);
        verdictText = ui.getVerdictAndCssClass(options, score);
        verdictLevel = verdictText[2];
        verdictText = verdictText[0];

        if (options.common.debug) { console.log(score + ' - ' + verdictText); }

        if ($.isFunction(options.common.onKeyUp)) {
            options.common.onKeyUp(event, {
                score: score,
                verdictText: verdictText,
                verdictLevel: verdictLevel
            });
        }
    };

    methods.init = function (settings) {
        this.each(function (idx, el) {
            // Make it deep extend (first param) so it extends too the
            // rules and other inside objects
            var clonedDefaults = $.extend(true, {}, defaultOptions),
                localOptions = $.extend(true, clonedDefaults, settings),
                $el = $(el);

            localOptions.instances = {};
            $el.data("pwstrength-bootstrap", localOptions);
            $el.on("keyup", onKeyUp);
            $el.on("change", onKeyUp);
            $el.on("onpaste", onKeyUp);

            ui.initUI(localOptions, $el);
            if ($.trim($el.val())) { // Not empty, calculate the strength
                $el.trigger("keyup");
            }

            if ($.isFunction(localOptions.common.onLoad)) {
                localOptions.common.onLoad();
            }
        });

        return this;
    };

    methods.destroy = function () {
        this.each(function (idx, el) {
            var $el = $(el),
                options = $el.data("pwstrength-bootstrap"),
                elements = ui.getUIElements(options, $el);
            elements.$progressbar.remove();
            elements.$verdict.remove();
            elements.$errors.remove();
            $el.removeData("pwstrength-bootstrap");
        });
    };

    methods.forceUpdate = function () {
        this.each(function (idx, el) {
            var event = { target: el };
            onKeyUp(event);
        });
    };

    methods.addRule = function (name, method, score, active) {
        this.each(function (idx, el) {
            var options = $(el).data("pwstrength-bootstrap");

            options.rules.activated[name] = active;
            options.rules.scores[name] = score;
            options.rules.extra[name] = method;
        });
    };

    applyToAll = function (rule, prop, value) {
        this.each(function (idx, el) {
            $(el).data("pwstrength-bootstrap").rules[prop][rule] = value;
        });
    };

    methods.changeScore = function (rule, score) {
        applyToAll.call(this, rule, "scores", score);
    };

    methods.ruleActive = function (rule, active) {
        applyToAll.call(this, rule, "activated", active);
    };

    $.fn.pwstrength = function (method) {
        var result;

        if (methods[method]) {
            result = methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            result = methods.init.apply(this, arguments);
        } else {
            $.error("Method " +  method + " does not exist on jQuery.pwstrength-bootstrap");
        }

        return result;
    };
}(jQuery, methods));
}(jQuery));
