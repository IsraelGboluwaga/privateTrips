if(process.env.NODE_ENV  === 'production'){
	module.exports ={
		mongoURI:'mongodb://ola:olamide1@ds047335.mlab.com:47335/privatetrips'
 
	}
}else{
		module.exports = {
		mongoURI :'mongodb://localhost/private-trips'
	}
}

