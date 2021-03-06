let issueContainerEl = document.querySelector("#issues-container");
let limitWarningEl = document.querySelector("#limit-warning");
let repoNameEl = document.querySelector("#repo-name");

let getRepoName = function(){
    //  grab repo name from url query string
    let queryString = document.location.search;
    let repoName = queryString.split("=")[1];

    if (repoName) {
        // display repo name on the page
    repoNameEl.textContent = repoName;
    getRepoIssues(repoName);
    } else {
        // redirect to homepage if repo name invalid
        document.location.replace("./index.html");
    }
};

let getRepoIssues = function(repo) {
    let apiUrl = "http://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            // pass response data to a DOM function
            displayIssues(data);

            // check if API has paginated issues
            if (response.headers.get("Link")) {
                displayWarning(repo);
            }
          });
        }
        else {
            // redirect to homepage if not successful
            document.location.replace("./index.html");
        }
      });
    };


let displayIssues = function(issues) {

    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    for (let i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        let issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        let titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        let typeEl = document.createElement("span");

        // check if issue is an actual issue or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
};


let displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more then 30 issues, visit ";

    let linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append warning to container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();