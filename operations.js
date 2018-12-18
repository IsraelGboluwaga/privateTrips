const fs = require('fs');



var addNote=(title, content) =>{
	var sessions =[];
	var session ={
		title,
		content
	};
	sessions.push(session);
	fs.writeFileSync('sessions-data.json', JSON.stringify(sessions));
};





module.exports ={
	addNote,
	
}