package com.ferencnagy.tempo.folios.web.action;

import com.atlassian.jira.security.JiraAuthenticationContext;
import com.atlassian.jira.web.action.JiraWebActionSupport;

@SuppressWarnings("serial")
public class ListFoliosAction extends JiraWebActionSupport {
	/* Services */
	private JiraAuthenticationContext jiraAuthenticationContext;

	public ListFoliosAction(JiraAuthenticationContext jiraAuthenticationContext) {
		this.jiraAuthenticationContext = jiraAuthenticationContext;
	}

	@SuppressWarnings("deprecation")
	public String execute() {
		if (jiraAuthenticationContext.getUser() == null) {
			return ERROR;
		}

		return SUCCESS;
	}
}
