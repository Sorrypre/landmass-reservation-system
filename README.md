
<div id="readme-top" align="center">
  
<!--- Quick Access Buttons --->
[![Contributors][contributors-button]][contributors-url]
[![Issues][issues-button]][issues-url]
[![Pull Request][pullRequest-button]][pullRequest-url]
[![MP Specs][MP-button]][MP-url]

</div>
<div align="center">
  <!--- Main Description --->
<img src="https://www.dlsu.edu.ph/wp-content/uploads/2025/02/exemplars-of-excellence-dlsu-logo.png"alt="DLSU LOGO" width="120" height="120">

  <h2>CCAPDEV MCO LOST CHILDREN</h2>
  <p> The official repository for creating a computer laboratory slot (seat) reservation web application. In this project, various web application technologies are going to be used, such as HTML, CSS, and JavaScript. Frameworks (Jquery, Bootstrap, React) will also be explored in order to achieve the necessary features intended of the program.</p>
  <br>
  <p> This machine project is created by the following goated&#x1F410 programmers: </p>
  <p>
    <a href="https://www.linkedin.com/in/joramm-dela-torre-1250b9369/">Joramm Dela Torre</a><br>
    <a href="https://www.linkedin.com/in/jensel-espada-a5a0602a7/">Jensel John Espada</a><br>
    <a href="https://www.linkedin.com/in/kurt-anjo-laguerta-853b56397/">Kurt Anjo Laguerta</a><br>
    <a href="https://www.linkedin.com/in/kei-saguin/">VL Kei Saguin</a><br>
</div>
<hr> 

### Build With
* [![HTML][HTML-button]][HTML-docu]
* [![CSS][CSS-button]][CSS-docu]
* [![JavaScript][JavaScript-button]][JavaScript=docu]
<!--- How to start --->
## How to Run
For this project, all NPM packages and libraries are already installed in the server for local. Environment variable API must be asked from one of the developers. If the wish to make your own API keys you have to fill up <ins>MDB_URI</ins>, <ins>MDB_URI_SRV</ins>, and <ins>SESSION_SIGNATURE</ins>.

In command prompt:
```sh
run_all.bat
```
<!-- Getting started-->

