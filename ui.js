// class UI
class UI {
  // Display Profile
  showProfile(user) {
    document.querySelector("#container").innerHTML = `
    <div class="card card-body mb-3 mt-3">
    <div class="row">
      <div class="col-md-3">
        <img class="img-fluid mb-2" src="${user.avatar_url}">
        <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
      </div>
      <div class="col-md-9">
        <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
        <span class="badge badge-secondary ml-2">Public Gists: ${user.public_gists}</span>
        <span class="badge badge-success ml-2">Followers: ${user.followers}</span>
        <span class="badge badge-info ml-2 mt-2">Following: ${user.following}</span>
        <br><br>
        <ul class="list-group">
          <li class="list-group-item">Company:  <strong>${user.company}</strong> </li>
          <li class="list-group-item">Website/Blog:   <strong>${user.blog}</strong> </li>
          <li class="list-group-item">Location:  <strong>${user.location}</strong> </li>
          <li class="list-group-item">Member Since:     <strong>${user.created_at}</strong> </li>
        </ul>
      </div>
    </div>
  </div>
  <h3 class="page-heading mb-3 text-center">Latest Repos</h3>
  <div id="repos"></div>
    `;
  }

  // Display Repositories
  showRepos(repos) {
    let output = "";

    repos.forEach((repo) => {
      output += `
    <div class="card card-body mb-2">
      <div class="row">
        <div class="col md-6">
          <a href="${repo.html_url}" target = "_blank">${repo.name}</a>
        </div>
        <div class="col md-6">
        <span class="badge badge-primary mr-2">Stars: ${repo.stargazers_count}</span>
        <span class="badge badge-secondary mr-2">Public Gists: ${repo.watchers_count}</span>
        <span class="badge badge-success">Followers: ${repo.forks_count}</span>
        </div>
      </div>
    </div>
    `;
      document.getElementById("repos").innerHTML = output;
    });
  }

  // Clear Alert to get rid of multiple alerts
  clearAlert() {
    const currentAlert = document.querySelector(".alert");
    if (currentAlert) {
      currentAlert.remove();
    }
  }

  // Show Alert
  showAlert(message, className) {
    const ui = new UI();

    ui.clearAlert();
    const div = document.createElement("div");
    div.classList = `alert ${className}`;

    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");

    const secondContainer = document.querySelector("#container");

    container.insertBefore(div, secondContainer);

    setTimeout(() => {
      ui.clearAlert();
    }, 1000);
  }

  // Clear Profile in case of no input value
  clearProfile() {
    const profile = document.getElementById("container");
    profile.innerHTML = "";
  }
}

// class Github
class Github {
  async getUser(user) {
    // Get Profile Response
    const profileResponse = await fetch(
      `https://api.github.com/users/${user}?client_id=b897b921fa3c6d344642&client_secret=89da986bc0e9c58ec68ca33f5f96009886fbd877`
    );

    let repoCount = 5,
      repoSort = "created: asc";

    // Get Repo Response
    const repoResponse = await fetch(
      `https://api.github.com/users/${user}/repos?per_page=${repoCount}&sort=${repoSort}&client_id=b897b921fa3c6d344642&client_secret=89da986bc0e9c58ec68ca33f5f96009886fbd877`
    );

    // Get Response Value
    const profile = await profileResponse.json();
    const repos = await repoResponse.json();

    // Return the fetched value
    return {
      profile,
      repos,
    };
  }
}

// class Main
class Main {
  static init() {
    // Instantiate Git
    const git = new Github();

    // Instantiate UI
    const ui = new UI();

    // Get Input
    const userInput = document.querySelector("#user-name");

    // Event Listener
    userInput.addEventListener("keyup", () => {
      // Validate
      if (userInput.value !== "") {
        git.getUser(userInput.value).then((profile) => {
          if (profile.profile.message === "Not Found") {
            ui.showAlert("User not found", "alert-danger");
          } else {
            ui.showProfile(profile.profile);
            ui.showRepos(profile.repos);
          }
        });
      } else {
        ui.clearProfile();
      }
    });
  }
}

// Instantiate Main
Main.init();
