function ConvertTime(x) {
	//This splits the universal time format to more readable.
	var date = x.split("T");
	var time1 = date[1].split("Z")[0];
	var Time = time1.split(":");
	var time2 = Time[2].split(".")[0];

	Time[2] = time2;
	Time[0] = Number(Time[0]) + 3; //Add three hours to get Finland timezone
	return "<b>Date:</b> " + date[0] + " <b>Time:</b> " + Time.join(":"); //join all and return
}

//This is the main function which is loaded at page load. Gets all questions.
function GetQuestions() {
	var row = "";
	$.get("http://127.0.0.1:8080/api/questions/", function(data, status) {
		var questions = data["_embedded"]["questions"]; //information from response body
		for (var i in questions) {
			//loop through questions and format them to table rows.
			row =
				row +
				"<tr id=" +
				i +
				"><td id=" +
				i +
				"A>" +
				questions[i].question +
				"</td><td id=" +
				i +
				'B style="display:none;">' +
				questions[i]._links.self.href.split("/")[2] +
				"</td><td width='70'><button class='button'   onclick=GetQuestion('" +
				i +
				"B')>Show answers</button></td><tr>";
		}
		//Get questions table by id and set the content to include all question rows.
		document.getElementById("questions").innerHTML = '<table id="qlist" border=1  width="440">' + row + "</table>";
		row = ""; //Clean row variable after table content is set.
	});
}

//This is a function to get one question AND answers for it
function GetQuestion(i) {
	var row = "";
	if (i.length == 2) {
		//This is used by two different functions, this determines from where the id is gotten from
		var get_id = document.getElementById(i).innerHTML;
	} else {
		var get_id = i;
	}
	document.getElementById("answer").innerHTML = "<table></table>";
	$.get("http://127.0.0.1:8080/api/questions/" + get_id, function(data, status) {
		//get question
		$.get("http://127.0.0.1:8080/api/questions/" + get_id + "/answers", function(data2) {
			//get answers
			console.log(get_id);
			var all_answers = data2._embedded.answers;

			for (i in all_answers) {
				//loop through answers and create rows.
				row =
					row +
					"<tr><td width='300' colspan='2'><b>Answer:</b>" +
					all_answers[i].answer +
					"</td><td style='display:none;''><b>ID:</b>" +
					all_answers[i]._id +
					"</td><td width='50'><button class='button'   onclick=GetAnswer('" +
					get_id +
					"','" +
					all_answers[i]._id +
					"')>Show Answer</button></td></tr>";
			}

			document.getElementById("question").innerHTML = //content to question table
				'<table border=1 id="Answer_table" width="450"><tr><td width="150"><b>Name: </b>' +
				data.author +
				"</td><td colspan='2' width='300'><b>Question:</b>" +
				data.question +
				"</td><tr><td colspan='3'>" +
				ConvertTime(data.time) +
				'</td></tr></tr><tr><td colspan="4"><table width="440">' +
				row +
				"</table></td></tr></table>";
			row = "";
			document.getElementById("_answer").innerHTML = // Add answer table is created
				'<tr><td width="300"><b>Answer:</b></td><td><b>Name: </b></td><td width="50"></td></tr><tr><td><input class="input" type="text" id="add_answer" /></td><td><input class="input" type="text" id="add_aauthor" /></td><td><button class="button"  onclick=addAnswer("' +
				get_id +
				'")>Add Answer</button></td></tr>';
		});
	});
}

//This shows an invidual answer.
function GetAnswer(qid, aid) {
	$.get("http://127.0.0.1:8080/api/questions/" + qid + "/answers/" + aid, function(data, status) {
		document.getElementById("answer").innerHTML = //create answer table
			'<table border=1 id="Get_Answer"><tr><td><b>Author</b></td><td><b>Answer</b></td><td colspan="2"></td></tr><tr><td><input class="input" type="text" id="author_field" value="' +
			data.author +
			'"></td><td><input class="input" type="text" id="answer_field" value="' +
			data.answer +
			'"></td><td width="100">' +
			ConvertTime(data.time) +
			"</td><td><button class='button' onclick=EditAnswer('" +
			qid +
			"','" +
			aid +
			"')>Edit</button><button class='button'   onclick=DeleteAnswer('" +
			qid +
			"','" +
			aid +
			"')>Delete</button></td></tr></table>";
	});
}

// Function to edit question.
function EditAnswer(qid, aid) {
	//Author and answer are on input fields for editing. Get values from them
	var author = document.getElementById("author_field").value;
	var answer = document.getElementById("answer_field").value;

	$.ajax({
		//Lets use ajax for PUT method
		url: "http://127.0.0.1:8080/api/questions/" + qid + "/answers/" + aid,
		contentType: "application/json",
		type: "PUT",
		data: '{ "author":"' + author + '", "answer":"' + answer + '" }', //body
		success: function(data) {
			//when PUT is successfull, do this
			GetQuestion(qid); //update answers table for one question.
			console.log("Updated!");
		},
		error: function(jqxhr) {
			var error = JSON.parse(jqxhr.responseText);
			document.getElementById("error").innerHTML = error.message;
		}
	});
}

//Delete an answer
function DeleteAnswer(qid, aid) {
	$.ajax({
		//ajax  for DELETE
		url: "http://127.0.0.1:8080/api/questions/" + qid + "/answers/" + aid,
		type: "DELETE",
		success: function() {
			GetQuestion(qid); //update answers table for one question.
			document.getElementById("answer").innerHTML = "<table></table>"; //hide answer-table because there is no answer
			console.log("Deleted!");
		}
	});
}

//add new question to database
function addQuestion() {
	//input fields from which the author and question are taken.
	var author = document.getElementById("add_qauthor").value;
	var question = document.getElementById("add_question").value;

	$.ajax({
		//ajax for POST
		url: "http://127.0.0.1:8080/api/questions/",
		contentType: "application/json",
		type: "POST",
		data: '{ "question":"' + question + '", "author":"' + author + '" }', //body
		success: function() {
			GetQuestions(); //again update the table with new question.
			document.getElementById("error").innerHTML = "";
		},
		error: function(jqxhr) {
			var error = JSON.parse(jqxhr.responseText);
			document.getElementById("error").innerHTML = error.message;
		}
	});
}

//Function for add answer table.
function addAnswer(id) {
	//data from input fields:
	var author = document.getElementById("add_aauthor").value;
	var answer = document.getElementById("add_answer").value;

	$.ajax({
		//ajax for POST
		url: "http://127.0.0.1:8080/api/questions/" + id + "/answers/",
		contentType: "application/json",
		type: "POST",
		data: '{ "answer":"' + answer + '", "author":"' + author + '" }', //body
		success: function() {
			GetQuestion(id); //update answers table with new answer.
		},
		error: function(jqxhr) {
			var error = JSON.parse(jqxhr.responseText);
			document.getElementById("error").innerHTML = error.message;
		}
	});
}
