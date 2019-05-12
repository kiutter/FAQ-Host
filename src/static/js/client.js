function ConvertTime(x) {
	var date = x.split("T");
	var Time = date[1].split("Z")[0];
	var Times = Time.split(":");
	var Timess = Times[2].split(".")[0];

	Times[2] = Timess;
	Times[0] = Number(Times[0]) + 3;
	return "<b>Date:</b> " + date[0] + " <b>Time:</b> " + Times.join(":");
}

function GetQuestions() {
	var row = "";
	$.get("http://127.0.0.1:8080/api/questions/", function(data, status) {
		//var response = JSON.parse(data);
		//console.log(data["_embedded"]["questions"]);
		var questions = data["_embedded"]["questions"];
		for (var i in questions) {
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
		document.getElementById("questions").innerHTML = '<table id="qlist" border=1  width="440">' + row + "</table>";
		row = "";
	});
}
function GetQuestion(i) {
	var row = "";
	if (i.length == 2) {
		var get_id = document.getElementById(i).innerHTML;
	} else {
		var get_id = i;
	}
	document.getElementById("answer").innerHTML = "<table></table>";
	$.get("http://127.0.0.1:8080/api/questions/" + get_id, function(data, status) {
		$.get("http://127.0.0.1:8080/api/questions/" + get_id + "/answers", function(data2) {
			//console.log(data2._embedded.answers[0]);
			var all_answers = data2._embedded.answers;

			for (i in all_answers) {
				row =
					row +
					"<tr><td width='300'><b>Answer:</b>" +
					all_answers[i].answer +
					"</td><td><b>ID:</b>" +
					all_answers[i]._id +
					"</td><td width='50'><button class='button'   onclick=GetAnswer('" +
					get_id +
					"','" +
					all_answers[i]._id +
					"')>Show Answer</button></td></tr>";
			}

			document.getElementById("question").innerHTML =
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
			document.getElementById("_answer").innerHTML =
				'<tr><td width="300"><b>Answer:</b></td><td><b>Name: </b></td><td width="50"></td></tr><tr><td><input class="input" type="text" id="add_answer" /></td><td><input class="input" type="text" id="add_aauthor" /></td><td><button class="button"  onclick=addAnswer("' +
				get_id +
				'")>Add Answer</button></td></tr>';
		});
	});
}

function GetAnswer(qid, aid) {
	$.get("http://127.0.0.1:8080/api/questions/" + qid + "/answers/" + aid, function(data, status) {
		document.getElementById("answer").innerHTML =
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

function EditAnswer(qid, aid) {
	var author = document.getElementById("author_field").value;
	var answer = document.getElementById("answer_field").value;

	$.ajax({
		url: "http://127.0.0.1:8080/api/questions/" + qid + "/answers/" + aid,
		contentType: "application/json",
		type: "PUT",
		data: '{ "author":"' + author + '", "answer":"' + answer + '" }',
		success: function(data) {
			GetQuestion(qid);
			console.log("Updated!");
		}
	});
}
function DeleteAnswer(qid, aid) {
	var author = document.getElementById("author_field").value;
	var answer = document.getElementById("answer_field").value;

	$.ajax({
		url: "http://127.0.0.1:8080/api/questions/" + qid + "/answers/" + aid,
		type: "DELETE",
		success: function() {
			GetQuestion(qid);
			document.getElementById("answer").innerHTML = "<table></table>";
			console.log("Deleted!");
		}
	});
}
function addQuestion() {
	var author = document.getElementById("add_qauthor").value;
	var question = document.getElementById("add_question").value;

	$.ajax({
		url: "http://127.0.0.1:8080/api/questions/",
		contentType: "application/json",
		type: "POST",
		data: '{ "question":"' + question + '", "author":"' + author + '" }',
		success: function() {
			GetQuestions();
		}
	});
}

function addAnswer(id) {
	var author = document.getElementById("add_aauthor").value;
	var answer = document.getElementById("add_answer").value;

	$.ajax({
		url: "http://127.0.0.1:8080/api/questions/" + id + "/answers/",
		contentType: "application/json",
		type: "POST",
		data: '{ "answer":"' + answer + '", "author":"' + author + '" }',
		success: function() {
			GetQuestion(id);
		}
	});
}
