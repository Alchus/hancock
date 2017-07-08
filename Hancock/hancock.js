
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

function cb(error, result) {
    if (error) {
        
        console.log(error);
        setTargetBlock('');
        $('#web3fail').show();
    } else {
        setTargetBlock(result + 5);
        $('#web3fail').hide();
    }
    
}

function getWeb3LatestBlock() {
    web3.eth.getBlockNumber(function (error, result) {
        if (error) {
            console.log(error);
            setTargetBlock('');
            $('#web3fail').show();
        } else {
            setTargetBlock(result + 5);
            $('#web3fail').hide();
        }
    });
    
}