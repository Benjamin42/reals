var files = { 
	"EvansBk" : { "path" : "Bill Evans Fake Book.pdf", "inc" : 3},
	"Colorado" : { "path" : "COLOBK.PDF", "inc" : 3},
	"JazzFake" : { "path" : "Jazz Fake Book.pdf", "inc" : -1},
	"JazzLTD" : { "path" : "Jazz Ltd.pdf", "inc" : 7},
	"Library" : { "path" : "LIBRARY.PDF", "inc" : 4},
	"NewReal1" : { "path" : "The New Real Book I.pdf", "inc" : 15},
	"NewReal2" : { "path" : "The New Real Book II.pdf", "inc" : 11},
	"NewReal3" : { "path" : "The New Real Book III.pdf", "inc" : 10},
	"Realbk1" : { "path" : "The Real Book Volume I.pdf", "inc" : 8},
	"RealBk2" : { "path" : "The Real Book Volume II.pdf", "inc" : 7},
	"RealBk3" : { "path" : "The Real Book Volume III.pdf", "inc" : 5},
};

$(document).ready( function () {

	// Load data from sessionStorage if exists
	if (typeof sessionStorage != 'undefined') {
    	if ("data" in sessionStorage) {
    		data = JSON.parse(sessionStorage.data);
    	}
    }

    drawListTable();

    drawBookmarksTable();
});

drawListTable = function() {
    // Draw lines in table
    var lines = "";
	for (i in data) {
		//$('#listTable > tbody:last-child').append(constructLine(i));
		lines += constructLine(i);
	}

	$('#listContent').html(constructTable("listTable", lines));

    $('#listTable').DataTable({
    	"order" : [[ 1, "asc"], [2, "asc"]]
    });	
}

drawBookmarksTable = function() {
	var lines = "";
	for (i in data) {
		if (data[i].bookmarked) {
			lines += constructLine(i);
		}
	}
	if (lines != "") {
		$('#bookmarksContent').html(constructTable("bookmarksTable", lines));

	    $('#bookmarksTable').DataTable({
	    	"order" : [[ 1, "asc"], [2, "asc"]]
	    });
	} else {
		$("#bookmarksContent").html("<div class='alert alert-warning' role='alert'>You have no bookmarks !</div>");
	}
}

constructLine = function(id) {
	var line = "";
	line += "<tr" + (data[id].book == "NewReal1" || data[id].book == "NewReal2" || data[id].book == "NewReal3" ? " class='table-danger'" : "") + ">";
	line += "	<td align='center' id='bookmark_" + i + "'>" + constructButton(i) + "</td>";
	line += "	<td>" + data[id].title + "</td>";
	line += "	<td>" + data[id].book + "</td>";
	line += "	<td>" + data[id].page + "</td>";
	line += "	<td><button class='btn btn-sm btn-outline-primary' onclick='loadPage(" + i + ");'>Show</button></td>";
	line += "</tr>";
	return line;
}

constructTable = function(idName, lines) {
	var strTable = ""
	strTable += "<table id='" + idName + "' class='table table-sm compact'>";
	strTable += "	<thead>";
	strTable += "		<tr>";
	strTable += "			<th width='60px;'></th>";
	strTable += "			<th>Title</th>";
	strTable += "			<th>Book</th>";
	strTable += "			<th>Page</th>";
	strTable += "			<th>&nbsp;</th>";
	strTable += "		</tr>";
	strTable += "	</thead>";
	strTable += "	<tbody>";
	strTable += lines;
	strTable += "	</tbody>";
	strTable += "</table>";		
	return strTable;
}

constructButton = function(id) {
	if (data[id].bookmarked) {
		return "<button class=\"btn btn-sm btn-outline-primary\" onclick='unBookMark(\"" + id + "\");'>Remove</button>";	
	} else {
		return "<button class=\"btn btn-sm btn-outline-primary\" onclick='addBookMark(\"" + id + "\");'>Add</button>";	
	}
}

loadPage = function(id) {
	var file = files[data[id].book];
	$('#framePdf').prop("src", "./web/viewer.html?file=../" + file.path + "#page=" + (data[id].page + file.inc));
}

addBookMark = function(id) {
	if (typeof sessionStorage != 'undefined') {
		data[id].bookmarked = true;
		sessionStorage.data = JSON.stringify(data);
		$("#bookmark_" + id).html(constructButton(id));
		drawBookmarksTable();
	}
}

unBookMark = function(id) {
	if (typeof sessionStorage != 'undefined') {
		data[id].bookmarked = false;
		sessionStorage.data = JSON.stringify(data);
		$("#bookmark_" + id).html(constructButton(id));
		drawBookmarksTable();
	}
}