
httpGet = function (url, callback)
{
    var request = new XMLHttpRequest();
    request.onreadystatechange = function()
    {
        if (request.readyState == 4 && request.status == 200)
        {
            callback(request.responseText);
        }
    }; 
    request.open('GET', url);
    request.send();
}


function setTargetBlock(data) {
    $('#txtTargetBlock').val(data);
    //console.log(data);
}

function getEtherchainLatestBlock() {
    httpGet('https://etherchain.org/api/blocks/count',
        function (response) {
            var block = JSON.parse(response).data[0].count;
            setTargetBlock(block + 5);
        });
}


function getEtherchainBlockHash() {
    var block = parseInt($('#txtTargetBlock').val(), 10);
    console.log(block);
    if (+block === +block) {//if block is not NaN. Welcome to Javascript.
        httpGet('https://etherchain.org/api/block/' + block,
            function (response) {
                console.log(response);
            var blocks = JSON.parse(response).data;
            if ((blocks.length > 0) && (blocks[0].hash > 0)) {
                $('#txtBlockHash').val(blocks[0].hash);
            } else {
                $('#txtBlockHash').val("Block is not yet available.");
            }
        });
    }
}


function setRandomKey() {
    var data = "";
    var hexAlphabet = "0123456789abcdef"
    for (i = 0; i < 64; i++) {
        data = data + "" + hexAlphabet.charAt(Math.random() * 16);
    }
    console.log(data);
    $('#txtSecretKey').val(data);
}

function getWeb3LatestBlock() {
    if (typeof (web3) == undefined) {
        setTargetBlock('');
        $('#web3fail').show();
        return false;
    }
    web3.eth.getBlockNumber(function (error, result) {
        if (error) {
            console.log(error);
            setTargetBlock('');
            $('#web3fail').show();
            return false;
        } else {
            setTargetBlock(result + 5);
            $('#web3fail').hide();
            return true;
        }
    });

}

function getWeb3BlockHash() {
    if (typeof (web3) == undefined) {
        setTargetBlock('');
        $('#web3fail').show();
        return false;
    }
    web3.eth.getBlock($('#txtTargetBlock').val(), false, function (error, result) {
        if (error) {
            console.log(error);
            setTargetBlock('');
            $('#web3fail').show();
            return false;
        } else {
            console.log(result);
            $('#txtBlockHash').val(result.hash);
            $('#web3fail').hide();
            return true;
        }
    });
}

function generateRandomNumbers() {
    $('#txtOutput').val('');
    //var modulus = parseInt($('#txtModulus').val());
    var output = '';

    var hash = parseInt($('#txtBlockHash').val());
    if (isNaN(hash)) return false;
    //hash = new BigNumber(hash);
    console.log('block hash: ' + hash);

    var salt = parseInt($('#txtSecretKey').val());
    //salt = new BigNumber(salt);
    console.log('key: ' + salt);

    output = web3.sha3(hash + salt);
    console.log(output);
    $('#txtOutput').val(output);

}

function copyElementText(element) {
    element.select();
    document.execCommand('copy');
}

function generateCommitment() {
    var block = $('#txtTargetBlock').val();
    var key = $('#txtSecretKey').val();
    if (block && key) {
        var commit = web3.sha3(block + "" + key);
        $('#txtCommitment').val(commit);
    }
}

function verifyCommitment() {
    var block = $('#txtTargetBlock').val();
    var key = $('#txtSecretKey').val();
    var valid = (web3.sha3(block + "" + key) ==  $('#txtCommitment').val());
    if (valid) {
        $('#txtCommitment').addClass("valid").removeClass("invalid");
    } else {
        $('#txtCommitment').addClass("invalid").removeClass("valid");
    }
}

$(document).ready(function () {
    $('.step1').on('input', function () {
        generateCommitment();
        verifyCommitment();
    });

    $('.step1').on('click', function () {
        generateCommitment();
        verifyCommitment();
    });

    $('.step2').on('input', function () {
        verifyCommitment();
    });
});