While making CSS changes (don't forget to run this in order to track changes):
```sh
tailwind.run_env.bat
```
## Developer Guide
For this project, `git clone` will be utilized for co-contributors to make changes seamlessly. Constantly, changes are made in the repository by pushing and pulling local commits into the remote. [Git Fork vs. Git Clone](https://youtu.be/6YQxkxw8nhE?si=jdcuqwRFyS532LMA)

### Prerequisites
Make sure you have configured your git version control system properly. Please check by running the prompt below in your terminal. If not installed, follow the installation guide on the official [Git website](https://git-scm.com/).
* Git
  ```sh
  git --version
  ```
  Expected output (or something similiar):
  ```sh
  git version 2.45.2.windows.1
  ```
### Installation Guide To Local Repo

![Screenshot of the code button.](https://docs.github.com/assets/cb-13128/mw-1440/images/help/repository/code-button.webp)
1. Click on the dropdown on the Code button in the github repository to get the HTTPS link of the repo.
2. Copy the link of the repository (or just copy the code below)
   ```sh
   git clone "https://github.com/Sorrypre/CCPROG3_MP_PLANTSVSZOMBIES_ESPADA-DELATORRE.git"
   ```
3. Create a folder/directory on your local drive. **Make sure it is _not already tracked_ by `.git`**.
   ```sh
   mkdir <new_target_directory> #you can also create new folders with your system's file mamanger
   ```
4. Go to command prompt and change directory to the created directory.
   ```sh
   cd <new_target_directory>
   ```
5.  Paste `git clone "https://github.com/Sorrypre/CCAPDEV-MCO_LOST_CHILDREN.git"` to clone the remote to the local repo.
6.  Type `ls` on the terminal to verify the you have the local copy of the remote repository.
7.  Use `git status` to list all new or modified files that haven't yet been committed.

<p align="right">(<a href="#readme-top">Back To Top</a>)</p>

<!-- Commit and Pull Request Protocols-->
### Commit and Pull Request Protocols
[![Trunk Base Development][trunkBase-button]][trunkBase-url]
This project follows a **Trunk Base Development Branching Model**. This strategy uses the main branch as mainline development it is where all developers commit. In this model developers usually clone branches and make changes locally so push them to the mainline (bugfix, feature, etc...). In trunk-based development, the trunk is the central branch (main branch) to which all developers send their code changes. See more [here](https://filipemotta.medium.com/branches-strategies-an-overview-d331c470ec53)

**_Important:_ No commits and pushes are allowed in the main branch.**
1. Before proceeding with any changes to remote, run the following to Avoid Merge Conflicts.
   ```sh
   git status #make sure you are in main
   git switch main #to go to the main branch
   git pull #to pull changes from the remote repository
   git status #to check the head of the current branch (if ahead, behind, or up-to-date)
   ```
2. Creating a new branch for every feature, refactoring, or issue fixes:
   ```sh
   #This combines git switch && git branch to create and switch to the new branch
   git checkout -b <new_branch_name>
   ```

   <!-- Reference for this section: https://gist.github.com/digitaljhelms/4287848-->
   Suggested format of new branch names:

   **##/type/branchName**

   * The `##` represent the branch number
   * The `type` represents the kind of changes made and should be changed to:
       - *feature* - are used when developing a new feature or enhancement which has the potential of a development lifespan longer than a single deployment.
       - *Bugfix* - differ from feature branches only semantically. This will be createdd when there is a bug on the main branch that should be fixed and merged into the next deployment.
       - *hotFix* - comes from the need to act immediately upon an undesired state of the main branch. Additionally, because of the urgency, this branch does not require any merge request from other developers of this project.
    
   * The `branchName` represents the name of the edits/changes done in the branch that will eventually be merged with the main branch.
     

3. Saving work done in the branch and merge request in Github
   ```sh
   #Staging - this puts the change into the staging area where it can be included in the next commit
   git add .

   #Commit - finalizes and saves the changes to your local repo
   git commit -m "<Insert commit message>"
   
   #Push - finalizes and saves the changes to your remote repo
   git push -u origin <##type/branchName>

   ```
4. Merging with main branch
   
   ![See sample of pull request.](https://docs.github.com/assets/cb-87213/mw-1440/images/help/pull_requests/pull-request-review-edit-branch.webp)
   * Go to the Pull requests tab
   * Click on the New pull request button
   * Check if it is able to merge, and it is the branches are correct
   * If merge conflicts are encountered please see this [link](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-using-the-command-line).
   * Addtional info: Click this [link](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
     
8. Deleting branches
   
   ![DeleteBranchImage](https://docs.github.com/assets/cb-13465/mw-1440/images/help/branches/branches-delete.webp)
   * On Github, navigate on the main page of the repo
   * select the branch dropdown menu, then click View All branche.
   * Click the trash icon next to the branch you want to delete
   * Deleting a branch associated with at least one open pull request will close the pull request.
   * Read the warnings before deleting

   **For command line terminal deletion:**
  ```sh
  #local repo
  git branch -d <##/type/branchName>

  #remote repo
  git branch origin --delete <##/type/branchName>
  ```

## Developer Emails
* Joramm Dela Torre - [joramm_delatorre@dlsu.edu.ph](joramm_delatorre@dlsu.edu.ph)
* Jensel Espada - [jensel_john_l_espada@dlsu.edu.ph](jensel_john_l_espada@dlsu.edu.ph)
* Kurt Laguerta - [kurt_laguerta@dlsu.edu.ph](kurt_laguerta@dlsu.edu.ph)
* Kei Saguin - [vl_saguin@dlsu.edu.ph](vl_saguin@dlsu.edu.ph)

## Acknowledgments
* Mr. Danny Cheng, Professor

<p align="right">(<a href="#readme-top">Back To Top</a>)</p>


<!--- button image url & destination url --->
[contributors-button]: https://img.shields.io/github/contributors/Sorrypre/CCAPDEV-MCO_LOST_CHILDREN?style=for-the-badge
[contributors-url]: https://github.com/Sorrypre/CCAPDEV-MCO_LOST_CHILDREN/graphs/contributors

[issues-button]: https://img.shields.io/github/issues/Sorrypre/CCAPDEV-MCO_LOST_CHILDREN?style=for-the-badge
[issues-url]: https://github.com/Sorrypre/CCAPDEV-MCO_LOST_CHILDREN/issues

[pullRequest-button]: https://img.shields.io/github/issues-pr/Sorrypre/CCAPDEV-MCO_LOST_CHILDREN?style=for-the-badge
[pullRequest-url]: https://github.com/Sorrypre/CCAPDEV-MCO_LOST_CHILDREN/pulls

[MP-button]: https://img.shields.io/badge/MP-Specs-brightgreen?style=for-the-badge
[MP-url]: https://drive.google.com/drive/folders/1SoC7Ef9zKff3rPqyQWTbqIfP_JsBFfif?usp=sharing

[HTML-button]:https://img.shields.io/badge/HTML-lightblue?style=for-the-badge&logo=html5
[HTML-docu]: https://www.w3schools.com/html/html_intro.asp

[CSS-button]: https://img.shields.io/badge/CSS-purple?style=for-the-badge&logo=CSS
[CSS-docu]: https://www.w3schools.com/cssref/index.php

[JavaScript-button]: https://img.shields.io/badge/JavaScript-%23FF7800?style=for-the-badge&logo=javascript
[JavaScript=docu]: https://www.w3schools.com/jsrEF/default.asp

[trunkBase-button]: https://miro.medium.com/v2/resize:fit:1100/format:webp/0*W-GlxosBTAMcvg2V.png
[trunkBase-url]: https://filipemotta.medium.com/branches-strategies-an-overview-d331c470ec53
