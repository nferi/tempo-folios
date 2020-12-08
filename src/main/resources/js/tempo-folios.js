AJS.toInit(function(){
	function callRestApi(url, parameter) {
		var result;
		var fullUrl = !url.startsWith("http") ? AJS.params.baseURL + url + parameter : url + parameter;
		AJS.$.ajax({
			url: fullUrl,
			type: "GET",
			async: false,
			dataType: "json",
			success: function (data) {
				result = data;
			},
			error: function (msg) {
				showError("Failed to call REST API: " + fullUrl);
			}
		});
		return result;
	}

	function showError(msg) {
		AJS.$('#error').append('<div class="aui-message aui-message-info">' + msg + '</div>');
	}

	function buildTable(data) {
		var table = '';
		table += '<table id="folios-table" class="aui aui-table-list">'
		table += '<thead><tr><th class="folio-id">#</th><th class="folio-name">Name</th><th/></tr></thead><tbody>'
		AJS.$.each(data.success, function (i, folio) {
			table += '<tr><td>' + folio.id + '</td><td><a href="#" class="toggler" data-folio-id="' + folio.id + '">' + folio.name + '</a></td><td/></tr>';
			var savedFilterId = callRestApi("/rest/tempo-planning/1/api/folio/", folio.id).success.savedFilterId;
			var searchUrl = callRestApi("/rest/api/2/filter/", savedFilterId).searchUrl;
			var issues = callRestApi(searchUrl, "&maxResults=1000").issues;
			table += '<tr class="folio' + folio.id + '" style="display:none"><td/><td/>';
			if (issues.length > 0) {
				table += '<td><table class="aui aui-table-list"><thead><tr><th class="issue-key">Key</th><th class="issue-summary">Summary</th><th class="issue-type">Issue Type</th><th class="issue-assignee">Assignee</th></tr></thead><tbody>';
				AJS.$.each(issues, function (i, issue) {
					table += '<tr><td>' + issue.key + '</td><td>' + issue.fields.summary + '</td><td>' + issue.fields.issuetype.name + '</td><td>' + (issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned') + '</td></tr>';
				});
				table += '</tbody></table></td>';
			} else {
				table += '<td>No issues.</td>';
			}
			table += '</tr>';
		});
		table += '</tbody></table>';
		return table;
	}

	AJS.$.ajax({
		url: AJS.params.baseURL + "/rest/tempo-planning/1/api/folio",
		type: "GET",
		async: false,
		success: function (data) {
			var html = '';
			if (data.success.length > 0) {
				html = buildTable(data);
			} else {
				html += '<div class="aui-message aui-message-warning">No Tempo Folios found.</div>'
			}
			AJS.$('#folios').append(html);
		},
		error: function (msg) {
			showError("Failed to get Tempo Folios.");
		}
	});

	AJS.$(document).ready(function(){
		AJS.$(".toggler").click(function(e) {
			e.preventDefault();
			$('.folio' + $(this).attr('data-folio-id')).toggle();
		});
	});
});