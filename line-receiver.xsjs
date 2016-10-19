// Global constant variables
var conSQLConnection = "digital-account::DigAccMessage",
	conSchema = "\"DigAcc\"",
	conMessageTable = "\"digital-account.data::DigAccMessage.Message\"";
var conDestPackage = "digital-account",
    conLineDestName = "LineProfiles";

var contentType;

function saveMessage(content) {
	var body;

	var id = 0;
	var conn = $.db.getConnection(conSQLConnection);
	conn.prepareStatement("SET SCHEMA " + conSchema).execute(); // Setting the SCHEMA
	
	var pStmt = conn.prepareStatement("select max( \"id\" ) from " + conMessageTable);
	var rs = pStmt.executeQuery();
	if (rs.next()) {
		id = Number(rs.getNString(1)) + 1;
	}
	rs.close();
	
	pStmt = conn.prepareStatement("insert INTO "+conMessageTable+'("id", "createdTime", "content") values(?, now(), ?)');
	pStmt.setInteger(1, id);
	pStmt.setNString(2, JSON.stringify(content));
	pStmt.executeUpdate();
	pStmt.close();

	// All database changes must be explicitly commited
	conn.commit();
	
	var i = 0;
	if(content.result && content.result.length > 0) {
		for(i = 0; i < content.result.length; i++) {
			getUserProfiles(content.result[i].to);
		}
	}

	$.response.status = $.net.http.OK;
	body = {
			id: id,
			info: "Success!"
		};
	
	if (conn) {
		conn.close();
	}
	return body;
}

//Implementation of GET call
function handleGet() {
    var messages = [];
	var conn = $.db.getConnection(conSQLConnection);
	conn.prepareStatement("SET SCHEMA " + conSchema).execute(); // Setting the SCHEMA
	var pStmt = conn.prepareStatement('select "id", "createdTime", "content" from ' + conMessageTable);
	var rs = pStmt.executeQuery();
	while (rs.next()) {
		messages.push({
			id: rs.getInteger(1),
			createdTime: rs.getTimestamp(2),
			content: rs.getNString(3)
		});
	}
	rs.close();
	
	if (conn) {
		conn.close();
	}
	
	// Retrieve data here and return results in JSON/other format 
	$.response.status = $.net.http.OK;
	return {"result": messages};
}

//Implementation of POST call
function handlePost() {
	var bodyStr = $.request.body ? $.request.body.asString() : undefined;
	if ( bodyStr === undefined ){
		 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		 return {"myResult":"Missing BODY"};
	}
	return saveMessage(JSON.parse(bodyStr));
}

function getUserProfiles( persons ) {
	var mids = persons.join(",");
	
   var dest = $.net.http.readDestination(conDestPackage, conLineDestName);
   var client = new $.net.http.Client();
   var req = new $.web.WebRequest($.net.http.GET, "?mids="+mids);
   req.headers.set("X-Line-ChannelID", "1480700231");
   req.headers.set("X-Line-ChannelSecret", "2fbbc5490892c7ce4a7294ff7d3700d9");
   req.headers.set("X-Line-Trusted-User-With-ACL", "u93892c0a44ffce86e7b5cb67edc55677");
   client.request(req, dest);
   var response = client.getResponse();  
   var contacts = JSON.parse(response.body.asString()).contacts;
   
   var i = 0;
   for(i = 0; i < contacts.length; i++) {
	    $.trace.info(contacts[i]);
   }
}

// Check Content type headers and parameters
function validateInput() {

	// Check content-type is application/json
	contentType = $.request.contentType;

	if ( contentType === null || contentType.startsWith("application/json") === false){
		 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		 $.response.setBody("Wrong content type request use application/json");
		return false;
	}
	
	return true;
}
	
// Request process 
function processRequest(){
    if (validateInput()){
		try {
		    switch ( $.request.method ) {
		        //Handle your GET calls here
		        case $.net.http.GET:
		            $.response.setBody(JSON.stringify(handleGet()));
		            break;
		            //Handle your POST calls here
		        case $.net.http.POST:
		            $.response.setBody(JSON.stringify(handlePost()));
		            break; 
		        case $.net.http.DEL:
		            //
		            break; 
		        //Handle your other methods: PUT, DELETE
		        default:
		            $.response.status = $.net.http.METHOD_NOT_ALLOWED;
		            $.response.setBody("Wrong request method");		        
		            break;
		    }
		    $.response.contentType = "application/json";	    
		} catch (e) {
		    $.response.setBody("Failed to execute action: " + e.toString());
		}
	}
}

// Call request processing  
processRequest();