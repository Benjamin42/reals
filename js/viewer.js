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
	if (document.cookie) {
		data = JSON.parse(document.cookie);
	}

    drawListTable();

    drawBookmarksTable();
});

drawListTable = function() {
    // Draw lines in table
    var lines = "";
	for (i in data) {
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

showHidePanel = function(elem) {
	if ($("#listPanel").is(":visible")) {
		$("#listPanel").hide();
		$("#sheetPanel").removeClass("col-6");
		$("#sheetPanel").addClass("col-11");
		elem.text(">");
	} else {
		$("#listPanel").show();
		$("#sheetPanel").removeClass("col-11");
		$("#sheetPanel").addClass("col-6");
		elem.text("<");
	}
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
	$('#framePdf').prop("src", "./web/viewer.html?file=../pdf/" + file.path + "#page=" + (data[id].page + file.inc));
}

addBookMark = function(id) {
	data[id].bookmarked = true;
	eraseCookie('bookmarks');
	createCookie('bookmarks', JSON.stringify(data), null);
	console.log(readCookie('bookmarks'));
	$("#bookmark_" + id).html(constructButton(id));
	drawBookmarksTable();
}

unBookMark = function(id) {
	data[id].bookmarked = false;
	eraseCookie('bookmarks');
	createCookie('bookmarks', JSON.stringify(data), null);
	$("#bookmark_" + id).html(constructButton(id));
	drawBookmarksTable();
}


function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}