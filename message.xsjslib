
let conSchema = "DigAcc",
	conMessageTable = "digital-account.data::DigAccMessage.Message";
	
function createMessage(param) {

    let before = param.beforeTableName;
    let after = param.afterTableName;
    
    let content = "";
    let pStmt = param.connection.prepareStatement('select "content" from "' + after +'"');
    var rs = pStmt.executeQuery();
	if (rs.next()) {
		content = rs.getNString(1);
		$.trace.error(JSON.stringify(content));
	}
	rs.close();
    pStmt.close();
    
    let id = 0;
    pStmt = param.connection.prepareStatement('select max( "id" ) from "'+conSchema+'"."'+ conMessageTable + '"');
	rs = pStmt.executeQuery();
	if (rs.next()) {
		id = Number(rs.getNString(1)) + 1;
	}
	rs.close();
	pStmt.close();
	
    pStmt = param.connection.prepareStatement('insert into "'+conMessageTable+'"("id", "createdTime", "content") values(?, now(), ?)');
    pStmt.setInteger(1, id);
    pStmt.setNString(2, content);
    pStmt.executeUpdate();
    pStmt.close();
}