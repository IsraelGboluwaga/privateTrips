if(process.env.NODE_ENV  === 'production'){
	module.exports ={
		mongoURI:'mongodb://admin:saamukupo99@ds127545.mlab.com:27545/todo-app'

	}
}else{
		module.exports = {
		mongoURI :'mongodb://localhost/private-trips'
	}
}