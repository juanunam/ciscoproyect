traffic = function(postal) {
    //Define URL
    var url = postal;
    //Define XML request
    var xmlHttp =  new XMLHttpRequest();
    //Define state change
    xmlHttp.onreadystatechange = function() {
        //Validate state
        if(xmlHttp.readyState === 4)
            //Validate status the Server
            if(xmlHttp.status === 200) {
                //Insert code
           		console.log(xmlHttp.response )
       		}
    };
    //Open connection to server
    xmlHttp.open('GET', url, true);
    //Send petition
    xmlHttp.send();
}

